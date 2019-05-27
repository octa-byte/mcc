const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const shopifyAuth = require('./api/shopify/auth');
const shopifyCallback = require('./api/shopify/callback');
const shopSetting = require('./api/backend/shopSetting');
const testRoute = require('./api/test/route');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/test', testRoute);

app.use('/shopify', shopifyAuth);
app.use('/shopify/callback', shopifyCallback);

app.use('/setting', shopSetting);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message
    });
});

module.exports = app;