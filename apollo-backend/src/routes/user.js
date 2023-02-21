const express = require('express');

//controller functions
const { signupUser, loginUser } = require('../controllers/user-controller');

const router = express.Router();

//login route - no method is currently executed here bc () => {}
router.post('/login', () => {});

//signup route - signupUser is the "method" that is executed
router.post('/signup', signupUser);

module.exports = router;
