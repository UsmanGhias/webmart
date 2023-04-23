const express = require('express');
const router = express.Router();
// Middleware to verify the JSON web token
const verifyToken = require('../../middleware/verifyToken');
const {likePost, unlikePost} = require("../../controllers/like");

// @route   POST api/like/
// @desc    Like a post
// @access  Private
router.post('/', verifyToken, likePost);

// @route   DELETE api/like/
// @desc    Unlike a post
// @access  Private
router.delete('/', verifyToken, unlikePost);

module.exports = router;
