const User = require("../models/User");
const Post = require("../models/Post");
const Product = require("../models/Product");
// const { validationResult } = require("express-validator");
const multer = require("multer");
require("fs");
const express = require('express');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${file.originalname.substring(file.originalname.lastIndexOf("."))
      }`
    );
  },
});
const upload = multer({ storage });

module.exports = {
  ProfileController: {
    // @route     GET api/profile
    // @desc      Get current user's profile
    // @access    Private
    async getProfile(req, res) {
      try {
        const profile = await User.findById(req.user.id)
          .select("fullName email profilePic posts followers following business favorites")
          .populate({
            path: "business",
            select: "name desc address insta fb tiktok"
          });

        if (!profile) {
          return res.status(400).json({ msg: "There is no profile for this user" });
        }

        const posts = await Post.find({ user: req.user.id })
          .populate("user", "fullName profilePic")
          .populate("likes", "fullName")
          .populate({
            path: "comments",
            model: "Comment",
            populate: {
              path: "user",
              model: "User",
              select: "fullName profilePic"
            }
          })
          .sort({ createdAt: -1 });

        const products = await Product.find({ user: req.user.id })
          .populate("user", "fullName profilePic")
          .sort({ createdAt: -1 });

        const serializedPosts = posts.map(post => {
          const obj = post.toObject();
          obj.likes = obj.likes.map(id => id._id ? id._id.toString() : id.toString());
          return obj;
        });

        const profileData = {
          ...profile._doc,
          profilePic: profile.profilePic
            ? `http://localhost:3001${profile.profilePic}`
            : "https://via.placeholder.com/120",
          posts: serializedPosts,
          products
        };

        return res.json(profileData);
      } catch (err) {
        console.error("Error in getProfile:", err.message);
        return res.status(500).json({ message: "Server error" });
      }
    },


    // controllers/profile.js
    async uploadProfilePic(req, res) {
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "Image not uploaded!" });
      }

      const imagePath = `/uploads/${file.filename}`;
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      user.profilePic = imagePath;
      await user.save();

      res.json({
        message: "Profile picture updated successfully",
        imageUrl: `http://localhost:3001${imagePath}`,
      });
    },


    // Get profile by ID
    async getProfileById(req, res) {
      try {
        const profile = await User.findOne({
          _id: req.query.userId,
        });

        if (!profile)
          return res.status(400)
            .json({ msg: "There is no profile for this user" });

        res.json(profile);
      } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
          return res.status(400).json({ msg: "Profile not found" });
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
            .json({ msg: "There is no profile for this user" });

        res.json(profile);
      } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
          return res.status(400).json({ msg: "Profile not found" });
        }
        res.status(500).send("Server Error");
      }
    },


    // @route     POST api/profile
    // @desc      Create or update a user's profile
    // @access    Private
    async postProfile(req, res) {
      const {
        fullName,
        // email,
      } = req.body;

      try {
        let profile = await User.findOne({ _id: req.user.id });
        if (!profile) {
          return res.status(400)
            .json({ msg: "There is no profile for this user" });
        }

        // Check if email already exists in the database
        // const existingUser = await User.findOne({ email: email });
        // console.log(existingUser._id, profile._id);
        // if (existingUser && existingUser._id.toString() !==
        // profile._id.toString()) {
        // return res.status(400).json({ msg: "Email already exists" });
        // }

        // Update user's profile information
        profile.fullName = fullName;
        // profile.email = email;

        await profile.save();
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    },

    async getUsersProfile(req, res) {
      const { q } = req.query;
      const regex = new RegExp(q, 'i');
      const users = await User.find({ fullName: regex });
      res.json(users);
    },
  }
}