const User = require('../models/User');

exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const user = await User.findById(userId);
        if (!user.cart.includes(productId)) {
            user.cart.push(productId);
            await user.save();
        }

        res.status(200).json({ message: 'Added to cart', cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const user = await User.findById(userId);
        user.cart = user.cart.filter(id => id.toString() !== productId);
        await user.save();

        res.status(200).json({ message: 'Removed from cart', cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const user = await User.findById(userId).populate('cart', 'name price media desc');
        
        res.status(200).json({ cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
