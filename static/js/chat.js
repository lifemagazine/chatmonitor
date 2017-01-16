
var WebChatConfig = { count: 0 };

var WebChat = window.WebChat || {};
WebChat.Chat = function(el) {
  var $root = $('#' + el),
  socket = io.connect(webChatAddress + '/innerchat'),
  me = null,
  connected = false,
  lastModifyTime = 0;
  //to be initialized
  var router,
    roomsCollection,
    userCollection,
    chatCollection;

  var GetMe = function GetMe(user) {
    me = new User(user);
    Backbone.history.stop();
    startChat(me);
    Backbone.history.start();
    connected = true;
  };


  var chatDashboard = function chatDashboard(realTimeInfo) {
    console.log('realTimeInfo => ' + JSON.stringify(realTimeInfo));
    $('#chat_p_access_count').text('현재 접속자 숫자: ' + realTimeInfo.accessCount);
    $('#chat_p_login_count').text('현재 로그인 숫자: ' + realTimeInfo.loginCount);
    $('#chat_p_chatting_count').text('현재 채팅 접속 숫자: ' + realTimeInfo.chattingAccessCount);
    $('#chat_p_consultant_count').text('현재 온라인 컨설턴트 숫자' + realTimeInfo.consultantCount);
    var d = new Date();
    lastModifyTime = d.getTime();
  };

  socket.on('connect', function() {
    if (!connected) socket.emit('GetMe');
  });
  socket.on('GetMe', GetMe);

  socket.on('chatdashboard', chatDashboard);

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

    var roomsSync = new SocketListener('Room', roomsCollection, socket, null, $root);
    var userSync = new SocketListener('User', userCollection, socket, roomsCollection, $root);
    var chatSync = new SocketListener('Chat', chatCollection, socket, null, null);

    roomsCollection.fetch();

    var channel = postal.channel();
    var roomJoin = channel.subscribe('Room.Join', roomFormEvent);

    function roomFormEvent(message) {
      roomsCollection.add({name: message.roomName, id: message.roomName});
    };

    function RoomSelection() {
      console.log('Dashboard RoomSelection event');
      // roomsCollection.sync('create', {name: 'consultantRoom', id: 'consultantRoom'});
      React.unmountComponentAtNode($root[0]);
      React.renderComponent(RoomForm({rooms: roomsCollection}), $root[0]);
    }

    function DefaultRoute() {
      router.navigate('', {trigger: true});
    };

    router.on('route:RoomSelection', RoomSelection);

    setInterval(function() {
      if (WebChatConfig.count > 9) {
        location.reload();
      }
      var d = new Date();
      var time = d.getTime();
      if (time - lastModifyTime > 180000) {
        location.reload();
      } else {
        console.log('valid: ' + time);
      }

      WebChatConfig.count = WebChatConfig.count + 1;
      var restCount = 10 - WebChatConfig.count;
      console.log('current count: ' + WebChatConfig.count + ', it will be reloaded after ' + restCount);
    }, 3* 60 * 1000);
  };

  var requestRoomInfos = function requestRoomInfos() {
    if (connected) socket.emit('GetMe');
    else alert('not connected');
  };

  return requestRoomInfos;
};

var wc = new WebChat.Chat('react-root');

