var io = require('socket.io'),
	cookie = require('cookie'),
	cookieParser = require('cookie-parser'),
	expressSession = require('express-session'),
	ConnectRedis = require('connect-redis')(expressSession),
	redisAdapter = require('socket.io-redis'),
	redis = require('redis'),
	config = require('../config'),
	//redisSession = new ConnectRedis({host: config.redisHost, port: config.redisPort}),
	redisSession = new ConnectRedis({url: config.redisUrl});
	redisChat = require('../redis/chat'),
	models = require('../redis/models'),
	log = require('../middleware/log'),
	q = require('q'),
	ChatDashboard = 'chatdashboard',
	nameSpaceWebChat = '/webchat',
	nameSpaceInnerChat = '/innerchat',
	nameSpaceWebEvent = '/webevent',
	httpRequest = require('../middleware/httprequest'),
	pathInfo = {host: config.chatbotHost, port: config.chatbotPort, path: config.chatbotPath};

var socketAuth = function socketAuth(socket, next) {
	var handshakeData = socket.request;
	var parsedCookie;
	var sid;
	try {
		parsedCookie = cookie.parse(handshakeData.headers.cookie);
		sid = cookieParser.signedCookie(parsedCookie['connect.sid'], config.secret);
		// sid = JSON.stringify(req.signedCookies);
		console.log('sid = ' + sid);
	} catch (e) {
		console.log(e);
		return next(new Error('Not Authenticated'));
	}
	//console.log('sid = ' + sid);
	if (parsedCookie['connect.sid'] === sid) {
		console.log('Not Authenticated - '+ sid);
		return next(new Error('Not Authenticated'));
	}

	redisSession.get(sid, function(err, session) {
		if (session.isAuthenticated) {
			socket.request.user = session.passport.user;
			socket.request.sid = sid;
			redisChat.addUser(session.passport.user.id, session.passport.user.displayName, session.passport.user.provider, session.passport.user.role);
			return next();
		} else {
			// console.log('there is no data in redis');
			return next(new Error('Not Authenticated'));
		}
	});
};

var removeFromRoom = function removeFromRoom(socket, role, room) {
	console.log('[removeFromRoom] role: ' + role + ', room: ' + room);
	socket.leave(room);
	// if (socket.request.user.role == 'consultant') console.log('socket.leave: ' + room);
	redisChat.removeUserFromRoom(socket.request.user.id, room);
	// if (socket.request.user.role == 'consultant') console.log('remove ' + socket.request.user.id + ' from ' + room);
	socket.broadcast.to(room).emit('RemoveUser',
		models.User(socket.request.user.id, socket.request.user.displayName, socket.request.user.provider, socket.request.user.role));
	io.of(nameSpaceInnerChat).emit('RemoveUser',
		models.User(socket.request.user.id, socket.request.user.displayName, socket.request.user.provider, socket.request.user.role));
	/*io.sockets.in(ChatDashboard).emit('RemoveUser',
		models.User(socket.request.user.id, socket.request.user.displayName, socket.request.user.provider, socket.request.user.role));*/
	/*socket.broadcast.emit('RemoveUser',
		models.User(socket.request.user.id, socket.request.user.displayName, socket.request.user.provider, socket.request.user.role));*/
	// console.log('socket.broadcast.emit RemoveUser');
};

var removeAllRooms = function removeAllRooms(socket, role, from, cb) {
	var current = socket.rooms;
	var len = Object.keys(current).length;
	var i = 0;
	for(var r in current) {
		if (current[r] !== socket.id) {
			console.log(from + ' - [removeAllRooms] role: ' + role + ', room: ' + current[r] + ', socket.id: ' + socket.id);
			if (config.consultantRoomName == current[r]) {
				if (role == "consultant") {
					removeFromRoom(socket, role, current[r]);
				}
			} else {
				removeFromRoom(socket, role, current[r]);
			}
		}
		i++;
		if (i === len) {
			console.log('callback after removeFromRoom -> i=' + i + ', len=' + len);
			cb();
		}
	}
};

var RealTimeInfo = {};
RealTimeInfo.accessCount = 0;
RealTimeInfo.loginCount = 0;
RealTimeInfo.chattingAccessCount = 0;
RealTimeInfo.consultantCount = 0;
RealTimeInfo.lastModifyTime = 0;

