const UserInfo = require('../models/user-model');


//login user

const loginUser = async (req, res) => {
    res.json({mssg: 'login user'})
}

//signup user

const signupUser = async (req, res) => {

    const {email, password} = req.body;

    try {
        const user = await UserInfo.signup({email, password});

        res.status(200).json(user);

   } catch (err) {
        res.status(400).json({mssg: err.message})
   }


    res.json({mssg: 'signup user'})
}

module.exports = { signupUser, loginUser }