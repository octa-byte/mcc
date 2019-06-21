const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const shopifyAuth = require('./api/shopify/auth');
const shopifyCallback = require('./api/shopify/callback');
const shopifyBilling = require('./api/shopify/billing');
const shopSetting = require('./api/backend/shopSetting');

const testRoute = require('./api/test/testRoute');
const testShop = require('./api/test/shop');

app.use('/static', express.static('./api/panel/react/build'));

app.use('/script', express.static('./api/script'));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin",  '*');
    res.header("Access-Control-Allow-Headers",  'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();	
});

app.use('/test', testRoute);
app.use('/tshop', testShop);

app.use('/shopify', shopifyAuth);
app.use('/shopify/callback', shopifyCallback);
app.use('/billing', shopifyBilling);

app.use('/setting', shopSetting);

app.use((req, res, next) => {
    const error = new Error('Page Not found 404');
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
