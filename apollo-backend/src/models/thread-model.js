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

  userPfp : {
    type: String,
    required: true,
    default: "default"
  }

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

    tag: {
      type: Object,
      required: true,
    },

    isProfThread: {
      type: Boolean,
      required: true,
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
    },

    comments: {
      type: [commentSchema],
      default: [],
    },

    subscribed: {
      type: Map,
      of: String,
      default: new Map(),
    },

    userPfp : {
      type: String,
      required: true,
      default: "default"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Thread", threadSchema);