var notifyConsultantCount = function notifyConsultantCount (socket, isDisconnect) {
	var consultantRoomName = config.consultantRoomName;
	var  usersP = redisChat.getUsersinRoom(consultantRoomName);
	usersP.done(function(users) {
		RealTimeInfo.consultantCount = users.length;
		var resultObj;
		if (isDisconnect) resultObj = { count: users.length };
		else resultObj = { count: users.length + 1 };
		// socket.broadcast.emit('changemode', resultObj);
		io.of(nameSpaceWebEvent).emit('changemode', resultObj);
		console.log('changemode socket.broadcast -> ' + JSON.stringify(resultObj));
	});
}

var webChatSocketConnection = function webChatSocketConnection(socket, eventSocket) {

	socket.on('GetMe', function() {
		RealTimeInfo.accessCount = RealTimeInfo.accessCount + 1;
		console.log('socket.request.user.id: ' + socket.request.user.id);
		socket.emit('GetMe', models.User(socket.request.user.id, socket.request.user.displayName, socket.request.user.provider, socket.request.user.role));
	});

	socket.on('chatdashboard', function() {
		console.log('join chatdashboard');
		notifyConsultantCount(socket, false);
	});

	socket.on('GetUser', function(room){
		var  usersP = redisChat.getUsersinRoom(room.room);
		usersP.done(function(users){
			socket.emit('GetUser', users);
		});
	});

	socket.on('CheckConsultantCount', function() {
		var consultantRoomName = config.consultantRoomName;
		var  usersP = redisChat.getUsersinRoom(consultantRoomName);
		usersP.done(function(users) {
			var resultObj = { onlineConsultantCount: users.length };
			socket.emit('CheckConsultantCount', resultObj);
			console.log('CheckConsultantCount -> ' + JSON.stringify(resultObj));
		});
	});

	socket.on('GetChat', function(data) {
		redisChat.getChat(data.room, function(chats) {
			var retArray = [];
			var len = chats.length;
			chats.forEach(function(c){
				try {
					retArray.push(JSON.parse(c));
				} catch(e) {
					log.error(e.message);
				}
				len--;
				if (len === 0) socket.emit('GetChat', retArray);
			});
		});
	});

	socket.on('AddChat', function(chat){
		// console.log(chat);
		var newChat = models.Chat(chat.message, chat.contentLength, chat.room,
			models.User(socket.request.user.id, socket.request.user.displayName, socket.request.user.provider, chat.room, socket.request.user.role));
		console.log('************************');
		console.log(newChat);

		redisChat.addChat(newChat);
		socket.broadcast.to(chat.room).emit('AddChat', newChat);
		io.of(nameSpaceInnerChat).emit('AddChat', newChat);
		socket.emit('AddChat', newChat);

		if (newChat.user.role != 'consultant') {
			var pathInfo = {
				host: config.chatbotHost,
				port: config.chatbotPort,
				path: config.chatbotPath
			};

			var args = {
				TYPE: 'Request',
			    ID : newChat.user.id,
			    MESSAGE_ID : newChat.user.id + '_ts',
			    TEXT : newChat.message
			};
			console.log(pathInfo);
			httpRequest.requestHttpPost(pathInfo, args)
				.then(function(data) {
					if (Array.isArray(data.TEXT)) {
						var len = data.TEXT.length;
						for (var i=0; i<len; i++) {
							var chatbotAnswer = newChat;
							chatbotAnswer.ts = Date.now();
							chatbotAnswer.id = 'admin' + chatbotAnswer.ts;
							chatbotAnswer.message = data.TEXT[i];
							chatbotAnswer.contentLength = -1;
							chatbotAnswer.user.id = 'admin';
							chatbotAnswer.user.role = 'consultant';

							redisChat.addChat(chatbotAnswer);
							socket.broadcast.to(chat.room).emit('AddChat', chatbotAnswer);
							io.of(nameSpaceInnerChat).emit('AddChat', chatbotAnswer);
							socket.emit('AddChat', chatbotAnswer);
						}
					} else {
						var chatbotAnswer = newChat;
						chatbotAnswer.ts = Date.now();
						chatbotAnswer.id = 'admin' + chatbotAnswer.ts;
						chatbotAnswer.message = data.TEXT;
						chatbotAnswer.contentLength = -1;
						chatbotAnswer.user.id = 'admin';
						chatbotAnswer.user.role = 'consultant';

						redisChat.addChat(chatbotAnswer);
						socket.broadcast.to(chat.room).emit('AddChat', chatbotAnswer);
						io.of(nameSpaceInnerChat).emit('AddChat', chatbotAnswer);
						socket.emit('AddChat', chatbotAnswer);
					}
				}).catch(function(err) {
					console.log(err)
					var chatbotAnswer = newChat;
					chatbotAnswer.ts = Date.now();
					chatbotAnswer.id = 'admin' + chatbotAnswer.ts;
					chatbotAnswer.message = 'Sorry. Chatbot is not ready.';
					chatbotAnswer.contentLength = -1;
					chatbotAnswer.user.id = 'admin';
					chatbotAnswer.user.role = 'consultant';
					
					redisChat.addChat(chatbotAnswer);
					socket.broadcast.to(chat.room).emit('AddChat', chatbotAnswer);
					io.of(nameSpaceInnerChat).emit('AddChat', chatbotAnswer);
					socket.emit('AddChat', chatbotAnswer);
				});
		}
	});

	socket.on('GetRoom', function() {
		return q.Promise(function(resolve, reject, notify) {
			redisChat.getRooms(function(rooms) {
				var retArray = [];
				var len = rooms.length;
				rooms.forEach(function(r) {
					var usersP = redisChat.getUsersForRoom(r, function(err, data) {
						var users = [];
						if (err == null) {
							data.forEach(function(u) {
								users.push(models.User(u, u, '', r));
								// console.log(r + ' -> ' + u);
							});
						}
						return users;
					});

					usersP.done(function(users) {
						retArray.push(models.Room(r, users));
						len--;
						if(len === 0) socket.emit('GetRoom', retArray);
					});
				});
			});
		});
	});

	socket.on('AddRoom', function(r) {
		var room = r.name;
		var role = socket.request.user.role;
		console.log('[AddRoom] socket.request.user.role: ' + role + ', socket.id: ' + socket.id);
		removeAllRooms(socket, role, 'AddRoom', function() {
			if (room !== '') {
				socket.join(room);
				redisChat.addRoom(room);

				socket.broadcast.emit('AddRoom', models.Room(room));

				socket.broadcast.to(room).emit('AddUser',
					models.User(socket.request.user.id, socket.request.user.displayName, socket.request.user.provider));
				io.of(nameSpaceInnerChat).emit('AddUser',
					models.User(socket.request.user.id, socket.request.user.displayName, socket.request.user.provider));
				redisChat.addUserToRoom(socket.request.user.id, room);
				console.log('addUserToRoom ' + socket.request.user.id + ' -> ' + room);
			}
		});
	});

	socket.on('disconnect', function() {
		var role = socket.request.user.role;
		console.log('disconnect -> socket.id: ' + socket.id);
		if (RealTimeInfo.accessCount > 0) RealTimeInfo.accessCount = RealTimeInfo.accessCount - 1;
		removeAllRooms(socket, role, 'disconnect', function() {
			console.log('disconnect -> removeAllRooms, role: ' + role);
			if (role == 'consultant') {
				notifyConsultantCount(socket, true);
			}
		});
	});
};

