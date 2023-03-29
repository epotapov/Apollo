const mongoose = require('mongoose')
const express = require('express');
const mongodb = require('mongodb');

// controller
const Course = require('../models/course-model');
const CourseSearch = require('../models/course-model')
const CourseGrades = require('../models/course-grades');

const router = express.Router();

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

module.exports = router;
