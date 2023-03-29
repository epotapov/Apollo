const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema({
    coursename: {
        type: String
    },
    
    stars: {
        type: Number
    },

    description: {
        type: String
    },

    username: {
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model("Rating", ratingSchema);
