const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new mongoose.Schema({
  
    Title: {
      type: String
    },
  
    Description: {
      type: String
    },

    Members: {
      type: Array
    },
    
});

module.exports = mongoose.model('Group', groupSchema)