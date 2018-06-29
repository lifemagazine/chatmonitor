var RoomForm = React.createClass({
  componentWillMount: function(){
    this.channel = postal.channel();
    this._boundForceUpdate = this.forceUpdate.bind(this, null);
    this.props.rooms.on('add change remove', this._boundForceUpdate, this);
  },
  componentWillUnmount: function() {
      this.props.rooms.off("add change remove", this._boundForceUpdate);
    },
  joinRoomHandler: function(){
    this.channel.publish('Room.Join', {roomName: this.refs.roomName.getDOMNode().value});
  },
  render: function(){
    return React.DOM.div({className: 'col-sm-8 col-sm-offset-2'},
      React.DOM.h2(null, 'Please Select a Room'),
      React.DOM.input({type: 'text', placeholder: 'Room Name', className: 'form-control', ref: 'roomName'}, null),
      React.DOM.button({className: 'btn btn-primary btn-block top-margin', onClick: this.joinRoomHandler}, 'Join Room'),
      React.DOM.ul(null,
        this.props.rooms.map(function(r){
          return React.DOM.li({className: 'list-unstyled'}, React.DOM.a({href: '#room/' + r.get('name')}, r.get('name'))
          );
        })
      )
    );
  }
});

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
    this.props.chats.sync('create', {message: data.message, contentLength: data.contentLength, room: this.props.room});
  },
  render: function() {
    return React.DOM.div(null,

          React.DOM.div({className: 'lifemagazine-chat-panel'},
            React.DOM.div({className: 'lifemagazine-chat-header'},
                React.DOM.img({src: '/images/chat_logo.png', style: {position:'absolute', left:'11px', top:'8px'}}),
                React.DOM.div({className: 'lifemagazine-chat-header-title1'}, chatRoom.users
                  // React.DOM.a({className: 'lifemagazine-chat-header-title2', href: '#', title: ''}, "실시간 상담")
                ),
                /*React.DOM.div({className: 'lifemagazine-chat-header-title2'}, "실시간 상담"),*/
                React.DOM.div({style: {position:'absolute', left:'288px', top:'15px', width:'15px', height:'3px', backgroundColor: '#ffc600', cursor: 'pointer'}}, null)
                /*React.DOM.img({src: '/images/chat_close_button.png', style: {position:'absolute', left:'270px', top:'10px', cursor: 'pointer'}})*/
            ),
            /*React.DOM.div({className: 'lifemagazine-chat-body-left'}, null),*/
            React.DOM.div({className: 'lifemagazine-chat-body-center', ref: 'chatList'},
              React.DOM.div({className: 'lifemagazine-chat-body-center-top-dummy'}, null),
              ChatList({chats: this.props.chats, me: this.props.me})
            ),
            ChatForm({me: this.props.me}),
            React.DOM.div({className: 'lifemagazine-chat-footer-bottom'}, null)
          )

      );
  }
});


var lifemagazine_default_msgLines = ['무엇이든 문의해 주세요.', '실시간으로 답변해 드리겠습니다.'];
var lifemagazine_default_src = '/images/admin.png';

var ChatList = React.createClass({
  render: function() {
    var me = this.props.me;
    var timeAgo = null;

    return React.DOM.ul({className: 'lifemagazine-chat-ul-row'},
      React.DOM.ul({className: 'lifemagazine-chat-ul-row'},
        React.DOM.div({className: 'lifemagazine-chat-left-div'},
          React.DOM.div({className: 'lifemagazine-chat-left-p'},
            lifemagazine_default_msgLines.map(function (line) {
              return React.DOM.p({className: 'lifemagazine-chat-p'}, line);
            })
          ),
          React.DOM.p({className: 'lifemagazine-chat-space-p-left'}, timeAgo),
          React.DOM.div({className: '.lifemagazine-chat-left-img', style: {top: '0px', left: '8px', width:'31px', height: '33px', position: 'absolute'}},
            React.DOM.img({src: lifemagazine_default_src, style: {width:'31px', height: '33px', border: '0px'}, title: 'consultant'}),
            null
          )
        )
      ),
      this.props.chats.map(function(chat) {
        return  ChatMessage({chat: chat, me: me});
      })
    )

    /*return React.DOM.ul({className: 'lifemagazine-chat-ul-row'},
      this.props.chats.map(function(chat) {
        return  ChatMessage({chat: chat, me: me});
      })
    )*/
  }
});

