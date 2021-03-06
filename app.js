var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db=require('./model/db');
var session=require('express-session');
var admin=require('./routes/admin');
var news=require('./routes/news');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'secretkey'}));

app.get('/getnews',news.getnews);
app.get('/getspecificnews/:id',news.getspecificnews);
app.get('/news/delete/:id',news.delete);
app.get('/news/edit/:id',news.edit);
app.post('/news/edit',news.doEdit);

app.get('/', admin.login);//first load login page
app.post('/login', admin.doLogin);
app.get('/adminhome', admin.index);
app.get('/news/add',news.add);
app.post('/news/add',news.doAdd);
app.get('/news/view',news.view);
app.get('/news/detailedview/:id',news.detailedview);
// Add admin profile
app.get('/admin/new', admin.create);
// Create new user form
app.post('/admin/new', admin.doCreate);
app.get('/admin/view',admin.view);
app.get('/admin/changepassword/:id',admin.changepassword);
app.post('/admin/changepassword',admin.dochangepassword);
app.get('/admin/delete/:id',admin.delete);

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
