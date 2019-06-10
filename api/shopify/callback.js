const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const cookie = require('cookie');
const querystring = require('querystring');
const request = require('request-promise');
const dotenv = require('dotenv').config();

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;

const shopInfo = require('./shopInfo');
const db = require('../backend/db');

router.get('/', (req, res, next) => {
    const { shop, hmac, code, state } = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;
  
    if (state !== stateCookie) {
      return res.status(403).send('Request origin cannot be verified');
    }
  
    if (shop && hmac && code) {
      // DONE: Validate request is from Shopify
      const map = Object.assign({}, req.query);
      delete map['signature'];
      delete map['hmac'];
      const message = querystring.stringify(map);
      const providedHmac = Buffer.from(hmac, 'utf-8');
      const generatedHash = Buffer.from(
        crypto
          .createHmac('sha256', apiSecret)
          .update(message)
          .digest('hex'),
          'utf-8'
        );
      let hashEquals = false;
  
      try {
        hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
      } catch (e) {
        hashEquals = false;
      };
  
      if (!hashEquals) {
        return res.status(400).send('HMAC validation failed');
      }
  
      // TODO: get shop info if this is first time
      console.log("============ Getting shop info ===============");
      db.read(shop + "-test5", (err, data) => {
        if(err){
          console.log('Shop info not found');
          shopInfo(shop, code, res);
          console.log('Redirecting to MCC panel...');
          return;
        }
        console.log('Shop info already there');
        console.log('Redirecting to MCC panel...');
        //TODO: Redirect this to MCC panel
        res.send('TODO: Redirect to MCC Panel');
      });
  
    } else {
      res.status(400).send('Required parameters missing');
    }
});

module.exports = router;