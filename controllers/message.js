const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

// Create new message
exports.newMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const senderId = req.user.id;

    if (!conversationId || !text) {
      return res.status(400).json({ message: "Conversation ID and text are required" });
    }

    // Verify user is part of the conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.members.includes(senderId)) {
      return res.status(403).json({ message: "Unauthorized to send message to this conversation" });
    }

    const newMessage = new Message({
      conversationId,
      sender: senderId,
      text
    });

    const savedMessage = await newMessage.save();
    
    // Update conversation timestamp
    await Conversation.findByIdAndUpdate(conversationId, { updatedAt: new Date() });

    res.status(201).json(savedMessage);
  } catch (err) {
    console.error('New message error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get messages of a conversation
exports.getMessagesOfConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Verify user is part of the conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.members.includes(userId)) {
      return res.status(403).json({ message: "Unauthorized to view this conversation" });
    }

    const messages = await Message.find({
      conversationId: conversationId,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};