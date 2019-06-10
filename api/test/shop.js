const request = require('request-promise');
const express = require('express');
const router = express.Router();

const test = require('./test');
const db = require('../backend/db');

// 8c8f5950d44cceae26d5ab9484a396a6
const accessToken = "45f72baddcad43e665f0ea29d30fefed";
const shop = "octabyte-shop-test.myshopify.com";

router.get('/detail', (req, res, next) => {

    db.read('octabyte-shop-test.myshopify.com', (err, data) => {
       if(err){
           res.send('error');
           return;
       }     
       console.log(data);
       res.send(data);
    });

});


router.get('/bill', (req, res, next) => {

    const shopRequestUrl = 'https://' + shop + '/admin/api/2019-04/recurring_application_charges.json';
    const shopRequestHeaders = {
      'X-Shopify-Access-Token': accessToken,
    };
  
    const billBody = {
        "recurring_application_charge": {
          "name": "Recurring charge",
          "price": 20.0,
          "return_url": "https:\/\/d0c3ae61.ngrok.io\/tshop\/back",
          "test": true
          }
        };
  
    const options = {
      url: shopRequestUrl,
      body: billBody,
      headers: shopRequestHeaders,
      json: true
    };
  
    request.post(options)
    .then((shopResponse) => {
        console.log(shopResponse.recurring_application_charge.decorated_return_url);
        
        const redirectURL = shopResponse.recurring_application_charge.decorated_return_url;

        res.redirect(redirectURL);
        //res.send(shopResponse);
    })
    .catch((error) => {
      res.status(200).send(error);
    });

});

//router.get();

router.get('/back', (req, res, next) => {
    console.log("============ BACK ============");
    console.log(">>> Body");
    console.log(req.body);
    console.log(">>> Param");
    console.log(req.params);
    console.log(">>> query");
    console.log(req.query);
    console.log("===== END =====");

    const { charge_id } = req.query;

    const shopRequestUrl = 'https://' + shop + '/admin/api/2019-04/recurring_application_charges/'+charge_id+'/activate.json';
    const shopRequestHeaders = {
      'X-Shopify-Access-Token': accessToken,
    };
  
    const billBody = {
        "recurring_application_charge": {
          "name": "Recurring charge",
          "price": 20.0,
          "return_url": "https:\/\/d0c3ae61.ngrok.io\/tshop\/back",
          "test": true
          }
        };
  
    const options = {
      url: shopRequestUrl,
      headers: shopRequestHeaders,
      json: true
    };
  
    request.post(options)
    .then((shopResponse) => {
        res.send(shopResponse);
    })
    .catch((error) => {
      res.status(200).send(error);
    });
})

module.exports = router;