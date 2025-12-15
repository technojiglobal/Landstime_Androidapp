// ==================== controllers/UserController.js ====================
import User from '../UserModels/User.js';   
import { auth } from '../Config/Firebase.js';
class UserController {
  // Register new user
  async register(req, res) {
    try {
      const { name, phone, countryCode, email, role, firebaseUid } = req.body;

      // Validation
      if (!name || !phone || !email || !role || !firebaseUid) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required'
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [
          { email: email.toLowerCase() },
          { phone },
          { firebaseUid }
        ]
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User already exists with this email, phone, or Firebase UID'
        });
      }

      // Verify Firebase user exists
      try {
        await auth.getUser(firebaseUid);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Firebase UID'
        });
      }

      // Create new user
      const user = new User({
        firebaseUid,
        name,
        phone,
        countryCode: countryCode || '+91',
        email: email.toLowerCase(),
        role,
        isPhoneVerified: true // Assuming phone is verified via Firebase
      });

      await user.save();

      // Create custom token
      const customToken = await auth.createCustomToken(firebaseUid);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            firebaseUid: user.firebaseUid,
            name: user.name,
            phone: user.phone,
            countryCode: user.countryCode,
            email: user.email,
            role: user.role,
            isPhoneVerified: user.isPhoneVerified,
            isEmailVerified: user.isEmailVerified
          },
          customToken
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message
      });
    }
  }

  // Login user
  async login(req, res) {
    try {
      const { firebaseUid } = req.body;

      if (!firebaseUid) {
        return res.status(400).json({
          success: false,
          message: 'Firebase UID is required'
        });
      }

      // Find user
      const user = await User.findOne({ firebaseUid });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found. Please register first.'
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      // Create custom token
      const customToken = await auth.createCustomToken(firebaseUid);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            firebaseUid: user.firebaseUid,
            name: user.name,
            phone: user.phone,
            countryCode: user.countryCode,
            email: user.email,
            role: user.role,
            isPhoneVerified: user.isPhoneVerified,
            isEmailVerified: user.isEmailVerified,
            profilePicture: user.profilePicture
          },
          customToken
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error.message
      });
    }
  }

  // Get user profile
  async getProfile(req, res) {
    try {
      const user = req.user;

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user._id,
            firebaseUid: user.firebaseUid,
            name: user.name,
            phone: user.phone,
            countryCode: user.countryCode,
            email: user.email,
            role: user.role,
            isPhoneVerified: user.isPhoneVerified,
            isEmailVerified: user.isEmailVerified,
            profilePicture: user.profilePicture,
            createdAt: user.createdAt
          }
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch profile',
        error: error.message
      });
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const userId = req.user._id;
      const { name, email, profilePicture } = req.body;

      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email.toLowerCase();
      if (profilePicture) updateData.profilePicture = profilePicture;

      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: {
            id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture
          }
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: error.message
      });
    }
  }

  // Verify phone number
  async verifyPhone(req, res) {
    try {
      const { phone, firebaseUid } = req.body;

      const user = await User.findOneAndUpdate(
        { firebaseUid },
        { isPhoneVerified: true },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Phone verified successfully',
        data: { isPhoneVerified: true }
      });
    } catch (error) {
      console.error('Phone verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Phone verification failed',
        error: error.message
      });
    }
  }

  // Delete user account
  async deleteAccount(req, res) {
    try {
      const userId = req.user._id;
      const firebaseUid = req.user.firebaseUid;

      // Delete from MongoDB
      await User.findByIdAndDelete(userId);

      // Delete from Firebase
      try {
        await auth.deleteUser(firebaseUid);
      } catch (error) {
        console.error('Firebase user deletion error:', error);
      }

      res.status(200).json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete account',
        error: error.message
      });
    }
  }
}

export default new UserController();
