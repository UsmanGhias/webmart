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
        const userId = req.params.id || req.query.userId;
        const currentUserId = req.user ? req.user.id : null;
        
        const profile = await User.findById(userId)
          .select("fullName email profilePic followers following business favorites createdAt")
          .populate({
            path: "business",
            select: "name desc address insta fb tiktok"
          });

        if (!profile) {
          return res.status(404).json({ msg: "User not found" });
        }

        // Get user's posts
        const posts = await Post.find({ user: userId })
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

        // Get user's products
        const products = await Product.find({ user: userId })
          .populate("user", "fullName profilePic")
          .sort({ createdAt: -1 });

        // Serialize posts
        const serializedPosts = posts.map(post => {
          const obj = post.toObject();
          obj.likes = obj.likes.map(id => id._id ? id._id.toString() : id.toString());
          return obj;
        });

        // Check if current user is following this profile
        let isFollowing = false;
        let isOwnProfile = false;
        
        if (currentUserId) {
          isFollowing = profile.followers.some(follower => follower.toString() === currentUserId);
          isOwnProfile = userId === currentUserId;
        }

        const profileData = {
          _id: profile._id,
          fullName: profile.fullName,
          email: profile.email,
          profilePic: profile.profilePic
            ? `http://localhost:3001${profile.profilePic}`
            : "https://via.placeholder.com/120",
          followers: profile.followers,
          following: profile.following,
          business: profile.business,
          favorites: profile.favorites,
          createdAt: profile.createdAt,
          posts: serializedPosts,
          products,
          isFollowing,
          isOwnProfile,
          followerCount: profile.followers.length,
          followingCount: profile.following.length,
          postCount: posts.length,
          productCount: products.length
        };

        res.json(profileData);
      } catch (err) {
        console.error("Error in getProfileById:", err.message);
        if (err.kind === "ObjectId") {
          return res.status(400).json({ msg: "Invalid user ID" });
        }
        res.status(500).json({ message: "Server error" });
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

    // Follow a user
    async followUser(req, res) {
      try {
        const currentUserId = req.user.id;
        const targetUserId = req.params.id;

        // Can't follow yourself
        if (currentUserId === targetUserId) {
          return res.status(400).json({ msg: "You cannot follow yourself" });
        }

        // Check if target user exists
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
          return res.status(404).json({ msg: "User not found" });
        }

        // Check if already following
        const currentUser = await User.findById(currentUserId);
        if (currentUser.following.includes(targetUserId)) {
          return res.status(400).json({ msg: "Already following this user" });
        }

        // Add to following list of current user
        await User.findByIdAndUpdate(currentUserId, {
          $addToSet: { following: targetUserId }
        });

        // Add to followers list of target user
        await User.findByIdAndUpdate(targetUserId, {
          $addToSet: { followers: currentUserId }
        });

        res.json({ msg: "User followed successfully" });
      } catch (error) {
        console.error("Follow error:", error);
        res.status(500).json({ msg: "Server error" });
      }
    },

    // Unfollow a user
    async unfollowUser(req, res) {
      try {
        const currentUserId = req.user.id;
        const targetUserId = req.params.id;

        // Can't unfollow yourself
        if (currentUserId === targetUserId) {
          return res.status(400).json({ msg: "You cannot unfollow yourself" });
        }

        // Check if target user exists
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
          return res.status(404).json({ msg: "User not found" });
        }

        // Check if currently following
        const currentUser = await User.findById(currentUserId);
        if (!currentUser.following.includes(targetUserId)) {
          return res.status(400).json({ msg: "Not following this user" });
        }

        // Remove from following list of current user
        await User.findByIdAndUpdate(currentUserId, {
          $pull: { following: targetUserId }
        });

        // Remove from followers list of target user
        await User.findByIdAndUpdate(targetUserId, {
          $pull: { followers: currentUserId }
        });

        res.json({ msg: "User unfollowed successfully" });
      } catch (error) {
        console.error("Unfollow error:", error);
        res.status(500).json({ msg: "Server error" });
      }
    },
  }
}