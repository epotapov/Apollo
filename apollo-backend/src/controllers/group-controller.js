/**
 * group-controller.js
 *
 * Group controller. API details are listed in comments above each request.
 *
 * @author jebeene
 */

const mongoose = require('mongoose')

const Group = require('../models/group-model');
const User = require('../models/user-model');

/**
 * get all groups
 * 
 * /api/group/
 * 
 * response: array of groups including id, title, description
 */
const getAllGroups = async (req, res) => {
    try {
        // only return title and description
        const groups = await Group.find({}, {title: 1, description: 1});
        res.status(200).json(groups);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

/**
 * getGroup
 * 
 * /api/group/:groupId 
 * 
 * response: group object including id, title, description, groupAdmin, members
 * 
 */
const getGroup = async (req, res) => {
    const { groupId } = req.params;

    try {
        const group = await Group.findOne({ groupId });
        if (!group) {
            throw new Error("Group not found.");
        }
        res.status(200).json(group);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

/**
 * createGroup
 * 
 * /api/group/create
 * 
 * request: title, description
 * 
 * authorization token required. it is stored in user context.
 * implement something like this for the frontend req:
 * 
 * const config = {
 *   headers: {
 *     "Content-type": "application/json",
 *     Authorization: `Bearer ${user.userToken}`,
 *   },
 * };
 *
 * const { data } = await axios.post(
 *      `http://localhost:5001/api/group/create`,
 *      {
 *          title: {title},
 *          description: {description}
 *      },
 *      config);
 */
const createGroup = async (req, res) => {
    const { title, description } = req.body;
    const token = req.user._id;

    try {
        // check if user is already a group admin
        const admin = await User.findOne({ _id: token });

        if (admin.isGroupAdmin) {
            throw new Error("User is already a group admin for a group.");
        } else {
            // update user to be a group admin
            admin.isGroupAdmin = true;
            await admin.save();
        }

        console.log(admin)
        // create new group
        const newGroup = new Group({ title, description, groupAdmin: token, members: [token] });

        await newGroup.save();
        res.status(201).json(newGroup);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

/**
 * updateGroup
 * 
 * /api/group/update/:groupId
 * 
 * request: title, description
 * 
 * authorization token required. it is stored in user context.
 * implement something like this for the frontend req:
 * 
 * const config = {
 *   headers: {
 *     "Content-type": "application/json",
 *     Authorization: `Bearer ${user.userToken}`,
 *   },
 * };
 *
 * const { data } = await axios.put(
 *      `http://localhost:5001/api/group/update/:groupId`,
 *      {
 *          title: {title},
 *          description: {description}
 *      },
 *      config);
 */
const updateGroup = async (req, res) => {
    const { groupId } = req.params;
    const { title, description } = req.body;
    const token = req.user._id;

    try {
        // check if group exists
        const group = await Group.findOne({ _id: groupId });
        if (!group) {
            throw new Error("Group not found.");
        }

        // check if admin is a user or if admin is this group's admin
        if (!group.groupAdmin.equals(token)) {
            throw Error("The user provided is not authorized to update this group.");
        }

        // update title if provided
        group.title = title;
        // update description if provided
        group.description = description;

        // update group
        const updatedGroup = await Group.findByIdAndUpdate(
            groupId,
            { title: group.title, description: group.description },
            { new: true }
        );

        // send updatedGroup back
        res.status(200).json(updatedGroup);

    } catch (err) {
        if (err instanceof mongoose.Error.CastError) {
            console.log("Check that the ID provided is correct.");
            res.status(400).json({ message: "Check that the ID provided is correct." });
        } else {
            console.log(err.message);
            res.status(404).json({ message: err.message });
        }
    }
}

/**
 * joinGroup
 * 
 * /api/group/join/:groupId
 * 
 * authorization token required. it is stored in user context.
 * implement something like this for the frontend req:
 * 
 * const config = {
 *   headers: {
 *     Authorization: `Bearer ${user.userToken}`,
 *   },
 * };
 *
 * const { data } = await axios.patch(
 *      `http://localhost:5001/api/group/join/:groupId`, config);
 */
const joinGroup = async (req, res) => {
    const { groupId } = req.params;
    const token = req.user._id;

    try {
        // check if group exists
        const group = await Group.findOne({ _id: groupId });
        if (!group) {
            throw new Error("Group not found.");
        }

        // check if user exists and is not already a part of this group
        const user = await User.findOne({ _id: token });
        if (!user) {
            throw Error("The user provided does not exist or is not authorized to update this group.");
        }

        if (group.members.includes(user._id)) {
            throw new Error("User is already a member of the group");
        }
        const updatedGroup = await Group.findByIdAndUpdate(
            groupId,
            {
                $addToSet: { members: user._id },
            },
            {
                new: true,
            })

        // send updatedGroup back
        res.status(200).json(updatedGroup);

    } catch (err) {
        if (err instanceof mongoose.Error.CastError) {
            console.log("Check that the ID provided is correct.");
            res.status(400).json({ message: "Check that the ID provided is correct." });
        } else {
            console.log(err.message);
            res.status(404).json({ message: err.message });
        }
    }
}

/**
 * leaveGroup
 * 
 * /api/group/leave/:groupId
 * 
 * authorization token required. it is stored in user context.
 * implement something like this for the frontend req:
 * 
 * const config = {
 *   headers: {
 *     Authorization: `Bearer ${user.userToken}`,
 *   },
 * };
 *
 * const { data } = await axios.patch(
 *      `http://localhost:5001/api/group/leave/:groupId`, config);
 */
const leaveGroup = async (req, res) => {
    const { groupId } = req.params;
    const token = req.user._id;

    try {
        // check if group exists
        const group = await Group.findOne({ _id: groupId });
        if (!group) {
            throw new Error("Group not found.");
        }

        // check if user exists and is not already a part of this group
        const user = await User.findOne({ _id: token });
        if (!user) {
            throw Error("The user provided does not exist.");
        }

        // is user a member of the group or is the user the group admin?
        if (!group.members.includes(user._id) || group.groupAdmin.equals(user._id)) {
            throw new Error("Cannot remove user because they are not a member of the group or are the group admin.");
        }

        // remove user
        const updatedGroup = await Group.findByIdAndUpdate(
            groupId,
            {
                $pull: { members: user._id },
            },
            {
                new: true,
            })

        // send updatedGroup back
        res.status(200).json(updatedGroup);

    } catch (err) {
        if (err instanceof mongoose.Error.CastError) {
            console.log("Check that the ID provided is correct.");
            res.status(400).json({ message: "Check that the ID provided is correct." });
        } else {
            console.log(err.message);
            res.status(404).json({ message: err.message });
        }
    }
}

/**
 * deleteGroup
 * 
 * /api/group/delete/:groupId
 * 
 * authorization token required. it is stored in user context.
 * implement something like this for the frontend req:
 * 
 * const config = {
 *   headers: {
 *     Authorization: `Bearer ${user.userToken}`,
 *   },
 * };
 *
 * const { data } = await axios.patch(
 *      `http://localhost:5001/api/group/delete/:groupId', config);
 */
const deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const token = req.user._id;
        const user = await User.findOne({ _id: token });

        const group = await Group.findOne({ _id: groupId });
        if (!group) {
            throw Error("Group " + groupId + " was not found! Check that the ID provided is correct.");
        }

        // check if user is the group admin
        console.log(group.groupAdmin)
        console.log(user)
        if (!group.groupAdmin.equals(user._id)) {
            throw Error("User is not authorized to delete this group.");
        }

        const deletedGroup = await Group.findByIdAndDelete(groupId);

        // update user to be a group admin
        user.isGroupAdmin = false;
        await user.save();

        res.status(200).json(deletedGroup);

    } catch (err) {
        if (err instanceof mongoose.Error.CastError) {
            console.log("Check that the ID provided is correct.");
            res.status(400).json({ message: "Check that the ID provided is correct." });
        } else {
            console.log(err.message);
            res.status(404).json({ message: err.message });
        }
    }
}

/**
 * getMembers
 * 
 * /api/group/members/:groupId
 * 
 * authorization token required. it is stored in user context.
 * implement something like this for the frontend req:
 * 
 * const config = {
 *   headers: {
 *     Authorization: `Bearer ${user.userToken}`,
 *   },
 * };
 *
 * const { data } = await axios.get(
 *      `http://localhost:5001/api/group/members/:groupId`, config);
 */
const getGroupMembers = async (req, res) => {
    const { groupId } = req.params;
    //const token = req.user._id;

    try {
        const group = await Group.findOne({ groupId })
            .populate('members', 'username email profilePicture');

        if (!group) {
            throw new Error("Group not found.");
        }

        /*const user = User.findOne({ _id: token });
        if (!user) {
            throw new Error("User not found.");
        }*/

        res.status(200).json(group.members);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

module.exports = { getAllGroups, getGroup, createGroup, updateGroup, joinGroup, leaveGroup, deleteGroup, getGroupMembers }