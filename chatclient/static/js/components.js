var ChatRoomInfo = { };
ChatRoomInfo.waitingRoomMap = new HashMap;
ChatRoomInfo.unreadMsgRoomMap = new HashMap;

var RoomForm = React.createClass({
  componentWillMount: function(){
    this.channel = postal.channel();
    this._boundForceUpdate = this.forceUpdate.bind(this, null);
    this.props.rooms.on('add change remove', this._boundForceUpdate, this);
  },
  componentWillUnmount: function() {
      this.props.rooms.off("add change remove", this._boundForceUpdate);
    },
  joinRoomHandler: function() {
    this.channel.publish('Room.Join', {roomName: this.refs.roomName.getDOMNode().value});
  },
  render: function() {
    // console.log('total: ' + this.props.rooms.length);

    var unhostedRooms = [];
    var hostedRooms = [];
    ChatRoomInfo.waitingRoomMap = new HashMap;

    this.props.rooms.map(function(room) {
      // console.log(room.get('name') + ' -> ' + JSON.stringify(room.get('users')));
      if (room.get('users') == undefined || room.get('users').length == 0) {
        unhostedRooms.push(room);
      } else {
        hostedRooms.push(room);
      }
    });

    // console.log('unhostedRooms: ' + unhostedRooms.length);
    // console.log('hostedRooms: ' + hostedRooms.length);

    return React.DOM.div({style: {height: '600px'}},

        React.DOM.div({className: "lifemagazine-chat-rooms-panel", style: {position: 'absolute', height: '600px', width: '190px', overflow: 'auto', background: '#ddd'}},
          React.DOM.br(null),
          React.DOM.p({className: 'lifemagazine-chat-rooms-title', style: {width: '160px'}}, 'Inactive Chatting Room'),
          unhostedRooms.map(function(r) {
            if (r == undefined) return null;
            var roomName = r.get('name').length <= 20 ? r.get('name') : r.get('name').substr(0, 17) + '...';
            return React.DOM.div({style: {width: '180px', padding: '5px'}}, React.DOM.a({className: 'btn btn-info', role: 'button', style: {width:'150px', margin: '5px', fontSize: '9px'}, href: 'javascript:chattingMenu("' + r.get('name') + '");', id: 'room-' + r.get('name')}, roomName));
          }),
          React.DOM.br(null),
          React.DOM.h6({style: {width: '160px'}}, '새 채팅방 만들기'),
          React.DOM.input({type: 'text', placeholder: 'Room Name',  ref: 'roomName', style: {width: '150px', margin: '5px'}}, null),
          React.DOM.button({className: 'btn btn-info', style: {width: '150px', margin: '5px', background: 'black', border: 'solid black'}, onClick: this.joinRoomHandler}, 'Create Room')
        ),

        React.DOM.div({className: "lifemagazine-chat-rooms-panel", style: {position: 'absolute', left: '210px', height: '600px', width: '190px', overflow: 'auto', background: '#bbb'}},
          React.DOM.br(null),
          React.DOM.p({className: 'lifemagazine-chat-rooms-title', style: {width: '160px'}}, 'Active Chatting Room'),
          hostedRooms.map(function(r) {
            var users = r.get('users');
            // console.log(r.get('name') + ' user count : ' + users.length);
            var roomName = r.get('name').length <= 20 ? r.get('name') : r.get('name').substr(0, 17) + '...';

            if (users.length == 1) {
              ChatRoomInfo.waitingRoomMap.put(r.get('name'), users.length);
              var bgColor = '#FF9436';
              if (ChatRoomInfo.unreadMsgRoomMap.get(r.get('name')) != undefined) {
                bgColor = '#FF0000';
              }
              return React.DOM.div({style: {width: '180px', padding: '5px'}},
                React.DOM.a({className: 'btn btn-info', style: {width:'150px', margin: '5px', background: bgColor, border:'#FF9436', fontSize: '9px'}, href: 'javascript:popupChatWindow("' + r.get('name') + '");', id: 'room-' + r.get('name')}, roomName + ' (' + users.length + ')')
              );
            } else {
              ChatRoomInfo.waitingRoomMap.put(r.get('name'), users.length);
              ChatRoomInfo.unreadMsgRoomMap.remove(r.get('name'));
              return React.DOM.div({style: {width: '180px', padding: '10px'}},
                React.DOM.a({className: 'btn btn-info', style: {width:'150px', margin: '5px', background: '#3163C9', border:'#3163C9', fontSize: '9px'}, href: 'javascript:popupChatWindow("' + r.get('name') + '");', id: 'room-' + r.get('name')}, roomName + ' (' + users.length + ')')
              );
            }
          })
        )

    );
  }
});

var top = -473;
var left = -302;
function popupChatWindow(roomName) {
  var url = webChatAddress + '/chatwindowadmin#room/' + roomName;
  var id = 'room-' + roomName;
  var className = document.getElementById(id).className;
  document.getElementById(id).className = className + " disabled";
  var height = 448 + 2;
  var width = 314 + 2;
  top = height;
  left = left + width;
  if (left > screen.width - 450 || left < 0) {
    left = 0;
  }

  window.open(url,'','height=450,width=316,top=' + top + ',left=' + left + ',directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no');
}

