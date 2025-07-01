const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require("path");
const verifyToken = require("../../middleware/verifyToken");
const { createPost, getAllPosts, getAllFollowingPosts, updatePost, deletePost } = require('../../controllers/post');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
});

// To accept only images and videos
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|webm|ogg|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images and videos are allowed!'), false);
    }
};

// File size limit
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: fileFilter
});

// Middleware to handle multer errors
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size too large. Maximum size is 10MB.' });
        }
        return res.status(400).json({ message: 'File upload error: ' + err.message });
    } else if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
};

// POST a new post
router.post('/', verifyToken, upload.single("media"), handleMulterError, createPost);

// GET all posts (admin or public)
router.get('/all', verifyToken, getAllPosts);

// GET all posts from following users (user's personalized feed)
router.get('/', verifyToken, getAllFollowingPosts);

// PUT a post by ID
router.put('/:id', verifyToken, upload.single("media"), updatePost);

// DELETE a post by ID
router.delete('/:id', verifyToken, deletePost);

module.exports = router;