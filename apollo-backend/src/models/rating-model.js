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
