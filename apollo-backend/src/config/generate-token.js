/**
 * generate-token.js
 *
 * Generates a JWT token.
 *
 * @author jebeene
 * @source https://github.com/piyush-eon/mern-chat-app
 */

const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;