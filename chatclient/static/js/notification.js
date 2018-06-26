// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());




/**
 * Notification JS
 * Shims up the Notification API
 *
 * @author Andrew Dodson
 * @website http://adodson.com/notification.js/
 */

//
// Does the browser support the the Notification API?
// .. and does it have a permission property?
//

(function(window, document){

	var PERMISSION_GRANTED = 'granted',
		PERMISSION_DENIED = 'denied',
		PERMISSION_UNKNOWN = 'unknown';

	var a = [], iv, i=0;

	//
	// Swap the document.title with the notification
	//
	function swaptitle(title){

		if(a.length===0){
			a = [document.title];
		}

		a.push(title);

		if(!iv){
			iv = setInterval(function(){

				// has document.title changed externally?
				if(a.indexOf(document.title) === -1 ){
					// update the default title
					a[0] = document.title;
				}

				document.title = a[++i%a.length];
			}, 1000);
		}
	}

	function swapTitleCancel(){

		// dont do any more if we haven't got anything open
		if(a.length===0){
			return;
		}

		// if an IE overlay is present, kill it
		if("external" in window && "msSiteModeClearIconOverlay" in window.external ){
			window.external.msSiteModeClearIconOverlay();
		}

		clearInterval(iv);

		iv = false;
		document.title = a[0];
		a = [];
	}

	//
	// Add aevent handlers
	function addEvent(el,name,func){
		if(name.match(" ")){
			var a = name.split(' ');
			for(var i=0;i<a.length;i++){
				addEvent( el, a[i], func);
			}
		}
		if(el.addEventListener){
			el.removeEventListener(name, func, false);
			el.addEventListener(name, func, false);
		}
		else {
			el.detachEvent('on'+name, func);
			el.attachEvent('on'+name, func);
		}
	}


	function check_permission(){
		// Check whether the current desktop supports notifications and if they are authorised,
		// PERMISSION_GRANTED (yes they are supported and permission is granted),
		// PERMISSION_DENIED (yes they are supported, permission has not been granted),
		// -1 (Notifications are not supported)

		// IE9
		if(("external" in window) && ("msIsSiteMode" in window.external)){
			return window.external.msIsSiteMode()? PERMISSION_GRANTED : PERMISSION_UNKNOWN;
		}
		else if("webkitNotifications" in window){
			return window.webkitNotifications.checkPermission() === 0 ? PERMISSION_GRANTED : PERMISSION_DENIED;
		}
		else if("mozNotification" in window.navigator){
			return PERMISSION_GRANTED;
		}
		else {
			return PERMISSION_UNKNOWN;
		}
	}

	function update_permission(){
		// Define the current state
		window.Notification.permission = check_permission();
		return window.Notification.permission;
	}


	if(!Object(window.Notification).permission){

		//
		// Bind event handlers to the body
		addEvent(window, "focus scroll click", swapTitleCancel);

		// Assign it.
		window.Notification = function(message, options){

			// ensure this is an instance
			if(!(this instanceof window.Notification)){
				return new window.Notification(message,options);
			}

			var n, self = this;

			//
			options = options || {};

			this.body = options.body || '';
			this.icon = options.icon || '';
			this.lang = options.lang || '';
			this.tag = options.tag || '';
			this.close = function(){

				// remove swapTitle
				swapTitleCancel();

				// Close
				if(Object(n).close){
					n.close();
				}

				self.onclose();
			};
			this.onclick = function(){};
			this.onclose = function(){};

			//
			// Swap document.title
			//
			swaptitle(message);

			//
			// Create Desktop Notifications
			//
			if(("external" in window) && ("msIsSiteMode" in window.external)){
				if(window.external.msIsSiteMode()){
					window.external.msSiteModeActivate();
					if(this.icon){
						window.external.msSiteModeSetIconOverlay(this.icon, message);
					}
				}
			}
			else if("webkitNotifications" in window){
				if(window.webkitNotifications.checkPermission() === 0){
					n = window.webkitNotifications.createNotification(this.icon, message, this.body );
					n.show();
					n.onclick = function(){

						// Fire any user bound events to the onclick function
						self.onclick();

						// redirect the user back to the page
						window.focus();
						setTimeout( function(){ n.cancel(); }, 1000);
					};
				}
			}
			else if( "mozNotification" in window.navigator ){
				var m = window.navigator.mozNotification.createNotification( message, this.body, this.icon );
				m.show();
			}
		};

		window.Notification.requestPermission = function(cb){
			// Setup
			// triggers the authentication to create a notification
			cb = cb || function(){};

			// IE9
			if(("external" in window) && ("msIsSiteMode" in window.external)){
				try{
					if( !window.external.msIsSiteMode() ){
						window.external.msAddSiteMode();
						cb( PERMISSION_UNKNOWN );
					}
				}
				catch(e){}
				cb( update_permission() );
			}
			else if("webkitNotifications" in window){
				window.webkitNotifications.requestPermission(function(){
					cb( update_permission() );
				});
			}
			else {
				cb( update_permission() );
			}
		};

		// Get the current permission
		update_permission();
	}
})(window, document);





        var console = window.console || {log:function(){}};

        var isActive;

        window.onfocus = function () {
          isActive = true;
        };

        window.onblur = function () {
          isActive = false;
        };

        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

        function notifyChatMessage(models) {
            // if (window.isActive) {
            //     console.log('Notification event skip!');
            //     return;
            // }

            if (Notification.permission !== 'granted') {
                console.log('permission not granted!');
                Notification.requestPermission();
            }

            console.log(models);

            var url = location.href.split('/');
            var title = "혼자 대기중인 고객 메세지";
            // title = title + '-' + url[url.length-1];
            var notification = new Notification( title, {
                body: models.message,
                icon : "/images/wait_msg.png"
            });

            notification.onclick = function() {
            	popupChatWindow(models.room);
            };
        }

        function notifyRoomEvent(rooms) {
            // alert(JSON.stringify(rooms));
            /*if (window.isActive) {
                console.log('Notification event skip!');
                return;
            }*/

            if (Notification.permission !== 'granted') {
                Notification.requestPermission();
            }

            // var resultMsg = ' 채팅방에서 대기중인 고객이 있습니다.';
            var resultMsg = null;
            for (var i in rooms) {
              var room = rooms[i];
              if (room.users == undefined || room.users.length == 0 || room.users.length > 1) {
                // nothing
              } else if (room.users.length == 1 && room.users[0].id != userid) {
                console.log('waiting customer: '+ JSON.stringify(room.users[0]));
                resultMsg = room.name + ' 채팅방에 대기중인 고객이 있습니다.';
                // alert(resultMsg);
                break;
              }
            }
            // alert(resultMsg);
            if (resultMsg == null) return;

            var url = location.href.split('/');
            var title = "[새로 생긴 채팅방]";
            // title = title + '-' + url[url.length-1];
            var notification = new Notification( title, {
                body: resultMsg,
                icon : "/images/active_chat_log.png"
            });
        }
