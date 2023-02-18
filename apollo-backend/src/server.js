/**
 * server.js
 *
 * Connects to MongoDB and starts the server.
 *
 * @authors: jebeene
 *
 * @source: https://linuxhint.com/get-started-with-mern-stack/#:~:text=To%20get%20started%20with%20the,js%20application
 */

// express is web framework for Node.js
const express = require('express');

// cors installs a Node.js package that allows cross origin resource sharing
const cors = require('cors');

// mongoose helps with server-database communication
const mongoose = require('mongoose');
require('dotenv').config();

//express router setup
const userRoutes = require('./routes/user');

// express app
const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

//middleware
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
});

// routes
app.use('/api/user', userRoutes);

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