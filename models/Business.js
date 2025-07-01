const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    desc: String,
    address: String,
    insta: String,
    fb: String,
    tiktok: String,
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

module.exports = mongoose.model('Business', businessSchema);
