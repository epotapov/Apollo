/**
 * group.js
 *
 * Group routes.
 *
 * @author jebeene
 */

const mongoose = require('mongoose')
const express = require('express');
const mongodb = require('mongodb');

const Group = require('../models/group-model');
const { getAllGroups, getGroup, createGroup, updateGroup, joinGroup, leaveGroup, deleteGroup, getGroupMembers } = require('../controllers/group-controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// get req for all groups
router.route("/").get(getAllGroups);

// get req for specific group
router.route("/:groupId").get(getGroup);

// post req for new group
router.route("/create").post(protect, createGroup);

// put req for updating group
router.route("/update/:groupId").put(protect, updateGroup);

// patch to join
router.route("/join/:groupId").patch(protect, joinGroup);

// patch to leave
router.route("/leave/:groupId").patch(protect, leaveGroup);

// delete req for group
router.route("/delete/:groupId").patch(protect, deleteGroup);

// get req for members
router.route("/members/:groupId").get(protect, getGroupMembers);

module.exports = router;