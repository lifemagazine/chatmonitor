var apiUrlPrefix = 'http://';
//var apiSvrUrl = 'https://api.tradlinx.com'
var apiSvrUrl = 'http://192.168.2.131:8080'

var tokenValue = 'd3d3LnRyYWRsaW54LmNvbQ==';
//var userId = '';
var username = '';

var tradlinx = angular.module('tradlinx', ['ui.router',
											'tradlinxCtrls',
											'ngSanitize',
											'pasvaz.bindonce']);

tradlinx.config(
                 function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/main');

	$stateProvider.state('main', {url: '/main', templateUrl: 'new/views/main.html', controller: 'MainCtrl'})
	    .state('signup', {url: '/signup', templateUrl: "/views/user/sign_up.html", controller: 'Signup'})
	    .state('signupConfirm', {url: '/signup/confirm', templateUrl: '/views/user/sign_up_confirm.html', controller: 'SignupConfirm'})
	    .state('login', {url: '/login', templateUrl: '/views/user/login.html', controller: 'Login'})
	    .state('password', {url: '/password', templateUrl: '/views/user/password.html', controller: 'Password'})
	    .state('notice', {url: '/notice', templateUrl: '/views/board/notice.html', controller: 'Notice'})
	    .state('noticeArticle', {url: '/notice/article/:articleId', templateUrl: '/views/board/notice_article.html', controller: 'NoticeArticle'})
	    .state('comingsoon', {url: '/comingsoon', templateUrl: '/views/oth/comingsoon.html', controller: 'OtherPage'})
	    .state('terminalSchedule', {url: '/terminal/schedule', templateUrl: '/views/terminal/terminal_schedule.html', controller: 'TerminalSchedule'})

	    .state('search', {url: '/search', templateUrl: '/views/schedule/search.html', controller: 'Search'})
	    .state('search.fcl', {url: '/fcl', templateUrl: '/views/schedule/search_fcl.html', controller: 'SearchFcl'})
	    .state('search.lcl', {url: '/lcl', templateUrl: '/views/schedule/search_lcl.html', controller: 'SearchLcl'})
	    .state('search.vesselSchedule', {url: '/vessel', templateUrl: '/views/schedule/vessel_schedule.html', controller: 'VesselSchedule'})


	    .state('fclSchedule', {url: '/fcl', templateUrl: '/views/schedule/fcl_schedule.html', controller: 'FclSchedule'})
	    .state('fclSchedule.list', {url: '/list', templateUrl: '/views/schedule/fcl_schedule_list.html', controller: 'FclScheduleList'})
	    .state('fclSchedule.calendar', {url: '/calendar', templateUrl: '/views/schedule/fcl_schedule_calendar.html', controller: 'FclScheduleCalendar'})

	    .state('lclSchedule', {url: '/lcl', templateUrl: '/views/schedule/lcl_schedule.html', controller: 'LclSchedule'})
	    .state('lclSchedule.list', {url: '/list', templateUrl: '/views/schedule/lcl_schedule_list.html', controller: 'LclScheduleList'})

	    .state('mypage', {url: '/mypage', templateUrl: '/views/mypage/mypage.html', controller: 'Mypage'})
	    .state('mypage.memberinfo', {url: '/memberinfo', templateUrl: '/views/mypage/mypage_memberinfo.html', controller: 'MypageMemberInfo'})
	    .state('mypage.password', {url: '/password', templateUrl: '/views/mypage/mypage_password.html', controller: 'MypagePassword'})
	    .state('mypage.consulting', {url: '/consulting', templateUrl: '/views/mypage/mypage_consulting.html', controller: 'MypageConsulting'})
	    .state('mypage.consultingView', {url: '/consultingview', templateUrl: '/views/mypage/mypage_consulting_view.html', controller: 'MypageConsultingView'})

	    .state('consultingSelect', {url: '/consultingselect', templateUrl: '/views/consulting/consulting_select.html', controller: 'ConsultingSelect'})
	    .state('consulting', {url: '/consulting', templateUrl: '/views/consulting/consulting.html', controller: 'Consulting'})
	    .state('consulting.fcl', {url: '/fcl', templateUrl: '/views/consulting/consulting_fcl.html', controller: 'ConsultingFcl'})
	    .state('consulting.lcl', {url: '/lcl', templateUrl: '/views/consulting/consulting_lcl.html', controller: 'ConsultingLcl'})
	    .state('consulting.move', {url: '/move', templateUrl: '/views/consulting/consulting_move.html', controller: 'ConsultingMove'})
	    .state('consulting.express', {url: '/express', templateUrl: '/views/consulting/consulting_express.html', controller: 'ConsultingExpress'})
	    .state('consultingComplete', {url: '/consultingcomplete', templateUrl: '/views/consulting/consulting_complete.html', controller: 'ConsultingComplete'})

	    .state('freightIndex', {url: '/freight/index', templateUrl: '/views/freight/freight_index.html', controller: 'FreightIndex'})

	    .state('aboutUs', {url: '/about', templateUrl: '/views/oth/aboutus.html', controller: 'AboutUs'})

	    .state('link', {url: '/link', controller: 'Link'})
	    ;
	}

);

		/*
		[
	'$routeProvider',
	function($routeProvider) {
		$routeProvider.when('/main', {templateUrl: '/views/main.html', controller: 'MainCtrl'})
					.when('/user/signup', {templateUrl: '/views/user/sign_up.html', controller: 'Signup'})
					.when('/user/signup/confirm', {templateUrl: '/views/user/sign_up_confirm.html', controller: 'SignupConfirm'})
					.when('/user/login', {templateUrl: '/views/user/login.html', controller: 'Login'})
					.when('/user/password', {templateUrl: '/views/user/password.html', controller: 'Password'})
					.when('/board/notice', {templateUrl: '/views/board/notice.html', controller: 'Notice'})
					.when('/board/notice/article', {templateUrl: '/views/board/notice_article.html', controller: 'NoticeArticle'})
					.when('/commingsoon', {templateUrl: '/views/oth/commimgsoon.html', controller: 'OtherPage'})
					.when('/terminal/schedule', {templateUrl: '/views/terminal/terminal_schedule.html', controller: 'TerminalSchedule'})


					.when('/schedulesearch', {templateUrl: '/views/schedule/fcl_schedule_search.html', controller: 'ScheduleSearch'})
					.when('/schedule/list', {templateUrl: '/views/schedule/fcl_schedule_list.html', controller: 'ScheduleList'})
					.when('/schedule/calendar', {templateUrl: '/views/schedule/fcl_schedule_calendar.html', controller: 'ScheduleCalendar'})
					.otherwise({redirectTo: '/main'});

	}
]);
*/

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-69830188-1', 'auto');




