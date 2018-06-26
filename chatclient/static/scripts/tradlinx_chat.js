
var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

var webchatAddress = "http://www.webmsg.com:8080/";
var iframeAddress = "http://www.webmsg.com:8080";
var parentAddress = "http://demo.webmsg.com:8888";

eventer(messageEvent, function(e) {
	// if (e.data == 'loaded') {
	// 	enableChatAction();
	// } else {
		if ($(".tradlinx-chat-modal").css('display') == 'none') {
			chatBarAlarm();
		}
	// }
},false);

function chatBarAlarm() {
    var msg = "메세지가 도착하였습니다.";
    var time = 0;
    var alarmInterval = 500;
    var count = 0;
    for (var i = 0; i < 11; i++) {
      time += alarmInterval;

      if (i % 2 == 0) {
        setTimeout(function() {
          (function() {
            chatBarNotification(msg);
          })();
        }, time);
      } else {
        setTimeout(function() {
          (function() {
          chatBarRestore(msg);
          })();
        }, time);
      }

    }

    chatBarNotification(msg);
}

function chatBarNotification(msg) {
    $(".tradlinx-chat-inactive-bar").css("background", "#ffc600");

    $(".tradlinx-chat-inactive-bar-td2").css("color", "#4858af");
    $(".tradlinx-chat-inactive-bar-td2").text(msg);

    // $(".tradlinx-chat-inactive-bar-msg").css("color", "#2b7591");
    // $(".tradlinx-chat-inactive-bar-msg").text(msg);
}

function chatBarRestore(msg) {
    // $(".tradlinx-chat-inactive-bar").css("background-image", "url('/images/chat_inactive_bar.png')");
    $(".tradlinx-chat-inactive-bar").css("background", "#00a6f3");

    $(".tradlinx-chat-inactive-bar-td2").css("color", "#ffffff");

    // $(".tradlinx-chat-inactive-bar-msg").css("color", "#bbbbbb");
    if (msg == null) {
      // $(".tradlinx-chat-inactive-bar-msg").text("실시간 상담이 가능합니다.");
      $(".tradlinx-chat-inactive-bar-td2").text("실시간 상담이 가능합니다");
    } else {
      // $(".tradlinx-chat-inactive-bar-msg").text(msg);
      $(".tradlinx-chat-inactive-bar-td2").text(msg);
    }
}

function inactivebar2Msg() {
	$(".tradlinx-chat-inactive-bar").css("background", "#060952");
	$(".tradlinx-chat-inactive-bar-title").text('메세지를 남겨주세요');

	$(".tradlinx-inactive-chat-logo").attr("src", "/images/chat/Message_icon_01.png");
	// $(".tradlinx-inactive-chat-logo").attr("src", "/images/chat/Message_icon_02.png");

	// $(".tradlinx-inactive-chat-logo").attr("style", "left: 8px; ");
	// $(".tradlinx-inactive-chat-logo").attr("style", "padding-top: 3px");
	$(".tradlinx-chat-inactive-bar-title").attr("style", "padding-left: 7px");

	$(".tradlinx-active-chat-logo").attr("src", "/images/chat/Message_icon_02.png");

	$(".tradlinx-chat-header").css("background", "#060952");
	$(".tradlinx-chat-header-title1").text('메세지');
	$(".tradlinx-chat-header-title1").attr("style", "left: 135px; ");
}

function inactivebar2Chatting() {
	$(".tradlinx-chat-inactive-bar").css("background", "#00a6f3");
	$(".tradlinx-chat-inactive-bar-title").text("실시간 상담이 가능합니다");

	$(".tradlinx-inactive-chat-logo").attr("src", "/images/chat/Chatting_icon_01.png");
	// $(".tradlinx-inactive-chat-logo").attr("src", "/images/chat/Chatting_icon_02.png");

	// $(".tradlinx-inactive-chat-logo").attr({"width": "30px"});
	// $(".tradlinx-inactive-chat-logo").attr("style", "left:12px; ");
	// $(".tradlinx-chat-inactive-bar-title").attr("style", "word-spacing: 5px");
	$(".tradlinx-chat-inactive-bar-title").attr("style", "padding-left: 0px");

	$(".tradlinx-active-chat-logo").attr("src", "/images/chat/Chatting_icon_02.png");

	$(".tradlinx-chat-header").css("background", "#00a6f3");
	$(".tradlinx-chat-header-title1").text('1:1 실시간 상담');
	$(".tradlinx-chat-header-title1").attr("style", "left: 106px; ");
}

function forceChatActive() {
	setTimeout(function() {
		var win = document.getElementById("chatIframe").contentWindow;
		win.postMessage(
			'active chat window',
			iframeAddress
		);
	}, 3000);
}

