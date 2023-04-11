/**
 * chat.js
 *
 * Route file for chats.
 *
 * @author jebeene
 * @source https://github.com/piyush-eon/mern-chat-app
 */

// requires
const express = require("express");
const { accessChat, fetchChats, createGroupChat, removeFromGroup, addToGroup, renameGroup } = require("../controllers/chatControllers");

const router = express.Router();

/* POST */
router.post("/", accessChat);
router.post("/group", createGroupChat);

/* GET */
router.get("/", fetchChats);

/* PUT */
router.put("rename", renameGroup);
router.put("/groupremove", removeFromGroup);
router.put("/groupadd", addToGroup);

module.exports = router;
