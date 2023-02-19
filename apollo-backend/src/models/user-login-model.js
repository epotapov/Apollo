const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');

const userSchema = new Schema({


    email: {
        type: String, 
        lowercase: true, 
        unique: true, 
        required: [true, 'Email is required'], 
        match: [/\S+@\S+\.\S+/, 'is invalid'], 
        trim: true,
        index: true
    },
    
    password: {
        type: String,
        required: true
    }
    
}, { timestamps: true}, {typeKey: '$type'});


// static signup method

userSchema.statics.signup = async function(email, password) {

    const exists = await this.findOne({ email });

    if (exists) {

        throw Error('Email already in use');

    }

    const salt = await bcrypt.genSalt(10);           //salt adds random string of characters on top of password
    const hashedPassword = await bcrypt.hash(password, salt);       //hashes salt with password

    const user = await this.create({email, password: hashedPassword });

    return user;
}

module.exports = mongoose.model('UserInfo', userSchema);

