const express = require('express');
const router = express.Router();
const { 
    createOrder, 
    getUserOrders, 
    updateOrderStatus, 
    getOrderDetails 
} = require('../../controllers/order');
const verifyToken = require('../../middleware/verifyToken');

// POST /api/orders - Create new order
router.post('/', verifyToken, createOrder);

// GET /api/orders - Get user's orders
router.get('/', verifyToken, getUserOrders);

// GET /api/orders/:orderId - Get single order details
router.get('/:orderId', verifyToken, getOrderDetails);

// PUT /api/orders/:orderId/status - Update order status
router.put('/:orderId/status', verifyToken, updateOrderStatus);

module.exports = router; 