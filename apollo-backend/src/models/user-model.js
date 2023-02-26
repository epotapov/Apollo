const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt');

const validator = require('validator'); // helps validate user input

const nodemailer = require('nodemailer');


// a schema is similar to an object
const userSchema = new Schema({

    username: {
      type: String,
      unique: true
    },

    email: {
        type: String, 
        lowercase: true, 
        unique: true 
    },

    password: {
        type: String,
        required: true
    },

    major: {
        type: String,
        required: false
    },

    gradYear: {
        type: Number,
        required: false
    },

    role: {
        type: String,
        required: false
    },

    friendsList: {
        type: String,
        required: false
    },

    blockList: {
        type: String,
        required: false
    },

    emailToken: {
        type: String
    },
    
    isVerified: {
        type: Boolean,
        default: false
    }


}, { timestamps: true}/*, {typeKey: '$type'}*/);


// static signup method
userSchema.statics.signup = async function(username, email, password, major, gradYear, role) {

   

    //validation

    const purdueEmail = 'purdue.edu'

    isEmailValid = validator.isEmail(email, options = {domain_specific_validation : true, 
        host_whitelist : [purdueEmail]})



    if (!email || !password) {
        throw Error('Email and password are required');
    }


    if (!isEmailValid) {
        throw Error('Must enter a Purdue email account');
    }


    if (!validator.isStrongPassword(password)) {
        throw Error('Password must contain: at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 special character');


    }

    // if (typeof(major) != String) {
    //     throw Error('Please type in a string');
    // }


    const exists = await this.findOne({ email });

    if (exists) {

        throw Error('Email already in use');

    }

    const salt = await bcrypt.genSalt(10);           //salt adds random string of characters on top of password
    const hashedPassword = await bcrypt.hash(password, salt);       //hashes salt with password

    const user = await this.create({username, email, password: hashedPassword, major, gradYear, role });

    // User Verification method

    const token = jwt.sign({
        user
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


    return user;
}

//static login method
userSchema.statics.login = async function(email, password) {

    if (!email || !password) {
        throw Error('Email and password are required');
    }

    const user = await this.findOne({ email });
    const exists = await this.findOne({ email });

    if (!exists) {

        throw Error('Incorrect email');

    }

    const match = await bcrypt.compare(password, user.password)
    
    if (!match) {
        throw Error('Incorrect password')
    }


    console.log('user logged in' + user)
    return user
}

// save userScheme to the UserInfo collection
module.exports = mongoose.model('UserInfo', userSchema);

