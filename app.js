var express = require('express'),
	partials = require('express-partials'),
	app = express(),
	routes = require('./routes'),
	errorHandlers = require('./middleware/errorhandlers'),
	log = require('./middleware/log'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	csrf = require('csurf'),
	session = require('express-session'),
	RedisStore = require('connect-redis')(session),
	util = require('./middleware/utilities'),
	flash = require('connect-flash'),
	config = require('./config'),
	io = require('./socket.io'),
	passport = require('./passport'),
	multer = require('multer');

app.set('view engine', 'ejs');
app.set('view options', {defaultLayout: 'layout'});


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(partials());
app.use(log.logger);
app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/bower_components'));
app.use(cookieParser(config.secret));
app.use(session({
	secret: config.secret,
	saveUninitialized: true,
	resave: true,
	store: new RedisStore({url: config.redisUrl}),
	cookie: { maxAge: 12 * 60 * 60 * 1000 }
	})
);
app.use(passport.passport.initialize());
app.use(passport.passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(csrf());
app.use(util.csrf);
app.use(util.authenticated);
app.use(flash());
app.use(util.templateRoutes);
//routes
app.get('/', [util.requireAuthentication], routes.index);
app.get(config.routes.checksession, routes.checksession);

app.post(config.routes.secondlogin, routes.secondlogin);

app.get(config.routes.login, routes.login);
app.get(config.routes.logout, routes.logOut);
app.get(config.routes.register, routes.register);
app.post(config.routes.register, routes.registerProcess);
app.get(config.routes.chat, [util.requireAuthentication], routes.chat);
app.get(config.routes.chatwindowadmin, [util.requireAuthentication], routes.chatwindowadmin);
// app.get(config.routes.chatwindowlogin,routes.chatwindowlogin);
app.get(config.routes.msgwindow, routes.msgwindow);
app.get(config.routes.checkconsultantcount, routes.checkconsultantcount);
app.post(config.routes.removechattingroom, [util.requireAuthentication], routes.removechattingroom)

app.get(config.routes.consultinglist, [util.requireAuthentication], routes.consultinglist);
app.get(config.routes.consultingmodify, [util.requireAuthentication], routes.consultingmodify);

// app.post(config.routes.uploadfile, [util.requireAuthentication], multer({dest: './public/uploads/'}).single('upl'), routes.uploadfile);
// app.post(config.routes.inquiry, routes.inquiry);
// app.post(config.routes.errorreport, routes.errorreport);
app.get(config.routes.chatwindow,routes.chatwindow);

//app.get(config.routes.test, routes.test);
// app.post(config.routes.posttest, routes.posttest);

app.get('/error', function(req, res, next){
	next(new Error('A contrived error'));
});
passport.routes(app);
app.use(errorHandlers.error);
app.use(errorHandlers.notFound);

var server = app.listen(config.port);
io.startIo(server);