tradlinx.controller('TradlinxCtrl', function ($scope, $http, $location) {
	apiUrlPrefix = apiUrlPrefix + $location.host() + '/';
//	if ($location.host() == 'localhost') {
//		apiUrlPrefix = 'http://localhost:8080/';
//	}
	headerReadyFunction();
	setBodyContentHeight();

	google.charts.load('current', {'packages':['corechart']});
//	google.load("visualization", "1", {packages:["corechart"]});
//	google.charts.setOnLoadCallback(drawChart);


	$scope.isLoginChecked = false;
	$scope.isLogin = null;
	$scope.isAsking = null;
	$scope.landingPage = '';
	$scope.account = {name:'', id:''};
	$scope.rememberMe = true;
	var id = getId();
	if (id) {
		$scope.loginId = id;
		$scope.rememberEmail = true;
	}
	$scope.fclQuery = {};
	$scope.tmnlQuery = {};
	$scope.lclQuery = {};

	$('#btnGnbLogin').click(
			function() {loginProc($('#email'), $('#password'), $scope, $http, $scope.rememberMe);}
	);


	$('#email').keydown(function (key) {
        if (key.keyCode == 13 && $('#email') && $('#password')) {
        	loginProc($('#email'), $('#password'), $scope, $http, $scope.rememberMe);
        }
    });
	$('#password').keydown(function (key) {
        if (key.keyCode == 13 && $('#email') && $('#password')) {
        	loginProc($('#email'), $('#password'), $scope, $http, $scope.rememberMe);
        }
    });


	$('.headerLogout').click(
			function() {
				logoutPorc($scope, $http, $location);
				}
	);

	$('#btnPassword').click(function() {
		moveToPassword();
	});
	$('#btnSignup').click(function() {
		moveToSignup();
	});
	$('#mypage').click(function() {
		if (!$scope.isLogin) {
			location.href = '/#/login';
		} else {
			location.href = '/#/mypage/memberinfo';
		}
	});

	$('#consulting').click(function() {
		if (!$scope.isLogin) {
			location.href = '/#/login';
		} else {
			location.href = '/#/consulting';
		}
	});

	// callback [tradlinx_chat.js - callCheckSession] after checkSession
	checkSession($scope, $http, callCheckSession);

	setEvent();

	function setEvent() {

		$('#mnuLogin').click(function() {
			$('.wrap_gnb_account').toggleClass('show');
		});

		$(document).click(function(event) {
			var gnbAccountDom = $('.wrap_gnb_account').get(0);
			var mnuLoginDom = $('#mnuLogin').get(0);

			var accntWrapperFlg = $.contains(gnbAccountDom, event.target) || gnbAccountDom == event.target;
			var mnuLoginFlg = $.contains(mnuLoginDom, event.target) || mnuLoginDom == event.target;

			if (!accntWrapperFlg && !mnuLoginFlg) {
				$('.wrap_gnb_account').removeClass('show');
			}
		});
	}

});

