// controllers/PostController.js

const Post = require('../models/Post');
const Notification = require('../models/Notification');

exports.getNotificationsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'name')
      .populate('post', 'image')
      .populate('sourceUser', 'name profilePic');

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting notifications' });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findById(notificationId);
    notification.read = true;

    await notification.save()

    res.json("Successfully marked notification as read");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error marking notification as read!' });
  }
};