const UserInfo = require('../models/user-model');


//login user

const loginUser = async (req, res) => {
    //TODO NEED TO CREATE WEB TOKEN AND STUFF

    const {username, password} = req.body

    try {
        const user = await UserInfo.login(username, password);

        //create a token
        // const token = createToken(user._id)

        res.status(200).json({username, user});

   } catch (error) {
        res.status(400).json({error: error.message})
   }
}

//signup user

const signupUser = async (req, res) => {
    const {username, email, password, major, gradYear, role, isVerified} = req.body;

    try {
        const user = await UserInfo.signup(username, email, password, major, gradYear, role, isVerified);

     //    res.status(200).json({email, user});
        res.redirect('http://localhost:5001/api/user/send');

   } catch (error) {
        res.status(400).json({error: error.message})
   }
}

module.exports = { signupUser, loginUser }
