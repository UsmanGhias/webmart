const express = require("express");
const router = express.Router();
const verifyToken = require('../../middleware/verifyToken');
const {newMessage, getMessagesOfConversation} = require("../../controllers/message");

// Create new message
router.post("/", verifyToken, newMessage);

// Get messages of a conversation
router.get("/:conversationId", verifyToken, getMessagesOfConversation);

module.exports = router;