var innerChatSocketConnection = function innerChatSocketConnection(socket) {

	socket.on('GetMe', function() {
		socket.emit('GetMe', models.User(socket.request.user.id, socket.request.user.displayName, socket.request.user.provider, socket.request.user.role));
	});

	socket.on('chatdashboard', function() {
		console.log('chatdashboard -> ' + JSON.stringify(RealTimeInfo));

		socket.emit('chatdashboard', RealTimeInfo);
	});

	socket.on('GetUser', function(room){
		var  usersP = redisChat.getUsersinRoom(room.room);
		usersP.done(function(users){
			socket.emit('GetUser', users);
		});
	});

	socket.on('CheckConsultantCount', function() {
		var consultantRoomName = config.consultantRoomName;
		var  usersP = redisChat.getUsersinRoom(consultantRoomName);
		usersP.done(function(users) {
			var resultObj = { onlineConsultantCount: users.length };
			socket.emit('CheckConsultantCount', resultObj);
			console.log('CheckConsultantCount -> ' + JSON.stringify(resultObj));
		});
	});

	socket.on('GetChat', function(data) {
		redisChat.getChat(data.room, function(chats) {
			var retArray = [];
			var len = chats.length;
			chats.forEach(function(c){
				try {
					retArray.push(JSON.parse(c));
				} catch(e) {
					log.error(e.message);
				}
				len--;
				if (len === 0) socket.emit('GetChat', retArray);
			});
		});
	});

	socket.on('AddChat', function(chat){
		var newChat = models.Chat(chat.message, chat.room,
			models.User(socket.request.user.id, socket.request.user.displayName, socket.request.user.provider, chat.room, socket.request.user.role));
		redisChat.addChat(newChat);
		socket.broadcast.to(chat.room).emit('AddChat', newChat);
		socket.emit('AddChat', newChat);
	});

	socket.on('GetRoom', function() {
		return q.Promise(function(resolve, reject, notify) {
			redisChat.getRooms(function(rooms) {
				var retArray = [];
				var len = rooms.length;
				var cnt = 0;
				rooms.forEach(function(r) {
					var usersP = redisChat.getUsersForRoom(r, function(err, data) {
						var users = [];
						if (err == null) {
							data.forEach(function(u) {
								users.push(models.User(u, u, '', r));
								// console.log(r + ' -> ' + u);
							});
						}
						return users;
					});

					usersP.done(function(users) {
						retArray.push(models.Room(r, users));
						cnt = cnt + users.length;
						// console.log(r + ' -> ' + users.length);
						len--;
						if(len === 0) {
							socket.emit('GetRoom', retArray);
							RealTimeInfo.chattingAccessCount = cnt;
						}
					});
				});
			});
		});
	});

	socket.on('AddRoom', function(r) {
		var room = r.name;
		var role = socket.request.user.role;
		console.log('[AddRoom] socket.request.user.role: ' + role + ', socket.id: ' + socket.id);
		removeAllRooms(socket, role, 'AddRoom', function() {
			if (room !== '') {
				socket.join(room);
				redisChat.addRoom(room);

				socket.broadcast.emit('AddRoom', models.Room(room));
				socket.broadcast.emit('AddUser',
					models.User(socket.request.user.id, socket.request.user.displayName, socket.request.user.provider, socket.request.user.role));
				redisChat.addUserToRoom(socket.request.user.id, room);
				console.log('addUserToRoom ' + socket.request.user.id + ' -> ' + room);
			}
		});
	});

	socket.on('disconnect', function() {
		var role = socket.request.user.role;
		console.log('disconnect -> socket.id: ' + socket.id);
		removeAllRooms(socket, role, 'disconnect', function() {
			console.log('disconnect -> removeAllRooms, role: ' + role);
			if (role == 'consultant') {
				notifyConsultantCount(socket, true);
			}
		});
	});
};

