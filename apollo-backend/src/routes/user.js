const express = require('express');

// email verification
const nodemailer = require('nodemailer');

//generates jwt token
const jwt = require('jsonwebtoken');


//controller functions
const { signupUser, loginUser } = require('../controllers/user-controller');

const UserInfo = require('../models/user-model');

const router = express.Router();

//login route - no method is currently executed here bc () => {}
router.get('/login', () => {});

//signup route - signupUser is the "method" that is executed
router.post('/signup', signupUser);


router.get('/send', function(req, res) {

    return res.status(200).json({message: 'Please verify your email' });

})

router.get('/verify', (req, res) => {

    const token = decodeURIComponent(req.query.token);;


    jwt.verify(token, 'secretKey', function(error, decoded) {
        if (error) {
            console.log(error);
            res.send('Email verification failed or link has expired');
        }
        else {
            res.send('Email verified');
            UserInfo.isVerified.update({isVerified: true}, {where: {email: decoded.email}});
        }
    });
});

module.exports = router;

