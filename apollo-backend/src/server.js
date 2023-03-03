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
const courseRoutes = require('./routes/course');
const diningHallRoutes = require('./routes/dining');

// express app
const app = express();
const port = process.env.PORT || 5001;

app.use(cors());

//middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
});

// attaches all the routes that we attached to the router
app.use('/api/user', userRoutes); // when we fire request to /api/user then check userRoutes for the route
app.use('/api/course', courseRoutes);
app.use('/api/dining', diningHallRoutes);
app.use(express.static('./profile_pictures'));

// connect to MongoDB
mongoose.connect(process.env.ATLAS_URI)
  .then(() => {
    // listen for requests only if DB is connected
    app.listen(port, () => {
      console.log("MongoDB database connection established successfully");
      console.log(`listening on port: ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// export so we can use db elsewhere
// const db = mongoose.connection;
// export default db;
