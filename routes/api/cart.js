const express = require('express');
const router = express.Router();
const { addToCart, removeFromCart, getCart } = require('../../controllers/cart');
const verifyToken = require('../../middleware/verifyToken');

router.post('/', verifyToken, addToCart);
router.delete('/', verifyToken, removeFromCart);
router.get('/', verifyToken, getCart);

module.exports = router;
