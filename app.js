const createError = require('http-errors');
const express = require('express');

const appUtils = require('./utils');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const quizeRouter = require('./routes/quize');

const app = express();

appUtils(app);

app.use('/', indexRouter);
app.use('/_api/user', userRouter);
app.use('/_api/quize', quizeRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res) => {
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.json({ status: err.status || 500, message: 'error' });
  // res.render('error');
});

module.exports = app;
