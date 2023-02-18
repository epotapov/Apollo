/**
 * server.js
 *
 * Connects to MongoDB and starts the server.
 *
 * @authors: jebeene
 *
 * @source: https://linuxhint.com/get-started-with-mern-stack/#:~:text=To%20get%20started%20with%20the,js%20application
 */

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// express app
const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// routes
app.get('/', (req, res) => {
  res.json({mssg: 'testing 123'})
})

// listen for requests
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

// connect to MongoDB
const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})


