/**
 * chat-model.js
 *
 * Chat model.
 *
 * @author jebeene
 */

const mongoose = require("mongoose");

// schema for chats
const chatModel = mongoose.Schema({
    chatName: {
        type: String,
        trim: true
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
}, {timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);
