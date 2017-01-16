var User = function User(id, name, type, room, role){
  if(arguments.length < 3 ) Throw('Not enough args!');
  if (arguments.length == 3) return {id: id, user: name, type: type};
  if (arguments.length == 4) return {id: id, user: name, type: type, room: room};
  if (arguments.length == 5) return {id: id, user: name, type: type, room: room, role: role};
};

var Chat = function Chat(message, contentLength, room, user){
  if(arguments.length < 4 ) Throw('Not enough args!');
  if(typeof user !== 'object') Throw('User must be an object!');
  return {
    id: user.id + (new Date).getTime().toString(),
    message: message,
    contentLength: contentLength,
    room: room,
    ts: (new Date).getTime(),
    user: user
  };
};

var Room = function Room(name, users) {
  if(arguments.length < 1) Throw('Room needs a name!');
  if(arguments.length == 1) return {id: name, name: name};
  if(arguments.length == 2) return {id: name, name: name, users: users};
}

exports.User = User;
exports.Chat = Chat;
exports.Room = Room;
