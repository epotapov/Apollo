const express = require('express');

//controller functions
const { signupUser, loginUser } = require('../controllers/user-controller');

const router = express.Router();

//login route
router.post('login', () => {});

//signup route
router.post('/signup', () => {});

module.exports = router;