const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  
    title: {
      type: String,
      required: true,
    },
  
    description: {
      type: String,
      required: true,
      default: ""
    },

    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserInfo"
    },

    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserInfo",
        default: []
    }],
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema)