// Import the user model
// const User = require('../models/user');

// POST /api/users/follow
const User = require("../models/User");
exports.followUser = async (req, res) => {
  const userId = req.user.id;
  const { followerUsername } = req.body;

  try {
    const following = await User.findOne({
      email: followerUsername + "@gmail.com"
    });
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.following.includes(following._id)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    user.following.push(following._id);
    following.followers.push(userId);

    await user.save();
    await following.save();

    res.json({ message: 'User followed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.unfollowUser = async (req, res) => {
  const userId = req.user.id;
  const { followingUsername } = req.body;

  try {
    const following = await User.findOne({
      email: followingUsername + "@gmail.com"
    });
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.following.includes(following._id)) {
      return res.status(400).json({ message: 'Not following this user' });
    }

    user.following = user.following.filter((id) => id.toString() !== following._id.toString());
    following.followers = following.followers.filter((id) => id.toString() !== userId.toString());

    await user.save();
    await following.save();

    res.json({ message: 'User unfollowed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
