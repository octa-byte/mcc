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
    
    db.read(shop, (err, data) =>{
        if(err){
            res.json({ message: "error" });
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
        "src": "https:\/\/e92800f3.ngrok.io\/currency.js"
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
