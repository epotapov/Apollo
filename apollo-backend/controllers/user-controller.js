const UserInfo = require('../models/user-model');


//login user

const loginUser = async (req, res) => {
    res.json({mssg: 'login user'})
}

//signup user

const signupUser = async (req, res) => {
    res.json({mssg: 'signup user'})
}

module.exports = { signupUser, loginUser }