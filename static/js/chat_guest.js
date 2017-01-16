
var isActive;

window.onfocus = function () {
  isActive = true;
};

window.onblur = function () {
  isActive = false;
};


var WebChatConfig = {
  parentListener: null,
  autoJoinRoomEvent: false,
  chatWinLoaded: false,
  JoinRoomFlag: false,
  JoinRoomBeginChat: null,
  roomName: null,
  isIE: /*@cc_on!@*/false || !!document.documentMode
};


if (window.addEventListener) {
  addEventListener("message", listener, false);
} else {
  attachEvent("onmessage", listener);
}

function listener(event) {
  if (event.origin !== webchatutility.parentAddress) {
    console.log("invalid event received: "+event.data);
  } else {
    console.log("received: "+event.data);
    if (!WebChatConfig.JoinRoomFlag) {
      WebChatConfig.autoJoinRoomEvent = true;
    } else {
      if (!WebChatConfig.chatWinLoaded) {
        if (WebChatConfig.JoinRoomBeginChat != null) {
          WebChatConfig.JoinRoomBeginChat(WebChatConfig.roomName);
        }
      } else {
        if (WebChatConfig.isIE) {
          if ($(".lifemagazine-guestchat-body-center") != null && $(".lifemagazine-guestchat-body-center")[0] != undefined) {
            $(".lifemagazine-guestchat-body-center").scrollTop($(".lifemagazine-guestchat-body-center")[0].scrollHeight);
          }
        }
      }
    }
  }

  console.log(WebChatConfig);
}


var WebChat = window.WebChat || { };
WebChat.Chat = function(el1, el2, el3) {
  console.log('############### start');
  var $root = $('#' + el1),
      $head = $('#' + el2),
      $body = $('#' + el3);
  socket = io.connect(webChatAddress + '/webchat'),
  me = null,
  connected = false;


  var router,
    roomName,
    roomsCollection,
    userCollection,
    chatCollection;

  var GetMe = function GetMe(user) {
    console.log('3- responsed [GetMe]');
    me = new User(user);
    Backbone.history.stop();
    console.log('first - Backbone.history.stop();');
    startChat(me);
    Backbone.history.start();
    console.log('first - Backbone.history.start();');
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

    var loadFlag = false;

    var roomsSync, userSync, chatSync, channel, roomJoin;


    function roomFormEvent(message) {
      // roomsCollection.add({name: message.roomName, id: message.roomName});
      // router.navigate('room/' + message.roomName, {trigger: true});
    };

    function RoomSelection() {
      // React.unmountComponentAtNode($root[0]);
      // React.renderComponent(RoomForm({rooms: roomsCollection}), $root[0]);
    }

    function JoinRoom(room) {

      $($root).css('height', '416px');
      $($root).css('display', 'block');
      $($head).css('height', '0px');
      $($head).css('display', 'none');
      $($body).css('height', '0px');
      $($body).css('display', 'none');

      if (!loadFlag) {
        roomName = room;
        loadFlag = true;

        WebChatConfig.JoinRoomFlag = true;
        WebChatConfig.roomName = room;
        WebChatConfig.loadFlag = true;

        console.log('7- JoinRoom: ' + room + ', WebChatConfig.autoJoinRoomEvent: ' + WebChatConfig.autoJoinRoomEvent);

        if (WebChatConfig.autoJoinRoomEvent) {
          setTimeout(JoinRoomBeginChat(room), 1500);
        } else {
          $($root).css("background-color","white");
          $($root).css("padding-top","100px");
          $($root).css("text-align", "center");
          $($root).prepend($('<img>',{id:'chatloadingimg',src:'/images/Chatting_loading.gif'}));
          $('#chatloadingimg').css( 'cursor', 'pointer' );

          $("#chatloadingimg").click(function() {
            JoinRoomBeginChat(room);
          });
        }

      }
    }

    function init() {
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
    }

    var JoinRoomBeginChat = function JoinRoomBeginChat(room) {
      console.log('begin JoinRoomBeginChat ~~~~' + room);
      $($root).find('img').remove();

      init();

      userCollection.reset();
      chatCollection.reset();
      roomsCollection.sync('create', {name: room, id: room});
      chatCollection.fetch({room: room});
      userCollection.fetch({room: room});
      React.unmountComponentAtNode($root[0]);
      // React.renderComponent(ChatView({users: userCollection, chats: chatCollection, room: room, me: me}), $root[0]);

      setTimeout(function() {
        console.log('================= before React.renderComponent(ChatView');
        React.renderComponent(ChatView({users: userCollection, chats: chatCollection, room: room, me: me}), $root[0]);
        WebChatConfig.chatWinLoaded = true;
      }, 1000);

      setTimeout(function() {
        if ($(".lifemagazine-guestchat-body-center") != null && $(".lifemagazine-guestchat-body-center")[0] != undefined) {
          $(".lifemagazine-guestchat-body-center").scrollTop($(".lifemagazine-guestchat-body-center")[0].scrollHeight);
        }
      }, 1500);

      console.log('8- JoinRoomBeginChat: ' + room);
    };

    if (WebChatConfig.JoinRoomBeginChat == null) {
      WebChatConfig.JoinRoomBeginChat = JoinRoomBeginChat;
      console.log('init WebChatConfig.JoinRoomBeginChat');
    }

    function DefaultRoute() {
      router.navigate('', {trigger: true});
    };

    router.on('route:RoomSelection', RoomSelection);
    router.on('route:JoinRoom', JoinRoom);
    router.on('route:Default', DefaultRoute);

    console.log('6- ready startChat ');

  };

};

var wc = new WebChat.Chat('lifemagazine_chat', 'lifemagazine_msg_header', 'lifemagazine_msg_body');

