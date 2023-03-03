const UserInfo = require('../models/user-model');
const fs = require('fs'); //filereader


//login user

const loginUser = async (req, res) => {

     const { username, password } = req.body

     try {
          const user = await UserInfo.login(username, password);

          res.status(200).json({ username, user });

     } catch (error) {
          res.status(400).json({ error: error.message })
     }
}

//signup user

const signupUser = async (req, res) => {
    const {username, email, password, major, gradYear, role, isVerified, courses, aboutMe, country, gender, planOfStudy, DOB, isPrivate, currentYear, profilePicture} = req.body;

     try {
        const user = await UserInfo.signup(username, email, password, major, gradYear, role, isVerified, courses, aboutMe, country, gender, planOfStudy, DOB, isPrivate, currentYear, profilePicture);
     

          //    res.status(200).json({email, user});
          res.redirect('http://localhost:5001/api/user/send');

     } catch (error) {
          console.log(error)
          res.status(400).json({ error: error.message })
     }
}

module.exports = { signupUser, loginUser }
