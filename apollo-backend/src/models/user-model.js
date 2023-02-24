const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');

const validator = require('validator'); // helps validate user input


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
        required: true
    },

    // gradYear: {
    //     type: int,
    //     required: true
    // },

    accountType: {
        type: String,
        required: true
    },

    friendsList: {
        type: String,
        required: true
    },

    blockList: {
        type: String,
        required: true
    }

}, { timestamps: true}/*, {typeKey: '$type'}*/);


// static signup method
userSchema.statics.signup = async function(username, email, password, major, gradYear, accountType) {

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

    if (typeof(major) != String) {
        throw Error('Please type in a string');
    }


    const exists = await this.findOne({ email });

    if (exists) {

        throw Error('Email already in use');

    }

    const salt = await bcrypt.genSalt(10);           //salt adds random string of characters on top of password
    const hashedPassword = await bcrypt.hash(password, salt);       //hashes salt with password

    const user = await this.create({username, email, password: hashedPassword });

    return user;
}

// save userScheme to the UserInfo collection
module.exports = mongoose.model('UserInfo', userSchema);