var tradlinxCtrls = angular.module('tradlinxCtrls', []);



//메뉴 구조
var menus = [
            {
            	menuId: 'schedule',
            	/*marginLeft: 777,*/
            	marginLeft: 442,
            	subMenus: [
            	           {label: 'FCL Point to Point', url: '/#/search/fcl'},
            	           {label: 'FCL Vessel', url: '/#/comingsoon'},
            	           {label: 'LCL Point to Point', url: '/#/search/lcl'}]
            }
];


var	loginPanel = '';

$(window).scroll(function() {
	$('.menu').css('left', -$(document).scrollLeft());
	$('.subMenu').css('left', -$(document).scrollLeft());
});
$(window).resize(function() {
	setBodyContentHeight();
});
$(document).ready(function() {
	loginPanel = $('.login');
});


function moveToPassword($location) {
	location.href = '/#/password';
	hideLoginPanel();
}
function moveToSignup($location) {
	location.href = '/#/signup';
	hideLoginPanel();
}

function showLoginPnlFunc() {
	if (!loginPanel.isOpening && !loginPanel.isOpened) showLoginPanel(loginPanel);
}


function setBodyContentHeight() {
	var minH = $('.bodyContents').css('min-height');
	minH = String(minH).replace('px', '');
	var wH = $(window).height();
	var fH = $('footer').height();
	var headerH = $('header').height();

	if (minH < wH - fH - headerH + 30) {
		$('.bodyContents').css('min-height', $(window).height() - $('footer').height() - $('header').height() + 30);
	}

}
/*
function checkSession($scope, $http) {
	$http.get(apiUrlPrefix + 'txuAuthenticatedUser.json')
	.then(function(result) {
		if (result.data.result === "OK") {
			$scope.account.id = result.data.id;
			$scope.account.name = result.data.name;
			$scope.isLogin = true;
			$scope.isLoginClass = 'logined';
		} else {
			$scope.isLogin = false;
			$scope.isLoginClass = '';
		}

		$scope.isLoginChecked = true;
	});
}
*/
function checkSession($scope, $http, cb) {
	$http.get(apiSvrUrl + '/session?clientId=tradlinx', {withCredentials: true})
	.then(function(result) {
		var data = result.data.respData;
		username = data.tokenId;

		if (data.user) {
			$scope.account.id = data.user.userId;
			$scope.account.name = data.user.lastNm + data.user.firstNm;
			username = data.user.userId;
			$scope.isLogin = true;
			$scope.isLoginClass = 'logined';
			cb(username, data.tokenId, tokenValue, $scope.account.name);
		} else {
			$scope.isLogin = false;
			$scope.isLoginClass = '';
			cb(null, data.tokenId, tokenValue, null);
		}

		$scope.isLoginChecked = true;
	});
}

/*
function logoutPorc($scope, $http, $location) {
	$scope.account = {};

	$http(
			{method: 'GET',
				url: apiUrlPrefix + 'txuActionLogout.json'})
		.then(function(result) {
			$scope.account.name = '';
			$scope.account.id = '';
			$scope.isLogin = false;
			$scope.isLoginClass = '';
			var id = getId();
			if (id) {
				$scope.loginId = id;
				$scope.rememberEmail = true;
			}
			if ($location && $location.path() != '/main') {
				location.href = '/';
			}
		});

}
*/
function logoutPorc($scope, $http, $location) {
	$http(
			{method: 'GET',
			url: apiSvrUrl + '/logout',
			params : {clientId:'tradlinx'},
			withCredentials: true})
		.then(function(result) {
			var data = result.data;
			if (!data.result) alert(data.resultMsg);
			else {
				$scope.account = {};
				$scope.account.name = '';
				$scope.account.id = '';
				$scope.isLogin = false;
				$scope.isLoginClass = '';
				var id = getId();
				if (id) {
					$scope.loginId = id;
					$scope.rememberEmail = true;
				}
				if ($location && $location.path() != '/main') {
					location.href = '/';
				}
			}
		}
	);
	WebChat.setMsgInfo('logout', 'logout');

}
/*
function loginProc($email, $password, $scope, $http, isSave, nUrl) {
	var returnData = '';

	var email = $email.val();
	var password = $password.val();

	if (!email) {
		alert('Please input e-mail');
		$email.focus();
		return;
	}
	if (!password) {
		alert('Please input password');
		$password.focus();
		return;
	}


	$email.val('');
	$password.val('');


	$http(
			{method: 'GET',
				url: apiUrlPrefix + 'txuActionLogin.json',
				params : {id: email, password: password}})
	.then(
			function(result) {
				returnData = result.data;
				$scope.loginId = '';

				if (returnData.result === 'ERROR') {
					alert(returnData.resultMsg);
				} else if (returnData.result === 'OK') {
					$scope.account.name = returnData.name;
					$scope.account.id = returnData.id;
					$scope.isLogin = true;
					$scope.isLoginClass = 'logined';
					hideLoginPanel();

					if (isSave) {
						saveId(returnData.id);
					}

					if (nUrl) location.href = nUrl;
			}
	});
}
*/
function loginProc($email, $password, $scope, $http, remember, nUrl) {
	var returnData = '';

	var email = $email.val();
	var password = $password.val();

	if (!email) {
		alert('Please input e-mail');
		$email.focus();
		return;
	}
	if (!password) {
		alert('Please input password');
		$password.focus();
		return;
	}


	$email.val('');
	$password.val('');

	$http(
			{method: 'GET',
				url: apiSvrUrl + '/login',
				params : {userId: email, userPswd: password, remember: remember, clientId: 'tradlinx'},
				withCredentials: true})
	.then(
			function(result) {
				$scope.loginId = '';
				var data = result.data;
				if (!data.result){
					alert(data.resultMsg);
					username = data.tokenId;
				} else {
					var respData = data.respData.user;
					$scope.account.name = respData.lastNm + respData.firstNm;
					$scope.account.id = respData.userId;
					username = respData.userId;
					$scope.isLogin = true;
					$scope.isLoginClass = 'logined';
					hideLoginPanel();
					WebChat.setMsgInfo($scope.account.id, $scope.account.name);
				}
			}
	);
}

function loginProc2(email, password, $scope, $http, remember, callBack) {
	var returnData = '';

	if (!email) {
		alert('Please input e-mail');
		return;
	}
	if (!password) {
		alert('Please input password');
		return;
	}

	$http(
			{method: 'GET',
				url: apiSvrUrl + '/login',
				params : {userId: email, userPswd: password, remember: remember, clientId: 'tradlinx'},
				withCredentials: true})
	.then(
			function(result) {
				$scope.loginId = '';
				var data = result.data;
				if (!data.result){
					alert(data.resultMsg);
					username = data.tokenId;
				} else {
					var respData = data.respData.user;
					$scope.account.name = respData.lastNm + respData.firstNm;
					$scope.account.id = respData.userId;
					username = respData.userId;
					$scope.isLogin = true;
					$scope.isLoginClass = 'logined';
					hideLoginPanel();
					WebChat.setMsgInfo($scope.account.id, $scope.account.name);
					if (callBack) callBack();
				}
			}
	);
}


function getId() {
	return getCookie("savedId");
}

function saveId(id) {
	var expdate = new Date();

	expdate.setTime(expdate.getTime() + 1000 * 3600 * 24 * 30);

	setCookie("savedId", id, expdate);
}

