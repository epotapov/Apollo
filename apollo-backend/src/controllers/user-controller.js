const UserInfo = require('../models/user-model');


//login user

const loginUser = async (req, res) => {
    res.json({mssg: 'login user'})
}

//signup user

const signupUser = async (req, res) => {
    const {username, email, password} = req.body;

    try {
        const user = await UserInfo.signup(username, email, password);

        res.status(200).json({email, user});

   } catch (error) {
        res.status(400).json({error: error.message})
   }
}

module.exports = { signupUser, loginUser }
