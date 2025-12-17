// Backend/UserRoutes/UserRoute.js
import express from 'express';
import { 
  sendOTP, 
  verifyOTP, 
  resendOTP, 
  registerUser, 
  loginUser, 
  checkPhoneExists
} from '../UserControllers/Usercontroller.js';

const router = express.Router();

// OTP Routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/check-phone',checkPhoneExists);

// Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;