// Landstime_Androidapp/Backend/AdminControllers/AdminController.js

import Admin from "../AdminModels/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    // 2️⃣ Find admin
    const admin = await Admin.findOne({ email });
    console.log("👤 Admin found:", admin ? "YES" : "NO");
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found with this email", // More specific
      });
    }

    // 3️⃣ Compare password
    console.log("🔐 Comparing passwords...");
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("🔐 Password match:", isMatch ? "YES" : "NO");
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password", // More specific
      });
    }

    // 4️⃣ Generate JWT
    const token = jwt.sign(
      { id: admin._id, role: "Admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
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
