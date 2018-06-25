var passUtil = require('./password');

var Users = {
	admin: {
		salt: 'G811JERghovMoUX5+RoasvwT7evsK1QTL33jc5pjG0w=',
		password: 'DAq+sDiEbIR0fHnbzgKQCOJ9siVCL6FmXKAI6mX7UY=',
		work: 5000,
		displayName: 'admin',
		id: 'admin',
		provider: 'local',
		username: 'admin'
	}
};

var findByUsername = function findByUsername(username, cb) {
	cb(null, Users[username]);
};

var addUser = function addUser(username, password, work, cb) {
	if (Users[username] === undefined) {
		passUtil.passwordCreate(password, function(err, salt, password) {
			Users[username] = {
				salt: salt,
				password: password,
				work, work,
				displayname: username,
				id: username,
				provider: 'local',
				username: username
			};

			return cb(null, Users[username]);
		});
	} else {
		return cb({errorCode: 1, message: 'User exists!'}, 'User exists!', null);
	}
};

var updatePassword = function(username, password, work) {
	passUtil.passwordCreate(password, function(err, salt, password) {
		Users[username].salt = salt;
		Users[username].password = password;
		Users[username].work = work;
	});
};

exports.findByUsername = findByUsername;
exports.addUser = addUser;
exports.updatePassword = updatePassword;