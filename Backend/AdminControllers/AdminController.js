import Admin from "../AdminModels/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../UserModels/User.js";
import Subscription from "../UserModels/Subscription.js";

/* ==================== ADMIN LOGIN ==================== */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("📧 Login attempt for:", email);

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2️⃣ Find admin (admin or superadmin)
    const admin = await Admin.findOne({ email });
    console.log("👤 Admin found:", admin ? "YES" : "NO");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found with this email",
      });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("🔐 Password match:", isMatch ? "YES" : "NO");

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // 4️⃣ Get role from DB (admin / superadmin)
    const role = admin.role || "admin";
    console.log("👑 Admin role:", role);

    // 5️⃣ Generate JWT
    const token = jwt.sign(
      {
        adminId: admin._id, // ✅ consistent key
        role: role,         // ✅ dynamic role
      },
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
        role: role,
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

/* ==================== ADMIN LOGOUT ==================== */
export const adminLogout = async (req, res) => {
  try {
    // JWT logout is handled client-side
    return res.status(200).json({
      success: true,
      message: "Admin logged out successfully",
    });
  } catch (error) {
    console.error("Error in adminLogout:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ==================== GET ALL USERS ==================== */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "Admin" } })
      .select("-password")
      .sort({ createdAt: -1 });

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
      data: usersWithSubscriptions,
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ==================== BLOCK / UNBLOCK USER ==================== */
export const toggleUserBlock = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newBlockedStatus = !user.isBlocked;

    // If blocking → cancel subscription immediately
    if (newBlockedStatus && user.currentSubscription?.subscriptionId) {
      const now = new Date();

      await Subscription.findByIdAndUpdate(
        user.currentSubscription.subscriptionId,
        {
          status: "cancelled",
          endDate: now,
        }
      );

      user.currentSubscription.status = "blocked";
      user.currentSubscription.endDate = now;
    }

    // If unblocking → mark subscription expired
    if (!newBlockedStatus && user.currentSubscription?.planId) {
      user.currentSubscription.status = "expired";
    }

    user.isBlocked = newBlockedStatus;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${newBlockedStatus ? "blocked" : "unblocked"} successfully`,
      data: user,
    });
  } catch (error) {
    console.error("Error in toggleUserBlock:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
