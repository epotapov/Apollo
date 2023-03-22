const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({

    Username: {
        type: String
    },

    Comment: {
        type: String
    }
});

module.exports = mongoose.model('Comment', commentSchema);
