const express = require('express');

// email verification
const nodemailer = require('nodemailer');

const bcrypt = require('bcrypt');

//generates jwt token
const jwt = require('jsonwebtoken');

const fs = require('fs');

const validator = require('validator'); // helps validate user input

//Need for file upload
const path = require('path')
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'profile_pictures')
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({storage: storage});

//For professor pdf upload

const storage_courseInfo = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'course_info_docs');
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const uploadCourseInfo = multer({storage: storage_courseInfo});

//controller functions
const { signupUser, loginUser } = require('../controllers/user-controller');

const UserInfo = require('../models/user-model');

const router = express.Router();

//login route - no method is currently executed here bc () => {}
router.post('/login', loginUser);

//signup route - signupUser is the "method" that is executed
router.post('/signup', signupUser);

// ex: /api/user/getAll
router.get('/getAll', async function (req, res) {

    const allUsers = await UserInfo.find();
    console.log("Responding with all users");
    res.json(allUsers);

});

// ex: /api/user/get/{username}
router.get('/get/:username', async (req, res) => {
    const param = req.params.username;
    const userReturned = await UserInfo.findOne({ username: param });
    console.log(userReturned);
    res.json(userReturned);
});

router.get('/send', function (req, res) {

    return res.status(200).json({ message: 'Please verify your email' });

})

router.get('/verify', async (req, res) => {

    const token = decodeURIComponent(req.query.token);

    decoded = jwt.verify(token, 'secretKey', async function (error, decoded) {
        if (error) {
            console.log(error);
            res.send('Email verification failed or link has expired');
        }
        else {
            const user = await UserInfo.findOne({ username: decoded.user.username });

            if (!user) {
                res.send('User does not exist');
            }


            fs.readFile('profemails.txt', async function (error, data) {
                if (error) { throw error };
                if (data.includes(user.email)) {
                    user.isProf = true;
                    console.log("user is professor");
                }
                user.isVerified = true;
                await user.save();
            })
            res.send('Account verification successful! Please return to the ' + 'login page'.link('http://localhost:3000/Login'));
        }
        console.log(decoded);
    });
});

router.post('/edit', async (req, res) => {
    // const salt = await bcrypt.genSalt(10);

    const {username, email, major, gradYear, role, 
        isVerified, courses, aboutMe, country, gender, planOfStudy, 
        dob, isPrivate, year, instagramLink, twitterLink, linkedinLink, favCourses} = req.body;

    const user = await UserInfo.findOne({ email: email });

    if (!user) {
        res.send('User does not exist');
    }

    user.major = major;
    user.gradYear = gradYear;
    user.aboutMe = aboutMe;
    user.planOfStudy = planOfStudy;
    user.currentYear = year;
    user.courses = courses;
    user.gender = gender;
    user.DOB = dob;
    user.country = country;
    user.isPrivate = isPrivate;
    user.instagramLink = instagramLink;
    user.twitterLink = twitterLink;
    user.linkedinLink = linkedinLink;
    user.favCourses = favCourses;
    /*
    const changePassword = req.body;
    const confirmPassword = req.body;

    if (changePassword !== confirmPassword) {
        res.send('Passwords do not match');
    } else {
        user.password = bcrypt.hash(changePassword, salt);
    }*/

    await user.save();
    res.send('User information updated');
})

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    const user = await UserInfo.findOne({ email: email });

    // If user does not exist
    if (!user) {
        // res.send("Incorrect email or email does not exist");
        res.status(400).json({ error: "Incorrect or nonexistent email!" })
        return;
    }


    const token = jwt.sign({
        user: { username: user.username, email: user.email }
    }, 'secretKey', { expiresIn: '20 minutes' }
    );

    res.status(200).json({ message: 'A reset password link has been sent to your email!' });

    //Send reset password email

    const smtpConfig = {
        service: 'gmail',
        auth: {
            user: 'TestDummy2199@gmail.com',
            pass: 'qjlyzponqvxkuzhp',
        }
    };

    const transporter = nodemailer.createTransport(smtpConfig);

    const mailOptions = {
        from: 'TestDummy2199@gmail.com',
        to: email,
        subject: 'Apollo Password Reset',
        text: `Reset Password Link: http://localhost:3000/ResetPass/${token}`
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
            throw Error(error.message);
        }
        else {
            console.log('Reset password email sent');
        }

    })

});

// reset password api
router.post('/reset-password', async (req, res) => {
    console.log(req);
    const token = decodeURIComponent(req.query.token);

    const salt = await bcrypt.genSalt(10);           //salt adds random string of characters on top of password

    decoded = jwt.verify(token, 'secretKey', async function (error, decoded) {
        if (error) {
            console.log(error);
            // res.send('Link expired or failed');
            res.status(400).json({ error: "Link has failed or expired'" })
            return;
        }
        else {
            const user = await UserInfo.findOne({ username: decoded.user.username });

            if (!user) {
                // res.send('User does not exist');
                res.status(400).json({ error: "User does not exist" })
                return;
            }

            const password = req.body.password;
            const confirmPassword = req.body.confirmPassword;

            if (password !== confirmPassword) {
                console.log('Passwords do not match');
                res.status(400).json({ error: "Passwords do not match" })
                return;
            }
            else {
                try {
                  const hashedPassword = await bcrypt.hash(password, salt);       //hashes salt with password
                  user.password = hashedPassword;
                  await user.save();
                  res.status(200).json({ message: 'Password changed! Please return to the ' + 'login page'.link('http://localhost:3000/Login')});
                  // res.send('Password changed! Please return to the ' + 'login page'.link('http://localhost:3000/Login'`);
                } catch (error) {
                  console.log("There was an issue with the data provided");
                  res.status(400).json({ error: "There was an issue with the data provided" })
                }
            }
        }
    });

})


// Change password api
router.post('/change-password', async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    const salt = await bcrypt.genSalt(10); 
    const user = await UserInfo.findOne({ email: email });

    if (password !== confirmPassword) {
        console.log('Passwords do not match');
        res.status(400).json({ error: "Passwords do not match" })
        return;
    }
    else {
        try {
            const hashedPassword = await bcrypt.hash(password, salt);       //hashes salt with password
            user.password = hashedPassword;
            await user.save();
            res.status(200).json({ message: 'Password changed! Please return to the ' + 'login page'.link('http://localhost:3000/Login')});
            // res.send('Password changed! Please return to the ' + 'login page'.link('http://localhost:3000/Login'`);
        } catch (error) {
            console.log("There was an issue with the data provided");
            res.status(400).json({ error: "There was an issue with the data provided" })
        }
    }
    

});

//MUST RUN COMMAND "npm install multer"
router.post("/upload-image/:username", upload.single("profilepic"), async (req, res) => {
    const prof_pic_name = req.file.filename
    const the_username = req.params.username
    const userReturned = await UserInfo.findOne({username: the_username})
    userReturned.profilePicture = prof_pic_name;
    await userReturned.save()
    res.status(200).json(prof_pic_name);
});

router.get("/get-image/:username", async (req, res) => {
    const param = req.params.username;
    const userReturned = await UserInfo.findOne({ username: param });
    res.status(200).json(userReturned.profilePicture);
});

//Professor upload pdf for course. (Must have isProfessor=true)
router.post("/upload-pdf", uploadCourseInfo.single("courseinfo"), async (req, res) => {
    //IMPLEMENT DETAILS ON HOW TO STORE COURSE INFO STUFF.
    res.send("Pdf uploading");
})

router.post("/add-favCourse", async (req, res) => {
    const {username, favCourses} = req.body;
    console.log({username, favCourses});
    const user = await UserInfo.findOne({ username: username });
    user.favCourses = favCourses;
    await user.save();
    res.status(200).json({ message: 'Success!'});
});

router.get("/get-favCourses/:username", async (req, res) => {
    const param = req.params.username;
    const userReturned = await UserInfo.findOne({ username: param });
    res.status(200).json(userReturned.favCourses);
});

module.exports = router;

