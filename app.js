var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var helmet = require('helmet');
var compress = require('compression');

var logger = require('./utils/logger');
var config = require('./config/config');
var cors = require('./config/cors');
var picture_uploader = require('./utils/picture-uploader');

// WEB APP
var app = express();
logger.info("Express app ("+ config.name +") has started");

// configure settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('case sensitive routing', true);
app.set('x-powered-by', false);

// set environment
app.set('env', config.env);
logger.verbose("Running on "+app.get('env')+" environment");

// middlewares
app.use(helmet());
app.use(require('morgan')('combined', {'stream':logger.stream}));
app.use(require('method-override')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compress());
logger.verbose("Middlewares are compiled");

// sessions
app.use(session({
	secret: '3n3b3CASVASr2as',
	// create new redis store.
	// store: new redisStore(),
	saveUninitialized: false,
	resave: false
}));

// cors
cors.set(app, '*');

// upload picture
picture_uploader.set(app, multer);

// database routes
app.use(require('./config/database-router')(express.Router()));
app.use('/', require('./config/interface-router'));

// public files
app.use(express.static(path.join(__dirname, 'public')));
logger.verbose("Express static: 'public' directory");

/***************************************************
                ERROR HANDLING
***************************************************/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handlers
if (app.get('env') === 'development') {
	// development error handler
	// will print stacktrace
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}
else {
	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: {}
		});
	});
}

logger.info("Listening to "+config.host+":"+config.port+"\n============================");
module.exports = app;
