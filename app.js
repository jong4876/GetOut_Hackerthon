var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
// var MySQLStore = require('express-mysql-session')(session);

var app = express();

var mysql = require('mysql');
var db_config = require('./config/db_config.json');

global.pool = mysql.createPool({
  host : db_config.host,
  port : db_config.port,
  user : db_config.user,
  password : db_config.password,
  database : db_config.database,
  connectionLimit : db_config.connectionLimit
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// session setting
app.use(session({
  secret: 'wqlker129038ksadlku98123hnkjsandjoi13',
  resave: false,
  saveUninitialized: true,
  // store: new MySQLStore({
  //     host: 'hojong.xyz',
  //     port: 3306,
  //     user: 'hackathon_2018_1',
  //     password: 'wjswhdgh',
  //     database: 'hackathon_2018_1_db'
  // }),
  cookie:{
    maxAge: 24000 * 60 * 60 // 쿠키 유효기간 : 24시간
  }
}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/index', require('./routes/index'));
app.use('/track', require('./routes/track'));
app.use('/subject', require('./routes/subject'));
app.use('/subject_search', require('./routes/subject_search'));
app.use('/mypage', require('./routes/mypage'));
// auth
app.use('/login', require('./routes/auth/login'));
app.use('/logout', require('./routes/auth/logout'));
app.use('/register', require('./routes/auth/register'));
// manage
app.use('/manage', require('./routes/manage'));
app.use('/manage/student', require('./routes/manage/student'));


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

app.listen(3000, function(){
  console.log('Connected 3000 port');
});

module.exports = app;