function readCookie(cookiesName) {
	var allcookies = document.cookie;
	console.log("target cookie: " + cookiesName+ ', length: ' + cookiesName.length);
	console.log("all cookies: " + allcookies );
	cookiearray  = allcookies.split(';');

	for (var i=0; i<cookiearray.length; i++) {
		name = cookiearray[i].split('=')[0].replace(/^\s+/, "");
		if (name == cookiesName) {
			value = cookiearray[i].split('=')[1];
			console.log("키 : " + name + " , 값 : " + value);
			return value;
		} else {
			console.log('name: ' + name + ', length: ' + name.length);
		}
	}
	return null;
}

var WebChatMonitor = window.WebChatMonitor || { };
WebChatMonitor.chatwinstate = 'off';
WebChatMonitor.chatwinactive = false;
WebChatMonitor.enableClick = false;

var WebChat = { msgEmail: null, msgName: null};
WebChat.setMsgInfo = function(email, name) {
	console.log(email + ', ' + name);
	WebChat.msgEmail = email;
	WebChat.msgName = name;
}

function getConsultantCount(tokenValue, username) {

    setTimeout(function() {
      (function() {
		  console.log('in setTimeout');
        $.ajax({
          url: webchatAddress + 'checkconsultantcount',
          type: 'get',
          dataType: 'text',
          success: function (data) {
            var json = $.parseJSON(data);
            // alert('count: ' + json.count);
            console.log('count: ' + json.count);
            if (json.count > 0) {
              if (WebChatMonitor.chatwinstate == 'chat') {
                // if same state, do nothing...
              } else {
                // change to chat mode
                changeMode(json.count, tokenValue, username);
              }
            } else {
              if (WebChatMonitor.chatwinstate == 'msg') {
                // if same state, do nothing...
              } else {
                // change to msg mode
                changeMode(json.count, tokenValue, username);
              }
              $(".tradlinx-active-chat-logo").attr("src", "/images/chat/Message_icon_02.png");
            }

            enableChatAction();
          },
          error: function (error) {
            console.log(error);
          }
        });
      })();
    }, 4 * 1000);

    var webSocketServer = webchatAddress + "webevent";
    console.log('parent1- try to connected to ' + webSocketServer);
    var socket = io.connect(webSocketServer);
    socket.on('connect', function() {
      console.log('parent2- websocket connected to ' + webSocketServer);
    });

    socket.on('changemode', function(consultant) {
      console.log('parent3- server push [changemode] -> ' + JSON.stringify(consultant));
      changeMode(consultant.count, tokenValue, username);
    });

    // socket.emit('chatdashboard');
    // console.log('emit chatdashboard');
}

function changeMode(consultantCount, tokenValue, username) {
	console.log('changeMod.consultantCount: ' + consultantCount + ', WebChatMonitor.chatwinstate: ' + WebChatMonitor.chatwinstate + ', tokenValue: ' + tokenValue)
	if (WebChatMonitor.chatwinstate == 'off') {
		if (tokenValue != null && consultantCount > 0) {
			$('#chatIframe').attr('src', webchatAddress + 'checksession?username=' + username + '&token='+tokenValue);
			WebChatMonitor.chatwinstate = 'chat';
			inactivebar2Chatting();
		} else {
			$('#chatIframe').attr('src', webchatAddress + 'msgwindow');
			WebChatMonitor.chatwinstate = 'msg';
			// inactivebat  chatting -> msg
			inactivebar2Msg();

			/*if (username.indexOf('@') > 0) {
				setTimeout(function() {
					var win = document.getElementById("chatIframe").contentWindow;
					win.postMessage(
						username,
						iframeAddress
					);
				}, 1000);
			}*/
			if (WebChat.msgEmail != null && WebChat.msgName != null) {
				setTimeout(function() {
					(function() {
						var win = document.getElementById("chatIframe").contentWindow;
						win.postMessage(
							WebChat.msgName + ';' + WebChat.msgEmail,
							iframeAddress
						);
					})();
				}, 1000);
			}
		}
	} else {
		if (consultantCount > 0 && WebChatMonitor.chatwinstate == 'msg') {
			$('#chatIframe').attr('src', webchatAddress + 'checksession?username=' + username + '&token='+tokenValue);
			WebChatMonitor.chatwinstate = 'chat';
			inactivebar2Chatting();
			forceChatActive();
		} else if (consultantCount > 0 && WebChatMonitor.chatwinstate == 'chat') {
			// do nothing
			inactivebar2Chatting();
			forceChatActive();
		} else if (consultantCount == 0 && WebChatMonitor.chatwinstate == 'chat') {
			$('#chatIframe').attr('src', webchatAddress + 'msgwindow');
			WebChatMonitor.chatwinstate = 'msg';
			// inactivebat  chatting -> msg
			inactivebar2Msg();

			if (WebChatMonitor.chatwinactive == true) {
				setTimeout(function() {
					(function() {
						alert('죄송합니다. 현재 대기중인 컨설턴트가 없습니다. 메세지를 남겨주시면 빠른 시간안에 답변드리겠습니다.');
						// setInactiveChatWindow();
					})();
				}, 5000);
			}
		} else {
			$('#chatIframe').attr('src', webchatAddress + 'msgwindow');
			WebChatMonitor.chatwinstate = 'msg';
			// inactivebat  chatting -> msg
			inactivebar2Msg();
		}
	}
}

