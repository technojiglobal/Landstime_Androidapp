// Backend/AdminControllers/AdminController.js
import Admin from "../AdminModels/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../UserModels/User.js";
import Subscription from "../UserModels/Subscription.js";
import { encryptPassword, decryptPassword } from '../utils/encryption.js';
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

// Backend/AdminControllers/AdminController.js
// ADD these new functions at the end of the file (before the export):

/* ==================== CREATE ADMIN ACCOUNT (SuperAdmin Only) ==================== */
export const createAdminAccount = async (req, res) => {
  try {
    const { name, email, phone, role, assignedTo, password, permissions } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    // Hash for authentication
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Encrypt for display (reversible)
    const encrypted = encryptPassword(password);

    const newAdmin = new Admin({
      name,
      email,
      phone,
      role: role || "admin",
      assignedTo,
      password: hashedPassword,         // For login authentication
      encryptedPassword: encrypted,      // For display purposes
      permissions: permissions || [],
      status: "Active",
      lastLogin: null,
      actionCount: 0,
    });

    await newAdmin.save();

    console.log("✅ New admin created:", newAdmin.email);

    return res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      data: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        phone: newAdmin.phone,
        role: newAdmin.role,
        assignedTo: newAdmin.assignedTo,
        permissions: newAdmin.permissions,
        status: newAdmin.status,
        plainPassword: password,           // Return plain on creation
        createdAt: newAdmin.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in createAdminAccount:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ==================== GET ALL ADMINS (SuperAdmin Only) ==================== */
// Backend/AdminControllers/AdminController.js
// MODIFY getAllAdmins:

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find()
      .sort({ createdAt: -1 });

    const adminsData = admins.map(admin => ({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
      assignedTo: admin.assignedTo,
      permissions: admin.permissions,
      status: admin.status,
      lastLogin: admin.lastLogin,
      actionCount: admin.actionCount,
      createdAt: admin.createdAt,
      plainPassword: decryptPassword(admin.encryptedPassword),  // Decrypt here
    }));

    return res.status(200).json({
      success: true,
      data: adminsData,
    });
  } catch (error) {
    console.error("Error in getAllAdmins:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ==================== UPDATE ADMIN STATUS ==================== */
export const updateAdminStatus = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { status } = req.body;

    const admin = await Admin.findByIdAndUpdate(
      adminId,
      { status },
      { new: true }
    ).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin status updated successfully",
      data: admin,
    });
  } catch (error) {
    console.error("Error in updateAdminStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ==================== DELETE ADMIN ==================== */
export const deleteAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    const admin = await Admin.findByIdAndDelete(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteAdmin:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
