const express = require('express');
const router = express.Router();
const cookie = require('cookie');

const test = require('./test');
const db = require('../backend/db');

router.get('/getcookie', (req, res, next) => {
    const shop = cookie.parse(req.headers.cookie).shop;
    res.send(shop);
});

router.get('/setcookie', (req, res, next) => {
    res.cookie('testcookie', "This is a test cookie");
    res.send('TestCoookie set');
});

router.get('/gettestcookie', (req, res, next) => {
    const testcookie = cookie.parse(req.headers.cookie).testcookie;
    res.send(testcookie);
})

router.get('/', (req, res, next) => {

    const data = {
        name: "Azeem",
        age: 27,
        email: "azeemhaider"
    };

    const data2 = {
        name: "Azeem",
        age: 28
    };

    console.log(data);
    console.log(data2);

    const data3 = Object.assign(data, data2);

    
    console.log(data3);



});

router.get('/db', (req, res, next) => {

    db.read("some-value", (err, data) => {
        console.log("================= PRINTING VALUE ===============");
        console.log(err);
    });

});

router.get('/dbsavetest', (req, res, next) => {
    const data = {
        name: "Azeem",
        age: 27,
        email: "azemmhaider"
    };

    db.create("key123", data, (err, savedData) => {
        if(err) {
            console.log("Error:");
            console.log(err);
            res.send('Error');
            return;
        }

        console.log("SAVED:");
        console.log(savedData);
        res.send('Saved');
    });

});

router.get('/dbupdatetest', (req, res, next) => {
    const data = {
        name: "Azeem",
        age: 28
    };

    db.update("key123", data, (err, savedData) => {
        if(err) {
            console.log("Error:");
            console.log(err);
            res.send('Error');
            return;
        }

        console.log("Update:");
        console.log(savedData);
        res.send('Update');
    });

});

router.get('/dbreadtest', (req, res, next) => {
    
    db.read("key123", (err, savedData) => {
        if(err) {
            console.log("Error:");
            console.log(err);
            res.send('Error');
            return;
        }

        console.log(savedData);
        res.send(savedData);
    });

});

router.get('/dbsave', (req, res, next) => {

    const data = {
                shop: 'localhost',
                accessToken: 'accessToken',
                currency: 'PKR',
                money_format: '${amount} PKR',
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
            db.create("localhost", data, (err, savedData) => {
                if(err){
                    console.log('Error: while saving shop info in database');
                    res.json({ message: err });
                    return;
                }

                console.log('Redirecting to MCC panel from SHOP INFO page');
                // TODO: redirect to MCC Panel
		res.json({ message: "saved" });
                //res.redirect('http://' + shop + '/admin/apps/multi-currency-1');
            });

});

router.get('/read', (req, res, next) => {
   db.read('localhost', (err, data) => {
                if(err){
                    console.log('TestRoute Read Error');
                    res.json({ message: err });
                    return;
                }

                console.log('TestRoute Read success');
		res.json(data);
   });
});	

router.get('/update', (req, res, next) => {
 const data = {
                shop: 'localhost',
                accessToken: 'accessToken',
                currency: 'PKR',
                money_format: '${amount} PKR',
                configure: false,
                plan: "free",
                enable: false,
                allCurrencies: true,
                currencies: [],
                geoLocation: false,
                defaultCurrencyPicker: true,
                pickerLocation: "tr",
                pickerType: "edge"
            };
    db.update("localhost", data, (err, savedData) => {
                if(err){
                    console.log('TestRoute update Error');
                    res.json({ message: err });
                    return;
                }

                console.log('TestRoute update success');
		res.json(savedData);
    });
});

router.get('/', (req, res, next) => {

    console.log('Sending request to function....');

    const t = test('Test Function');

    console.log(t);
});


module.exports = router;
