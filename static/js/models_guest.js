var SocketListener = function SocketListener(noun, collection, socket, refColls){
  var type = noun;
  var refCollection = refColls;

  var addModels = function addModels(models) {
      if (type == 'Chat') {
        // console.log('addChat -> ' + JSON.stringify(models));
        /*if (Array.isArray(models)) {
          models.map(function(chatModel, i) {
            if (chatModel.contentLength == undefined) {
              chatModel.contentLength = getContentWidth(chatModel.message);
              collection.add(collection.parse(chatModel));
            }
          });
        } else {
          if (models.contentLength == undefined) {
            models.contentLength = webchatutility.getContentWidth(models.message);
            collection.add(collection.parse(models));
          }
        }*/
        collection.add(collection.parse(models));

        if (WebChatConfig.chatWinLoaded) {
          parent.postMessage("msg","http://demo.webmsg.com");
        }
      }
      if (type == 'Room') {
        // console.log('AddRoom -> ' + JSON.stringify(models));
        if (collection.length == 0) {
          collection.add(collection.parse(models));
        }
      }
      if (type == 'User') {
        collection.add(collection.parse(models));
      }
  };

  var removeModels = function removeModels(models){
    collection.remove(collection.parse(models));
    if (type == 'User') {

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
    console.log('[model_guest.js] request Add' + noun);
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
    // 'generalinquiry': 'generalQuiry',
    // 'errortype': 'selectErrorType',
    // 'dataerror': 'sendDataError',
    // 'viewerror': 'sendViewError',
    // 'othererror': 'sendOtherError',
    '*default' : 'Default'
  }
});

