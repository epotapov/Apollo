const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseGradesSchema = new mongoose.Schema({

    'CourseID': {
        type: String
    },

    'A+': {
        type: Number
    },

    'A': {
        type: Number
    },

    'A-': {
        type: Number
    },

    'B+': {
        type: Number
    },

    'B': {
        type: Number
    },

    'B-': {
        type: Number
    },

    'C+': {
        type: Number
    },

    'C': {
        type: Number
    },

    'C-': {
        type: Number
    },

    'D+': {
        type: Number
    },

    'D': {
        type: Number
    },

    'D-': {
        type: Number
    },

    'F': {
        type: Number
    }

});

module.exports = mongoose.model('CourseGrades', courseGradesSchema);
