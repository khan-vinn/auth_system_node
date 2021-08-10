var path = require('path');
var cookieParser = require('cookie-parser');
var lessMiddleware = require('less-middleware');
var logger = require('morgan');
var express = require('express');

module.exports = function (app) {
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    
    app.use(lessMiddleware(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'public')));
}