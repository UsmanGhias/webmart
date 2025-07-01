const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const adminController = require('../controllers/admin');

// Admin Dashboard Stats
router.get('/dashboard', adminAuth, adminController.getDashboardStats);

// User Management
router.get('/users', adminAuth, adminController.getAllUsers);
router.delete('/users/:id', adminAuth, adminController.deleteUser);
router.put('/users/:id/make-admin', adminAuth, adminController.makeUserAdmin);

// Product Management
router.get('/products', adminAuth, adminController.getAllProducts);
router.delete('/products/:id', adminAuth, adminController.deleteProduct);
router.put('/products/:id', adminAuth, adminController.updateProduct);

// Post Management
router.get('/posts', adminAuth, adminController.getAllPosts);
router.delete('/posts/:id', adminAuth, adminController.deletePost);

module.exports = router; 