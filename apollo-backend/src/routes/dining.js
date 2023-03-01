const express = require('express');
const mongoose = require('mongoose');
const mongodb = require('mongodb');

// controller
const DiningInfo = require('../models/dining-model');

const router = express.Router();

// ex: /api/course/getAll
router.get('/getAll', async function (req, res) {

  const allDiningHalls = await DiningInfo.find();
  console.log("Responding with all DiningHalls");
  res.json(allDiningHalls);

});

// ex: /api/course/get/CS30700
router.get('/get/:dining', async (req, res) => {
  const param = req.params.dining;
  const diningReturned = await DiningInfo.findOne({ name: param });
  console.log(diningReturned);
  res.json(diningReturned);
 });

module.exports = router;
