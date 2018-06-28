var passport = require('passport'),
	local = require('passport-local').Strategy,
	passwordUtils = require('./password'),
	user = require('./user'),
	config = require('../config'),
	log = require('../middleware/log');

passport.use(new local(function(username, password, done) {
	// console.log('username: ' + username + ', password: ' + password);
	user.findByUsername(username, function(err, profile) {
		if(profile) {
			passwordUtils.passwordCheck(password, profile.password, profile.salt, profile.work, function(err,isAuth) {
				console.log('username: ' + username + ', password: ' + password + ' => passwordCheck: ' + isAuth);
				if (isAuth) {
					if (profile.work > config.crypto.workFactor) {
						user.updatePassword(username, password, 1);
					}
					done(null, profile);
				} else {
					done(null, false, {message: 'Wrong Username or Password'});
				}
			});
		} else {
			done(null, false, {message: 'Wrong Username or Password'});
		}
	});
}));

passport.serializeUser(function(user, done){
	done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

var routes = function routes(app){
	app.post(config.routes.login, passport.authenticate('local',
		{successRedirect: '/chat', failureRedirect: config.routes.login, failureFlash: true}));
};

exports.passport = passport;
exports.routes = routes;
