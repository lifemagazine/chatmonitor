HashMap = function() {
    this.map = new Array();
};
HashMap.prototype = {
    put: function(key, value) { this.map[key] = value; },
    get: function(key, value) { return this.map[key]; },
    getAll: function(key, value) { return this.map; },
    clear: function(key, value) { this.map = new Array(); },
    getKeys: function(key, value) {
        var keys = new Array();
        for (i in this.map)
        {
            keys.push(i);
        }
        return keys;
    },
    remove: function(key) {
      var tmp = this.map[key];
      delete this.map[key];
      return tmp;
    }
};

var SocketListener = function SocketListener(noun, collection, socket, refColls, rootElement){
  var type = noun;
  var refCollection = refColls;

  var addModels = function addModels(models) {
      if (type == 'Chat') {
        var userCount = ChatRoomInfo.waitingRoomMap.get(models.room);
        console.log(models.room + ' -> ' + userCount);
        if (userCount == 1 && models.room != 'consultantRoom') {
          console.log('notifyChatMessage -> ' + JSON.stringify(models));

          // var divId =  '#room-' + models.room;
          // $(divId).css("background-color","#FF0000");

          ChatRoomInfo.unreadMsgRoomMap.put(models.room, 1);

          // var divId =  '#room-' + models.room;
          // $(divId).css("background-color","#FF0000");
          document.getElementById('room-' + models.room).style.backgroundColor = "#FF0000";

          notifyChatMessage(models);
        }
      }

      if (type == 'Room') {
        console.log(models);
        notifyRoomEvent(models);
        collection.add(collection.parse(models));
      }

      if (type == 'User') {
        collection.add(collection.parse(models));

        console.log(refCollection.length);
        refCollection.reset();
        console.log(refCollection.length);
        refCollection.sync('read', null);
        console.log(refCollection.length);
        React.unmountComponentAtNode(rootElement[0]);
        React.renderComponent(RoomForm({rooms: refCollection}), rootElement[0]);
      }
  };

  var removeModels = function removeModels(models){
    collection.remove(collection.parse(models));
    if (type == 'User') {
      // location.reload();
      console.log('add user -> renderComponent');
      refCollection.reset();
      // refCollection.fetch();
      refCollection.sync('read', null);
      React.unmountComponentAtNode(rootElement[0]);
      React.renderComponent(RoomForm({rooms: refCollection}), rootElement[0]);
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
    if (noun == 'Room') {
      console.log('RoomsCollection read sync');
    }
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
  image: function(size) {
    switch(this.get('type')) {
      case 'local':
        return '/images/' + size + '.png';
        break;
    }
  } //,
  // gravatar: function gravatar(size){
  //   return 'http://www.gravatar.com/avatar/' + md5(this.get('id')) + '?d=retro&s=' + size;
  // },
  // facebook: function facebook(size){
  //   return 'http://graph.facebook.com/' + this.get('id') + '/picture/?height=' + size;
  // }
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
    '': 'RoomSelection'
  }
});
