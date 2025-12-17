// Backend/UserMiddleware/UserMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../UserModels/User.js';

// Verify JWT Token Middleware
export const verifyToken = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.userId).select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Attach user to request object
    req.user = user;
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Check if user's phone is verified
export const checkPhoneVerified = (req, res, next) => {
  if (!req.user.isPhoneVerified) {
    return res.status(403).json({
      success: false,
      message: 'Phone number not verified. Please verify your phone first'
    });
  }
  next();
};

// Check if user's email is verified
export const checkEmailVerified = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email not verified. Please verify your email first'
    });
  }
  next();
};

// Check user role (Buyer or Owner)
export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Only ${allowedRoles.join(' or ')} can access this resource`
      });
    }

    next();
  };
};

// Rate limiting middleware for OTP requests
export const otpRateLimit = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Check if IP-based rate limiting is needed
    const clientIP = req.ip || req.connection.remoteAddress;
    
    // You can implement Redis-based rate limiting here for production
    // For now, we'll rely on database checks in the controller

    next();
  } catch (error) {
    console.error('Rate limit middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Request validation middleware
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }
    
    next();
  };
};