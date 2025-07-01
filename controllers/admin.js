const User = require('../models/User');
const Product = require('../models/Product');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Delete user's products and posts
    await Product.deleteMany({ user: req.params.id });
    await Post.deleteMany({ user: req.params.id });
    await Comment.deleteMany({ user: req.params.id });
    
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('user', 'fullName email').sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Get all products error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, desc, price, quantity, category } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    product.name = name || product.name;
    product.desc = desc || product.desc;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.category = category || product.category;
    
    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'fullName email')
      .populate('comments')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Get all posts error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    // Delete associated comments
    await Comment.deleteMany({ post: req.params.id });
    
    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalComments = await Comment.countDocuments();
    
    // Recent activity
    const recentUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(5);
    const recentProducts = await Product.find().populate('user', 'fullName').sort({ createdAt: -1 }).limit(5);
    const recentPosts = await Post.find().populate('user', 'fullName').sort({ createdAt: -1 }).limit(5);
    
    res.json({
      stats: {
        totalUsers,
        totalProducts,
        totalPosts,
        totalComments
      },
      recentActivity: {
        recentUsers,
        recentProducts,
        recentPosts
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Make user admin
exports.makeUserAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    user.role = 'admin';
    await user.save();
    
    res.json({ msg: 'User promoted to admin successfully', user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Make user admin error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
}; 