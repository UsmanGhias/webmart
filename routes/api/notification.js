const express = require("express")
const router = express.Router()
const verifyToken = require("../../middleware/verifyToken")
const {getNotificationsByUser, markNotificationAsRead} = require("../../controllers/notifications")

router.get("/:userId", verifyToken, getNotificationsByUser);

router.put("/:notificationId", verifyToken, markNotificationAsRead)

module.exports = router;