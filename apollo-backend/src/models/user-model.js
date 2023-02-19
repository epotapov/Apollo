const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bycrypt = require('bycrypt');

const userSchema = new Schema({

    firstName: {
        type: String,
        required: [true, 'First name is required'],
        match: [/^[a-zA-Z]+$/, 'is invalid'],
        trim: true,
        index: true
    },

    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        match: [/^[a-zA-Z]+$/, 'is invalid'],
        trim: true,
        index: true
    },

    email: {
        type: String, 
        lowercase: true, 
        unique: true, 
        required: [true, 'Email is required'], 
        match: [/\S+@\S+\.\S+/, 'is invalid'], 
        trim: true,
        index: true
    },
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, 'Username is required'],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: true
    }
    
}, { timestamps: true});

// static sighup method

userSchema.statics.signup = async function(email, password, ) {

    const exists = await this.findOne({ email });

    if (exists) {

        throw new Error('Email already in use');

    }

    const salt = await bycrpt.genSalt(10);           //salt adds random string of characters on top of password
    const hashedPassword = await bycrpt.hash(password, salt);       //hashes salt with password

    const user = await this.create({email, password: hashedPassword });

    return user;
}

module.exports = mongoose.model('UserInfo', userSchema);

