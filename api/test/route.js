const express = require('express');
const router = express.Router();

const test = require('./test');

router.get('/', (req, res, next) => {

    console.log('Sending request to function....');

    const t = test('Test Function');

    console.log(t);
});

module.exports = router;