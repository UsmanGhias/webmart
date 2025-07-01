const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Create new order (COD)
exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity = 1, shippingAddress } = req.body;

        if (!productId || !shippingAddress) {
            return res.status(400).json({ 
                message: 'Product ID and shipping address are required' 
            });
        }

        // Validate shipping address
        const { fullName, phone, address, city, postalCode } = shippingAddress;
        if (!fullName || !phone || !address || !city || !postalCode) {
            return res.status(400).json({ 
                message: 'Complete shipping address is required' 
            });
        }

        // Get product details
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const totalPrice = product.price * quantity;

        // Create order
        const order = new Order({
            user: userId,
            product: productId,
            quantity,
            totalPrice,
            shippingAddress,
            paymentMethod: 'COD'
        });

        await order.save();

        // Remove item from user's cart after successful order
        const user = await User.findById(userId);
        user.cart = user.cart.filter(id => id.toString() !== productId);
        await user.save();

        // Populate order details for response
        const populatedOrder = await Order.findById(order._id)
            .populate('product', 'name price media')
            .populate('user', 'fullName email');

        res.status(201).json({
            message: 'Order placed successfully',
            order: populatedOrder
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const orders = await Order.find({ user: userId })
            .populate('product', 'name price media')
            .sort({ orderDate: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// Update order status (for sellers/admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: 'Invalid status' 
            });
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        ).populate('product', 'name price media')
         .populate('user', 'fullName email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({
            message: 'Order status updated',
            order
        });
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// Get single order details
exports.getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        const order = await Order.findOne({ 
            _id: orderId, 
            user: userId 
        })
        .populate('product', 'name price media desc')
        .populate('user', 'fullName email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Get order details error:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
}; 