/**
 * thread.js
 *
 * Thread controller. API details are listed in comments above each request.
 *
 * @author jebeene
 */

// import mongoose - in this case, we use it for error handling
const mongoose = require("mongoose");

// imports thread model
const Thread = require("../models/thread-model");

// imports comments (yes it's inside thread-model)
const Comment = require("../models/thread-model");

// imports user model - used for user verification
const User = require("../models/user-model");

// imports course model - used for course verification
const Course = require("../models/course-model");

// imports nodemailer - used for email notification
const nodemailer = require('nodemailer');

/* CREATE */

/* createThread
 *
 * API Requ: /api/thread/create
 * Req Body: courseName, username, title, description
 * Response: all threads for courseName or JSON error message
 *
 * Status Codes:
 *   CREATED = 201
 *   CONFLICT = 409
 */
const createThread = async (req, res) => {
  console.log(req.body);
  try {
    const { courseName, username, title, description } = req.body;

    // verify user exists before we let them create a thread
    const user = await User.findOne({ username });
    if (!user) {
      throw Error(username + " is not a registered user!");
    }

    const userEmail = user.email;

    // verify course exists before creating thread
    const courseExist = await Course.findOne({ Course: courseName });
    if (!courseExist) {
      throw Error(courseName + " does not exist!");
    }

    const newThread = new Thread({
      courseName,
      username,
      title,
      description,
      upvotes: {},
      downvotes: {},
      comments: [],
      subscribed: {
        [username]: userEmail
      },
    })
    await newThread.save();

    // returns courseName threads
    const thread = await Thread.find({ courseName });

    res.status(201).json(thread);

  } catch (err) {
    console.log(err.message);
    res.status(409).json({ message: err.message });
  }
}

/* READ */

/* getCourseThreads
 *
 * API Requ: /api/thread/:courseName
 * Req Body: courseName
 * Response: all threads for courseName or JSON error message
 *
 * Status Codes:
 *   OK = 200
 *   NOT FOUND = 404
 */
const getCourseThreads = async (req, res) => {
  const { courseName } = req.params;

  try {
    const courseExist = await Course.findOne({ Course: courseName });
    const courseThreads = await Thread.find({ courseName });

    // verify course exists
    if (!courseExist) {
      throw Error(courseName + " does not exist!");
    }

    res.status(200).json(courseThreads);
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ message: err.message });
  }
}

/* UPDATE */

/* upvoteThread
 *
 * API Requ: /api/thread/:threadId/upvote
 * Req Body: username
 * Response: updated thread object or JSON error message
 *
 * Status Codes:
 *   OK = 200
 *   NOT FOUND = 404
 *   DOUBLE UPVOTE = 209
 *   DOWNVOTE UPVOTE = 210
 *
 * Other:
 *   How to access # of upvotes?
 *      {thread object}.upvotes.size
 */
const upvoteThread = async (req, res) => {

  try {
    const { id } = req.params;
    const { username } = req.body;

    const userExist = await User.findOne({ username });
    if (!userExist) {
      throw Error(username + " is not a registered user!");
    }

    const thread = await Thread.findById(id);
    if (!thread) {
      throw Error("Thread " + id + " was not found! Check that the ID provided is correct.");
    }

    const isUpvoted = thread.upvotes.get(username);
    const isDownvoted = thread.downvotes.get(username);
    var doubleUpvoteAttempt = false;
    var downvoteUpvoteAttempt = false;

    if (isUpvoted) {
      console.log(username + " removed their upvote from this thread!");
      thread.upvotes.delete(username);
      doubleUpvoteAttempt = true;
    } else if (isDownvoted) {
      console.log(username + " changed their downvote to an upvote!");
      thread.downvotes.delete(username);
      thread.upvotes.set(username, true);
      downvoteUpvoteAttempt = true;
    } else {
      console.log(username + " upvoted this thread!");
      thread.upvotes.set(username, true);
    }

    const updatedThread = await Thread.findByIdAndUpdate(
      id,
      { upvotes: thread.upvotes, downvotes: thread.downvotes },
      { new: true }
    );

    console.log("upvotes: " + updatedThread.upvotes.size);
    if (doubleUpvoteAttempt) {
      res.status(209).json(updatedThread);
    } else if (downvoteUpvoteAttempt) {
      res.status(210).json(updatedThread);
    } else {
      res.status(200).json(updatedThread);
    }

  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      console.log("Check that the ID provided is correct.");
      res.status(400).json({ message: "Check that the ID provided is correct." });
    } else {
      console.log(err.message);
      res.status(404).json({ message: err.message });
    }
  }
}

/* downvoteThread
 *
 * API Requ: /api/thread/:threadId/downvote
 * Req Body: username
 * Response: updated thread object or JSON error message
 *
 * Status Codes:
 *   OK = 200
 *   NOT FOUND = 404
 *   DOUBLE DOWNVOTE = 209
 *   DOWNVOTE UPVOTE = 210
 *
 * Other:
 *   How to access # of downvotes?
 *      {thread object}.downvotes.size
 */
