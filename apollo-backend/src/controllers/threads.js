/**
 * thread.js
 *
 * Thread controller. API details are listed in comments above each request.
 *
 * @author jebeene
 */

// imports thread model
const Thread = require("../models/thread-model");

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
 * API Requ: /api/thread/:threadId/downvote
 * Req Body: username
 * Response: updated thread object or JSON error message
 *
 * Status Codes:
 *   OK = 200
 *   NOT FOUND = 404
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

// export functions so they can be imported & used elsewhere
module.exports = { createThread, getCourseThreads, upvoteThread, downvoteThread };
