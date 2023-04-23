const User = require("../models/User");
// const { validationResult } = require("express-validator");
const multer = require("multer");
const fs = require("fs");
const express = require('express');

// const validateProfileInput = require("../validation/profile");
// const validateExperienceInput = require("../validation/experience");
// const validateEducationInput = require("../validation/education");

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

    async getAllProfiles(req, res) {
      try {
        const profiles = await Profile.find()
          .populate("user", ["name", "avatar"]);
        res.json(profiles);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
    },

    // Get profile by handle
    async getProfileByHandle(req, res) {
      try {
        const profile = await Profile.findOne({handle: req.params.handle})
          .populate(
            "user",
            ["name", "avatar"]
          );

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

        // Updated
        profile = await User.updateOne(
          {
            name: name,
            website: website,
            bio: bio,
            email: email,
            phoneNumber: phoneNumber,
            gender: gender
          }
        );

        // await profile.save();
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    },

    async addExperience(req, res) {
      const {errors, isValid} = validateExperienceInput(req.body);

      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }

      try {
        const profile = await Profile.findOne({user: req.user.id});

        profile.experience.unshift(req.body);

        await profile.save();

        return res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    },

    async deleteExperience(req, res) {
      try {
        const profile = await Profile.findOne({user: req.user.id});

        // Get remove index
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        return res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    },

    async addEducation(req, res) {
      const {errors, isValid} = validateEducationInput(req.body);

      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }

      try {
        const profile = await Profile.findOne({user: req.user.id});

        profile.education.unshift(req.body);

        await profile.save();

        return res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    },

    async deleteEducation(req, res) {
      try {
        const profile = await Profile.findOne({user: req.user.id});

        // Get remove index
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);

        await profile.save();

        return res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    },

    async deleteUserAndProfile(req, res) {
      try {
        // Remove profile
        await Profile.findOneAndRemove({user: req.user.id});
        // Remove user
        await User.findOneAndRemove({_id: req.user.id});

        res.json({msg: 'User deleted'});
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