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
router.post('/login', loginUser);

//signup route - signupUser is the "method" that is executed
router.post('/signup', signupUser);


router.get('/send', function (req, res) {

    return res.status(200).json({ message: 'Please verify your email' });

})

router.get('/verify', async (req, res) => {

    const token = decodeURIComponent(req.query.token);

    decoded = jwt.verify(token, 'secretKey', async function (error, decoded) {
        if (error) {
            console.log(error);
            res.send('Email verification failed or link has expired');
        }
        else {
            const user = await UserInfo.findOne({ username: decoded.user.username });

            if (!user) {
                res.send('User does not exist');
            }

            user.isVerified = true;
            await user.save();
            res.redirect('http://localhost:5001/api/user/login');
        }
        console.log(decoded);
    });
});

router.post('/edit', async (req, res) => {
    const token = decodeURIComponent(req.query.token);
    
    decoded = jwt.verify(token, 'secretKey', async function (error, decoded) {
        if (error) {
            console.log(error);
            res.send('Account does not exist');
        }
        else {
            const user = await UserInfo.findOne({ username: decoded.user.username });

            if (!user) {
                res.send('User does not exist');
            }

            user.major = req.body.major;
            user.role = req.body.role;
            user.friendsList = req.body.friendsList;
            user.blockList = req.body.blockList;
            user.gradYear = req.body.gradYear;
            user.password = req.body.password;

            await user.save();
            res.redirect('http://localhost:5001/api/user/login');
        }
        console.log(decoded);
    });
    
})

module.exports = router;

