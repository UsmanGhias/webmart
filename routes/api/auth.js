// routes/api/auth.js
const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../../controllers/auth");

// @route   POST api/auth/signup
// @desc    Register user
// @access  Public
router.post("/signup", registerUser);

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", loginUser);

module.exports = router;
