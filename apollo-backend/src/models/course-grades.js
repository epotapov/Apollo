const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseGradesSchema = new mongoose.Schema({

    CourseID: {
        type: String
    },

    A_plus: {
        type: Number
    },

    A: {
        type: Number
    },

    A_minus: {
        type: Number
    },

    B_plus: {
        type: Number
    },

    B: {
        type: Number
    },

    B_minus: {
        type: Number
    },

    C_plus: {
        type: Number
    },

    C: {
        type: Number
    },

    C_minus: {
        type: Number
    },

    D_plus: {
        type: Number
    },

    D: {
        type: Number
    },

    D_minus: {
        type: Number
    },

    F: {
        type: Number
    }

});

module.exports = mongoose.model('CourseGrades', courseGradesSchema);
