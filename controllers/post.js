const Post = require('../models/post');
const User = require("../models/User");

// Create a new post
exports.createPost = async (req, res) => {
  const { user, image, caption } = req.body;

  // // Validate that the user field is a valid ObjectId
  // if (!mongoose.Types.ObjectId.isValid(user)) {
  //   return res.status(400).json({ message: 'Invalid user ID' });
  // }

  try {
    const newPost = await Post.create({
      user,
      image,
      caption,
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to get all posts
exports.getAllPosts = (req, res) => {
  Post.find()
    .populate('user', 'name profilePic')
    .populate('likes', 'name')
    .populate({
      path: 'comments', model: 'Comment',
      populate: {path: 'user', model: 'User', select: 'name'}
    })
    .sort({ createdAt: -1 })
    .then(posts => {
      res.json(posts);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error getting posts' });
    });
};

// Function to get all posts
exports.getAllFollowingPosts = (req, res) => {
  const userId = req.user.id;
  // Find the user document for the current user
  User.findById(userId, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error getting user' });
    } else {
      // Find all the posts of the users that the current user follows
      Post.find({ user: { $in: user.following } })
        .populate('user', 'name profilePic')
        .populate('likes', 'name')
        .populate({
          path: 'comments', model: 'Comment',
          populate: { path: 'user', model: 'User', select: 'name' }
        })
        .sort({ createdAt: -1 })
        .then(posts => {
          res.json(posts);
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: 'Error getting posts' });
        });
    }
  });
};