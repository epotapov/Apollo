const express = require('express');

// email verification
const nodemailer = require('nodemailer');

// generates random string
const {v4 :uuid} = require('uuid');

//controller functions
const { signupUser, loginUser } = require('../controllers/user-controller');

const router = express.Router();

//login route - no method is currently executed here bc () => {}
router.get('/login', () => {});

//signup route - signupUser is the "method" that is executed
router.post('/signup', signupUser);

module.exports = router;


// nodemailer function
const smtpConfig = {
    service: 'gmail',
    auth: {
        user: 'TestDummy2199@gmail.com',
        pass: 'qjlyzponqvxkuzhp',
    }
};

const transporter = nodemailer.createTransport(smtpConfig);

// email verification tests
// transporter.verify((error, success) => {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Server is ready to take our messages');
//         console.log(success);
//     }
// });

// const sendVerificationEmail = ({id, email}, res) => {
//     const localhost = 'http://localhost:5001';
//     const uniqueId = uuid.v4() + id

//     const mailOptions = { 
//         from: 'TestDummy2199@gmail.com',
//         to: 'brandon.jiang@gmail.com',
//         subject: 'Verify your email',
//         text:'Hello', 
//     }

//     transporter.sendMail(mailOptions, (error) => {
//         if (error) {
//             console.log(error);
//         }
//         else {
//             console.log('email sent');
//         }

//     })
// }

const mailOptions = { 
    from: 'TestDummy2199@gmail.com',
    to: 'brandon.jiang@gmail.com',
    subject: 'Verify your email',
    text:'Hello', 
}

transporter.sendMail(mailOptions, (error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log('email sent');
    }

})
