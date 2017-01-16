/*var exchange = require('../queue');

function debug(message){
	exchange.done(function(ex){
		ex.publish('debug.log', message);
	});
};

function error(message){
	exchange.done(function(ex){
		ex.publish('error.log', message);
	});
}

exports.logger = function logger(req, res, next){
	debug({url: req.url, ts: Date.now()});
	next();
};*/

/*var winston = require('winston');

winston.add( winston.transports.DailyRotateFile, {
	level: 'error',
	json: false,
	filename: 'lifemagazineinternallog-',
	datePattern: 'yyyy-MM-dd.log'
});*/

function error(message) {
	// winston.error(message);
	console.log(message);
}

function debug(message) { }

exports.logger = function logger(req, res, next){
	debug({url: req.url, ts: Date.now()});
	next();
}

exports.error = error;
exports.debug = debug;