// call by tradlinx.js-checkSession
// parameter token not used
function callCheckSession(name, tokenId, token, fullName) {
	console.log('callCheckSession -> name: ' + name + ', tokenId: ' + tokenId);
	if (name == null) {
		console.log('failed to check in tradlinx.js-checkSession');
	} else {
		console.log('succeeded to check in tradlinx.js-checkSession');
	}
	username = name;
	tokenValue = 'd3d3LnRyYWRsaW54LmNvbQ==';

	if (username == null || username.length == 0) {
		username = tokenId.replace(/=/g, "");
		var utf8 = unescape(encodeURIComponent(username));
		var id = 0;
		for (var i = 0; i < utf8.length; i++) {
			id = id + utf8.charCodeAt(i);
		}
		username = 'Guest-' + id + '-' + username;
	} else {
		WebChat.msgEmail = username;
		WebChat.msgName = fullName;
	}
	console.log(webchatAddress + 'checksession?username=' + username + '&token='+tokenValue);
	// $('#chatIframe').attr('src', webchatAddress + 'checksession?username=' + username + '&token='+tokenValue);
	setTimeout(function() {
		(function() {
			$('#chatIframe').css('height', '416px');
			$('#previewchat').css('height', '0px');
		})();
	}, 3000);

	inactivebar2Msg();
	getConsultantCount(tokenValue, username);
}

function enableChatAction() {

	var win = document.getElementById("chatIframe").contentWindow;
	win.postMessage(
		'active chat window',
		parentAddress
	);

	setTimeout(function() {
		(function() {
			$(".tradlinx-chat-inactive-bar").css("cursor", "pointer");

			$( ".tradlinx-chat-modal" ).draggable();

			$(".tradlinx-chat-inactive-bar").click(function() {
				setActiveChatWindow();
			});

			$("#tradlinx-modal-close").click(function() {
				setInactiveChatWindow();
			});
		})();
	}, 1500);
}

function setActiveChatWindow() {

	$(".tradlinx-chat-inactive-bar").css("background", "#00a6f3");
	$(".tradlinx-chat-inactive-bar-td2").css("color", "#ffffff");

	if (WebChatMonitor.chatwinstate == 'chat') {
		var win = document.getElementById("chatIframe").contentWindow;
		win.postMessage(
			'active chat window',
			iframeAddress
		);
	} else {
		if (WebChat.msgEmail != null && WebChat.msgName != null) {
			setTimeout(function() {
				(function() {
					var win = document.getElementById("chatIframe").contentWindow;
					win.postMessage(
						WebChat.msgName + ';' + WebChat.msgEmail,
						iframeAddress
					);
				})();
			}, 100);
		}
	}

	$('.tradlinx-chat-inactive-bar').hide();
	$('.tradlinx-chat-modal').show("fast", function() {});
	WebChatMonitor.chatwinactive = true;
}

function setInactiveChatWindow() {

	$('.tradlinx-chat-modal').hide();
	$('.tradlinx-chat-inactive-bar').show("fast", function() {
		if (WebChatMonitor.chatwinstate == 'chat') {
			$(".tradlinx-chat-inactive-bar").css("background", "#00a6f3");
			$(".tradlinx-chat-inactive-bar-td2").css("color", "#ffffff");
			// $(".tradlinx-chat-inactive-bar-td2").text("실시간 상담이 가능합니다");
			$(".tradlinx-chat-inactive-bar-title").text("실시간 상담이 가능합니다");
		} else {
			$(".tradlinx-chat-inactive-bar").css("background", "#060952");
			$(".tradlinx-chat-inactive-bar-td2").css("color", "#ffffff");
			// $(".tradlinx-chat-inactive-bar-td2").text("메세지를 남겨주세요");
			$(".tradlinx-chat-inactive-bar-title").text("메세지를 남겨주세요");
		}
	});
	WebChatMonitor.chatwinactive = false;
	$(".tradlinx-chat-inactive-bar").focus();
}


var webchat = {};

