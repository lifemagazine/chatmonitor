var crypto = require('crypto'),
        scmp = require('scmp'),
        user = require('./passport/user'),
        passwordUtils = require('./passport/password'),
        config = require('./config');

var Users = {
        batman: {
                salt: 'G81lJERghovMoUX5+RoasvwT7evsK1QTL33jc5pjG0w=',
                password: 'DAq+sDiEbIR0fHnbzgKQCOJ9siV5CL6FmXKAI6mX7UY=',
                work: 5000,
                displayName: 'Batman',
                id: 'batman',
                provider: 'local',
                username: 'batman',
                role: 'guest'
        },
        superman: {
                salt: 'Mh5EdMSe0WT8FedHqaCg+RIC12yUpsn/T0sAq/ttaQI=',
                password: 'CkAMxwp9KwaAMi+RgX1QtcAi0VQ9q7tH+d0/BdRYSpY=',
                work: 5000,
                displayName: 'Superman',
                id: 'superman',
                provider: 'local',
                username: 'superman',
                role: 'guest'
        }
};


var username = "superman";
var password = "password";
var profile = Users[username];


                if(profile) {
                        passwordUtils.passwordCheck(password, profile.password, profile.salt, profile.work, function(err,isAuth) {
                                if (isAuth) {
                                        if (profile.work < config.crypto.workFactor) {
                                                user.updatePassword(username, password, config.crypto.workFactor);
                                        }
                                         console.log("Good Job");
                                        // done(null, profile);
                                } else {
                                        console.log({message: 'Wrong Username or Password', username: profile.username});
                                        // done(null, false, {message: 'Wrong Username or Password'});
                                        return;
                                }
                        });
                } else {
                        // done(null, false, {message: 'Wrong Username or Password'});
                        console.log('profile is null');
                        return;
                }

password = "1234567890ab";
var updatePassword = function(username, password, work) {
        passwordUtils.passwordCreate(password, function(err, salt, password){
                Users[username].salt = salt;
                Users[username].password = password;
                Users[username].work = work;
                console.log(salt);
                console.log(password);
        });
};

updatePassword(username, password, 50);
