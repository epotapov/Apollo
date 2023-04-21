const express = require('express');

// email verification
const nodemailer = require('nodemailer');

const bcrypt = require('bcrypt');

//generates jwt token
const jwt = require('jsonwebtoken');

const fs = require('fs');

const validator = require('validator'); // helps validate user input

const CourseInfo = require('../models/course-model');

const { protect } = require('../middleware/authMiddleware');

const mongoose = require('mongoose');

let hasExecuted = true;

// Friend schema 
const Friend = require('../models/user-model');

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
const upload = multer({ storage: storage });

//For professor pdf upload

const storage_courseInfo = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'course_info_docs');
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const uploadCourseInfo = multer({ storage: storage_courseInfo });

//controller functions
const { signupUser, loginUser, allUsers } = require('../controllers/user-controller');

const UserInfo = require('../models/user-model');
const Notification = mongoose.model('Notification', UserInfo.schema.paths.notifications.schema);

const router = express.Router();

//login route - no method is currently executed here bc () => {}
router.post('/login', loginUser);

//signup route - signupUser is the "method" that is executed
router.post('/signup', signupUser);

router.route('/').get(protect, allUsers);

router.patch('/addNotification', async (req, res) => {
    try {
        const { username, title, type, path, sender } = req.body;

        const User = await UserInfo.findOne({ username: username });

        if (!User)
            throw Error("User not found");

        const newNotification = new Notification({
            title: title,
            type: type,
            path: path,
            sender: sender,
            isRead: false
        });

        User.notifications.unshift(newNotification);


        // Send email here, smth like:
        // You have 5 new notifications, you have {User.notifications.filter(notification => notification.isRead === false).length} unread notifications
        // You can view and mark notifications as read by clicking at your profile picture in the top right corner! 

        const smtpConfig = {
            service: 'gmail',
            auth: {
                user: 'TestDummy2199@gmail.com',
                pass: 'qjlyzponqvxkuzhp',
            }
        };

        const transporter = nodemailer.createTransport(smtpConfig);

        if (User.notifications.filter(notification => notification.isRead === false).length > 5 && hasExecuted == true) {
            const mailOptions = {
                from: 'TestDummy2199@gmail.com',
                to: User.email,
                subject: 'Apollo Notifications',
                text: `You have more than 5 unread notifications! Click here to redirect to Apollo: http://localhost:3000/`
            };

            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    console.log(error);
                    throw Error(error.message);
                }
                else {
                    console.log('Notification email sent');
                }

            })

            hasExecuted = false;

        }


        await User.save();
        res.status(200).json({ user: User });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

router.post('/clear-notifications', async (req, res) => {
    const username = req.body.username;
    console.log(username);
    const user = await UserInfo.findOne({ username: username });

    if (!user) {
        res.status(404).json({ message: 'User not found!' });
        return;
    }

    if (user.recentActivity.length === 0) {
        res.status(200).json({ message: 'Notifications already cleared!' });
        return;
    }

    user.notifications = [];

    await user.save();
    res.status(200).json({ message: 'Recent activity cleared!' });
})



