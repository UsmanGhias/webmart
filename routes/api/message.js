const express = require("express");
const router = express.Router();
const verifyToken = require('../../middleware/verifyToken');
const {newMessage, getMessagesOfConversation} = require("../../controllers/message");

router.post("/", newMessage);

router.get("/:conversationId", getMessagesOfConversation);

module.exports = router;