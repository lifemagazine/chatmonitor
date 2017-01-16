var passport = require('passport'),
	local = require('passport-local').Strategy,
	config = require('../config'),
	log = require('../middleware/log');

passport.use(new local(function(username, password, done) {
	// console.log('username: ' + username + ', password: ' + password);
	user.findByUsername(username, function(err, profile) {
		if(profile) {
			passwordUtils.passwordCheck(password, profile.password, profile.salt, profile.work, function(err,isAuth) {
				if (isAuth) {
					if (profile.work < config.crypto.workFactor) {
						user.updatePassword(username, password, config.crypto.workFactor);
					}
					done(null, profile);
				} else {
					log.debug({message: 'Wrong Username or Password', username: username});
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
		{successRedirect: '/', failureRedirect: config.routes.login, failureFlash: true}));
};

exports.passport = passport;
exports.routes = routes;
