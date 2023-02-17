/**
 * server.js
 *
 * @source: https://www.mongodb.com/languages/mern-stack-tutorial
 */

// To connect with your mongoDB database
// const mongoose = require("mongoose");
// // Connecting to database
// mongoose.connect(
//   "mongodb://localhost:27017/",
//   {
//     dbName: "Apollo",
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   },
//   (err) =>
//     err ? console.log(err) : console.log(
//       "Connected to yourDB-name database")
// );
// const express = require("express");
// const app = express();
// const cors = require("cors");
// console.log("App listen at port 5001");


const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5001;
app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));
// get driver connection
const dbo = require("./db/conn");
 
app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
 
  });
  console.log(`Server is running on port: ${port}`);
});

