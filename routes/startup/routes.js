const express = require('express');
var indexRouter = require('../index');
var userRouter = require('../user');
var productRouter = require('../product');
var categoryRouter = require('../category');
module.exports = function (app) {
    app.use(express.json());

    app.use('/', indexRouter);
    app.use('/user', userRouter);
    app.use('/products', productRouter);
    app.use('/categories', categoryRouter);
}