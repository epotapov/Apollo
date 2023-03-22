/**
 * thread.js
 *
 * Thread controller
 *
 * @author jebeene
 */

const Thread = require("../models/thread-model");

/* CREATE */

/* createThread
 *
 * req.body should contain courseName, username, title, description
 *
 * res.body returns all threads
 */
const createThread = async (req, res) => {
  try {
    const { courseName, username, title, description } = req.body;
    const user = await UserInfo.findById(username);
    const newThread = new Thread({
      username,
      title,
      description,
      upvotes: {},
      downvotes: {},
      comments: []
    })
    await newThread.save();

    // returns all the threads
    // TODO change this to make more sense later
    const thread = await Thread.find();

    res.status(201).json(thread);

  } catch (err) {
    res.status(409).json({ message: err.message });
  }
}

/* READ */

/* getCourseThreads
 *
 * req.body should only contain the courseName
 *
 * res.body returns all threads that contain the given courseName
 */
const getCourseThreads = async(req, res) => {
  const { courseName } = req.body;

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
 * req.body should contain 
 *
 */
const upvoteThread = async(req, res) => {

  try {
    const { id } = req.params;
    const { username } = req.body;

    const thread = await Thread.findById(id);
    const isUpvoted = thread.upvotes.get(username);

    if (isUpvoted) {
      thread.upvotes.delete(username);
    } else {
      thread.upvotes.set(username, true);
    }

    const updatedThread = await Thread.findByIdAndUpdate(
      id,
      { upvotes: thread.upvotes },
      { new: true }
    );

    res.status(200).json(updatedThread);

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

/* downvoteThread
 *
 * req.body should contain 
 *
 */
const downvoteThread = async(req, res) => {

  try {
    const { id } = req.params;
    const { username } = req.body;

    const thread = await Thread.findById(id);
    const isDownvoted = thread.downvotes.get(username);

    if (isDownvoted) {
      thread.downvotes.delete(username);
    } else {
      thread.downvotes.set(username, true);
    }

    const updatedThread = await Thread.findByIdAndUpdate(
      id,
      { downvotes: thread.downvotes },
      { new: true }
    );

    res.status(200).json(updatedThread);

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

module.exports = { createThread, getCourseThreads, upvoteThread, downvoteThread };