var webEventSocketConnection = function webEventSocketConnection(socket) {

	socket.on('CheckConsultantCount', function() {
		var consultantRoomName = config.consultantRoomName;
		var  usersP = redisChat.getUsersinRoom(consultantRoomName);
		usersP.done(function(users) {
			var resultObj = { onlineConsultantCount: users.length };
			socket.emit('CheckConsultantCount', resultObj);
			console.log('CheckConsultantCount -> ' + JSON.stringify(resultObj));
		});
	});

	socket.on('disconnect', function() {
		console.log('webEventSocketConnection.disconnect -> socket.id: ' + socket.id);
	});
};

exports.startIo = function startIo(server) {
	console.log('begin startIo ~~~');
	io = io.listen(server);

	io.adapter(redisAdapter({host: config.redisHost, port: config.redisPort}));

	var webchat = io.of(nameSpaceWebChat);
	var innerchat = io.of(nameSpaceInnerChat);
	var webevent = io.of(nameSpaceWebEvent);

	webchat.use(socketAuth);
	webchat.on('connection', webChatSocketConnection);

	innerchat.use(socketAuth);
	innerchat.on('connection', innerChatSocketConnection);

	// webevent.use(socketAuth);
	webevent.on('connection', webEventSocketConnection);

	setInterval(function() {
		var d = new Date();
		RealTimeInfo.lastModifyTime = d.getTime();
		io.of(nameSpaceInnerChat).emit('chatdashboard', RealTimeInfo);
	}, 60 * 1000);

	return io;
};

exports.io = io;