var webchat_init = function(baseDivName) {

	var baseDiv = document.getElementsByClassName(baseDivName)[0];

	webchat.basementDiv = document.createElement("DIV");
	webchat.basementDiv.className = "tradlinx-chat-foothold";
	baseDiv.appendChild(webchat.basementDiv);

	webchat.floor1Div = document.createElement("DIV");
	webchat.floor1Div.className = "tradlinx-chat-floor1";
	webchat.basementDiv.appendChild(webchat.floor1Div);

	webchat.floor2Div = document.createElement("DIV");
	webchat.floor2Div.id = "inacviebutton";
	webchat.floor1Div.appendChild(webchat.floor2Div);

	webchat.chatModalWindowDiv = document.createElement("DIV");
	webchat.chatModalWindowDiv.id = "chatmodalwindow";
	webchat.chatModalWindowDiv.className = "tradlinx-chat-modal";
	webchat.floor2Div.appendChild(webchat.chatModalWindowDiv);

	webchat.headerDiv = document.createElement("DIV");
	webchat.headerDiv.className = "tradlinx-chat-header";
	webchat.chatModalWindowDiv.appendChild(webchat.headerDiv);

	webchat.headerLogoImg = document.createElement("IMG");
	webchat.headerLogoImg.className = "tradlinx-active-chat-logo";
	webchat.headerLogoImg.src = "/images/chat/Chatting_icon_02.png";
	webchat.headerDiv.appendChild(webchat.headerLogoImg);

	webchat.headerTitleDiv = document.createElement("DIV");
	webchat.headerTitleDiv.className = "tradlinx-chat-header-title1";
	webchat.headerTitleDiv.innerHTML = "1:1 실시간 상담";
	webchat.headerDiv.appendChild(webchat.headerTitleDiv);

	webchat.chatClostButtonImg = document.createElement("IMG");
	webchat.chatClostButtonImg.id = "tradlinx-modal-close";
	webchat.chatClostButtonImg.src = "/images/chat/chat_close_button.png";
	webchat.headerDiv.appendChild(webchat.chatClostButtonImg);

	webchat.iframe = document.createElement("IFRAME");
	webchat.iframe.id = "chatIframe";
	webchat.chatModalWindowDiv.appendChild(webchat.iframe);


	webchat.inactiveBarDiv = document.createElement("DIV");
	webchat.inactiveBarDiv.className = "tradlinx-chat-inactive-bar";
	webchat.floor2Div.appendChild(webchat.inactiveBarDiv);
	webchat.inactiveBarDiv.style.cursor =  "wait";

	/*webchat.inactiveBarTable = document.createElement("TABLE");
	webchat.inactiveBarTable.className = "tradlinx-chat-inactive-bar-table";
	webchat.inactiveBarDiv.appendChild(webchat.inactiveBarTable);

	webchat.inactiveBarTr = document.createElement("TR");
	webchat.inactiveBarTable.appendChild(webchat.inactiveBarTr);

	webchat.inactiveBarTd1 = document.createElement('TD');
	webchat.inactiveBarTd1.className = "tradlinx-chat-inactive-bar-td1";
	webchat.inactiveBarTr.appendChild(webchat.inactiveBarTd1);

	webchat.inactiveBarLogoImg = document.createElement("IMG");
	webchat.inactiveBarLogoImg.className = "tradlinx-inactive-chat-logo";
	webchat.inactiveBarLogoImg.src = "/images/chat/Message_icon_01.png";
	webchat.inactiveBarTd1.appendChild(webchat.inactiveBarLogoImg);

	webchat.inactiveBarTd2 = document.createElement('TD');
	webchat.inactiveBarTd2.className = "tradlinx-chat-inactive-bar-td2";
	webchat.inactiveBarTr.appendChild(webchat.inactiveBarTd2);*/

	webchat.inactiveBarLogoImg = document.createElement("IMG");
	webchat.inactiveBarLogoImg.className = "tradlinx-inactive-chat-logo";
	webchat.inactiveBarLogoImg.src = "/images/chat/Message_icon_01.png";
	webchat.inactiveBarDiv.appendChild(webchat.inactiveBarLogoImg);

	webchat.inactiveBarTitleP = document.createElement('P');
	webchat.inactiveBarTitleP.className = "tradlinx-chat-inactive-bar-title";
	webchat.inactiveBarTitleP.innerHTML = "메세지를 남겨주세요.";
	webchat.inactiveBarDiv.appendChild(webchat.inactiveBarTitleP);

	// webchat.inactiveBarTitleDiv = document.createElement("DIV");
	// webchat.inactiveBarTitleDiv.className = "tradlinx-chat-inactive-bar-title";
	// webchat.inactiveBarTitleDiv.innerHTML = "실시간 상담이 가능합니다.";
	// webchat.inactiveBarTd2.appendChild("..... loading .....");

	webchat.floor2Div.appendChild(webchat.inactiveBarDiv);
	//webchat.floor2Div.appendChild(webchat.inactiveBarTable);
}
