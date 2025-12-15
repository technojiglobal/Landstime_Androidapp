import express from 'express';
import UserController from '../UserControllers/Usercontroller.js';
import { verifyFirebaseToken } from '../UserMiddleware/UserMiddleware.js';

const router = express.Router();

// Public routes
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // In production, you would send actual OTP via SMS service (Twilio, etc.)
    // For now, return success (client handles Firebase OTP)
    res.status(200).json({
      success: true,
      message: 'OTP sending handled by Firebase',
      verificationId: `temp-${Date.now()}` // Placeholder
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp, verificationId } = req.body;
    
    // Firebase handles actual verification on client side
    // This endpoint is for future backend OTP verification
    res.status(200).json({
      success: true,
      message: 'OTP verification handled by Firebase client-side'
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP'
    });
  }
});

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/profile', verifyFirebaseToken, UserController.getProfile);
router.put('/profile', verifyFirebaseToken, UserController.updateProfile);
router.delete('/account', verifyFirebaseToken, UserController.deleteAccount);

export default router;