/*Send friend request route
 * API Request: "/api/user/sendFriendRequest"
 * Request Body: {
 *     username: String,  (the user sending the friend request)
 *    friendUsername: String (the user receiving the friend request)
 * }    
 * Response: 
 * 
 * Status codes: 
 * 200: Friend request sent successfully
 * 201: Friend request already sent
*/
router.patch('/sendFriendRequest', async (req, res) => {
    try {
        const { username, friendUsername } = req.body;
        const user = await UserInfo.findOne({ username: username });
        const pendingFriend = await UserInfo.findOne({ username: friendUsername });

        if (!user || !pendingFriend) {
            throw Error("User not found");
        }

        //Check if friend request has already been sent
        if (user.friendRequestsSent.includes(friendUsername)) {
            res.status(201).json({ message: "Friend request already sent" })
            return;
        } else {
            user.friendRequestsSent.push(friendUsername);
            pendingFriend.friendRequests.push(username);
            await user.save();
            await pendingFriend.save();
            res.status(200).json({ user: user, pendingFriend: pendingFriend })
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});


/* Accept a friend request
    * API Request: "/api/user/acceptRequest"
    * Request Body: {
    *    username: String, (the user accepting the friend request)
    *   friendUsername: String (the user who sent the friend request)
    * }
    * 
    * This is for when a user accepts a friend request from pendingFriend 
*/
router.patch('/acceptFriendRequest', async (req, res) => {
    try {
        const { username, friendUsername } = req.body;
        const user = await UserInfo.findOne({ username: username });
        const pendingFriend = await UserInfo.findOne({ username: friendUsername });

        if (user.friendRequests.includes(friendUsername)) {
            user.friendRequests.splice(user.friendRequests.indexOf(friendUsername), 1);
            pendingFriend.friendRequestsSent.splice(pendingFriend.friendRequestsSent.indexOf(username), 1);

            // This is the friend object that will be added to the user's friends array
            const newFriend = new Friend({
                username: friendUsername,
                profilePicture: pendingFriend.profilePicture,
            });

            // This is the friend object that will be added to the pendingFriend's friends array
            const newPendingFriend = new Friend({
                username: username,
                profilePicture: user.profilePicture,
            });

            user.friendsList.push(newFriend);
            pendingFriend.friendsList.push(newPendingFriend);
            await user.save();
            await pendingFriend.save();
            res.status(200).json({ user: user, pendingFriend: pendingFriend })
        } else {
            res.status(201).json({ message: "Friend request not found" });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

/*Deny a friend request
    * API Request: "/api/user/denyRequest"
    * Request Body: {
    *   username: String, (The current user)
    *   friendUsername: String (User who sent the friend request)
    * }
    * 
    * This is for when a user denies a friend request from pendingFriend
*/
router.patch('/denyFriendRequest', async (req, res) => {
    try {
        const { username, friendUsername } = req.body;
        const user = await UserInfo.findOne({ username: username });
        const pendingFriend = await UserInfo.findOne({ username: friendUsername });

        if (user.friendRequests.includes(friendUsername)) {
            user.friendRequests.splice(user.friendRequests.indexOf(friendUsername), 1);
            pendingFriend.friendRequestsSent.splice(pendingFriend.friendRequestsSent.indexOf(username), 1);
            await user.save();
            await pendingFriend.save();
            res.status(200).json({ user: user, pendingFriend: pendingFriend })
        } else {
            res.status(201).json({ message: "Friend request not found" });
            return;
        }

        await user.save();
        await pendingFriend.save();
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

/*Remove friend route
    * API Request: "/api/user/removeFriend"
    * Request Body: {
    *  username: String, (The current user)
    * friendUsername: String (The friend to be removed)
    * }
    * 
    * This is for when a user removes a friend from their friends list (it removes the friend from both the user's and the friend's friends list)
*/
router.patch('/removeFriend', async (req, res) => {
    try {
        const { username, friendUsername } = req.body;
        const user = await UserInfo.findOne({ username: username });
        const pendingFriend = await UserInfo.findOne({ username: friendUsername });

        var friends = false;
        for (let i = 0; i < user.friendsList.length; i++) {
            if (user.friendsList[i].username === friendUsername) {
                friends = true;
            }
        }
        if (friends) {
            user.friendsList.splice(user.friendsList.indexOf(friendUsername), 1);
            pendingFriend.friendsList.splice(pendingFriend.friendsList.indexOf(username), 1);
            await user.save();
            await pendingFriend.save();
            res.status(200).json({ user: user, pendingFriend: pendingFriend })
        } else {
            res.status(201).json({ message: "Friend not found" });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

// Cancel a friend request
router.patch('/cancelFriendRequest', async (req, res) => {
    try {
        const { username, friendUsername } = req.body;
        const user = await UserInfo.findOne({ username: username });
        const pendingFriend = await UserInfo.findOne({ username: friendUsername });

        if (!user || !pendingFriend) {
            res.status(400).json({ message: "User not found" });
            return;
        }

        if (user.friendRequestsSent.includes(friendUsername)) {
            user.friendRequestsSent.splice(user.friendRequestsSent.indexOf(friendUsername), 1);
            pendingFriend.friendRequests.splice(pendingFriend.friendRequests.indexOf(username), 1);
            await user.save();
            await pendingFriend.save();
            res.status(200).json({ user: user, pendingFriend: pendingFriend })
        } else {
            res.status(201).json({ message: "Friend request not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

// ex: /api/user/getAll
router.get('/getAll', async function (req, res) {

    const allUsers = await UserInfo.find();
    res.json(allUsers);

});

// ex: /api/user/get/{username}
router.get('/get/:username', async (req, res) => {
    const param = req.params.username;
    const userReturned = await UserInfo.findOne({ username: param });
    res.json(userReturned);
});

// ex: /api/user/friends/{username}
router.get('/friends/:username', async (req, res) => {
    const param = req.params.username;
    const userReturned = await UserInfo.findOne({ username: param });
    res.json(userReturned.friendsList);
});



// get is professor accoutn
router.get('/getIsProf/:username', async (req, res) => {
    const param = req.params.username;
    const userReturned = await UserInfo.findOne({ username: param });
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
                }
                user.isVerified = true;
                await user.save();
            })
            res.send('Account verification successful! Please return to the ' + 'login page'.link('http://localhost:3000/Login'));
        }
    });
});

router.post('/edit', async (req, res) => {
    // const salt = await bcrypt.genSalt(10);

    const { username, email, major, gradYear, role,
        isVerified, courses, aboutMe, country, gender, planOfStudy,
        dob, isPrivate, emailNotif, year, instagramLink, twitterLink, linkedinLink, favCourses, inAppNotifs } = req.body;

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
    user.inAppNotifs = inAppNotifs;
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
                    res.status(200).json({ message: 'Password changed! Please return to the ' + 'login page'.link('http://localhost:3000/Login') });
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
            res.status(200).json({ message: 'Password changed! Please return to the ' + 'login page'.link('http://localhost:3000/Login') });
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
    const userReturned = await UserInfo.findOne({ username: the_username })
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
    const pdf = { doc_name: doc_name, ui_name: ui_name };
    const course_name = req.params.Course
    const courseReturned = await CourseInfo.findOne({ Course: course_name })
    courseReturned.Information_Document.push(pdf);
    console.log(courseReturned.Information_Document[0])
    await courseReturned.save();
    res.status(200).json({ message: 'Success!' });
});

//Professor delete pdf for course. (Must have isProfessor=true)
router.post("/delete-pdf/:Course", async (req, res) => {
    //IMPLEMENT DETAILS ON HOW TO STORE COURSE INFO STUFF.

    const doc_name = req.body.link;
    const course_name = req.params.Course;
    const courseReturned = await CourseInfo.findOne({ Course: course_name })
    for (let i = 0; i < courseReturned.Information_Document.length; i++) {
        if (courseReturned.Information_Document[i][0].doc_name == doc_name) {
            console.log(courseReturned.Information_Document[i][0].doc_name)
            courseReturned.Information_Document.splice(i, 1);
        }
    }
    await courseReturned.save();
    fs.unlinkSync("course_info_docs/" + doc_name);
    res.status(200).json({ message: 'Success!' });
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
    const pdf = { doc_name: doc_name, ui_name: ui_name };
    console.log("pdf stuff: " + pdf)
    const course_name = req.params.Course
    const courseReturned = await CourseInfo.findOne({ Course: course_name })
    courseReturned.Information_Resource.push(pdf);
    console.log(courseReturned.Information_Resource[0])
    await courseReturned.save();
    res.status(200).json({ message: 'Success!' });
});

//Professor delete pdf for course resource. (Must have isProfessor=true)
router.post("/delete-pdf-resource/:Course", async (req, res) => {
    //IMPLEMENT DETAILS ON HOW TO STORE COURSE INFO STUFF.
    const doc_name = req.body.link;
    const course_name = req.params.Course;
    const courseReturned = await CourseInfo.findOne({ Course: course_name })
    for (let i = 0; i < courseReturned.Information_Resource.length; i++) {
        if (courseReturned.Information_Resource[i][0].doc_name == doc_name) {
            console.log(courseReturned.Information_Resource[i][0].doc_name)
            courseReturned.Information_Resource.splice(i, 1);
        }
    }
    await courseReturned.save();
    fs.unlinkSync("course_info_docs/" + doc_name);
    res.status(200).json({ message: 'Success!' });
});

router.post("/add-favCourse", async (req, res) => {
    const { username, favCourses } = req.body;

    const user = await UserInfo.findOne({ username: username });
    user.favCourses = favCourses;
    await user.save();

    const course = await CourseInfo.findOneAndUpdate(
        { Course: favCourses.at(favCourses.length - 1) },
        { $addToSet: { Favorited: user._id } },
        { new: true });
    console.log(course)
    res.status(200).json({ message: 'Success!' });
});

router.post("/:Course/addProfDescription", async (req, res) => {
    const { username, description } = req.body;
    const user = await UserInfo.findOne({ username: username });
    if (user.isProf) {
        const course = await CourseInfo.findOne({ Course: req.params.Course });
        course.Professor_Description = description;
        await course.save();
        res.status(200).json({ message: 'Success!' });
    } else {
        res.status(200).json({ message: 'Fail!' });
    }
});

router.get("/get-favCourses/:username", async (req, res) => {
    const param = req.params.username;
    const userReturned = await UserInfo.findOne({ username: param });
    res.status(200).json(userReturned.favCourses);
});

/* Block a user
    * @param username: username of the user to block
    * @body username: username of the user who is blocking
    * 
    * @return 200: success
    * @return 404: user not found
*/

router.post("/block-user/:username", async (req, res) => {
    const pendingBlock = await UserInfo.findOne({ username: req.params.username });
    const user = await UserInfo.findOne({ username: req.body.username });

    let isBlocked = false;
    for (let i = 0; i < user.blockedList.length; i++) {
        if (user.blockedList[i] == pendingBlock.username) {
            isBlocked = true;
        }
    }

    if (!isBlocked) {
        var friends = false;
        for (let i = 0; i < user.friendsList.length; i++) {
            if (user.friendsList[i].username === pendingBlock.username) {
                friends = true;
            }
        }
        if (friends) {
            user.friendsList.splice(user.friendsList.indexOf(pendingBlock.username), 1);
            pendingBlock.friendsList.splice(pendingBlock.friendsList.indexOf(user.username), 1);
        }
        if (user.friendRequests.includes(pendingBlock.username)) {
            user.friendRequests.splice(user.friendRequests.indexOf(pendingBlock.username), 1);
            pendingBlock.friendRequestsSent.splice(pendingBlock.friendRequestsSent.indexOf(user.username), 1);
        }
        if (user.friendRequestsSent.includes(pendingBlock.username)) {
            user.friendRequestsSent.splice(user.friendRequestsSent.indexOf(pendingBlock.username), 1);
            pendingBlock.friendRequests.splice(pendingBlock.friendRequests.indexOf(user.username), 1);
        }
        user.blockedList.push(pendingBlock.username);
        await user.save();
        await pendingBlock.save();
        res.status(200).json({ user: user, pendingBlock: pendingBlock });
    } else {
        // Unblock the user
        user.blockedList.splice(user.blockedList.indexOf(pendingBlock.username), 1);
        await user.save();
        res.status(200).json({ user: user, pendingBlock: pendingBlock });
    }
});

router.post("/clear-recent-activity", async (req, res) => {
    const username = req.body.username;
    console.log(username);
    const user = await UserInfo.findOne({ username: username });

    if (!user) {
        res.status(404).json({ message: 'User not found!' });
        return;
    }

    if (user.recentActivity.length === 0) {
        res.status(200).json({ message: 'Recent activity already cleared!' });
        return;
    }

    user.recentActivity = [];

    await user.save();
    res.status(200).json({ message: 'Recent activity cleared!' });
})

const Thread = require("../models/thread-model");
const Rating = require("../models/rating-model");

router.post("/edit-thread/:threadID", async (req, res) => {
    const { title, description, tag } = req.body
    const id = req.params.threadID;
    const threadFound = await Thread.findById(id)
    threadFound.title = title;
    threadFound.description = description;
    threadFound.tag = tag;
    await threadFound.save();
    console.log(threadFound)
})

router.post("/edit-review/:reviewID", async (req, res) => {
    const { description, stars, title, enjoyability, difficulty, attendanceRequired, professor, semester } = req.body
    const id = req.params.reviewID;
    const reviewFound = await Rating.findById(id)
    reviewFound.title = title;
    reviewFound.stars = stars;
    reviewFound.description = description;
    reviewFound.enjoyability = enjoyability;
    reviewFound.difficulty = difficulty;
    reviewFound.attendanceRequired = attendanceRequired;
    reviewFound.professor = professor;
    reviewFound.semester = semester;
    await reviewFound.save();
    console.log(reviewFound)
    // edit: Description, stars, title, enjoyability, difficulty, attendanceRequired, professor, semester
})

router.post("/edit-comment/:threadID/:commentID", async (req, res) => {
    const { description } = req.body
    const thrId = req.params.threadID
    var id = req.params.commentID;
    const threadFound = await Thread.findById(thrId)
    const commentFound = threadFound.comments.find(x => x._id + "x" === id + "x");
    commentFound.description = description;
    await threadFound.save();
    console.log(commentFound)
    // edit : description
})

module.exports = router;

