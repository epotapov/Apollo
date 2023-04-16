/**
 * message-model.js
 *
 * Message model.
 *
 * @author jebeene
 * @source https://github.com/piyush-eon/mern-chat-app
 */

const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserInfo"
    },
    content: {
        type: String,
        trim: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserInfo"
    }],
  },
  { timestamps: true,
    toJSON: {virtuals: true}}
);

module.exports = mongoose.model("Message", messageSchema);