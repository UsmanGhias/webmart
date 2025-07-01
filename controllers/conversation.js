const Conversation = require("../models/Conversation");
const User = require("../models/User");

// Create new conversation
exports.createConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] }
    }).populate('members', 'fullName profilePic');

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    // Create new conversation
    const newConversation = new Conversation({
      members: [senderId, receiverId],
    });

    const savedConversation = await newConversation.save();
    const populatedConversation = await Conversation.findById(savedConversation._id)
      .populate('members', 'fullName profilePic');

    res.status(201).json(populatedConversation);
  } catch (err) {
    console.error('Create conversation error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get user's conversations
exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const conversations = await Conversation.find({
      members: { $in: [userId] },
    }).populate('members', 'fullName profilePic')
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (err) {
    console.error('Get conversations error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get specific conversation between two users
exports.getConversation = async (req, res) => {
  try {
    const { firstUserId, secondUserId } = req.params;
    
    const conversation = await Conversation.findOne({
      members: { $all: [firstUserId, secondUserId] },
    }).populate('members', 'fullName profilePic');
    
    res.status(200).json(conversation);
  } catch (err) {
    console.error('Get conversation error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};