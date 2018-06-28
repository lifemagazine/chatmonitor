var passUtil = require('./password');
var Datastore = require('nedb');
var db = new Datastore();
var db = new Datastore({ filename: './nedb.db', autoload: true });

/*var Users = {
	admin: {
		salt: 'G81lJERghovMoUX5+RoasvwT7evsK1QTL33jc5pjG0w=',
		password: 'DAq+sDiEbIR0fHnbzgKQCOJ9siV5CL6FmXKAI6mX7UY=',
		work: 5000,
		displayName: 'admin',
		id: 'admin',
		provider: 'local',
		username: 'admin',
		role: 'consultant'
	}
};*/

var findByUsername = function findByUsername(username, cb) {
	// cb(null, Users[username]);
	db.find({ id: username }, function(err, users) {
		cb(null, users[0]);
	})
};

var addUser = function addUser(username, password, work, cb) {
	db.find({ id: username }, function(err, users) {
		if (users.length == 0) {
			passUtil.passwordCreate(password, function(err, salt, password) {
				var user = {
					salt: salt,
					password: password,
					work, work,
					displayname: username,
					id: username,
					provider: 'local',
					username: username,
					role: 'consultant'
				};
				db.insert(user, function(err, newUser) {
					return cb(null, newUser);
				})
			});
		} else {
			return cb({errorCode: 1, message: 'User exists!'}, 'User exists!', null);
		}
	});
	/*if (Users[username] === undefined) {
		passUtil.passwordCreate(password, function(err, salt, password) {
			Users[username] = {
				salt: salt,
				password: password,
				work, work,
				displayname: username,
				id: username,
				provider: 'local',
				username: username,
				role: 'consultant'
			};
			return cb(null, Users[username]);
		});
	} else {
		return cb({errorCode: 1, message: 'User exists!'}, 'User exists!', null);
	}*/
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