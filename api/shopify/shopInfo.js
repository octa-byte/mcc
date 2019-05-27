const request = require('request-promise');
const dotenv = require('dotenv').config();
const cookie = require('cookie');

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;

function shopInfo(shop, code){

      // DONE: Exchange temporary code for a permanent access token
      const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
      const accessTokenPayload = {
        client_id: apiKey,
        client_secret: apiSecret,
        code,
      };
  
      request.post(accessTokenRequestUrl, { json: accessTokenPayload })
      .then((accessTokenResponse) => {
        const accessToken = accessTokenResponse.access_token;

        // SAVE: shop and access token in cookie for further use
        res.cookie('shop', shop);
        res.cookie('accessToken', accessToken);

        // DONE: Use access token to make API call to 'shop' endpoint
        const shopRequestUrl = 'https://' + shop + '/admin/api/2019-04/shop.json';
        const shopRequestHeaders = {
          'X-Shopify-Access-Token': accessToken,
        };
  
        request.get(shopRequestUrl, { headers: shopRequestHeaders })
        .then((shopResponse) => {
          res.status(200).end(shopResponse);
        })
        .catch((error) => {
          res.status(error.statusCode).send(error.error.error_description);
        });
      })
      .catch((error) => {
        res.status(error.statusCode).send(error.error.error_description);
      });

}

module.exports = shopInfo;