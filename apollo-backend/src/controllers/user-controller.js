const UserInfo = require('../models/user-model');
const fs = require('fs'); //filereader
const generateToken = require('../config/generate-token.js');
const asyncHandler = require('express-async-handler');

//login user

const loginUser = async (req, res) => {

     const { username, password } = req.body

     try {
          const user = await UserInfo.login(username, password);
          const userToken = generateToken(user._id);
          res.status(200).json({ username, user, userToken });

     } catch (error) {
          res.status(400).json({ error: error.message })
     }
}

//signup user

const signupUser = async (req, res) => {
     const { username, email, password, major,
          gradYear, role, isVerified, courses, aboutMe, country,
          gender, planOfStudy, DOB, isPrivate, emailNotif, currentYear,
          profilePicture, instagramLink, twitterLink, linkedinLink, favCourses } = req.body;

     try {
          const user = await UserInfo.signup(username, email, password,
               major, gradYear, role, isVerified, courses, aboutMe,
               country, gender, planOfStudy, DOB, isPrivate, emailNotif, currentYear,
               profilePicture, twitterLink, instagramLink, linkedinLink, favCourses);


          //    res.status(200).json({email, user});
          res.redirect('http://localhost:5001/api/user/send');

     } catch (error) {
          console.log(error)
          res.status(400).json({ error: error.message })
     }
}

// this returns a users friends - used for dms
const allUsers = asyncHandler(async (req, res) => {
     const friends = (await UserInfo.findOne(req.user._id)).friendsList;

     // this matches friends that are relevant from the search query
     const keyword = req.query.search
          ? {
               $and: [
                    { _id: { $in: friends } },
                    {
                         $or: [
                              { username: { $regex: req.query.search, $options: "i" } },
                              { email: { $regex: req.query.search, $options: "i" } },
                         ],
                    },
               ],
          }
          : {};

     // using keyword we grab those friends from the database
     const users = await UserInfo.find(keyword).find({ _id: { $ne: req.user._id } });

     res.send(users);
});


module.exports = { signupUser, loginUser, allUsers }
