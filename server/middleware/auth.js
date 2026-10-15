const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('Auth middleware: No token provided');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'healthwise_secret_key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.log('Auth middleware: User not found for token');
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied. Admin or Doctor privileges required.' });
    }
    next();
  });
};

const doctorAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied. Doctor privileges required.' });
    }
    next();
  });
};

module.exports = { auth, adminAuth, doctorAuth };