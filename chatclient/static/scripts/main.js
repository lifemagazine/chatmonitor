var apiServerUrl = "https://api.test.com/";

var checkSession = function checkSession() {
	var requestBody = {
		url: apiServerUrl + 'session',
		method: 'GET',
		data : {
			clientId : 'test'
		}
	};
	console.log('begin to checkSession ...');
	ajax(requestBody,
		function(data) {
			console.log(data);
			if (!data.result || !data.respData.user) location.replace('/');
			else {
				if (data.respData.user.userTp != '99') {
					// noty({text: '권한이 없습니다.', type:"error", layout:"topRight"});
					alert('사용 권한이 없습니다.');
					//logout();
				} else {
					console.log('사용 권한이 있습니다.');
					//document.getElementById('accountName').innerHTML = data.respData.user.lastNm + data.respData.user.firstNm;
					//document.getElementById('accountId').value=data.respData.user.userId;
				}
			}
		}
	);
}

var logout = function logout() {
	var requestBody = {
		url : apiServerUrl + 'logout',
		method: 'GET',
		data : {
			clientId : 'lifemagazine'
		}
	};

	ajax(requestBody,
		function(data) {
			if (!data.result) noty({text: data.resultMsg, type:"error", layout:"topRight"});
			else {
				location.replace('/account/login');
			}
		}
	);
}

// if (window.location.pathname.indexOf('login.html') < 0) checkSession();


$('.btn_sidebar').click(function() {
	if (isSideBarOpen) {
		isSideBarOpen = false;
		$('#content').addClass('expanded');
	} else {
		isSideBarOpen = true;
		$('#content').removeClass('expanded');

	}

});


$('.popup > .box > .box-header .btn-close').click(function(e) {
	e.stopPropagation();
	e.preventDefault();
	$(this).parents('.popup').addClass('disp-none');
})

var isSideBarOpen = true;
