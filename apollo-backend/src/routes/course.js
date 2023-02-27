const mongoose = require('mongoose')
const express = require('express');

// controller
const { getCourse } = require('../controllers/course-controller');
const courseModel = require('../models/course-model');

const router = express.Router();

// ex: /api/course/getAll
router.get('/getAll', async function (req, res) {

  const data = await courseModel.find();
  res.json(data);

  // let collection = await (mongoose.connection).collection("course");
  // let results = await collection.find().toArray();

  // return res.send(results).status(200);

});

// ex: /api/course/get/:SubjectId/:Number
router.get('/get/:subjectId/:courseNumber', async function (req, res) {

  const id = String(req.params.productID);
  const courseNumber = Number(req.params.CourseNumber);
  const course = courseModel.find(course => course.SubjectId === id)

});

module.exports = router;
