// Backend/UserControllers/Usercontroller.js
import Otp from '../UserModels/Otp.js';
import User from '../UserModels/User.js';
import { generateOTP, sendOTPviaSMS, isValidPhone, isValidOTP } from '../utils/otpService.js';
import { generateToken } from '../utils/jwtUtils.js';


// Add at the top after imports
console.log('🔧 Environment Check:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
console.log('FAST2SMS:', process.env.FAST2SMS ? '✅ Set' : '❌ Missing');
console.log('FAST2SMS length:', process.env.FAST2SMS?.length);
console.log('---');

const DEVELOPMENT_MODE = true; // Set to false in production

// ==================== SEND OTP ====================
export const sendOTP = async (req, res) => {
  console.log('\n📨 ===== SEND OTP REQUEST =====');
  console.log('Request body:', req.body);
  
  try {
    const { phone, countryCode = '+91' } = req.body;
    console.log('📱 Phone:', phone, 'Country Code:', countryCode);

    // Validate phone number
    if (!phone || !isValidPhone(phone)) {
      console.log('❌ Invalid phone number');
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit phone number'
      });
    }
    console.log('✅ Phone number valid');

    // Check rate limiting - max 3 OTP requests in 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const recentOtpCount = await Otp.countDocuments({
      phone: phone,
      createdAt: { $gte: thirtyMinutesAgo }
    });

    if (recentOtpCount >= 3) {
      return res.status(429).json({
        success: false,
        message: 'Too many OTP requests. Please try again after 30 minutes'
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to database
    const otpDoc = new Otp({
      phone: phone,
      countryCode: countryCode,
      otp: otp,
      attempts: 0
    });

    await otpDoc.save();

    // Send OTP via SMS
    // const smsResult = await sendOTPviaSMS(phone, otp, countryCode);

    // if (smsResult.success) {
    //   return res.status(200).json({
    //     success: true,
    //     message: 'OTP sent successfully to your phone number',
    //     data: {
    //       phone: phone,
    //       expiresIn: '10 minutes'
    //     }
    //   });
    // } else {
    //   // Delete OTP from database if SMS failed
    //   await Otp.deleteOne({ _id: otpDoc._id });
      
    //   return res.status(500).json({
    //     success: false,
    //     message: 'Failed to send OTP. Please try again',
    //     error: smsResult.message
    //   });
    // }



     // Send OTP via SMS (or skip in development)
    let smsResult;

    console.log('📱 Attempting to send OTP to:', phone, 'Country:', countryCode);
    console.log('🔧 DEVELOPMENT_MODE:', DEVELOPMENT_MODE);

    
    if (DEVELOPMENT_MODE) {
      // Development mode - just log OTP, don't send SMS
      console.log('🔐 DEV MODE - OTP:', otp, 'for phone:', phone);
      smsResult = { success: true };
    } else {
      // Production mode - send real SMS
      console.log('📤 Calling Fast2SMS API...');
      smsResult = await sendOTPviaSMS(phone, otp, countryCode);
      console.log('📥 Fast2SMS Result:', smsResult);
    }

    if (smsResult.success) {
  console.log('✅ OTP sent successfully');
  console.log('===== END SEND OTP =====\n');
  return res.status(200).json({
    success: true,
    message: 'OTP sent successfully to your phone number',
    data: {
      phone: phone,
      expiresIn: '10 minutes',
      ...(DEVELOPMENT_MODE && { devOtp: otp })
    }
  });
} else {
  console.log('❌ Failed to send OTP:', smsResult);
  await Otp.deleteOne({ _id: otpDoc._id });
  
  return res.status(500).json({
    success: false,
    message: 'Failed to send OTP. Please try again',
    error: smsResult.message
  });
}

  } catch (error) {
    console.error('Error in sendOTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};


// ==================== VERIFY OTP ====================
export const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // Validate inputs
    if (!phone || !isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit phone number'
      });
    }

    if (!otp || !isValidOTP(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 4-digit OTP'
      });
    }

    // Find the most recent OTP for this phone number
    const otpDoc = await Otp.findOne({
      phone: phone,
      isVerified: false
    }).sort({ createdAt: -1 });

    if (!otpDoc) {
      return res.status(404).json({
        success: false,
        message: 'OTP not found or has expired. Please request a new OTP'
      });
    }

    // Check if OTP has expired (10 minutes)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    if (otpDoc.createdAt < tenMinutesAgo) {
      await Otp.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP'
      });
    }

    // Check maximum attempts (5 attempts)
    if (otpDoc.attempts >= 5) {
      await Otp.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({
        success: false,
        message: 'Maximum verification attempts exceeded. Please request a new OTP'
      });
    }

    // Verify OTP
    if (otpDoc.otp !== otp) {
      // Increment attempts
      otpDoc.attempts += 1;
      await otpDoc.save();

      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${5 - otpDoc.attempts} attempts remaining`
      });
    }

    // // OTP is correct - mark as verified
    // otpDoc.isVerified = true;
    // await otpDoc.save();

    // // Delete all other OTPs for this phone number
    // await Otp.deleteMany({
    //   phone: phone,
    //   _id: { $ne: otpDoc._id }
    // });

    // return res.status(200).json({
    //   success: true,
    //   message: 'Phone number verified successfully',
    //   data: {
    //     phone: phone,
    //     verified: true
    //   }
    // });

// OTP is correct - mark as verified and keep for 30 minutes
otpDoc.isVerified = true;
await otpDoc.save();

// Delete all other OTPs for this phone number (but keep the verified one)
await Otp.deleteMany({
  phone: phone,
  _id: { $ne: otpDoc._id }
});

return res.status(200).json({
  success: true,
  message: 'Phone number verified successfully',
  data: {
    phone: phone,
    verified: true
  }
});




  } catch (error) {
    console.error('Error in verifyOTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// ==================== RESEND OTP ====================
export const resendOTP = async (req, res) => {
  try {
    const { phone, countryCode = '+91' } = req.body;

    // Validate phone number
    if (!phone || !isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit phone number'
      });
    }

    // Check if there's a recent OTP (within last 30 seconds)
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
    const recentOtp = await Otp.findOne({
      phone: phone,
      createdAt: { $gte: thirtySecondsAgo }
    });

    if (recentOtp) {
      return res.status(429).json({
        success: false,
        message: 'Please wait 30 seconds before requesting a new OTP'
      });
    }

    // Delete old OTPs for this phone
    await Otp.deleteMany({ phone: phone });

    // Generate new OTP
    const otp = generateOTP();

    // Save new OTP to database
    const otpDoc = new Otp({
      phone: phone,
      countryCode: countryCode,
      otp: otp,
      attempts: 0
    });

    await otpDoc.save();

    // Send OTP via SMS
    // const smsResult = await sendOTPviaSMS(phone, otp, countryCode);

    // if (smsResult.success) {
    //   return res.status(200).json({
    //     success: true,
    //     message: 'New OTP sent successfully',
    //     data: {
    //       phone: phone,
    //       expiresIn: '10 minutes'
    //     }
    //   });
    // } else {
    //   await Otp.deleteOne({ _id: otpDoc._id });
      
    //   return res.status(500).json({
    //     success: false,
    //     message: 'Failed to send OTP. Please try again'
    //   });
    // }


    // NEW
    // Send OTP via SMS (or skip in development)
    let smsResult;
    
    if (DEVELOPMENT_MODE) {
      // Development mode - just log OTP, don't send SMS
      console.log('🔐 DEV MODE - OTP:', otp, 'for phone:', phone);
      smsResult = { success: true };
    } else {
      // Production mode - send real SMS
      smsResult = await sendOTPviaSMS(phone, otp, countryCode);
    }

    if (smsResult.success) {
      return res.status(200).json({
        success: true,
        message: 'OTP sent successfully to your phone number',
        data: {
          phone: phone,
          expiresIn: '10 minutes',
          ...(DEVELOPMENT_MODE && { devOtp: otp }) // Show OTP in response during dev
        }
      });
    } else {
      await Otp.deleteOne({ _id: otpDoc._id });
      
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP. Please try again',
        error: smsResult.message
      });
    }

  } catch (error) {
    console.error('Error in resendOTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};


// ==================== REGISTER USER ====================
export const registerUser = async (req, res) => {
  try {
    const { name, phone, countryCode = '+91', email, role } = req.body;

    // Validate inputs
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters long'
      });
    }

    if (!phone || !isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit phone number'
      });
    }

    // Better email validation
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
if (!email || !emailRegex.test(email)) {
  return res.status(400).json({
    success: false,
    message: 'Please provide a valid email address'
  });
}

    if (!role || !['Buyer', 'Owner'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid role (Buyer or Owner)'
      });
    }

 // NEW - Check if verified OTP exists and is still valid (within 30 minutes)
// In development mode we skip strict OTP check to make testing easier.
if (!DEVELOPMENT_MODE) {
       
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  const verifiedOtp = await Otp.findOne({
    phone: phone,
    isVerified: true,
    createdAt: { $gte: thirtyMinutesAgo }
  }).sort({ createdAt: -1 });

  console.log('verifiedOtp:', verifiedOtp);

  if (!verifiedOtp) {
    return res.status(400).json({
      success: false,
      message: 'Phone verification expired or not found. Please verify your phone again'
    });
  }
} else {
  console.log('Development mode: skipping OTP verified check for', phone);
}

    // Check if user already exists with this phone
    const existingUserByPhone = await User.findOne({ phone: phone });
    if (existingUserByPhone) {
      return res.status(400).json({
        success: false,
        message: 'User with this phone number already exists'
      });
    }

    // Check if user already exists with this email
    const existingUserByEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const newUser = new User({
      name: name.trim(),
      phone: phone,
      countryCode: countryCode,
      email: email.toLowerCase(),
      role: role,
      isPhoneVerified: true,
      isEmailVerified: false
    });

    await newUser.save();

    // Delete the verified OTP
    await Otp.deleteMany({ phone: phone });
// NEW - Add token (if needed)
// Generate JWT token
const token = generateToken(newUser._id);

return res.status(201).json({
  success: true,
  message: 'User registered successfully',
  data: {
    token: token,
    user: {
      id: newUser._id,
      name: newUser.name,
      phone: newUser.phone,
      email: newUser.email,
      role: newUser.role,
      isPhoneVerified: newUser.isPhoneVerified
    }
  }
});

  } catch (error) {
    console.error('Error in registerUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// ==================== LOGIN USER ====================
export const loginUser = async (req, res) => {
  try {
    const { phone, email, name } = req.body;

    // Validate inputs
    if (!phone || !isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit phone number'
      });
    }

    // Find user
    const user = await User.findOne({ phone: phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first'
      });
    }

    // Verify phone is still verified
    if (!user.isPhoneVerified) {
      return res.status(400).json({
        success: false,
        message: 'Phone number not verified. Please verify your phone'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role,
          isPhoneVerified: user.isPhoneVerified,
          isEmailVerified: user.isEmailVerified
        }
      }
    });

  } catch (error) {
    console.error('Error in loginUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};


// ==================== CHECK PHONE EXISTS ====================
export const checkPhoneExists = async (req, res) => {
  try {
    const { phone } = req.body;

    // Validate phone number
    if (!phone || !isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit phone number'
      });
    }

    // Check if user exists with this phone
    const existingUser = await User.findOne({ phone: phone });

    if (existingUser) {
      return res.status(200).json({
        success: true,
        exists: true,
        message: 'Phone number already registered'
      });
    }

    return res.status(200).json({
      success: true,
      exists: false,
      message: 'Phone number available'
    });

  } catch (error) {
    console.error('Error in checkPhoneExists:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};



// Temporary test endpoint - remove after testing
export const testFast2SMS = async (req, res) => {
  try {
    console.log('🧪 Testing Fast2SMS...');
    console.log('API Key exists:', !!process.env.FAST2SMS);
    console.log('API Key length:', process.env.FAST2SMS?.length);
    console.log('API Key first 10 chars:', process.env.FAST2SMS?.substring(0, 10));
    
    // Test with a dummy number
    const testResult = await sendOTPviaSMS('9999999999', '1234', '+91');
    
    return res.status(200).json({
      success: true,
      keyExists: !!process.env.FAST2SMS,
      keyLength: process.env.FAST2SMS?.length,
      testResult: testResult
    });
  } catch (error) {
    console.error('Test error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};