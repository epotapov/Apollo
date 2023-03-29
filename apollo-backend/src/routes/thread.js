/**
 * thread.js
 *
 * Route file for threads.
 *
 * @author jebeene
 */

// requires
const express = require('express');
const ThreadInfo = require('../models/thread-model');
const { createThread, getCourseThreads, upvoteThread, downvoteThread, createComment, subscribeToThread } = require('../controllers/threads-controller');

const router = express.Router();

/* CREATE / POST */
router.post("/create", createThread);

/* READ */
router.get("/:courseName", getCourseThreads);

/* UPDATE */
router.patch("/:id/upvote", upvoteThread);
router.patch("/:id/downvote", downvoteThread);
router.patch("/:id/createComment", createComment);
router.patch("/:id/subscribeToThread", subscribeToThread);

module.exports = router;
