const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema({
    coursename: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    semester: {
        type: String,
        required: true
    },

    professor: {
        type: String,
        required: true
    },
    
    stars: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    },

    upvotes: {
      type: Map,
      of: Boolean,
      default: new Map(),
    },

    downvotes: {
      type: Map,
      of: Boolean,
      default: new Map(),
    }

}, {timestamps: true});

module.exports = mongoose.model("Rating", ratingSchema);
