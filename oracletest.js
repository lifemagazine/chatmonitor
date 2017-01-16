
var async = require('async');
var oracledb = require('oracledb');
var config = require('./config');

var username = "batman";
// function findByUsername(username, cb) {
    // cb(null, Users[username]);
        oracledb.getConnection(config.connAttrs, function(err, connection) {
                if (err) {
                        console.log('Error connecting to DB');
                        return;
                }

                connection.execute("SELECT ID, PASSWORD, DISPLAYNAME, USERNAME, ROLE, PROVIDER, WORK, SALT FROM TX_INNERUSER WHERE ID = :ID",
                        [ username ], {
                        outFormat: oracledb.OBJECT
                }, function(err, result) {
                        if (err) {
                                console.log(err);
                                // cb(null, null);
                        } else {
                                // res.contentType('application/json').status(200);
                                // res.send(JSON.stringify(result.rows));
                                if (result.rows.length == 0) {
                                        // cb(null, null);
                                        console.log('invalud user: ' + username);
                                } else {
                                        var user = {
                                                        salt: result.rows[0].SALT,
                                                        password: result.rows[0].PASSWORD,
                                                        work: result.rows[0].WORK,
                                                        displayName: result.rows[0].DISPLAYNAME,
                                                        id: result.rows[0].ID,
                                                        provider: result.rows[0].PROVIDER,
                                                        username: result.rows[0].USERNAME,
                                                        role: result.rows[0].ROLE
                                        };
                                        console.log(user);
                                        // cb(null, Users[username]);
                                }
                                // cb(null, Users[username]);
                        }

                        connection.release(
                                function (err) {
                                        if (err) {
                                                console.error(err.message);
                                        } else {
                                                console.log("Connection released");
                                        }
                                });
                });
        });
// };