const downvoteThread = async (req, res) => {

  try {
    const { id } = req.params;
    const { username } = req.body;

    const userExist = await User.findOne({ username });
    if (!userExist) {
      throw Error(username + " is not a registered user!");
    }

    const thread = await Thread.findById(id);
    console.log(thread);
    if (!thread) {
      throw Error("Thread " + id + " was not found! Check that the ID provided is correct.");
    }
    const isDownvoted = thread.downvotes.get(username);
    const isUpvoted = thread.upvotes.get(username);
    var doubleDownvoteAttempt = false;
    var downvoteUpvoteAttempt = false;

    if (isDownvoted) {
      console.log(username + " removed their downvote from this thread!");
      thread.downvotes.delete(username);
      doubleDownvoteAttempt = true;
    } else if (isUpvoted) {
      console.log(username + " changed their upvote to a downvote!");
      thread.upvotes.delete(username);
      thread.downvotes.set(username, true);
      downvoteUpvoteAttempt = true;
    } else {
      console.log(username + " downvoted this thread!");
      thread.downvotes.set(username, true);
    }

    const updatedThread = await Thread.findByIdAndUpdate(
      id,
      { upvotes: thread.upvotes, downvotes: thread.downvotes },
      { new: true }
    );

    console.log("downvotes: " + updatedThread.downvotes.size);
    if (doubleDownvoteAttempt) {
      res.status(209).json(updatedThread);
    } else if (downvoteUpvoteAttempt) {
      res.status(210).json(updatedThread);
    } else {
      res.status(200).json(updatedThread);
    }

  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      console.log("Check that the ID provided is correct.");
      res.status(400).json({ message: "Check that the ID provided is correct." });
    } else {
      console.log(err.message);
      res.status(404).json({ message: err.message });
    }
  }
}

/* createComment
 *
 * API Requ: /api/thread/:threadId/createComment
 * Req Body: username, description
 * Response: updated thread object or JSON error message
 *
 * Status Codes:
 *   CREATED = 201
 *   CONFLICT = 409
 */
const createComment = async (req, res) => {

  try {
    // grab request param & json body
    const { id } = req.params;
    const { username, description } = req.body;

    // does user exist
    const userExist = await User.findOne({ username });
    if (!userExist) {
      throw Error(username + " is not a registered user!");
    }

    // find thread by id provided and create new comment obj
    const thread = await Thread.findById(id);
    console.log(thread);
    if (!thread) {
      throw Error("Thread " + id + " was not found! Check that the ID provided is correct.");
    }
    const newComment = new Comment({
      username,
      description,
    })

    // add comment to thread obj
    thread.comments.push(newComment);

    // subscribe user to thread
    thread.subscribed.set(username, userExist.email);

    // update thread with new comment
    const updatedThread = await Thread.findByIdAndUpdate(
      id,
      { comments: thread.comments, subscribed: thread.subscribed },
      { new: true }
    );


    // TODO @brandon can you add email stuff here? you'll have to access thread.subscribed which is a map in the form of username: email (ex: jebeene: jebeene@purdue.edu)
    // so you'll have to access all the emails in the subscribed list. i think the .values() method is the way to do this but yeah i'll let you figure it out https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values

    const smtpConfig = {
      service: 'gmail',
      auth: {
        user: 'TestDummy2199@gmail.com',
        pass: 'qjlyzponqvxkuzhp',
      }
    };

    const transporter = nodemailer.createTransport(smtpConfig);

    for (const [key, value] of thread.subscribed) {

      if (!key.emailNotif) {
        const mailOptions = {
          from: 'TestDummy2199@gmail.com',
          to: value,
          subject: 'A User Reacted to your Comment!',
          text: `Someone replied to your comment ` + thread.title + ` click here to view: http://localhost:3000/course/${thread.courseName}`
        };

        transporter.sendMail(mailOptions, (error) => {
          if (error) {
            console.log(error);
            throw Error(error.message);
          }
          else {
            console.log('Email notification sent successfully');
          }
        });
      }
    }

    // success
    console.log(username + " commented and subscribed to thread " + thread.title + "!");
    res.status(201).json(updatedThread);

  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      console.log("Check that the ID provided is correct.");
      res.status(400).json({ message: "Check that the ID provided is correct." });
    } else {
      console.log(err.message);
      res.status(409).json({ message: err.message });
    }
  }
}

/* subscribeToThread
 *
 * THIS HANDLES UNSUBSCRIBING TOO
 *
 * API Requ: /api/thread/:threadId/subscribeToThread
 * Req Body: username
 * Response: updated thread object or JSON error message
 *
 * Status Codes:
 *   OK = 200
 *   NOT FOUND = 404
 *   CONFLICT = 210
 */
const subscribeToThread = async (req, res) => {

  try {
    const { id } = req.params;
    const { username } = req.body;

    const userExist = await User.findOne({ username });
    if (!userExist) {
      throw Error(username + " is not a registered user!");
    }

    // user has email notifications turned off
    if (!userExist.emailNotif) {
      throw Error(username + " has email notifications off!")
    }

    const thread = await Thread.findById(id);
    console.log(thread);
    if (!thread) {
      throw Error("Thread " + id + " was not found! Check that the ID provided is correct.");
    }

    const isSubscribed = thread.subscribed.get(username);
    var doubleSubscribe = false;

    if (isSubscribed) {
      console.log(username + " unsubscribed from this thread!");
      thread.subscribed.delete(username);
      doubleSubscribe = true;
    } else {
      console.log(username + " subscribed to this thread!");
      thread.subscribed.set(username, userExist.email);
    }

    // update thread
    const updatedThread = await Thread.findByIdAndUpdate(
      id,
      { subscribed: thread.subscribed },
      { new: true }
    );

    if (doubleSubscribe) {
      res.status(210).json(updatedThread);
    } else {
      res.status(200).json(updatedThread);
    }

  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      console.log("Check that the ID provided is correct.");
      res.status(400).json({ message: "Check that the ID provided is correct." });
    } else {
      console.log(err.message);
      res.status(404).json({ message: err.message });
    }
  }
}

// export functions so they can be imported & used elsewhere
module.exports = { createThread, getCourseThreads, upvoteThread, downvoteThread, createComment, subscribeToThread };
