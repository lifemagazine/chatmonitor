var client = require('./index').client,
  q = require('q'),
  models = require('./models'),
  config = require('../config'),
  async = require('async');
  // Request = require('tedious').Request,
  // TYPES = require('tedious').TYPES;

exports.client = client;

exports.addUser = function addUser(user, name, type, role){
  client.multi()
  .hset('user:' + user, 'name', name)
  .hset('user:' + user, 'type', type)
  .hset('user:' + user, 'role', role)
  .zadd('users', Date.now(), user)
  .exec();
};

exports.addRoom = function addRoom(room){
  if (room !== '') client.zadd('rooms', Date.now(), room);
};

exports.getRooms = function getRooms(cb){
  client.zrevrangebyscore('rooms', '+inf', '-inf', function(err, data){
    return cb(data);
  });
};

exports.addChat = function addChat(chat){
  client.multi()
  .zadd('rooms:' + chat.room + ':chats', Date.now(), JSON.stringify(chat))
  .zadd('users', (new Date).getTime(), chat.user.id)
  .zadd('rooms', (new Date).getTime(), chat.room)
  .exec();

addChatMsg(chat);
};

exports.getChat = function getChat(room, cb){
  client.zrange('rooms:' + room + ':chats', 0, -1, function(err, chats){
    cb(chats);
  });
};

exports.addUserToRoom = function addUserToRoom(user, room){
  console.log('addUserToRoom] zadd rooms:' + room);
  client.multi()
  .zadd('rooms:' + room, Date.now(), user)
  .zadd('users', Date.now(), user)
  .zadd('rooms', Date.now(), room)
  .set('user:' + user + ':room', room)
  .exec();
}

exports.removeUserFromRoom = function removeUserFromRoom(user, room){
  console.log('removeUserFromRoom] zrem rooms:' + room + ', ' + user);
  client.multi()
  .zrem('rooms:' + room, user)
  .del('user:' + user + ':room')
  .exec();
};

exports.getUsersinRoom = function getUsersinRoom(room) {
  return q.Promise(function(resolve, reject, notify) {
    client.zrange('rooms:' + room, 0, -1, function(err, data) {
      var users = [];
      var loopsleft = data.length;
      // console.log('loopsleft: ' + loopsleft);
      if(loopsleft === 0) resolve(users);
      data.forEach(function(u) {
        client.hgetall('user:' + u, function(err, userHash) {
          if (userHash == null) {
            console.log('[getUsersinRoom] room: ' + room + ' - userHash is null');
          } else {
            users.push(models.User(u, userHash.name, userHash.type, room));
          }
          loopsleft--;
          if(loopsleft === 0) resolve(users);
        });
      });
    });
  });
};

exports.getUsersForRoom = function getUsersForRoom(room, cb) {
  return q.Promise(function(resolve, reject, notify) {
    client.zrange('rooms:' + room, 0, -1, function(err, data) {
      resolve(cb(err, data));
    });
  });
};

exports.getUserInfo = function getUserInfo(user, cb) {
  return q.Promise(function(resolve, reject, notify) {
    client.hgetall('user:' + user, function(err, u) {
      resolve(cb(err, u));
    });
  });
};


/* function addChatMsg(chat) {

  async.waterfall(
    [
      function(cb) {
        var pool = config.pool;
				pool.acquire(function (err, connection) {
					if (err) {
						cb(err, null);
					} else {
            cb(null, connection);
          }
				});
      },
      function(conn, cb) {
        if (!conn) return;
        var sql = "INSERT INTO TX_CHAT_MESSAGE (" +
          "ID, MESSAGE, ROOM, TS, USER_ID, USER_TYPE" +
          ") VALUES (" +
          "@ID, @MESSAGE, @ROOM, @TS, @USER_ID, @USER_TYPE" +
          ")";

        request = new Request(sql, function(err) {
					if (err) {
						console.error(err.message);
						return;
					}
          cb(null, conn);
				});

				request.addParameter('ID',TYPES.NVarChar, chat.id);
				request.addParameter('MESSAGE',TYPES.NVarChar, chat.message);
				request.addParameter('ROOM',TYPES.NVarChar, chat.room);
				request.addParameter('TS',TYPES.Decimal, chat.ts);
				request.addParameter('USER_ID',TYPES.NVarChar, chat.user.id);
				request.addParameter('USER_TYPE',TYPES.NVarChar, chat.user.type);

				conn.execSql(request);
      }
    ],
    function (err, conn) {
      if (conn) {
				conn.release();
			}
      if (err) {
        console.error("In waterfall error cb: ==>", err, "<==");
      }
    }
  );
}
*/
