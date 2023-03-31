const express = require('express');

const RatingInfo = require('../models/rating-model');
const { createReview, getCourseReviews, getCourseAverageRating, upvoteReview, downvoteReview } = require('../controllers/ratings');
// TODO add method imports


const router = express.Router();

/* CREATE / POST */
router.post("/create", createReview);

/* READ */
router.get("/:coursename", getCourseReviews);
router.get("/:coursename/avgRating", getCourseAverageRating);
// router.get("/:username/threads", verifyToken, getUserThreads);

/* UPDATE */
router.patch("/:id/upvote", upvoteReview);
router.patch("/:id/downvote", downvoteReview);

module.exports = router;