var ChatMessage = React.createClass({
  goodClick: function(msgId) {
    sendGoodFeedback(this.props.chat);
  },
  badClick: function(msgId) {
    sendBadFeedback(this.props.chat.get('id'));
  },
  callClick: function(msgId) {
    consultantCall(this.props.chat.get('id'));
  }
  render: function() {
    var timeAgo = moment(this.props.chat.get('ts')).format('h:mm:ss a');
    var message = this.props.chat.get('message') + '';
    message = message.replace(new RegExp('\r?\n','g'), '<br>');
    // var contentLength = getContentWidth(message);
    var contentLength = this.props.chat.get('contentLength');

    if (contentLength == -1) {
      contentLength = webchatutility.getContentWidth(message);
    }

    // console.log(message + '] length: ' + contentLength);

    var msgLines = message.split("<br>");
    var newLineCount = msgLines.length;

    // 197 - 10(padding) * 2(left + right)
    if (contentLength > 177) {
      if (this.props.me.id === this.props.chat.get('user').id) {
        return React.DOM.ul({className: 'lifemagazine-chat-ul-row'},
            React.DOM.div({className: 'lifemagazine-chat-right-div'},
              React.DOM.div({className: 'lifemagazine-chat-right-p'},
                msgLines.map(function (line) {
                  return React.DOM.p({className: 'lifemagazine-chat-p'}, line);
                })
              ),
              React.DOM.p({className: 'lifemagazine-chat-space-p-right'}, timeAgo)
            )
          );
      } else {
        return React.DOM.ul({className: 'lifemagazine-chat-ul-row'},
            React.DOM.div({className: 'lifemagazine-chat-left-div'},
              React.DOM.div({className: 'lifemagazine-chat-left-p'},
                msgLines.map(function (line) {
                  return React.DOM.p({className: 'lifemagazine-chat-p'}, line);
                })
              ),
              React.DOM.p({className: 'lifemagazine-chat-space-p-left'}, timeAgo),
              React.DOM.button({className: 'lifemagazine-chat-good-feedback-p-left', onClick: this.goodClick}, 'Good'),
              React.DOM.button({className: 'lifemagazine-chat-bad-feedback-p-left', onClick: this.badClick}, 'Bad'),
              React.DOM.button({className: 'lifemagazine-chat-call-feedback-p-left', onClick: this.badClick}, 'Call'),
              UserView({user: this.props.chat.get('user'), size: 30, useName: true})
            )
          );
      }
    } else {
      var margin = '' + (177 - contentLength) + 'px';

      if (this.props.me.id === this.props.chat.get('user').id) {
        return React.DOM.ul({className: 'lifemagazine-chat-ul-row'},
            React.DOM.div({className: 'lifemagazine-chat-right-more-div'},
              React.DOM.div({className: 'lifemagazine-chat-span-right', style: {marginLeft: margin}},
                msgLines.map(function (line) {
                  return React.DOM.p({className: 'lifemagazine-chat-p'}, line);
                })
              ),
              React.DOM.p({className: 'lifemagazine-chat-space-more-p-right'}, timeAgo)
            )
          );
      } else {
        return React.DOM.ul({className: 'lifemagazine-chat-ul-row'},
            React.DOM.div({className: 'lifemagazine-chat-left-more-div'},
              React.DOM.div({className: 'lifemagazine-chat-span-left', style: {marginRight: margin}},
                  msgLines.map(function (line) {
                    return React.DOM.p({className: 'lifemagazine-chat-p'}, line);
                  })
              ),
              React.DOM.p({className: 'lifemagazine-chat-space-more-p-left-2'}, timeAgo),
              React.DOM.button({className: 'lifemagazine-chat-good-feedback-p-left', onClick: this.goodClick}, 'Good'),
              React.DOM.button({className: 'lifemagazine-chat-bad-feedback-p-left', onClick: this.badClick}, 'Bad'),
              React.DOM.button({className: 'lifemagazine-chat-call-feedback-p-left', onClick: this.badClick}, 'Call'),
              UserView({user: this.props.chat.get('user'), size: 30, useName: true})
            )
          );
      }
    }

  }
});

