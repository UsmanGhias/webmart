const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/verifyToken');
const { followUser, unfollowUser } = require('../../controllers/follow');

// Follow a user
router.post("/follow", verifyToken, followUser);

// Unfollow a user
router.delete("/unfollow", verifyToken, unfollowUser);

module.exports = router;
