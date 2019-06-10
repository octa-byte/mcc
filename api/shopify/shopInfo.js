const request = require('request-promise');
const dotenv = require('dotenv').config();
const cookie = require('cookie');

const db = require('../backend/db');

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;

function shopInfo(shop, code, res){

      // DONE: Exchange temporary code for a permanent access token
      const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
      const accessTokenPayload = {
        client_id: apiKey,
        client_secret: apiSecret,
        code,
      };
  
      console.log('Sending request to get shop accessToken');
      request.post(accessTokenRequestUrl, { json: accessTokenPayload })
      .then((accessTokenResponse) => {
        const accessToken = accessTokenResponse.access_token;

        // SAVE: shop and access token in cookie for further use
        //res.cookie('shop', shop);
        //res.cookie('accessToken', accessToken);

        // DONE: Use access token to make API call to 'shop' endpoint
        const shopRequestUrl = 'https://' + shop + '/admin/api/2019-04/shop.json';
        const shopRequestHeaders = {
          'X-Shopify-Access-Token': accessToken,
        };
        
        console.log('Access token received: ' + accessToken);
        console.log('Sending request for shop info');
        request.get(shopRequestUrl, { headers: shopRequestHeaders })
        .then((shopResponse) => {
            console.log('Shop info received');
            const s = JSON.parse(shopResponse);
            
            const data = {
                shop: shop,
                accessToken: accessToken,
                currency: s.currency,
                money_format: s.money_format,
                configure: false,
                plan: "free",
                enable: true,
                allCurrencies: true,
                currencies: [],
                geoLocation: false,
                defaultCurrencyPicker: true,
                pickerLocation: "tr",
                pickerType: "edge"
            };
            console.log('saving shop info into database');
            // SAVE: shop setting in database
            db.create(shop + "-test5", data, (err, savedData) => {
                if(err){
                    console.log('Error: while saving shop info in database');
                    //res.json({ message: err });
                    return;
                }

                console.log('Redirecting to MCC panel from SHOP INFO page');
                // TODO: redirect to MCC Panel
                res.redirect('http://' + shop + '/admin/apps/multi-currency-1');
            });

          //res.status(200).end(shopResponse);
        })
        .catch((error) => {
            console.log(error);
            res.status(error.statusCode).send(error.error.error_description);
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(error.statusCode).send(error.error.error_description);
      });

}

module.exports = shopInfo;