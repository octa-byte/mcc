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
  
    //res.cookie('shop', shop);

    if (state !== stateCookie) {
      return res.status(200).send('Request origin cannot be verified');
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
        return res.status(200).send('HMAC validation failed');
      }
  
      db.read(shop, (err, data) => {
        if(err){
          shopInfo(shop, code, res, false);
          return;
        }
        shopInfo(shop, code, res, true);
        
        res.redirect('/panel?'+shop);
      });
  
    } else {
      res.status(200).send('Required parameters missing');
    }
});

module.exports = router;