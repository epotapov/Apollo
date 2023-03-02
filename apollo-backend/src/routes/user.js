const express = require('express');

// email verification
const nodemailer = require('nodemailer');

const bcrypt = require('bcrypt');

//generates jwt token
const jwt = require('jsonwebtoken');

const fs = require('fs');

const validator = require('validator'); // helps validate user input

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


            fs.readFile('profemails.txt', async function (error, data) {
                if (error) { throw error };
                if (data.includes(user.email)) {
                    user.isProf = true;
                    console.log("user is professor");
                }
                user.isVerified = true;
                await user.save();
            })
            res.send('Please click the link to return to login page: http://localhost:3000/api/user/login');
        }
        console.log(decoded);
    });
});

router.post('/edit', async (req, res) => {
    const salt = await bcrypt.genSalt(10);

    const user = req.body.user;

    const exists = await UserInfo.findOne({ username: user.username });

    if (!exists) {
        res.send('User does not exist');
    }

    user.major = req.body.major;
    user.friendsList = req.body.friendsList;
    user.blockList = req.body.blockList;;
    user.gradYear = req.body.gradYear;;
    user.profilePicture = req.body.profilePicture;
    user.courses = req.body.courses;
    user.aboutMe = req.body.aboutMe;
    user.gender = req.body.gender;
    user.planOfstudy = req.body.planOfstudy;
    user.DOB = req.body.DOB;
    user.country = req.body.country;
    user.isPrivate = req.body.isPrivate;
    user.currentYear = req.body.currentYear;


    const changePassword = req.body;
    const confirmPassword = req.body;

    if (changePassword !== confirmPassword) {
        res.send('Passwords do not match');
    } else {
        user.password = bcrypt.hash(changePassword, salt);
    }

    await user.save();

})

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    const user = await UserInfo.findOne({ email: email });

    // If user does not exist
    if (!user) {
        // res.send("Incorrect email or email does not exist");
        res.status(400).json({ error: "Incorrect or nonexistent email!" })
        return;
    }


    const token = jwt.sign({
        user: { username: user.username, email: user.email }
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
        text: `Reset Password Link: http://localhost:5001/api/user/reset-password/?token=${token}`
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
            throw Error(error.message);
        }
        else {
            console.log('Reset password email sent');
        }

    })

});

//reset password route

router.get('/reset-password', async (req, res) => {
    const token = decodeURIComponent(req.query.token);
    const salt = await bcrypt.genSalt(10);

    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;


    decoded = jwt.verify(token, 'secretKey', async function (error, decoded) {
        if (error) {
            console.log(error);
            // res.send('Link has failed or expired');
            res.status(400).json({ error: "Link has failed or expired'" })
            return;
        }
        else {
            const user = await UserInfo.findOne({ username: decoded.user.username });

            if (!user) {
                // res.send('User does not exist');
                res.status(400).json({ error: "User does not exist" })
                return;
            }
            if (password !== confirmPassword) {
                console.log('Passwords do not match');
                res.status(400).json({ error: "Passwords do not match" })
                return;
            }
            else {
                try {
                    const hashedPassword = await bcrypt.hash(password, salt);       //hashes salt with password
                    user.password = hashedPassword;
                    await user.save();
                    res.send(`Password changed!`);
                } catch (error) {
                    console.log("There was an issue with the data provided");
                    res.status(400).json({ error: "There was an issue with the data provided" })
                }
            }

        }
    });
})

// router.post('/reset-password', async (req, res) => {
//     const token = decodeURIComponent(req.query.token);

//     const salt = await bcrypt.genSalt(10);           //salt adds random string of characters on top of password

//     decoded = jwt.verify(token, 'secretKey', async function (error, decoded) {
//         if (error) {
//             console.log(error);
//             // res.send('Link expired or failed');
//             res.status(400).json({ error: "Link has failed or expired'" })
//             return;
//         }
//         else {
//             const user = await UserInfo.findOne({ username: decoded.user.username });

//             if (!user) {
//                 // res.send('User does not exist');
//                 res.status(400).json({ error: "User does not exist" })
//                 return;
//             }

//             const password = req.body.password;
//             const confirmPassword = req.body.confirmPassword;

//             if (password !== confirmPassword) {
//                 console.log('Passwords do not match');
//                 res.status(400).json({ error: "Passwords do not match" })
//                 return;
//             }
//             else {
//                 try {
//                   const hashedPassword = await bcrypt.hash(password, salt);       //hashes salt with password
//                   user.password = hashedPassword;
//                   await user.save();
//                   res.send(`Password changed! Please click the link to return to login page: http://localhost:5001/api/user/login`);
//                 } catch (error) {
//                   console.log("There was an issue with the data provided");
//                   res.status(400).json({ error: "There was an issue with the data provided" })
//                 }
//             }
//         }
//     });

// })



module.exports = router;

