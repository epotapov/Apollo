const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema for section. sections are within courses
const sectionSchema = mongoose.Schema({
  Section: {
    type: String
  },

  Days: {
    type: String
  },

  StartTime: {
    type: String
  },

  EndTime: {
    type: String
  },

  Location: {
    type: String
  },

  Instructor: {
    type: String
  },

  InstructorEmail: {
    type: String
  }

}, { timestamps: true });

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
  },
  
  Professor_Description: {
     type: String
  },
  
  Information_Document: [{
    type: Array
  }],

  Information_Resource: [{
    type: Array
  }],

  TypicallyOffered: {
    type: String
  },

  Sections: {
    type: [sectionSchema],
    default: [],
  },

  Pairings: {
    type: Map,
    of: Number,
    default: new Map(),
  }
});

const courseSearchSchema = new mongoose.Schema({
  Course: {
    type: String
  },

  Title: {
    type: String
  }, 
}, { timestamps: true });

module.exports = mongoose.model('CourseSearch', courseSearchSchema)
module.exports = mongoose.model('Course', courseSchema);
