const mongoose = require('mongoose');
const { models, model } = require("mongoose");

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    media: {
        type: String,
        required: true
    },
    material: {
        type: String,
        required: true
    },
    price: {
        type: Number,  // ✅ Use Number, not Integer
        required: true
    },
    quantity: {
        type: Number,  // ✅ Use Number, not Integer
        required: true
    },
    category: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Product = models.Product || model('Product', productSchema);

module.exports = Product;
