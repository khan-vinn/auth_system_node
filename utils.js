var cookieParser = require('cookie-parser');
var logger = require('morgan');
var express = require('express');
// var path = require('path');
// var lessMiddleware = require('less-middleware');

module.exports = function (app) {
    
    app.use(logger('dev'));
    app.use(express.json());
    app.use(cookieParser());
    // app.use(express.urlencoded({ extended: false }));

    // app.set('views', path.join(__dirname, 'views'));
    // app.set('view engine', 'pug');
    
    // app.use(lessMiddleware(path.join(__dirname, 'public')));
    // app.use(express.static(path.join(__dirname, 'public')));
}