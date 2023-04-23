const express = require('express');
const router = express.Router();
const verifyToken = require("../../middleware/verifyToken");
const {createPost, getAllPosts, getAllFollowingPosts} = require('../../controllers/post');

// POST a new post
router.post('/', createPost);

// GET all posts
router.get('/all', verifyToken, getAllPosts);

router.get('/', verifyToken, getAllFollowingPosts);

module.exports = router;