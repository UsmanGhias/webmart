const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.user.id);
    
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    }
    
    req.user = decoded.user;
    req.user.role = user.role;
    next();
  } catch (err) {
    console.error('Admin auth error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = adminAuth; 