//Header 초기화 함수
var headerReadyFunction = function() {
	loginPanel.isOpening = false;
	loginPanel.isOpened = false;
	loginPanel.isClosing = false;
	loginPanel.isClosed = true;

//	var showLoginPnlFunc = function() {
//		if (!loginPanel.isOpening && !loginPanel.isOpened) showLoginPanel(loginPanel);
//	};
	var hideLoginPnlFunc = function() {
		if (!loginPanel.isOpening && !loginPanel.isClosing && !loginPanel.isClosed) hideLoginPanel();
	};


	$('.showLogin').click(showLoginPnlFunc);

	$(document).click(function(event) {
		if (loginPanel.isOpened && !hasClasses($(event.target), '.login') && $(event.target).parents('.login').size() === 0) {

			hideLoginPanel();
		}
	});

	var menuItem = $('.menu .menuList').children('li');
	var subMenuPanel = $('.subMenu');
	menuItem.hover(
			function() {
				var menuId = $(this).attr('id');
				menuItem.removeClass('selected');
				showSubMenu(subMenuPanel, menuId, $(this));
				},
			function() {
					if (!subMenuPanel.hasClass('show')) {
						menuItem.removeClass('selected');
					}
				}
	);

	subMenuPanel.hover(
			function() {},
			function() {
				hideSubMenu(subMenuPanel, menuItem);
			}
	);

};


//SubMenu 을 보여주고, 숨기는 함수
var showSubMenu = function(subMenuPanel, menuId, menu) {
	var openFlag = true;

	menu.addClass('selected');

	if (menuId != subMenuPanel.attr('menu-id')) {
		var html = getSubMenuHtml(menuId);
		if(html) {
			subMenuPanel.children('div').html(html);
			subMenuPanel.attr('menu-id', menuId);
		} else {
			subMenuPanel.children('div').html('');
			subMenuPanel.attr('menu-id', '');
			openFlag = false;
		}
	}


	for (var i = 0 ; i < menus.length ; i++) {
		if (menus[i].menuId == menuId) {
			var marginLeft = menus[i].marginLeft;
		}
	}

	if (openFlag) {
		if (!subMenuPanel.hasClass('show')) {
			$('.subMenu ul').css('margin-left', marginLeft);
			subMenuPanel.animate({marginTop: '0px' }, 100);
			subMenuPanel.addClass('show');
		}
	} else {
		if (subMenuPanel.hasClass('show')) hideSubMenu(subMenuPanel);
	}

}
var hideSubMenu = function(subMenuPanel, menuItem) {
	if (menuItem) {
		menuItem.removeClass('selected');
	}
	if (subMenuPanel.hasClass('show')) {
		subMenuPanel.animate({marginTop: '-48px' }, 100);
		subMenuPanel.removeClass('show');
	}
}
//SubMenu 을 보여주고, 숨기는 함수 끝

//SubMenu를 세팅하는 함수
function getSubMenuHtml(menuId) {
	var html = null;

	for (var i = 0 ; i < menus.length ; i++) {
		if (menus[i].menuId == menuId) {
			html = '<ul>';
			for (var sI = 0 ; sI < menus[i].subMenus.length ; sI++) {
				var subMenu = menus[i].subMenus[sI];
				html += '<li><a href="' + subMenu.url + '">' + subMenu.label + '</a></li>'
			}
			html += '</ul>';
		}
	}

	return html;
}



//Login Panel 을 보여주고, 숨기는 함수
var showLoginPanel = function(loginPanel) {
	loginPanel.isOpening = true;
	loginPanel.isOpened = false;
	loginPanel.isClosing = false;
	loginPanel.isClosed = false;

	loginPanel.stop().animate({marginTop: '0px' }, 300, function() {
		loginPanel.isOpening = false;
		loginPanel.isOpened = true;
		loginPanel.isClosing = false;
		loginPanel.isClosed = false;
		$('input#email').focus();
	});
};
var hideLoginPanel = function() {
	loginPanel.isOpening = false;
	loginPanel.isOpened = false;
	loginPanel.isClosing = true;
	loginPanel.isClosed = false;

//	loginPanel.animate({marginTop: '-280px' }, 300, function() {
//		loginPanel.isOpening = false;
//		loginPanel.isOpened = false;
//		loginPanel.isClosing = false;
//		loginPanel.isClosed = true;
//	});
	$('.wrap_gnb_account').removeClass('show');
};
//Login Panel 을 보여주고, 숨기는 함수 끝



function initBalloon() {
	$(".scheduleTable").on('mouseenter mouseleave', '.balloonBtn', function(event) {
		if (event.type == 'mouseenter') {
			var content = $(this).parent().parent().children('.balloon');
			content.addClass('show');
		} else  {
			var content = $(this).parent().parent().children('.balloon');
			content.removeClass('show');
		}
	});

	/*btnBalloon.hover(
			function() {
				var content = $(this).parent().children('.balloon');
				content.addClass('show');
			},
			function() {
				var content = $(this).parent().children('.balloon');
				content.removeClass('show');
			}
			);*/
}
