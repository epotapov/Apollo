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
const { accessChat } = require("../controllers/chat-controller");

const router = express.Router();

/* POST */
router.post("/", accessChat);
// router.post("/group", createGroupChat);

// /* GET */
// router.get("/", fetchChats);

// /* PUT */
// router.put("/rename", renameGroup);
// router.put("/groupRemove", removeFromGroup);
// router.put("/groupAdd", addToGroup);

module.exports = router;
