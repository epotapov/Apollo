const express = require('express');

// email verification
const nodemailer = require('nodemailer');

const bcrypt = require('bcrypt');

//generates jwt token
const jwt = require('jsonwebtoken');

const fs = require('fs');

const validator = require('validator'); // helps validate user input

const CourseInfo = require('../models/course-model');


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

// get is professor accoutn
router.get('/getIsProf/:username', async (req, res) => {
    const param = req.params.username;
    const userReturned = await UserInfo.findOne({ username: param });
    console.log(userReturned);
    res.send(userReturned.isProf);
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
        dob, isPrivate, emailNotif, year, instagramLink, twitterLink, linkedinLink, favCourses} = req.body;

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
    user.emailNotif = emailNotif;
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

router.get("/get-pdf/:Course", async (req, res) => {
    const param = req.params.Course;
    const courseReturned = await CourseInfo.findOne({ Course: param });
    if (!courseReturned) {
        res.status(400).json({ error: "Course does not exist" })
        return;
    }
    res.status(200).json(courseReturned.Information_Document);
});

router.get("/get-pdf-resource/:Course", async (req, res) => {
    const param = req.params.Course;
    const courseReturned = await CourseInfo.findOne({ Course: param });
    res.status(200).json(courseReturned.Information_Resource);
});

//Professor upload pdf for course. (Must have isProfessor=true)
router.post("/upload-pdf/:Course/:PdfTitle", uploadCourseInfo.single("courseinfo"), async (req, res) => {
    //IMPLEMENT DETAILS ON HOW TO STORE COURSE INFO STUFF.
    const doc_name = req.file.filename;
    const ui_name = req.params.PdfTitle;
    const pdf = {doc_name: doc_name, ui_name: ui_name};
    const course_name = req.params.Course
    const courseReturned = await CourseInfo.findOne({Course: course_name})
    courseReturned.Information_Document.push(pdf);
    console.log(courseReturned.Information_Document[0])
    await courseReturned.save();
    res.status(200).json({ message: 'Success!'});
});

//Professor delete pdf for course. (Must have isProfessor=true)
router.post("/delete-pdf/:Course", async (req, res) => {
    //IMPLEMENT DETAILS ON HOW TO STORE COURSE INFO STUFF.

    const doc_name = req.body.link;
    const course_name = req.params.Course;
    const courseReturned = await CourseInfo.findOne({Course: course_name})
    for (let i = 0; i < courseReturned.Information_Document.length; i++) {
        if (courseReturned.Information_Document[i][0].doc_name == doc_name) {
            console.log(courseReturned.Information_Document[i][0].doc_name)
            courseReturned.Information_Document.splice(i, 1);
        }
    }
    await courseReturned.save();
    fs.unlinkSync("course_info_docs/" + doc_name);
    res.status(200).json({ message: 'Success!'});
});

function get_date_format(myDate) {
  
    let month = myDate.getMonth() + 1;
    
    // helper function
    const addZeroIfNeeded = (num) => {
        return (num < 10) ? '0' + num : num.toString();
    }
    
    month = addZeroIfNeeded(month);
    let day = addZeroIfNeeded(myDate.getDate());
    
    let year = myDate.getFullYear();
    let hours = addZeroIfNeeded(myDate.getHours());
    let mins = addZeroIfNeeded(myDate.getMinutes());
    let seconds = addZeroIfNeeded(myDate.getSeconds());
  
    return `${month}-${day}-${year}T${hours}:${mins}:${seconds}`;
}

router.post("/upload-pdf-resource/:Course/:PdfTitle", uploadCourseInfo.single("courseinfo"), async (req, res) => {
    //IMPLEMENT DETAILS ON HOW TO STORE COURSE INFO STUFF.
    const doc_name = req.file.filename;
    const ui_name = req.params.PdfTitle + "-" + get_date_format(new Date());
    const pdf = {doc_name: doc_name, ui_name: ui_name};
    console.log("pdf stuff: " + pdf)
    const course_name = req.params.Course
    const courseReturned = await CourseInfo.findOne({Course: course_name})
    courseReturned.Information_Resource.push(pdf);
    console.log(courseReturned.Information_Resource[0])
    await courseReturned.save();
    res.status(200).json({ message: 'Success!'});
});

//Professor delete pdf for course resource. (Must have isProfessor=true)
router.post("/delete-pdf-resource/:Course", async (req, res) => {
    //IMPLEMENT DETAILS ON HOW TO STORE COURSE INFO STUFF.
    const doc_name = req.body.link;
    const course_name = req.params.Course;
    const courseReturned = await CourseInfo.findOne({Course: course_name})
    for (let i = 0; i < courseReturned.Information_Resource.length; i++) {
        if (courseReturned.Information_Resource[i][0].doc_name == doc_name) {
            console.log(courseReturned.Information_Resource[i][0].doc_name)
            courseReturned.Information_Resource.splice(i, 1);
        }
    }
    await courseReturned.save();
    fs.unlinkSync("course_info_docs/" + doc_name);
    res.status(200).json({ message: 'Success!'});
});

router.post("/add-favCourse", async (req, res) => {
    const {username, favCourses} = req.body;
    console.log({username, favCourses});
    const user = await UserInfo.findOne({ username: username });
    user.favCourses = favCourses;
    await user.save();
    res.status(200).json({ message: 'Success!'});
});

router.post("/:Course/addProfDescription", async (req, res) => {
    const {username, description} = req.body;
    const user = await UserInfo.findOne({username: username});
    if (user.isProf) {
        const course = await CourseInfo.findOne({ Course: req.params.Course });
        course.Professor_Description = description;
        await course.save();
        res.status(200).json({ message: 'Success!'});
    } else {
        res.status(200).json({ message: 'Fail!'});
    }
});

router.get("/get-favCourses/:username", async (req, res) => {
    const param = req.params.username;
    const userReturned = await UserInfo.findOne({ username: param });
    res.status(200).json(userReturned.favCourses);
});

module.exports = router;

