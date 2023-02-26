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

    const email = req.body;

    const token = jwt.sign({
        data: 'token'
    }, 'secretKey', { expiresIn: '20 minutes' }

    );

    const smtpConfig = {
        service: 'gmail',
        auth: {
            user: 'TestDummy2199@gmail.com',
            pass: 'qjlyzponqvxkuzhp',
        }
    };

    const transporter = nodemailer.createTransport(smtpConfig);

    const mailOptions = { 
        from: 'TestDummy2199@gmail.com',
        to: email,
        subject: 'Verify your email',
        text:`Verify: http://localhost:5001/api/user/verify?token=${encodeURIComponent(token)}`
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log('email sent');
        }

    })

    // return res.status(200).json({message: 'Please verify your email' });
    return console.log(email);

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
            UserInfo.isVerified = true;
        }
    });
});

module.exports = router;

