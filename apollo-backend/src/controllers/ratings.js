// import mongoose - in this case, we use it for error handling
const mongoose = require("mongoose");

// imports rating model
const Rating = require("../models/rating-model");

// imports user model - used for user verification
const User = require("../models/user-model");

const Course = require("../models/course-model");

/*
 * api request: /api/ratings/create
 * body: coursename, stars, description, username
 * response: all reviews associated with course 'coursename'
 */
const createReview = async (req, res) => {

    console.log(req.body);

    try {
      const {coursename, stars, description, username} = req.body;
  
      // verify user exists before we let them create a thread
      const userExist = await User.findOne({ username });
      if (!userExist) {
        throw Error(username + " is not a registered user!");
      }

      const newRating = new Rating({coursename, stars, description, username});
      await newRating.save();
      
      const review = await Rating.find({ coursename });
      res.status(201).json(review);

    } catch (err) {
        console.log(err.message);
        res.status(409).json({ message: err.message });
    }
}

/*
 * api request: /api/ratings/{coursename}
 * response: all reviews associated with course 'coursename'
 */
const getCourseReviews = async(req, res) => {
    const { coursename } = req.params;
  
    try {
      const courseExist = await Course.findOne({ Course: coursename });
      const courseReviews = await Rating.find({ coursename });
  
      // verify course exists
      if (!courseExist) {
        throw Error(coursename + " does not exist!");
      }
  
      res.status(200).json(courseReviews);
    } catch (err) {
      console.log(err.message);
      res.status(404).json({ message: err.message });
    }
}

/*
 * api request: /api/ratings/{coursename}/avgRating
 * response: 
 */

const getCourseAverageRating = async(req, res) => {
  const {coursename} = req.params;

  try {
    // courseExist is the individual course object
    const courseExist = await Course.findOne({ Course: coursename });

    // courseReviews is all reviews associated with coursename
    const courseReviews = await Rating.find({ coursename });

    // verify course exists
    if (!courseExist) {
      throw Error(coursename + " does not exist!");
    }

    total = 0;

    for (i of courseReviews) {
      total += i.stars;
    }

    total /= courseReviews.length;

    // courseExist.Average_Rating = total;

    res.status(200).json(total);
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ message: err.message });
  }
}

module.exports = {createReview, getCourseReviews, getCourseAverageRating};
