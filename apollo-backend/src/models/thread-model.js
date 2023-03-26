/**
 * thread-model.js
 *
 * Thread model.
 *
 * @author jebeene
 */

const mongoose = require("mongoose");

// schema for comments. comments are within threads.
const commentSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

}, { timestamps: true });

// schema for threads
const threadSchema = mongoose.Schema({
    courseName: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    upvotes: {
      type: Map,
      of: Boolean,
      default: {},
    },

    downvotes: {
      type: Map,
      of: Boolean,
      default: {},
    },

    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Thread", threadSchema);
