const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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

models.exports = mongoose.model('UserInfo', userSchema);

