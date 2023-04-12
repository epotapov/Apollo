/**
 * chat-controller.js
 *
 * Controller file for chats.
 *
 * @author jebeene
 * @source https://github.com/piyush-eon/mern-chat-app
 */

const asyncHandler = require("express-async-handler");
const Chat = require("../models/chat-model");
const User = require("../models/user-model");

const accessChat = asyncHandler(async (req, res) => {
    const { idOfOtherUser } = req.body;

    if (!idOfOtherUser) {
        res.status(400);
        throw new Error("No user id provided.");
    }

    const idOfLoggedInUser = req.user._id;

    // find chat containing logged in user and other user
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {users: {$elemMatch: {$eq: idOfLoggedInUser}}},
            {users: {$elemMatch: {$eq: idOfOtherUser}}},
        ],
    })
    .populate("users", "-password")
    .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "username profilePicture email",
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [idOfLoggedInUser, idOfOtherUser],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");;

            res.status(200).send(FullChat);

        } catch (error) {
            res.status(400);
            throw new Error("Error creating chat.");
        }
    }
});

module.exports = { accessChat }