const mongoose = require('mongoose')
const express = require('express');

// controller
const { getCourse } = require('../controllers/course-controller');
const CourseInfo = require('../models/course-model');

const router = express.Router();

// ex: /api/course/getAll
router.get('/getAll', async function (req, res) {

  const allCourses = await CourseInfo.find();
  res.json(allCourses);

  // let collection = await (mongoose.connection).collection("course");
  // let results = await collection.find().toArray();

  // return res.send(results).status(200);

});

// ex: /api/course/get/:SubjectId/:Number
router.get('/get/:courseName', async function (req, res) {

  const idk = "CS30700";
  const courseReturned = await CourseInfo.findOne({ Course: idk });
  res.json(courseReturned);

});

module.exports = router;
