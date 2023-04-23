const express = require('express');
const router = express.Router();
// Middleware to verify the JSON web token
const verifyToken = require('../../middleware/verifyToken');
const {addComment, deleteComment} = require("../../controllers/comment");

// @route   POST api/comments/
// @desc    Add a comment
// @access  Private
router.post('/', verifyToken, addComment);

// @route   DELETE api/comments/
// @desc    Delete a comment
// @access  Private
router.delete('/', verifyToken, deleteComment);

module.exports = router;
