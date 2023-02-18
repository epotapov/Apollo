const express = require('express');

const router = express.Router();

//controler functions
const {loginUser, signupUser} = require('../controllers/user-controller');


//Get a single accounts info
router.get('/', (req, res) => {
    res.json({mssg: 'Get a single accounts info'});
});

//Add a new account
router.post('/', (req, res) => {
    res.json({mssg: "Add a new account"});
});

// login route
router.post('/login', loginUser);

// signup route
router.post('/signup', signupUser);  


module.exports = router;