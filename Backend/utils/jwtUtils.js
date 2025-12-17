// Backend/utils/jwtUtils.js
import jwt from 'jsonwebtoken';

// Generate JWT Access Token
export const generateToken = (userId) => {
  const token = jwt.sign(
    { userId: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
  
  return token;
};

// Generate Refresh Token (optional - for future use)
export const generateRefreshToken = (userId) => {
  const refreshToken = jwt.sign(
    { userId: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );
  
  return refreshToken;
};

// Verify JWT Token
export const verifyJWT = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};