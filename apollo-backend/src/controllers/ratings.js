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
      const {title, semester, professor, stars, coursename, description, username, userPfp, difficulty, enjoyability, attendanceRequired} = req.body;
  
      // verify user exists before we let them create a rating
      const userExist = await User.findOne({ username });
      if (!userExist) {
        throw Error(username + " is not a registered user!");
      }

      const newRating = new Rating({title, semester, professor, stars, coursename, description, username, userPfp, difficulty, enjoyability, attendanceRequired});
      await newRating.save();
      
      const review = await Rating.find({ coursename });
      res.status(201).json(review);

    } catch (err) {
        console.log(err.message);
        res.status(409).json({ message: err.message });
    }
}

/*
 * api request: /api/ratings/:{coursename}
 * response: all reviews associated with course 'coursename'
 */
const getCourseReviews = async(req, res) => {
    console.log("asdqwe" + req.params);
    const { coursename } = req.params;

    try {
      const courseExist = await Course.findOne({ Course: coursename });
      const courseReviews = await Rating.find({ coursename });
  
      // verify course exists
      if (!courseExist) {
        throw Error(coursename + " does not exist!");
      }
      console.log("bla blabl " + courseReviews)
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

/* UPDATE */

/* upvoteReview
 *
 * API Requ: /api/rating/:ratingId/upvote
 * Req Body: username
 * Response: updated thread object or JSON error message
 *
 * Status Codes:
 *   OK = 200
 *   NOT FOUND = 404
 *   DOUBLE UPVOTE = 209
 *   DOWNVOTE UPVOTE = 210
 */
const upvoteReview = async (req, res) => {

  try {
    const { id } = req.params;
    const { username } = req.body;

    const userExist = await User.findOne({ username });
    if (!userExist) {
      throw Error(username + " is not a registered user!");
    }

    const review = await Rating.findById(id);
    if (!review) {
      throw Error("Review " + id + " was not found! Check that the ID provided is correct.");
    }

    const isUpvoted = review.upvotes.get(username);
    const isDownvoted = review.downvotes.get(username);
    var doubleUpvoteAttempt = false;
    var downvoteUpvoteAttempt = false;

    if (isUpvoted) {
      console.log(username + " removed their upvote from this thread!");
      review.upvotes.delete(username);
      doubleUpvoteAttempt = true;
    } else if (isDownvoted) {
      console.log(username + " changed their downvote to an upvote!");
      review.downvotes.delete(username);
      review.upvotes.set(username, true);
      downvoteUpvoteAttempt = true;
    } else {
      console.log(username + " upvoted this thread!");
      review.upvotes.set(username, true);
    }

    const updatedReview = await Rating.findByIdAndUpdate(
      id,
      { upvotes: review.upvotes, downvotes: review.downvotes },
      { new: true }
    );

    console.log("upvotes: " + updatedReview.upvotes.size);
    if (doubleUpvoteAttempt) {
      res.status(209).json(updatedReview);
    } else if (downvoteUpvoteAttempt) {
      res.status(210).json(updatedReview);
    } else {
      res.status(200).json(updatedReview);
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

/* downvoteReview
 *
 * API Requ: /api/ratings/:ratingId/downvote
 * Req Body: username
 * Response: updated thread object or JSON error message
 *
 * Status Codes:
 *   OK = 200
 *   NOT FOUND = 404
 *   DOUBLE DOWNVOTE = 209
 *   DOWNVOTE UPVOTE = 210
 */
const downvoteReview = async (req, res) => {

  try {
    const { id } = req.params;
    const { username } = req.body;

    const userExist = await User.findOne({ username });
    if (!userExist) {
      throw Error(username + " is not a registered user!");
    }

    const review = await Rating.findById(id);
    console.log(review);
    if (!review) {
      throw Error("Review " + id + " was not found! Check that the ID provided is correct.");
    }
    const isDownvoted = review.downvotes.get(username);
    const isUpvoted = review.upvotes.get(username);
    var doubleDownvoteAttempt = false;
    var downvoteUpvoteAttempt = false;

    if (isDownvoted) {
      console.log(username + " removed their downvote from this thread!");
      review.downvotes.delete(username);
      doubleDownvoteAttempt = true;
    } else if (isUpvoted) {
      console.log(username + " changed their upvote to a downvote!");
      review.upvotes.delete(username);
      review.downvotes.set(username, true);
      downvoteUpvoteAttempt = true;
    } else {
      console.log(username + " downvoted this thread!");
      review.downvotes.set(username, true);
    }

    const updatedReview = await Rating.findByIdAndUpdate(
      id,
      { upvotes: review.upvotes, downvotes: review.downvotes },
      { new: true }
    );

    console.log("downvotes: " + updatedReview.downvotes.size);
    if (doubleDownvoteAttempt) {
      res.status(209).json(updatedReview);
    } else if (downvoteUpvoteAttempt) {
      res.status(210).json(updatedReview);
    } else {
      res.status(200).json(updatedReview);
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

/* DELETE */

  //delete review

  const deleteReview = async (req, res) => {
    //console.log("hi");
    try {
      const { id } = req.params;
      const rating = await Rating.findById(id);
      if (!rating) {
        throw Error("Rating " + id + " was not found! Check that the ID provided is correct.");
      }
      const deletedReview = await Rating.findByIdAndDelete(id);
      res.status(200).json(deletedReview);
  
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

module.exports = {createReview, getCourseReviews, getCourseAverageRating, upvoteReview, downvoteReview, deleteReview};
