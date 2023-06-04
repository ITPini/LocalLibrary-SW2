const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');

require('dotenv').config({ path: 'process.env' });

// Routes
const indexRouter = require('./routes/index');
const catalogRouter = require('./routes/catalog');
const usersRouter = require('./routes/users');

// Application routes
const app = express();

app.use(helmet());

// Import mongoose
const mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(compression());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/resources/images', express.static(path.join(__dirname, 'resources/images')));

app.use('/', indexRouter);
app.use('/catalog', catalogRouter);
app.use('/users', usersRouter);

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