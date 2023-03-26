const mongoose = require('mongoose')
const express = require('express');
const mongodb = require('mongodb');

// controller
const CourseInfo = require('../models/course-model');
const CourseGrades = require('../models/course-grades');

const router = express.Router();

// ex: /api/course/getAll
router.get('/getAll', async function (req, res) {

  const allCourses = await CourseInfo.find();
  console.log("Responding with all courses");
  res.json(allCourses);

});

// ex: /api/course/get/CS30700
router.get('/get/:courseName', async (req, res) => {
  const name = req.params.courseName;
  const courseReturned = await CourseInfo.findOne({ Course: name });
  const courseReturnedGrades = await CourseGrades.findOne({ Course: name });
  console.log(courseReturned);
  console.log(courseReturnedGrades);
  res.json(courseReturned);
 });

module.exports = router;
