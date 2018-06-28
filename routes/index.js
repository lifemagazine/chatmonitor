var util = require('../middleware/utilities'),
	config = require('../config'),
	requestIp = require('request-ip'),
	redis = require('redis'),
	redisWorker = require('../workers/chat'),
	redisChat = require('../redis/chat'),
	config = require('../config'),
	q = require('q'),
	moment = require("moment"),
	async = require('async'),
	user = require('../passport/user');
	// customer = require("./managecustomers"),
	// vessel = require("./managevessels"),
	// vesselmap = require("./managevesselmap"),
	// portnmmap = require("./manageportnmmap"),
	// port = require("./manageport"),
	// scraper = require("./managescraper"),
	// scraper2 = require("./managescraper2"),
	// customerquerys = require("./managecustomerquerys"),
	// errorreports = require("./manageerrorreports"),
	// unlocode = require("./manageunlocode"),
	// consult = require("./manageconsult");

// var redisClient = redis.createClient(config.redisPort, config.redisHost);

module.exports.index = index;
module.exports.login = login;
module.exports.logOut = logOut;
module.exports.chat = chat;
module.exports.chatwindow = chatwindow;
module.exports.chatwindowalone = chatwindowalone;
// module.exports.chatwindowlogin = chatwindowlogin;
module.exports.msgwindow = msgwindow;
module.exports.chatwindowadmin = chatwindowadmin;
module.exports.checksession = checksession;
module.exports.checkconsultantcount = checkconsultantcount;
module.exports.secondlogin = secondlogin;
module.exports.register = register;
module.exports.registerProcess = registerProcess;
module.exports.consultinglist = consultinglist;
module.exports.consultingmodify = consultingmodify;
module.exports.removechattingroom = removechattingroom;

module.exports.testpage = testpage;
module.exports.posttest = posttest;


function index(req, res){
	req.session.touch();
	res.render('index', {title: 'Index'});
};

function login(req, res){
	res.render('login', {title: 'Login', message: req.flash('error'), layout: 'layout2'});
};

function register(req, res){
	res.render('register', {title: 'Register', message: req.flash('error'), layout: 'layout2'});
};

function registerProcess(req, res){
	if (req.body.username && req.body.password) {
		user.addUser(req.body.username, req.body.password, config.crypto.workFactor, function(err, profile){
			if (err) {
				req.flash('error', err);
				res.redirect(config.routes.register);
			}else{
				req.login(profile, function(err){
					res.redirect(config.routes.chat);
				});
			}
		});
	} else {
		req.flash('error', 'Please fill out all the fields');
		res.redirect(config.routes.register);
	}
};

function logOut(req, res){
	util.logOut(req);
	res.redirect('/');
};

function consultinglist(req, res) {
	req.session.touch();
	res.render('consultinglist', {title: 'consultinglist'});
}

function consultingmodify(req, res) {
	req.session.touch();
	res.render('consultingmodify', {title: 'consultingmodify'});
}

function chat(req, res){
	req.session.touch();
	res.render('chat', {title: 'Chat', webChatAddress: config.host});
};

function chatwindow(req, res){
	req.session.touch();
	res.render('chatwindow', {title: 'Chat Window', webChatAddress: config.host, layout: 'customer_layout'});
};

function chatwindowalone(req, res){
	req.session.touch();
	res.render('chatwindowalone', {title: 'Chat Window Alone', webChatAddress: config.host});
};

function chatwindowadmin(req, res){
	req.session.touch();
	res.render('chatwindowadmin', {title: 'Admin Chat Window', webChatAddress: config.host});
};

function removechattingroom(req, res) {
	var roomName = req.body.roomname;
	redisWorker.RemoveRoomByRoomName(roomName);
	redisWorker.CleanUpChatsByRoomName(roomName);
	res.status(201).end();
}

function managecustomers(req, res) {
	req.session.touch();
	res.render('managecustomers', {title: 'Management Customers', webChatAddress: config.host});
}

function managevessels(req, res) {
	req.session.touch();
	res.render('managevessels', {title: 'Management Vessels', webChatAddress: config.host});
}

function msgwindow(req, res){
	req.session.touch();
	console.log(req.session);
	res.render('msgwindow', {title: 'Message Window', webChatAddress: config.host, layout: 'customer2_layout'});
};

function checkconsultantcount(req, res) {
	var consultantRoomName = config.consultantRoomName;
	console.log('consultant room: ' + consultantRoomName);
	var  usersP = redisChat.getUsersinRoom(consultantRoomName);
	usersP.done(function(users) {
		console.log('Consultant count: ' + users == null ? 0 : users.length);
		res.send({count: users.length});
	});
}

