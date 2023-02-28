const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new mongoose.Schema({

  Course: {
    type: String
  },

  Title: {
    type: String
  },

  CreditHours: {
    type: Number
  },

  Description: {
    type: String
  }
});

module.exports = mongoose.model('CourseInfo', courseSchema);
