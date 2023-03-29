const express = require('express');

const RatingInfo = require('../models/rating-model');
const { createReview, getCourseReviews} = require('../controllers/ratings');
// TODO add method imports


const router = express.Router();

/* CREATE / POST */
router.post("/create", createReview);

/* READ */
router.get("/:courseName", getCourseReviews);
// router.get("/:username/threads", verifyToken, getUserThreads);

module.exports = router;