/*function chatwindowlogin(req, res){
	var username = req.query.username;
	var sessionToken = req.query.token;

	if (username == null || username.length == 0) {
		username = sessionToken;
	}
	console.log('username: ' + username + ', token: ' + sessionToken);

	var targetRoute;
	var roomName;

	if (util.checkInValidToken(sessionToken)) {
		console.log('token is valid');
		req.session.isAuthenticated = true;
		var profile = {displayName: username, id: username, provider: 'local',username: username, work: 50, role: 'guest' };
		req.login(profile, function(err) {
			if (err != undefined) {
				console.log('err: ' + err);
				targetRoute = 'generalinquiry';
				res.render('chatwindowlogin', {title: 'Chat Window', targetRoute: targetRoute, webChatAddress: config.host, layout: 'customer_layout'});
			} else {

				var onlineConsultant = {count: 0};
				var consultantRoomName = config.consultantRoomName;
				var  usersP = redisChat.getUsersinRoom(consultantRoomName);
				usersP.done(function(users) {
					console.log('Consultant count in ' + consultantRoomName + ': ' + users.length);
					var chatAddr = config.host + '/chatwindow#room/';
					roomName = username;
					if (users.length > 0) {
						var chatAddr = config.host + '/chatwindow#room/';
						console.log(chatAddr + username);
						targetRoute = username;
						res.render('chatwindowlogin', {title: 'Chat Window', targetRoute: targetRoute, roomName: roomName, webChatAddress: config.host, layout: 'customer_layout'});
					} else {
						var chatAddr = config.host + '/msgwindow';
						console.log('there is no online consultant, forward to ' + chatAddr);
						targetRoute = 'chatWindow';
						res.render('chatwindowlogin', {title: 'Chat Window', targetRoute: targetRoute, roomName: roomName, webChatAddress: config.host, layout: 'customer_layout'});
					}
				});

			}
		});
		console.log('redirect to chatwindow in ' + username);
	} else {
		console.log('token is invalid.');
		var chatAddr = config.host + '/msgwindow';
		targetRoute = 'generalinquiry';
		res.render('chatwindowlogin', {title: 'Chat Window', targetRoute: targetRoute, webChatAddress: config.host, layout: 'customer_layout'});
	}
};*/

/*function chatwindowlogin(req, res){
//  http://inner.lifemagazine.com/checksession?username=echo1234&token=d3d3LnRyYWRsaW54LmNvbQ==
	var username = req.query.username;
	var sessionToken = req.query.token;
	console.log('username: ' + username + ', token: ' + sessionToken);
	if (util.checkInValidToken(sessionToken)) {
		console.log('token is valid');
		req.session.isAuthenticated = true;
		var profile = {displayName: username, id: username, provider: 'local',username: username, work: 50, role: 'guest' }
		req.login(profile, function(err){
			if (err != undefined) {
				console.log('err: ' + err);
				res.redirect('/message');
			} else {

				var onlineConsultant = {count: 0};
				var consultantRoomName = config.consultantRoomName;
				var  usersP = redisChat.getUsersinRoom(consultantRoomName);
				usersP.done(function(users) {
					console.log('Consultant count in ' + consultantRoomName + ': ' + users.length);
					var chatAddr = config.host + '/chatwindowlogin#room/';
					if (users.length > 0) {
						var chatAddr = config.host + '/chatwindowlogin#room/';
						res.redirect(chatAddr + username);
						console.log(chatAddr + username);
					} else {
						var chatAddr = config.host + '/msgwindow';
						res.redirect(chatAddr);
						console.log('there is no online consultant, forward to ' + chatAddr);
					}
				});

			}
		});
		console.log('redirect to chatwindow in ' + username);
	} else {
		console.log('token is invalid.');
		var chatAddr = config.host + '/msgwindow';
		res.redirect(chatAddr);
	}
}*/

function checksession(req, res) {
	//  http://inner.lifemagazine.com/checksession?username=echo1234&token=d3d3LnRyYWRsaW54LmNvbQ==
	var username = req.query.username;
	var mode = req.query.mode;
	var sessionToken = req.query.token;
	console.log('username: ' + username + ', token: ' + sessionToken + ', mode: ' + mode);
	if (util.checkInValidToken(sessionToken)) {
		console.log('token is valid');
		req.session.isAuthenticated = true;
		var profile = {displayName: username, id: username, provider: 'local',username: username, work: 50, role: 'guest' }
		req.login(profile, function(err){
			if (err != undefined) {
				console.log('err: ' + err);
				res.redirect('/message');
			} else {

				var onlineConsultant = {count: 0};
				var consultantRoomName = config.consultantRoomName;
				var  usersP = redisChat.getUsersinRoom(consultantRoomName);
				usersP.done(function(users) {
					console.log('Consultant count in ' + consultantRoomName + ': ' + users.length);
					var chatwindowpage = '/chatwindow#room/';
					if (mode != null && mode == 'alone')
						chatwindowpage = '/chatwindowalone#room/';
					var chatAddr = config.host + chatwindowpage;
					if (users.length > 0) {
						var chatAddr = config.host + chatwindowpage;
						res.redirect(chatAddr + username);
						console.log(chatAddr + username);
					} else {
						var chatAddr = config.host + '/msgwindow';
						res.redirect(chatAddr);
						console.log('there is no online consultant, forward to ' + chatAddr);
					}
				});

			}
		});
		console.log('redirect to chatwindow in ' + username);
	} else {
		console.log('token is invalid.');
		var chatAddr = config.host + '/msgwindow';
		res.redirect(chatAddr);
	}
};

function secondlogin(req, res) {
	var userid = req.body.userid;
	var userTp = req.body.usertp;
	console.log('userid: ' + userid + ', userTp: ' + userTp);

	var role = userTp == 99 ? 'consultant' : 'guest';

	req.session.isAuthenticated = true;
	var profile = {displayName: userid, id: userid, provider: 'local',username: userid, work: 50, role: role }
	console.log(profile);
	req.login(profile, function(err) {
		if (err != undefined) {
			console.log('err: ' + err);
			res.status(400).send(JSON.stringify({
				status: 400,
				message: 'failed to create session for ' + userid
			}));
		} else {
			res.status(201).end();
		}
	});
};

function testpage(req, res) {
	res.render('testpage', {title: 'testpage'});
}

function posttest(req, res) {
	res.status(201).end();
}
