const Product = require('../models/Product');
const User = require("../models/User");
const path = require('path');
const fs = require('fs');

// Create new product
exports.createProduct = async (req, res) => {
    try {
        const { user, name, desc, material, price, quantity, category } = req.body;

        if (!user || !name || !desc || !material || !price || !quantity || !category) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Product image is required." });
        }

        const userExists = await User.findById(user);
        if (!userExists) {
            return res.status(404).json({ message: "User not found." });
        }

        const mediaPath = `/uploads/${req.file.filename}`;
        const newProduct = new Product({
            user,
            name,
            desc,
            media: mediaPath,
            material,
            price,
            quantity,
            category
        });

        await newProduct.save();
        res.status(201).json({ message: "Product created successfully", product: newProduct });

    } catch (error) {
        console.error("Error creating product:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId).populate("user", "fullName profilePic");
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (err) {
        console.error("Failed to fetch product:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, desc, material, price, quantity, category } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (req.user.id !== product.user.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (req.file) {
            if (product.media) {
                const oldPath = path.join(__dirname, "..", "public", product.media);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            product.media = `/uploads/${req.file.filename}`;
        }

        product.name = name || product.name;
        product.desc = desc || product.desc;
        product.material = material || product.material;
        product.price = price || product.price;
        product.quantity = quantity || product.quantity;
        product.category = category || product.category;

        await product.save();

        res.status(200).json({ message: "Product updated", product });

    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Failed to update product" });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (product.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to delete this product' });
        }

        if (product.media) {
            const filePath = path.join(__dirname, '..', 'public', product.media);
            fs.unlink(filePath, err => {
                if (err) console.error('Failed to delete media file:', err.message);
            });
        }

        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Product deleted successfully' });

    } catch (err) {
        console.error('Error deleting product:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProductByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        const products = await Product.find({ category });

        res.status(200).json(products);
    } catch (err) {
        console.error("Failed to fetch by category:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("user", "fullName profilePic favorites");
        res.status(200).json(products);
    } catch (err) {
        console.error("Failed to fetch products:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.addToFavorites = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) return res.status(400).json({ message: "Product ID is required" });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.favorites.includes(productId)) {
            user.favorites.push(productId);
            await user.save();
        }

        return res.json({ favorites: user.favorites });
    } catch (err) {
        console.error("Add to favorites error:", err.message);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.removeFromFavorites = async (req, res) => {
    try {
        const { productId } = req.query;
        if (!productId) return res.status(400).json({ message: "Product ID is required" });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.favorites = user.favorites.filter(id => id.toString() !== productId);
        await user.save();

        return res.json({ favorites: user.favorites });
    } catch (err) {
        console.error("Remove from favorites error:", err.message);
        return res.status(500).json({ message: "Server error" });
    }
};

// Get all favorite products of the user
exports.getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("favorites");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user.favorites);
    } catch (err) {
        console.error("Get favorites error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};
