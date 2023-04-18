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
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    const idOfLoggedInUser = req.user._id;

    // find chat containing logged in user and other user
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: idOfLoggedInUser } } },
            { users: { $elemMatch: { $eq: idOfOtherUser } } },
        ],
    })
        .populate("users", "username email profilePicture")
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
            const FullChat = await Chat.findOne({
                _id: createdChat._id
            }).populate("users", "username email profilePicture");;

            res.status(200).send(FullChat);

        } catch (error) {
            res.status(400);
            throw new Error("Error creating chat.");
        }
    }
});

const fetchChats = asyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "username email profilePicture")
            .populate("groupAdmin", "username email profilePicture")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "username profilePicture email",
                });
                res.status(200).send(results);
            });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res
            .status(400)
            .send("More than 2 users are required to form a group chat");
    }

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "username email profilePicture")
            .populate("groupAdmin", "username email profilePicture");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName: chatName,
        },
        {
            new: true,
        }
    )
        .populate("users", "username email profilePicture")
        .populate("groupAdmin", "username email profilePicture");

    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(updatedChat);
    }
});

const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    // check if the requester is admin

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "username email profilePicture")
        .populate("groupAdmin", "username email profilePicture");

    if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(removed);
    }
});

const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    // check if the requester is admin

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(added);
    }
});

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup }