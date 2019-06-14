const express = require('express');
const router = express.Router();
const nonce = require('nonce')();
const dotenv = require('dotenv').config();

const apiKey = process.env.SHOPIFY_API_KEY;
const scopes = 'read_products,write_script_tags';
const forwardingAddress = "https://mcc-octabyte.appspot.com"; 

router.get('/', (req, res, next) => {
    const shop = req.query.shop;
    if (shop) {
      const state = nonce();
      const redirectUri = forwardingAddress + '/shopify/callback';
      const installUrl = 'https://' + shop +
        '/admin/oauth/authorize?client_id=' + apiKey +
        '&scope=' + scopes +
        '&state=' + state +
        '&redirect_uri=' + redirectUri;
  
      res.cookie('state', state);
      res.redirect(installUrl);
    } else {
      return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
    }
});

module.exports = router;
