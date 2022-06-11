var express = require('express');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Routes
var indexRouter = require('./routes/index');
var catalogRouter = require('./routes/catalog');
var usersRouter = require('./routes/users');

// Application routes
var app = express();

// Import mongoose
var mongoose = require('mongoose');

var mongoDB = 'mongodb+srv://pini:fns83ydg@cluster0.o32ao.mongodb.net/local_library?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true }, {useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/catalog', catalogRouter);
app.use('/users', usersRouter);
//app.use('/users/cool', coolRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
  
  // Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});

module.exports = app;