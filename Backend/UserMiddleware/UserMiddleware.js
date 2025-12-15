import { auth } from '../Config/Firebase.js';
import User from '../UserModels/User.js';

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const idToken = authHeader.split('Bearer ')[1];

    // Verify Firebase token
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Find user in database
    const user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    req.user = user;
    req.firebaseUser = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};
