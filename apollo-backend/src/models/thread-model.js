/**
 * thread-model.js
 *
 * Thread model.
 *
 * @author jebeene
 */

const mongoose = require("mongoose");

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
    },

    downvotes: {
      type: Map,
      of: Boolean,
    },

    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Thread", threadSchema);
