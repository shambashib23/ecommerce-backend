const express = require('express');
var indexRouter = require('../index');
var userRouter = require('../user');
module.exports = function (app) {
    app.use(express.json());

    app.use('/', indexRouter);
    app.use('/user', userRouter);
}