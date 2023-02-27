const CourseInfo = require('../models/course-model');

const getAllCourses = async (req, res) => {
  const { number, subjectId } = req.body;

  try {
    const course = await CourseInfo.getAll(subjectId, courseNumber);

    res.status(200).json({subjectId, number});

  } catch (error) {
    res.status(400).json({error: error.message});
  }

}

module.exports = { getAllCourses }
