const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const diningSchema = new mongoose.Schema({

  name: {
    type: String
  },

  address: {
    type: String
  },

  mealSwipe: {
    type: Boolean
  },

  mobileOrder: {
    type: Boolean
  },

  description: {
    type: String
  },

  link: {
    type: String
  },

  hours: {
    type: String
  }
  
});

module.exports = mongoose.model('DiningInfo', diningSchema);
