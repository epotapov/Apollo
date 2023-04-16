const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt');

const validator = require('validator'); // helps validate user input

const nodemailer = require('nodemailer');

const fs = require('fs'); //file reader
const { resourceLimits } = require('worker_threads');


//Schema for a friend, friends are within the user schema
const friendSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: true,
        default: "default"
    }
})

// a schema is similar to an object
var userSchema = new Schema({

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
        required: false, 
        default: "Undecied"
    },

    gradYear: {
        type: Number,
        required: false,
        default: ""
    },

    isProf: {
        type: Boolean,
        default: false
    },

    profilePicture: {
        type: String,
        required: false,
        default: "default"
    },

    friendsList: {
        type: [friendSchema],
        required: false,
        default: []
    },

    blockList: {
        type: Array,
        required: false,
        default: []
    },

    emailToken: {
        type: String
    },
    
    isVerified: {
        type: Boolean,
        default: false
    }, 
    
    courses: {
        type: Array,
        required: false
    },

    aboutMe: {
        type: String,
        required: false,
        default: ""
    },

    country: {
        type: String,
        required: false,
        default: ""
    },

    gender: {
        type: String,
        required: false,
        default: ""
    },

    planOfStudy: {
        type: Array,
        required: false,
    },

    DOB: {
        type: String,
        required: false,
        default: ""
    },

    isPrivate: {
        type: Boolean,
        required: false,
        default: false
    },

    emailNotif: {
        type: Boolean,
        required: false,
        default: true
    },

    currentYear: {
        type: String,
        required: false,
        default: ""
    },

    instagramLink: {
        type: String,
        required: false,
        default: ""
    },

    twitterLink: {
        type: String,
        required: false,
        default: ""
    },

    linkedinLink: {
        type: String,
        required: false,
        default: ""
    },

    favCourses: {
        type: Array,
        required: false
    },

    recentActivity: {
        type: Array,
        required: false
    },

    recentActivity: {
        type: Array,
        required: false
    },

    // Friend requests that you receive
    friendRequests: {
        type: Array,
        of: String,
        required: false,
        default: []
    },

    // Friend requests that you sent
    friendRequestsSent: {
        type: Array,
        of: String,
        required: false,
        default: []
    },

    blockedList: {
        type: Array,
        of: String,
        default: []
    }
}, { timestamps: true});


// static signup method
userSchema.statics.signup = async function(username, email, password, major, 
    gradYear, role, isVerified, profilePicture, courses, aboutMe, country, gender, 
    planOfStudy, DOB, isPrivate, currentYear, 
    instagramLink, linkedinLink, twitterLink, profilePicture, favCourses, recentActivity) {

   
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

    const usernameExists = await this.findOne({ username });

    if (usernameExists) {

        throw Error('Username already in use');

    }

    const salt = await bcrypt.genSalt(10);           //salt adds random string of characters on top of password
    const hashedPassword = await bcrypt.hash(password, salt);       //hashes salt with password


    const user = await this.create({username, email, password: hashedPassword, major, gradYear, profilePicture, role, courses, aboutMe, country, gender, planOfStudy, DOB, isPrivate});

    // User Verification method

    const token = jwt.sign({
        user: {username: user.username, email: user.email}
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
            console.log('Verification email sent');
        }

    })

    return user;
}

//static login method
userSchema.statics.login = async function(username, password) {

    if (!username || !password) {
        throw Error('Username and password are required');
    }

    const user = await this.findOne({ username });
    const exists = await this.findOne({ username });

    if (!exists) {

        throw Error('Username does not exist');

    }

    if (!user.isVerified) {
        throw Error('This account has not been verified');
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

