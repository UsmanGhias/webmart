const express = require("express");
const router = express.Router();
const { uploadMedia } = require("../../controllers/media");
const upload = require("../../middleware/multer");

router.post("/", upload.single("media"), uploadMedia);

module.exports = router;
