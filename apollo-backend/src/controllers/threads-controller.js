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
    const userExist = await User.findOne({ username });
    if (!userExist) {
      throw Error(username + " is not a registered user!");
    }

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
      comments: []
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
const getCourseThreads = async(req, res) => {
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
const upvoteThread = async(req, res) => {

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
const downvoteThread = async(req, res) => {

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
const createComment = async(req, res) => {

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

    // update thread with new comment
    const updatedThread = await Thread.findByIdAndUpdate(
      id,
      { comments: thread.comments },
      { new: true }
    );

    // success
    console.log(username + " commented on thread " + thread.title + "!");
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

// export functions so they can be imported & used elsewhere
module.exports = { createThread, getCourseThreads, upvoteThread, downvoteThread, createComment };
