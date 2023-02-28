const CourseInfo = require('../models/course-model');

const getAllCourses = async (req, res) => {
  const { courseName } = req.body;

  try {
    // const courses = await CourseInfo.getAll(courseName);

    // res.status(200).json({courseName});

  } catch (error) {
    res.status(400).json({error: error.message});
  }

}

module.exports = { getAllCourses }
