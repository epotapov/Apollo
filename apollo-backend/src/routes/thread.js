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
const { createThread, getCourseThreads, upvoteThread, downvoteThread, createComment, subscribeToThread, deleteThread, removeComment, editThread, editComment, getGroupThreads, createGroupThread } = require('../controllers/threads-controller');

const router = express.Router();

/* CREATE / POST */
router.post("/create", createThread);
router.post("/createGroupThread", createGroupThread);

/* READ */
router.get("/:courseName", getCourseThreads);
router.get("/group/:courseName", getCourseThreads);

/* UPDATE */
router.patch("/:id/upvote", upvoteThread);
router.patch("/:id/downvote", downvoteThread);
router.patch("/:id/createComment", createComment);
router.patch("/:id/subscribeToThread", subscribeToThread);
router.patch("/:id/deleteThread", deleteThread);
router.patch("/:threadId/:commentId/removeComment", removeComment);
router.patch("/:threadId/edit", editThread)
router.patch("/:threadId/:commentId/edit", editComment)

module.exports = router;
