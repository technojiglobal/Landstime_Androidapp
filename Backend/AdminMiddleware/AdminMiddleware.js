// // Backend/AdminMiddleware/AdminMiddleware.js
// import jwt from "jsonwebtoken";
// import Admin from "../AdminModels/Admin.js"; // Make sure the path is correct

// export const verifyAdmin = async (req, res, next) => {
//   console.log("🚨🚨🚨 ADMIN AUTH MIDDLEWARE 🚨🚨🚨");
//   console.log("ADMIN AUTH HEADER:", req.headers.authorization);
//   console.log("JWT_SECRET in middleware:", process.env.JWT_SECRET);

//   const authHeader = req.headers.authorization;

//   // 1️⃣ Check Authorization header
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     console.log("❌ Missing or invalid Authorization header");
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     // 2️⃣ Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("🔓 DECODED ADMIN TOKEN:", decoded);

//     // 3️⃣ Role check (admin OR superadmin)
//     if (decoded.role !== "admin" && decoded.role !== "superadmin") {
//       console.log("❌ Role mismatch:", decoded.role);
//       return res.status(403).json({ message: "Forbidden: Admin access required" });
//     }

//     // 4️⃣ Fetch admin from database
//     const adminId = decoded.adminId || decoded.id;
//     const admin = await Admin.findById(adminId);

//     if (!admin) {
//       console.log("❌ Admin user not found in database:", adminId);
//       return res.status(404).json({ message: "Admin user not found" });
//     }

//     // 5️⃣ Attach admin info to request
//     req.admin = admin; // Attach the full admin object

//     console.log("✅ ADMIN ACCESS GRANTED:", admin.role, admin.email);
//     next();
//   } catch (err) {
//     console.log("❌ JWT VERIFY ERROR:", err.message);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };


import jwt from 'jsonwebtoken';
import Admin from '../AdminModels/Admin.js';

export const verifyAdmin = async (req, res, next) => {
  try {
    console.log('🚨🚨🚨 ADMIN AUTH MIDDLEWARE 🚨🚨🚨');
    
    const authHeader = req.headers.authorization;
    console.log('ADMIN AUTH HEADER:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided or invalid format'
      });
    }

    const token = authHeader.split(' ')[1];
    console.log('JWT_SECRET in middleware:', process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔓 DECODED ADMIN TOKEN:', decoded);

    // Find admin
    const admin = await Admin.findById(decoded.adminId);
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin not found'
      });
    }

    console.log('✅ ADMIN ACCESS GRANTED:', admin.name, admin.email);

    // ✅ FIXED: Set req.admin with the full admin object AND req.adminId
    req.admin = admin;
    req.adminId = admin._id; // This is what was missing!
    
    next();
  } catch (error) {
    console.error('❌ ADMIN AUTH ERROR:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};