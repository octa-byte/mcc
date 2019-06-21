const request = require('request-promise');
const express = require('express');
const router = express.Router();

const db = require('../backend/db');

router.get('/', (req, res, next) => {
    const shop = req.query.shop;
    db.read(shop, (err, data) =>{
        if(err){
            res.json({ message: "error" });
            return;
        }

        const accessToken = data.accessToken;
        const shopRequestUrl = 'https://' + shop + '/admin/api/2019-04/recurring_application_charges.json';
        const shopRequestHeaders = {
            'X-Shopify-Access-Token': accessToken,
        };
    
        const billBody = {
            "recurring_application_charge": {
                    "name": "App charge",
                    "price": 20.0,
                    "return_url": "http:\/\/mcc-octabyte.appspot.com\/billing\/activate?shop="+encodeURIComponent(shop),
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
            const redirectURL = shopResponse.recurring_application_charge.confirmation_url;
            res.redirect(redirectURL);
            //res.send(shopResponse);
        })
        .catch((error) => {
            res.status(200).json({
                error: error.message
            });
        });
    });
});

router.get('/activate', (req, res, next) => {
    const { charge_id } = req.query;
    const shop = decodeURIComponent(req.query.shop);
    db.read(shop, (err, data) =>{
        if(err){
            res.json({ error: "Unable to read data from database" });
            return;
        }

        const accessToken = data.accessToken;
        const shopRequestUrl = 'https://' + shop + '/admin/api/2019-04/recurring_application_charges/'+charge_id+'/activate.json';
        const shopRequestHeaders = {
        'X-Shopify-Access-Token': accessToken,
        };
    
        const billBody = {
            "recurring_application_charge": {
            "name": "App charge",
            "price": 20.0,
            "return_url": "http:\/\/mcc-octabyte.appspot.com\/billing\/activate",
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
            const status = shopResponse.recurring_application_charge.status;
            if(status == 'active') {
                const updateData = {
                    plan: 'paid'
                }
                db.update(shop, updateData, (err, savedData) => {
                    if(err){
                        res.json({ message:"Error while updating your plan" });
                        return;
                    }
            
                    res.redirect('https://'+shop + '/admin/apps/multi-currency-1');
                });
            }
        })
        .catch((error) => {
            res.status(200).json({
                error: error.message
            });
        });
    });
});

module.exports = router;
