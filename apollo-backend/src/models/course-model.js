const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new mongoose.Schema({

  number: {
    type: Number
  },

  subjectId: {
    type: String
  },

  title: {
    type: String
  },

  creditHours: {
    type: Number
  },

  description: {
    type: String
  }
});

module.exports = mongoose.model('CourseInfo', courseSchema);
