const router = require("express").Router();
const verifyToken = require('../../middleware/verifyToken');
const {newMessage, getMessages, getConversation} = require("../../controllers/conversation");

//new message
router.post("/", newMessage);

//get messages of a user
router.get("/:userId", getMessages);

// get conversation of 2 users
router.get("/find/:firstUserId/:secondUserId", verifyToken, getConversation);

module.exports = router;