function chattingMenu(roomName) {
  $( "#dialog-confirm" ).dialog({
      resizable: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        "채팅창 열기": function() {
          $( this ).dialog( "close" );
          popupChatWindow(roomName);
        },
        "채팅룸 삭제": function() {
          $( this ).dialog( "close" );
          if (confirm('정말 [' + roomName + '] 채팅룸을 삭제하시겠습니까?')) {
            removeChattingRoom(roomName);
          }
        }
      }
    });
}

function removeChattingRoom(roomName) {
    var formData = { roomname: roomName };
    $.ajax({
        url: '/removechattingroom',
        async: false,
        type: "POST",
        data : JSON.stringify(formData),
        contentType: "application/json; charset=utf-8",
        success: function(data) {
            // console.log('succeeded to remove chatting room: ' + roomName);
            alert('succeeded to remove chatting room: ' + roomName);
            // location.reload();
            wc();
        },
        error: function(err) {
            console.log(err);
            alert('failed to remvoe chatting room: ' + roomName);
        }
    });
}

var ChatView = React.createClass({
  componentWillMount: function(){
    var channel = postal.channel();
    this._boundForceUpdate = this.forceUpdate.bind(this, null);
    this.props.chats.on('add change remove', this._boundForceUpdate, this);
    this.props.users.on('add change remove', this._boundForceUpdate, this);
    this.chatSub = channel.subscribe('Chat.Add', this.chatAdd);
  },
  componentWillUnmount: function() {
    this.props.chats.off("add change remove", this._boundForceUpdate);
    this.props.users.off("add change remove", this._boundForceUpdate);
    this.chatSub.unsubscribe();
  },
  componentDidUpdate: function(){
    var chatList = this.refs.chatList.getDOMNode();
    chatList.scrollTop = chatList.scrollHeight;
  },
  chatAdd: function(data){
    this.props.chats.sync('create', {message: data.message, room: this.props.room});
  },
  render: function(){
    return React.DOM.div({className: "row"},
      React.DOM.div({className: 'row'},
        React.DOM.div({className: "col-sm-2"}, UserList({collection: this.props.users, me: this.props.me}) ),
        React.DOM.div({className: "col-sm-8 chat-center", ref: 'chatList'},
          ChatList({chats: this.props.chats, me: this.props.me})
        )
      ),
      ChatForm({me: this.props.me})
    );
  }
});

var ChatList = React.createClass({
  render: function(){
    var me = this.props.me;
    return React.DOM.ul({className: 'list-unstyled'},
      this.props.chats.map(function(chat){
        return  ChatMessage({chat: chat, me: me});
      })
    )
  }
});

var ChatMessage = React.createClass({
  render: function(){
    var pull;
    if (this.props.me.id === this.props.chat.get('user').id)
      pull = 'pull-right';
    else
      pull = 'pull-left';

    var timeAgo = moment(this.props.chat.get('ts')).fromNow();
    return React.DOM.li(null,
      React.DOM.div({className: 'bg-primary chat-message ' + pull}, this.props.chat.get('message')),
      React.DOM.div({className: 'clearfix'}, null),
      React.DOM.div({className: pull},
        UserView({user: this.props.chat.get('user'), size: 20, useName: true}), React.DOM.small(null, timeAgo)),
      React.DOM.div({className: 'clearfix'}, null)
    )
  }
});

var ChatForm = React.createClass({
  componentWillMount: function(){
    this.channel = postal.channel();
  },
  formSubmit: function(e){
    e.preventDefault();
    var message = this.refs.message.getDOMNode().value;
    if (message !== '')
    {
      this.channel.publish('Chat.Add', {message: message});
      this.refs.message.getDOMNode().value = '';
      this.refs.message.getDOMNode().placeholder = '';
    }else{
      this.refs.message.getDOMNode().placeholder = 'Please enter a message';
    }
  },
  render: function(){
    return React.DOM.div({className: "row"},
      React.DOM.form({onSubmit: this.formSubmit},
        React.DOM.div({className: "col-sm-2"},
          UserView({user: this.props.me, size: 50, useName: true})),
        React.DOM.div({className: "col-sm-8"},
          React.DOM.input({type: "text", className: "form-control", ref: "message"}, null)),
        React.DOM.div({className: "col-sm-2"},
          React.DOM.button({className: "btn btn-primary"}, 'Send'))
      )
    )
  }
});

var UserList = React.createClass({
  render: function(){
    var me = this.props.me;
    return React.DOM.ul({className: 'list-unstyled'},
      this.props.collection.map(function(user){
        if (me.id !== user.get('id'))
          return React.DOM.li(null, UserView({user: user, size: 50, useName: true}))
      })
    )
  }
});

var UserView = React.createClass({
  render: function(){
    var name = this.props.useName ? this.props.user.get('user') : null;
    return React.DOM.div(null,
      React.DOM.img({src: this.props.user.image(this.props.size), className: 'img-circle', title: this.props.user.get('user')}),
      name
    )
  }
});
