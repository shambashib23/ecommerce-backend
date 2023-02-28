const express = require('express');
var indexRouter = require('../index');
module.exports = function (app) {
    app.use(express.json());

    app.use('/', indexRouter);
}