var WebChat = window.WebChat || { };
var chatRoom = { roomName: null, users: '실시간 상담', title: '' };
WebChat.Chat = function(el) {
  console.log('############### start');
  var $root = $('#' + el),
  socket = io.connect(webChatAddress + '/webchat'),
  me = null,
  connected = false;
  //to be initialized
  var router,
    roomsCollection,
    userCollection,
    chatCollection;
  var GetMe = function GetMe(user) {
    console.log('3- responsed [GetMe]');
    me = new User(user);
    Backbone.history.stop();
    startChat(me);
    Backbone.history.start();
    connected = true;
  };

  socket.on('connect', function() {
    console.log('1- websocket connected');
    if (!connected) {
      socket.emit('GetMe');
      console.log('2- requested [GetMe]');
    }
  });
  socket.on('GetMe', GetMe);

  var startChat = function startThis() {
    router = new Router();

    Backbone.socket = socket;
    Backbone.sync = SocketSync;

    roomsCollection = new RoomsCollection();
    roomsCollection.noun = 'Room';
    userCollection = new UserCollection();
    userCollection.noun = 'User';
    chatCollection = new ChatCollection();
    chatCollection.noun = 'Chat';

    var roomsSync = new SocketListener('Room', roomsCollection, socket);
    var userSync = new SocketListener('User', userCollection, socket);
    var chatSync = new SocketListener('Chat', chatCollection, socket);

    roomsCollection.fetch();

    var channel = postal.channel();
    var roomJoin = channel.subscribe('Room.Join', roomFormEvent);

    function roomFormEvent(message) {
      roomsCollection.add({name: message.roomName, id: message.roomName});
      router.navigate('room/' + message.roomName, {trigger: true});
    };

    function RoomSelection() {
      React.unmountComponentAtNode($root[0]);
      React.renderComponent(RoomForm({rooms: roomsCollection}), $root[0]);
    }

    function JoinRoom(room) {
      socket.emit('chatdashboard');
      console.log('emit chatdashboard')

      // console.log('/////////////////////////////// JoinRoom Event');

      chatRoom.roomName = room;
      userCollection.reset();
      chatCollection.reset();
      roomsCollection.sync('create', {name: room, id: room});
      chatCollection.fetch({room: room});
      userCollection.fetch({room: room});
      React.unmountComponentAtNode($root[0]);
      // console.log('================= before React.renderComponent(ChatView)');
      // React.renderComponent(ChatView({users: userCollection, chats: chatCollection, room: room, me: me}), $root[0]);

      setTimeout(function() {
        console.log('================= before React.renderComponent(ChatView)');
        React.renderComponent(ChatView({users: userCollection, chats: chatCollection, room: room, me: me}), $root[0]);
      }, 1000);

      setTimeout(function() {
        if ($(".lifemagazine-chat-body-center") != null && $(".lifemagazine-chat-body-center")[0] != undefined) {
          $(".lifemagazine-chat-body-center").scrollTop($(".lifemagazine-chat-body-center")[0].scrollHeight);
        }
      }, 1500);
      // socket.emit('chatdashboard');
      // console.log('emit chatdashboard')
    };

    function DefaultRoute() {
      router.navigate('', {trigger: true});
    };

    router.on('route:RoomSelection', RoomSelection);
    router.on('route:JoinRoom', JoinRoom);
    router.on('route:Default', DefaultRoute);
  };
};

var wc = new WebChat.Chat('react-root');
