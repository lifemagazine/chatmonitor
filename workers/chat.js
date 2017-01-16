var client = require('../redis').client,
  log = require('../middleware/log'),
  config = require('../config');

var delta = 60 * 60 * 1000 * 3; //10800000
var interval = 60 * 60 * 1000 * 2; //7200000

function RemoveRooms(){
  log.debug({message: 'Removing Rooms', ts: Date.now()});
  client.zrangebyscore('rooms', '-inf', ((new Date).getTime() - delta), function(err, rooms){
    if (err !== null) log.error({message: 'Error in Remove Rooms', err: err, ts: Date.now()});
    else {
      rooms.forEach(function (room) {
        if (room != config.consultantRoomName) {
          client.multi().zrem('rooms', room).del('rooms:' + room + ':chats').exec();
        }
      });
    }
  });
};

function CleanUpChatsFromRoom(){
  log.debug({message: 'Cleaning Up Chats', ts: Date.now()});
  client.zrange('rooms', 0, -1, function(err, rooms){
    rooms.forEach(function(room) {
      if (room != config.consultantRoomName) {
        client.zremrangebyscore('rooms:' + room + ':chats', '-inf', ((new Date).getTime() - delta));
      }
    });
  });
};

function CleanUpUsers(){
  log.debug({message: 'Cleaning Up Users', ts: Date.now()});
  client.zrangebyscore('users', '-inf', ((new Date).getTime() - delta), function(err, users){
    users.forEach(function(user){
      client.multi()
      .zrem('users', user)
      .del('user:' + user)
      .del('user:' + user + ':room')
      .exec();
    });
  });
};

function CleanUp() {
  RemoveRooms();
  CleanUpChatsFromRoom();
  CleanUpUsers();
};

setInterval(CleanUp, interval);
CleanUp();


module.exports.RemoveRoomByRoomName = RemoveRoomByRoomName;
module.exports.CleanUpChatsByRoomName = CleanUpChatsByRoomName;

function RemoveRoomByRoomName(roomName){
  log.debug({message: 'Removing Rooms', ts: Date.now()});
  console.log('RemoveRoomByRoomName -:> ' + roomName);
  client.zrange('rooms', 0, -1, function(err, rooms){
      rooms.forEach(function (room) {
        console.log('room -:> ' + JSON.stringify(room));
        if (room == roomName) {
          client.multi()
          .zrem('rooms', room)
          .del('rooms:' + room + ':chats')
          .exec();
          console.log('chatting room: ' + roomName + ' removed');
        }
      });
  });
};

function CleanUpChatsByRoomName(roomName){
  log.debug({message: 'Cleaning Up Chats', ts: Date.now()});
  client.zrange('rooms', 0, -1, function(err, rooms){
    rooms.forEach(function(room){
      if (room == roomName) {
        client.zremrangebyscore('rooms:' + room + ':chats', 0, -1);
        console.log('chat msg: ' + 'rooms:' + room + ':chats' + ' removed');
      }
    });
  });
};
