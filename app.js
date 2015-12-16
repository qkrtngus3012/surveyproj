var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var mongoose   = require('mongoose');
var passport = require('passport');
var configAuth = require('./config/auth');

var routes = require('./routes/index');
var users = require('./routes/users');
var routeAuth = require('./routes/auth');
var posts = require('./routes/posts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}
app.locals.moment = require('moment');

// mongodb connect
mongoose.connect('mongodb://suhyun:tn462513@ds051334.mongolab.com:51334/suhyun');
mongoose.connection.on('error', console.log);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method', {methods: ['POST', 'GET']}));
app.use(express.static(path.join(__dirname, 'public')));
var MongoStore = require('connect-mongo')(session);
app.sessionStore = new MongoStore({mongooseConnection: mongoose.connection});

app.use(session({
  resave: true,
  key: 'express.sid',
  saveUninitialized: true,
  secret: 'a9757b0a404eb68946acc25e25ff2bc5',
  store: app.sessionStore
}));
/*
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'a9757b0a404eb68946acc25e25ff2bc5'
}));
*/
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(path.join(__dirname, '/bower_components')));


app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  console.log("REQ USER", req.user);
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});

configAuth(passport);

app.use('/', routes);
app.use('/users', users);
app.use('/posts', posts);
routeAuth(app, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
