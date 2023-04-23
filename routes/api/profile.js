const express = require("express");
const router = express.Router();
// Middleware to verify the JSON web token
const passport = require("passport")
const verifyToken = require('../../middleware/verifyToken');
const {ProfileController} = require("../../controllers/profile");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

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

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get("/all", ProfileController.getAllProfiles);

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get("/handle/:handle", ProfileController.getProfileByHandle);

// @route   GET api/profile/user
// @desc    Get profile by user ID
// @access  Public
router.get("/user", ProfileController.getProfileById);

router.get("/email", ProfileController.getProfileByEmail);

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
  "/update",
  verifyToken,
  ProfileController.postProfile
);

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  ProfileController.addExperience
);

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  ProfileController.addEducation
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  ProfileController.deleteExperience
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  ProfileController.deleteEducation
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  ProfileController.deleteUserAndProfile
);


router.get("/search", ProfileController.getUsersProfile)

module.exports = router;
