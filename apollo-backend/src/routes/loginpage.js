const express = require('express');

const router = express.Router();

//Get a single accounts info
router.get('/:id', (req, res) => {
    res.json({mssg: "Get a single accounts info"})
});

module.exports = router;