var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var passport = require('passport');
require('./auth/passport');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.options('*', cors());
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Passport session setup.
passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use(session({ secret: 'keyboard cat', key: 'sid'}));  //Save user login
app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/users', passport.authenticate('jwt', { session : false }), usersRouter );

// app.use(cors({ origin: 'http://localhost:3001' , credentials :  false}));
// app.options('*', cors( { origin: '*' , credentials : true } ));
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // allow requests from any other server
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'); // allow these verbs
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
  next();
}

app.use(allowCrossDomain); // plumbing it in as middleware

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
