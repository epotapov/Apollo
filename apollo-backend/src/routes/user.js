const express = require('express');

const router = express.Router();

//Get a single accounts info
router.get('/', (req, res) => {
    res.json({mssg: 'Get a single accounts info'});
});

//Add a new account
router.post('/', (req, res) => {
    res.json({mssg: "Add a new account"});
});

module.exports = router;