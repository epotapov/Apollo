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
const { createThread, getCourseThreads, upvoteThread, downvoteThread, createComment } = require('../controllers/threads');
// TODO add method imports


const router = express.Router();

/* CREATE / POST */
router.post("/create", createThread);

/* READ */
router.get("/:courseName", getCourseThreads);
// router.get("/:username/threads", verifyToken, getUserThreads);


/* UPDATE */
router.patch("/:id/upvote", upvoteThread);
router.patch("/:id/downvote", downvoteThread);
router.patch("/:id/createComment", createComment);

module.exports = router;
