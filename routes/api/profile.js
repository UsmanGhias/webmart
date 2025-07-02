const express = require("express");
const router = express.Router();
// Middleware to verify the JSON web token
require("passport");
const verifyToken = require('../../middleware/verifyToken');
const { ProfileController } = require("../../controllers/profile");
const multer = require('multer');
const upload = multer({ dest: 'public/uploads' });

// @route   GET api/profile
// @desc    Get current user's profile
// @access  Private
router.get(
  "/",
  verifyToken,
  ProfileController.getProfile
);

// @route   GET api/profile
// @desc    Get current user's profile
// @access  Private
router.post(
  "/uploadProfilePic",
  verifyToken,
  upload.single('profile_pic'),
  ProfileController.uploadProfilePic
);

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
  "/update",
  verifyToken,
  upload.single('profile_pic'),
  ProfileController.postProfile
);

// @route   GET api/profile/user
// @desc    Get profile by user ID
// @access  Public
router.get("/user", ProfileController.getProfileById);

// @route   GET api/profile/user/:id
// @desc    Get profile by user ID (with auth for follow status)
// @access  Public/Private
router.get("/user/:id", verifyToken, ProfileController.getProfileById);

router.get("/email", ProfileController.getProfileByEmail);

router.get("/search", ProfileController.getUsersProfile);

// @route   POST api/profile/follow/:id
// @desc    Follow a user
// @access  Private
router.post("/follow/:id", verifyToken, ProfileController.followUser);

// @route   DELETE api/profile/unfollow/:id
// @desc    Unfollow a user
// @access  Private
router.delete("/unfollow/:id", verifyToken, ProfileController.unfollowUser);

module.exports = router;
