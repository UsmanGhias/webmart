const express = require("express");
const router = express.Router();
const verifyToken = require('../../middleware/verifyToken');
const { 
    createConversation, 
    getUserConversations, 
    getConversation 
} = require("../../controllers/conversation");

// Create new conversation
router.post("/", verifyToken, createConversation);

// Get user's conversations
router.get("/", verifyToken, getUserConversations);

// Get conversation between two users
router.get("/:firstUserId/:secondUserId", getConversation);

module.exports = router;