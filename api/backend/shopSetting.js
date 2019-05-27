const express = require('express');
const router = express.Router();

const db = require('./db');

router.post('/save', (req, res) => {
    const data = req.body;

    db.create(data, (err, savedData) => {
        if(err){
            res.json({ message:"Error while creating setting" });
            return;
        }

        res.json({
            id: savedData.id,
            key: savedData.key
        });
    });
});

router.get('/read', (req, res) => {
    const id = req.body.id;
    
    db.read(id, (err, savedData) =>{
        if(err){
            res.json({ message: "error" });
            return;
        }

        res.json(savedData);
    });
});


module.exports = router;