// Landstime_Androidapp/Backend/AdminControllers/AdminController.js

import Admin from "../AdminModels/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../UserModels/User.js";
import Subscription from "../UserModels/Subscription.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Add debug logs
    console.log("📧 Login attempt for:", email);

    // 1️⃣ Validate
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2️⃣ Find admin in database (both admin and superadmin are stored in DB)
    const admin = await Admin.findOne({ email });
    console.log("👤 Admin found:", admin ? "YES" : "NO");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found with this email",
      });
    }

    // 3️⃣ Compare password
    console.log("🔐 Comparing passwords...");
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("🔐 Password match:", isMatch ? "YES" : "NO");

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // 4️⃣ Get role from database (should be "admin" or "superadmin")
    const role = admin.role || "admin"; // Default to "admin" if not set
    console.log("👑 Admin role:", role);

    // 5️⃣ Generate JWT with role from database
    const token = jwt.sign(
      { id: admin._id, role: role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: `${role === "superadmin" ? "SuperAdmin" : "Admin"} login successful`,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: role
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



// OLD CODE: (none - this is new)

// NEW CODE:
// ==================== ADMIN LOGOUT ====================
export const adminLogout = async (req, res) => {
  try {
    // Since we're using JWT, logout is handled client-side
    // This endpoint can be used for logging purposes or token blacklisting if needed
    return res.status(200).json({
      success: true,
      message: 'Admin logged out successfully'
    });
  } catch (error) {
    console.error('Error in adminLogout:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};



// ==================== GET ALL USERS FOR ADMIN ====================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'Admin' } })
      .select('-password')
      .sort({ createdAt: -1 });

    // Fetch subscription details for each user
    const usersWithSubscriptions = await Promise.all(
      users.map(async (user) => {
        const userObj = user.toObject();
        
        if (userObj.currentSubscription?.subscriptionId) {
          const subscription = await Subscription.findById(
            userObj.currentSubscription.subscriptionId
          );
          
          if (subscription) {
            userObj.subscriptionDetails = subscription;
          }
        }
        
        return userObj;
      })
    );

    return res.status(200).json({
      success: true,
      data: usersWithSubscriptions
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// ==================== BLOCK/UNBLOCK USER ====================
export const toggleUserBlock = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Determine new blocked status
    const isBlocked = user.isBlocked || false;
    const newBlockedStatus = !isBlocked;

    // If blocking the user, expire their subscription immediately
    if (newBlockedStatus && user.currentSubscription?.subscriptionId) {
      const now = new Date();
      
      // Update subscription in Subscription collection
      await Subscription.findByIdAndUpdate(
        user.currentSubscription.subscriptionId,
        {
          status: 'cancelled',
          endDate: now // Expire immediately
        }
      );

      // Update user's current subscription status
      user.currentSubscription.status = 'blocked';
      user.currentSubscription.endDate = now; // Expire immediately
    }

    // If unblocking and they had a subscription, just mark as expired (don't restore)
    if (!newBlockedStatus && user.currentSubscription?.planId) {
      user.currentSubscription.status = 'expired';
    }

    // Update user blocked status
    user.isBlocked = newBlockedStatus;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${newBlockedStatus ? 'blocked' : 'unblocked'} successfully`,
      data: user
    });
  } catch (error) {
    console.error('Error in toggleUserBlock:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
