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
const { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require("../controllers/chat-controller");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/* POST */
router.route("/").post(protect, accessChat);
router.route("/group").post(protect, createGroupChat);

/* GET */
router.route("/").get(protect, fetchChats);

/* PUT */
router.route("/rename").put(protect, renameGroup);
router.route("/groupRemove").put(protect, removeFromGroup);
router.route("/groupAdd").put(protect, addToGroup);

module.exports = router;