const express = require('express');
const router = express.Router();
const verifyToken = require("../../middleware/verifyToken");
const { registerBusiness } = require('../../controllers/business');


// Register a business
router.post('/', verifyToken, registerBusiness);

module.exports = router;