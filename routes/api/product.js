const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require("path");
const verifyToken = require("../../middleware/verifyToken");
const {
    createProduct,
    getAllProducts,
    getProductById,
    getProductByCategory,
    updateProduct,
    deleteProduct,
    addToFavorites,
    removeFromFavorites,
    getFavorites
} = require('../../controllers/product');

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, "product-" + uniqueSuffix + ext);
    }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase()) &&
        allowedTypes.test(file.mimetype);
    if (isValid) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed (jpg, jpeg, png, gif, webp)"), false);
    }
};

// Multer upload middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB image
    fileFilter: fileFilter
});

// Error handler middleware
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError || err) {
        return res.status(400).json({ message: err.message });
    }
    next();
};

// Create a product
router.post('/', verifyToken, upload.single("media"), handleMulterError, createProduct);

// Get all products
router.get('/', getAllProducts);

// Favorites routes
router.post('/favorite', verifyToken, addToFavorites);
router.delete('/favorite', verifyToken, removeFromFavorites);
router.get('/favorites/list', verifyToken, getFavorites);

// Category route (specific path before ID route)
router.get('/category/:category', getProductByCategory);

// Get a single product by ID
router.get('/:id', getProductById);

// Update a product (with image)
router.put('/:id', verifyToken, upload.single("media"), handleMulterError, updateProduct);

// Delete a product
router.delete('/:id', verifyToken, deleteProduct);

module.exports = router;
