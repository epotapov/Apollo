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
const connectDB = require("./config/db");
connectDB();

const path = require('path')

//express router setup
const userRoutes = require('./routes/user');
const courseRoutes = require('./routes/course');
const groupRoutes = require('./routes/group');
const diningHallRoutes = require('./routes/dining');
const threadRoutes = require('./routes/thread');
const ratingRoutes = require('./routes/ratings');
const chatRoutes = require('./routes/chat');
const messageRoutes = require('./routes/message');

// express app
const app = express();
const port = process.env.PORT || 5001;
const http = require('http').Server(app);

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
app.use('/api/group', groupRoutes);
app.use('/api/dining', diningHallRoutes);
app.use('/pictures', express.static(path.join(__dirname, '../profile_pictures')));
app.use('/pdfs', express.static(path.join(__dirname, '../course_info_docs')));
app.use("/api/thread", threadRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// server running
const server = app.listen(port, console.log(`Server running on PORT ${port}...`.yellow.bold));

// connect to socket.io
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData.user._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
      console.log("message recieved");
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData.user._id);
  });
});