const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/verifyToken');
const { likePost, unlikePost, cleanupDuplicateLikes } = require('../../controllers/like');

// @route   POST api/like
// @desc    Like a post
// @access  Private
router.post('/', verifyToken, likePost);

// @route   DELETE api/like/:postId
// @desc    Unlike a post
// @access  Private
router.delete('/:postId', verifyToken, unlikePost);

// @route   POST api/like/cleanup
// @desc    Clean up duplicate likes
// @access  Private
router.post('/cleanup', verifyToken, cleanupDuplicateLikes);

module.exports = router;
