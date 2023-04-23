// Import the jsonwebtoken module
const jwt = require('jsonwebtoken');

// Export the middleware function
module.exports = (req, res, next) => {
  // Get the token from the header
  // console.log(req.header('Authorization'))
  const token = req.header('Authorization').split(' ')[1];

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT secret not set');
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
