const express = require('express');

// email verification
const nodemailer = require('nodemailer');

const bcrypt = require('bcrypt');

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

// ex: /api/user/getAll
router.get('/getAll', async function (req, res) {

  const allUsers = await UserInfo.find();
  console.log("Responding with all users");
  res.json(allUsers);

});

// ex: /api/user/get/{username}
router.get('/get/:username', async (req, res) => {
  const param = req.params.username;
  const userReturned = await UserInfo.findOne({ username: param });
  console.log(userReturned);
  res.json(userReturned);
 });

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
            res.send('Please click the link to return to login page: http://localhost:3000/api/user/login');
        }
        console.log(decoded);
    });
});

router.post('/edit', async (req, res) => {
    const token = decodeURIComponent(req.query.token);
    const salt = await bcrypt.genSalt(10);

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
            user.profilePicture = req.body.profilePicture;
            
            const changePassword = req.body.changePassword;
            const confirmPassword = req.body.confirmPassword;

            if (changePassword !== confirmPassword) {
                res.send('Passwords do not match');
            } else { 
                user.password = bcrypt.hash(changePassword, salt);
            }

            await user.save();
        }
    });

})

router.post('/forgot-password', async (req, res) => {
    const {email} = req.body;

    const user = await UserInfo.findOne({ email: email });

    // If user does not exist
    if (!user) {
        res.send('Incorrect email or email does not exist');
        return;
    }

    const secret = 'secretKey' + user.password;

    const token = jwt.sign({
        user: {username: user.username, email: user.email}
    }, 'secretKey', { expiresIn: '20 minutes' }
    );

    res.send('Please check your email to reset your password');


    //Send reset password email

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
        subject: 'Apollo Password Reset',
        text:`Reset Password Link: http://localhost:5001/api/user/reset-password/?token=${token}`
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Reset password email sent');
        }

    })
   
});

//reset password route

router.get('/reset-password', async (req, res) => {
    const token = decodeURIComponent(req.query.token);

    decoded = jwt.verify(token, 'secretKey', async function (error, decoded) {
        if (error) {
            console.log(error);
            res.send('Link has failed or expired');
        }
        else {
            const user = await UserInfo.findOne({ username: decoded.user.username });

            if (!user) {
                res.send('User does not exist');
            }
        }
    });
})

router.post('/reset-password', async (req, res) => {
    const token = decodeURIComponent(req.query.token);

    const salt = await bcrypt.genSalt(10);           //salt adds random string of characters on top of password

    decoded = jwt.verify(token, 'secretKey', async function (error, decoded) {
        if (error) {
            console.log(error);
            res.send('Link expired or failed');
        }
        else {
            const user = await UserInfo.findOne({ username: decoded.user.username });

            if (!user) {
                res.send('User does not exist');
            }

            const password = req.body.password;
            const confirmPassword = req.body.confirmPassword;

            if (password !== confirmPassword) {
                console.log('Passwords do not match');
            } 
            else {

                const hashedPassword = await bcrypt.hash(password, salt);       //hashes salt with password

                user.password = hashedPassword;

                await user.save();
                res.send(`Password changed! Please click the link to return to login page: http://localhost:5001/api/user/login`);

            }
        }
        console.log(decoded);
    });
    
})



module.exports = router;

