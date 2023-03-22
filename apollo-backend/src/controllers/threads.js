/**
 * thread.js
 *
 * Thread controller. API details are listed in comments above each request.
 *
 * @author jebeene
 */

// imports thread model
const Thread = require("../models/thread-model");

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
  try {
    const { courseName, username, title, description } = req.body;

    const userExist = await User.findOne({ username });
    if (!userExist) {
      throw Error(username + " is not a registered user!");
    }

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
    const courseThreads = await Thread.find({ courseName });
    res.status(200).json(courseThreads);
  } catch (err) {
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
    const isUpvoted = thread.upvotes.get(username);
    const isDownvoted = thread.downvotes.get(username);

    if (isUpvoted) {
      console.log(username + " removed their upvote from this thread!");
      thread.upvotes.delete(username);
    } else if (isDownvoted) {
      console.log(username + " changed their downvote to an upvote!");
      thread.downvotes.delete(username);
      thread.upvotes.set(username, true);
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
    res.status(200).json(updatedThread);

  } catch (err) {
    res.status(404).json({ message: err.message });
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
    const isDownvoted = thread.downvotes.get(username);
    const isUpvoted = thread.upvotes.get(username);

    if (isDownvoted) {
      console.log(username + " removed their downvote from this thread!");
      thread.downvotes.delete(username);
    } else if (isUpvoted) {
      console.log(username + " changed their upvote to a downvote!");
      thread.upvotes.delete(username);
      thread.downvotes.set(username, true);
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
    res.status(200).json(updatedThread);

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

// export functions so they can be imported & used elsewhere
module.exports = { createThread, getCourseThreads, upvoteThread, downvoteThread };
