/**
 * chat-model.js
 *
 * Chat model.
 *
 * @author jebeene
 * @source https://github.com/piyush-eon/mern-chat-app
 */

const mongoose = require("mongoose");

// schema for chats
const chatSchema = mongoose.Schema({
    chatName: {
        type: String,
        trim: true
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    // array of user ids pulled from UserInfo collection
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserInfo"
    }],
    // latest message shows up as a preview in the chat list
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserInfo"
    },
}, {timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);
