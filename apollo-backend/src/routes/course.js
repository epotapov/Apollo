const mongoose = require('mongoose')
const express = require('express');
const mongodb = require('mongodb');

// controller
const Course = require('../models/course-model');
const CourseSearch = require('../models/course-model')
const CourseGrades = require('../models/course-grades');

const router = express.Router();

// get all user emails that have this course favorited
router.get('/getFavorites/:courseName', async (req, res) => {
  const courseName = req.params.courseName;
  const course = await Course.findOne({ Course: courseName });
  if (!course) {
    throw Error(courseName + " does not exist!");
  }

  res.status(200).json(course.Favorited);
});

// ex: /api/course/getAll
// this only returns the course name and title
router.get('/getAll', async function (req, res) {

  console.time('find');
  const allCourses = await CourseSearch.find({}, 'Course Title');
  console.timeEnd('find')
  console.log("Responding with all courses");
  res.json(allCourses);

});

// ex: /api/course/get/CS30700
// this returns the course object
router.get('/get/:courseName', async (req, res) => {
  const name = req.params.courseName;
  const courseReturned = await Course.findOne({ Course: name });
  console.log(courseReturned);
  res.json(courseReturned);
 });

 router.get('/get/grades/:courseName', async (req, res) => {
  const name = req.params.courseName;
  const courseReturnedGrades = await CourseGrades.findOne({ CourseID: name });
  console.log(courseReturnedGrades);
  res.json(courseReturnedGrades);
 });

 router.get('/getPairings/:courseName', async (req, res) => {
  const name = req.params.courseName;
  try {
    const course  = await Course.findOne({ Course: name });
    if (!course) {
      throw Error(courseName + " does not exist!");
    }

    res.status(200).json(course.Pairings);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
 });

 router.patch('/create_pairing/:courseName', async (req, res) => {
  const courseName = req.params.courseName;
  const coursePair = req.body.course;
  const difficulty = req.body.difficulty;
  
  try {
    const course = await Course.findOne({ Course: courseName });
    if (!course) {
      throw Error(courseName + " does not exist!");
    }

    const pairings = course.Pairings;
    pairings.set(coursePair, difficulty);
    course.Pairings = pairings;
    await course.save();
    res.status(200).json(course);
  }
  catch (err) {
    res.status(400).json({ msg: err.message });
  }
  });

module.exports = router;