var ChatForm = React.createClass({
  componentWillMount: function(){
    this.channel = postal.channel();
  },
  formSubmit: function(e) {
    e.preventDefault();
    var message = this.refs.message.getDOMNode().value;
    if (message !== '') {
      console.log(message);
      this.channel.publish('Chat.Add', {message: message});
      this.refs.message.getDOMNode().value = '';
      this.refs.message.getDOMNode().placeholder = '';
    }else{
      this.refs.message.getDOMNode().placeholder = '대화 입력 후 Enter 키로 전송합니다.';
    }
  },
  textareaEnterEvent: function(e) {
    // console.log('textareaEnterEvent: ' + this.refs.message.getDOMNode().value);
    var code = (e.keyCode ? e.keyCode : e.which);

    if (code == 13 && !e.shiftKey) {
        e.preventDefault();
        var message = this.refs.message.getDOMNode().value;

        if (message.length >= 512) {
          alert('메세지가 512자 이상이면 전송이 제한 됩니다. 현재 ' + message.length + ' 자 입니다.');
          return;
        }

        if (message !== '') {
          var sMsg = message.replace(new RegExp('\r?\n','g'), '<br>');
          var contentLength = webchatutility.getContentWidth(sMsg);
          // console.log(message + ' -> ' + sMsg);
          this.channel.publish('Chat.Add', {message: sMsg, contentLength: contentLength});
          this.refs.message.getDOMNode().value = '';
          this.refs.message.getDOMNode().placeholder = '';
        } else {
          this.refs.message.getDOMNode().placeholder = '대화 입력 후 Enter 키로 전송합니다.';
        }
     } else if (code == 13 && e.shiftKey) {
        this.refs.message.getDOMNode().rows = this.refs.message.getDOMNode().rows + 1;
     }
  },
  render: function() {
    return (
      React.DOM.form({onSubmit: this.formSubmit},
        React.DOM.div({className: 'lifemagazine-chat-footer'},
          /*React.DOM.img({src: '/images/chat_attach_file.png', style: {position:'absolute', left:'5px', top:'4px', cursor: 'pointer'}}),*/
          React.DOM.textarea({className: 'lifemagazine-chat-footer-input', cols: '40', placeholder:'대화 입력 후 Enter 키로 전송합니다.', onKeyPress: this.textareaEnterEvent, ref: 'message'}),
          React.DOM.button({style: {display: 'none'}})
       )
      )
    );
  }
});

var UserList = React.createClass({
  render: function(){
    var me = this.props.me;
    return React.DOM.ul({className: 'list-unstyled'},
      this.props.collection.map(function(user){
        if (me.id !== user.get('id'))
          return React.DOM.li(null, UserView({user: user, size: 50, useName: true, role: user.get('role')}))
      })
    )
  }
});

var UserView = React.createClass({
  render: function(){
    // var name = this.props.useName ? this.props.user.get('user') : 'guest';
    var name = 'admin';
    return React.DOM.div({className: '.lifemagazine-chat-left-img', style: {top: '0px', left: '8px', width:'31px', height: '33px', position: 'absolute'}},
      /*React.DOM.img({src: this.props.user.image(name), style: {width:'31px', height: '33px', border: '0px'}, title: this.props.user.get('user')}),*/
      React.DOM.img({src: lifemagazine_default_src, style: {width:'31px', height: '33px', border: '0px'}, title: 'consultant'}),
      null
    )
  }
});

/*function getContentWidth(content) {
  return getColumnWidth('lifemagazine-chat-string-class ', content);
}

function getColumnWidth(columnClass, text) {
  tempSpan = $('<span id="tempColumnWidth" class="'+columnClass+'" style="display:none">' + text + '</span>').appendTo($('body'));
  columnWidth = tempSpan.width();
  tempSpan.remove();
  return columnWidth;
}
*/
