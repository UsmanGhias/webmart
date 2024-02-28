const User = require("../models/User");
// const { validationResult } = require("express-validator");
const multer = require("multer");
require("fs");
const express = require('express');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/profile");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${
        file.originalname.substring(file.originalname.lastIndexOf("."))
      }`
    );
  },
});
const upload = multer({storage});

module.exports = {
  ProfileController: {
    // @route     GET api/profile
    // @desc      Get current user's profile
    // @access    Private
    async getProfile(req, res) {
      try {
        const profile = await User.findOne({_id: req.user.id}).select(
          "name email website profilePic bio phoneNumber gender posts followers following");

        if (!profile) {
          return res.status(400)
            .json({msg: "There is no profile for this user"});
        }

        return res.json(profile);
      } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
      }
    },

    async uploadProfilePic(req, res) {
      const file = req.file;
      if (!file) {
        res.status(200).jsonp({
          message: "Image not uploaded!",
        });
      } else {
        const imageContent = `/${file.filename}`;
        const user = await User.findOne({_id: req.user.id});
        if (!user) {
          return res.status(400)
            .json({msg: "There is no profile for this user"});
        }

        user.profilePic = imageContent;
        // Save the updated user record
        user.save((err, updatedUser) => {
          if (err) {
            console.log(err);
            res.status(500).send('Error saving updated user record');
          } else {
            // console.log('Updated user record:', updatedUser);
            res.send('Profile picture updated successfully');
          }
        });
      }

    },

// Get profile by ID
    async getProfileById(req, res) {
      try {
        const profile = await User.findOne({
          _id: req.query.userId,
        });

        if (!profile)
          return res.status(400)
            .json({msg: "There is no profile for this user"});

        res.json(profile);
      } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
          return res.status(400).json({msg: "Profile not found"});
        }
        res.status(500).send("Server Error");
      }
    },

    // Get profile by email
    async getProfileByEmail(req, res) {
      try {
        const profile = await User.findOne({
          email: req.query.username + "@gmail.com",
        });

        if (!profile)
          return res.status(400)
            .json({msg: "There is no profile for this user"});

        res.json(profile);
      } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
          return res.status(400).json({msg: "Profile not found"});
        }
        res.status(500).send("Server Error");
      }
    },


    // @route     POST api/profile
    // @desc      Create or update a user's profile
    // @access    Private
    async postProfile(req, res) {
      const {
        name,
        website,
        bio,
        email,
        phoneNumber,
        gender
      } = req.body;

      try {
        let profile = await User.findOne({_id: req.user.id});
        if (!profile) {
          return res.status(400)
            .json({msg: "There is no profile for this user"});
        }

        // Check if email already exists in the database
        const existingUser = await User.findOne({email: email});
        console.log(existingUser._id, profile._id);
        if (existingUser && existingUser._id.toString() !==
          profile._id.toString()) {
          return res.status(400).json({msg: "Email already exists"});
        }

        // Update user's profile information
        profile.name = name;
        profile.website = website;
        profile.bio = bio;
        profile.email = email;
        profile.phoneNumber = phoneNumber;
        profile.gender = gender;

        // Handling image upload
        const file = req.file;
        if (file) {
          const imageContent = `/${file.filename}`;
          profile.profilePic = imageContent;
        }

        await profile.save();
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    },

    async getUsersProfile(req, res) {
      const {q} = req.query;
      const regex = new RegExp(q, 'i');
      const users = await User.find({name: regex});
      res.json(users);
    },
  }
}