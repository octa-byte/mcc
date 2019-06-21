const request = require('request-promise');
const dotenv = require('dotenv').config();
const cookie = require('cookie');

const db = require('../backend/db');

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;

function shopInfo(shop, code, res, update){

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

        if(update){
          const updateData = {
            accessToken: accessToken
          };
          db.update(shop, updateData, (err, savedData) => {
            if(err){
                //res.json({ message:"Error while updating access token" });
                console.log("Error while updating access token");
                return;
            }
            console.log("AccessToken updated");
            //res.redirect('http://' + shop + '/admin/apps/multi-currency-1');
          });

          return;
        }

        // SAVE: shop and access token in cookie for further use
        //res.cookie('shop', shop);
        //res.cookie('accessToken', accessToken);

        const shopRequestUrlS = 'https://' + shop + '/admin/api/2019-04/script_tags.json';
        const shopRequestHeadersS = {
          'X-Shopify-Access-Token': accessToken,
        };

        const scriptTagBodyS = {
          "script_tag": {
            "event": "onload",
            "src": "https:\/\/mcc-octabyte.appspot.com\/script\/obc-script.js"
          }
        };

        const optionsS = {
          url: shopRequestUrlS,
          body: scriptTagBodyS,
          headers: shopRequestHeadersS,
          json: true
        };

        request.post(optionsS)
        .then((shopResponse) => {
          console.log('script added');
        })
        .catch((error) => {
          console.log('ERROR: script is not added');
          console.log(error);
        });

        // DONE: Use access token to make API call to 'shop' endpoint
        const shopRequestUrl = 'https://' + shop + '/admin/api/2019-04/shop.json';
        const shopRequestHeaders = {
          'X-Shopify-Access-Token': accessToken,
        };

        request.get(shopRequestUrl, { headers: shopRequestHeaders })
        .then((shopResponse) => {
            console.log('Shop info received');
            const s = JSON.parse(shopResponse);
            
            const data = {
                shop: shop,
                accessToken: accessToken,
                currency: s.shop.currency,
                money_format: s.shop.money_format,
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
            // SAVE: shop setting in database
            db.create(shop, data, (err, savedData) => {
                if(err){
                    console.log('Error: while saving shop info in database');
                    //res.json({ message: err });
                    return;
                }

                // TODO: redirect to MCC Panel
                res.redirect('https://' + shop + '/admin/apps/multi-currency-1');
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