$('#password').keypress(function(event) {
	if (event.keyCode == 13) {
		$('#btnLogin').click();
	}
});

$('#btnLogin').click(function() {
	var userId = document.getElementById('username').value;
	var userPswd = document.getElementById('password').value;
	var remember = document.getElementById('remember').checked;

	var requestBody = {
		url : apiServerUrl + 'login',
		method : 'GET',
		data : {
			clientId : 'lifemagazine',
			userId : userId,
			userPswd : userPswd,
			remember : remember
		}
	};

	ajax(requestBody,
		function(data) {
			console.log(data);
			if (!data.result) noty({text: data.resultMsg, type:"error", layout:"topRight"});
			else {
				//notifySession2server(userId, data.respData.userTp);
				notifySession2server(userId, 99);
			}
		}
	);
});


var notifySession2server = function notifySession2server(userid, usertp) {
	var formData = { userid: userid, usertp: usertp};
	console.log(formData);
	$.ajax({
		url: '/secondlogin',
		async: false,
		type: "POST",
		data : JSON.stringify(formData),
		contentType: "application/json; charset=utf-8",
		success: function(data) {
			console.log('login ok');
			location.replace('/');
		},
		error: function(err) {
			console.log(err);
		}
	});
}
