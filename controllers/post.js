const Post = require('../models/Post');
const User = require("../models/User");
const path = require('path');
const fs = require('fs');

// Create new post
exports.createPost = async (req, res) => {
  try {
    const { user, desc } = req.body;

    if (!user || !desc) {
      return res.status(400).json({
        message: "Description is required."
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Media file is required."
      });
    }

    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    const mediaPath = `/uploads/${req.file.filename}`;
    const newPost = new Post({
      user,
      desc,
      media: mediaPath,
    });

    await newPost.save();

    try {
      let posts = await Post.find({ user })
        .populate('user', 'fullName profilePic')
        .populate('likes', 'fullName')
        .populate({
          path: 'comments',
          model: 'Comment',
          populate: {
            path: 'user',
            model: 'User',
            select: 'fullName profilePic'
          }
        })
        .sort({ createdAt: -1 });

      // Serialize likes to strings
      posts = posts.map(post => {
        const obj = post.toObject();
        obj.likes = obj.likes.map(id => id._id ? id._id.toString() : id.toString());
        return obj;
      });

      res.json(posts);
    } catch (error) {
      console.error("Error showing posts:", error.message);
      res.status(500).json({ message: error.message });
    }

  } catch (error) {
    console.error("Error creating post:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    let posts = await Post.find()
      .populate('user', 'fullName profilePic email')
      .populate('likes', 'fullName')
      .populate({
        path: 'comments',
        model: 'Comment',
        populate: {
          path: 'user',
          model: 'User',
          select: 'fullName profilePic'
        }
      })
      .sort({ createdAt: -1 });

    // Serialize likes to strings
    posts = posts.map(post => {
      const obj = post.toObject();
      obj.likes = obj.likes.map(id => id._id ? id._id.toString() : id.toString());
      return obj;
    });

    res.json(posts);
  } catch (error) {
    console.error("Error fetching all posts:", error);
    res.status(500).json({ message: 'Error getting posts' });
  }
};

// Get posts from followed users only (user feed)
exports.getAllFollowingPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Include user's own posts + following users' posts
    const userIds = [...user.following, userId];

    let posts = await Post.find({ user: { $in: userIds } })
      .populate('user', 'fullName profilePic email')
      .populate('likes', 'fullName')
      .populate({
        path: 'comments',
        model: 'Comment',
        populate: {
          path: 'user',
          model: 'User',
          select: 'fullName profilePic'
        }
      })
      .sort({ createdAt: -1 });

    // Serialize likes to strings
    posts = posts.map(post => {
      const obj = post.toObject();
      obj.likes = obj.likes.map(id => id._id ? id._id.toString() : id.toString());
      return obj;
    });

    res.json(posts);
  } catch (error) {
    console.error("Error fetching followed posts:", error);
    res.status(500).json({ message: 'Error getting posts' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { desc } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (req.user.id !== post.user.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (req.file) {
      if (post.media) {
        const oldPath = path.join(__dirname, "..", "public", post.media);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      post.media = `/uploads/${req.file.filename}`;
    }

    post.desc = desc || post.desc;
    await post.save();

    res.status(200).json({ message: "Post updated", post });

  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update post" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this post' });
    }

    // Delete media file if exists
    if (post.media) {
      const filePath = path.join(__dirname, '..', 'public', post.media);
      fs.unlink(filePath, err => {
        if (err) console.error('Failed to delete media file:', err.message);
      });
    }

    await Post.deleteOne({ _id: post._id });
    res.json({ message: 'Post deleted successfully' });

  } catch (err) {
    console.error('Error deleting post:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
