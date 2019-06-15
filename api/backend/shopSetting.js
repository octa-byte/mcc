const express = require('express');
const router = express.Router();
const db = require('./db');

router.post('/save', (req, res) => {
    const shop = req.body.shop;
    const data = req.body.data;

    db.create(shop, data, (err, savedData) => {
        if(err){
            res.json({ message:"Error while creating setting" });
            return;
        }

        res.json({
            message: "saved"
        });
    });
});

router.post('/read', (req, res) => {
    const shop = req.body.shop;
    //const shop = cookie.parse(req.headers.cookie).shop;
    //const shop = 'octabyte-shop-test.myshopify.com';
    
    db.read(shop, (err, data) =>{
        if(err){
            res.json({ 
              error: err,
              pdata: shop 
            });
            return;
        }

        res.json(data);
    });
});

router.post('/update', (req, res) => {
    const shop = req.body.shop;
    const data = req.body.data;

    db.update(shop, data, (err, savedData) => {
        if(err){
            res.json({ message:"Error while creating setting" });
            return;
        }

        res.json({
            message: "saved"
        });
    });
});

router.post('/enablescript', (req, res) => {
    const shop = req.body.shop;
    const accessToken = req.body.accessToken;
    
    const shopRequestUrl = 'https://' + shop + '/admin/api/2019-04/script_tags.json';
    const shopRequestHeaders = {
      'X-Shopify-Access-Token': accessToken,
    };
  
    const scriptTagBody = {
      "script_tag": {
        "event": "onload",
        "src": "https:\/\/mcc-octabyte.appspot.com\/api\/script\/currency.js"
      }
    };
  
    const options = {
      url: shopRequestUrl,
      body: scriptTagBody,
      headers: shopRequestHeaders,
      json: true
    };
  
    request.post(options)
    .then((shopResponse) => {
      res.status(200).end(shopResponse);
    })
    .catch((error) => {
      res.status(200).send(error);
    });
});


module.exports = router;
