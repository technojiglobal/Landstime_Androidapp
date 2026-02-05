// Backend/UserRoutes/UserRoute.js
import express from 'express';
import { 
  sendOTP, 
  verifyOTP, 
  resendOTP, 
  registerUser, 
  loginUser, 
  checkPhoneExists,
  testFast2SMS
} from '../UserControllers/Usercontroller.js';
// 🔽 ADD
import multer from "multer";
import path from "path";
import { verifyToken } from "../UserMiddleware/UserMiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
} from "../UserControllers/Usercontroller.js";
import { deleteProfileImage } from "../UserControllers/Usercontroller.js";
import fs from "fs";

if (!fs.existsSync("uploads/profile")) {
  fs.mkdirSync("uploads/profile", { recursive: true });
}

// 🔽 ADD (inline multer config)
// ✅ MODIFIED: Use memory storage for Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image")) cb(null, true);
    else cb(new Error("Only images allowed"));
  },
});



const router = express.Router();

// OTP Routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/check-phone',checkPhoneExists);
router.post('/test-fast2sms', testFast2SMS);

// Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
// 🔽 ADD

// 🔽 ADD
router.get("/profile", verifyToken, getUserProfile);

router.put(
  "/profile",
  verifyToken,
  upload.single("profileImage"),
  updateUserProfile
);

// ADD THIS TEMPORARILY for debugging
router.get('/debug-profile', verifyToken, async (req, res) => {
  console.log('🔍 DEBUG - req.user:', req.user);
  console.log('🔍 DEBUG - req.user.name:', req.user.name);
  console.log('🔍 DEBUG - typeof req.user.name:', typeof req.user.name);
  
  return res.json({
    success: true,
    user: req.user,
    nameType: typeof req.user.name,
    nameValue: req.user.name
  });
});
// ✅ NEW: Delete profile image route


router.delete("/profile/image", verifyToken, deleteProfileImage);

export default router;