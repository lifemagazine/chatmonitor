var SocketListener = function SocketListener(noun, collection, socket, refColls){
  var type = noun;
  var refCollection = refColls;

  var addModels = function addModels(models) {
      //console.log(models);
      if (type == 'Chat') {
        // console.log(models);
        if (Array.isArray(models)) {
          models.map(function(chatModel, i) {
            if (chatModel.contentLength == undefined) {
              // chatModel.message = chatModel.message.replace(new RegExp('\r?\n','g'), '<br>');
              chatModel.contentLength = webchatutility.getContentWidth(chatModel.message);
            }
          });
        } else {
          if (models.contentLength == undefined) {
            // models.message = models.message.replace(new RegExp('\r?\n','g'), '<br>');
            models.contentLength = webchatutility.getContentWidth(models.message);
          }
        }

        collection.add(collection.parse(models));
      }
      if (type == 'Room') {
        // notifyRoomEvent(models);
        collection.add(collection.parse(models));
      }
      if (type == 'User') {
        console.log('add user -> ' + JSON.stringify(models));
        console.log('Array.isArray -> ' + Array.isArray(models));
        var firstName = null;
        var titleStr = null;
        var userNames;

        if (Array.isArray(models)) {
          models.map(function(v, i) {
            if (chatRoom.roomName == v.room) {
              console.log('[same room name] ' + chatRoom.roomName + ': ' +  v.room);
              if (firstName == null) {
                firstName = v.id.length > 30 ? v.id.substr(0, 26) + '...' : v.id;
              }

              // titleStr = firstName + ' 외 ' + i + '명';
              titleStr = 'Chatbot';
              chatRoom.users = titleStr;

              if (userNames != null) {
                userNames = userNames + ', ' + v.id;
              } else {
                userNames = v.id;
              }
              chatRoom.title = userNames;

              $('.lifemagazine-chat-header-title1').text(titleStr);
              $('.lifemagazine-chat-header-title1').attr('title', userNames);
              // $('.lifemagazine-chat-header-title1').css("font-size", 12);
              // $('.lifemagazine-chat-header-title1').css("font-weight", "normal");

              console.log(titleStr);

              collection.add(collection.parse(models));
            } else {
              console.log('[different room name] ' + chatRoom.roomName + ': ' +  v.room);
            }
          });
        } else {
          var userId = models.id;
          var size = _.size(collection);

          collection.each(function(user){
            console.log(user);
            if (user.id == userId) {
              console.log("already same id: " + userId);
              return user.id;
            } else {
              size--;
              if (size == 0) {
                collection.add(collection.parse(models));

                var i = 0;
                collection.each(function(user){
                  console.log(user);
                  if (firstName == null) firstName = user.id.length > 30 ? user.id.substr(0, 26) + '...' : user.id;
                  titleStr = firstName + ' 외 ' + i + '명';
                  i++;
                  if (userNames != null) userNames = userNames + ', ' + user.id;
                  else userNames = user.id;
                  $('.lifemagazine-chat-header-title1').text(titleStr);
                  $('.lifemagazine-chat-header-title1').attr('title', userNames);
                  $('.lifemagazine-chat-header-title1').css("font-size", 13);
                  $('.lifemagazine-chat-header-title1').css("font-weight", "normal");
                });
                return null;
              }
            }
          });
        }

        // console.log('add user -> ' + JSON.stringify(models));
        // $('.lifemagazine-chat-header-title1').css("font-size", 11);
        // $('.lifemagazine-chat-header-title1').css("font-weight", "normal");

        // console.log('title: ' + userNames);

        // collection.add(collection.parse(models));
      }

      // collection.add(collection.parse(models));
  };

  var removeModels = function removeModels(models){
    collection.remove(collection.parse(models));
    if (type == 'User') {
      console.log('removed user -> ' + JSON.stringify(models));

      var firstName = null;
      var titleStr = null;
      var userNames;
      var i = 0;

      collection.each(function(user){
        console.log(user);
        if (firstName == null) firstName = user.id.length > 30 ? user.id.substr(0, 26) + '...' : user.id;
        titleStr = firstName + ' 외 ' + i + '명';
        i++;
        if (userNames != null) userNames = userNames + ', ' + user.id;
        else userNames = user.id;
        $('.lifemagazine-chat-header-title1').text(titleStr);
        $('.lifemagazine-chat-header-title1').attr('title', userNames);
        $('.lifemagazine-chat-header-title1').css("font-size", 13);
        $('.lifemagazine-chat-header-title1').css("font-weight", "normal");
      });

    }
  };

  socket.on('Add' + noun, addModels);
  socket.on('Get' + noun, addModels);
  socket.on('Remove' + noun, removeModels);

  var destroy = function destroy(){
    socket.removeListener('Add' + noun, addModels);
    socket.removeListener('Get' + noun, addModels);
    socket.removeListener('Remove' + noun, removeModels);
  };

  return {destroy: destroy};
};

var SocketSync = function SocketSync(method, model, options){
  var socket = Backbone.socket;

  var create = function create(model, options, noun){
    socket.emit('Add' + noun, model);
  };

  var read = function read(model, options, noun){
    socket.emit('Get' + noun, options);
  };

  switch(method){
    case 'create':
      create(model, options, this.noun);
      break;
    case 'read':
      read(model, options, this.noun);
      break;
  }
};

var User = Backbone.Model.extend({
  image: function(size){
    switch(this.get('type')){
      case 'local':
	return '/images/' + size + '.png';
        break;
    }
  }
});

var UserCollection = Backbone.Collection.extend({model: User});

var RoomsCollection = Backbone.Collection.extend();

var ChatCollection = Backbone.Collection.extend({
  parse: function(data){
    if (Array.isArray(data)){
      return _.map(data, function(d){
        d.user = new User(d.user);
        return d;
      });
    }else {
      data.user = new User(data.user);
      return data;
    }
  }
});

var Router = Backbone.Router.extend({
  routes: {
    '': 'RoomSelection',
    'room/:room' : 'JoinRoom',
    '*default' : 'Default'
  }
});
