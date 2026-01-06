// Landstime_Androidapp/Backend/AdminMiddleware/AdminMiddleware.js

import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  console.log("🚨🚨🚨 NEW MIDDLEWARE LOADED 🚨🚨🚨");
  console.log("ADMIN AUTH HEADER:", req.headers.authorization);

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No Authorization header or wrong format");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED ADMIN TOKEN:", decoded);
    
    // ✅ Accept "admin" (lowercase) - this matches the token
    if (decoded.role === "admin") {
      console.log("✅✅✅ ADMIN ACCESS GRANTED ✅✅✅");
      req.adminId = decoded.adminId || decoded.id;
      return next();
    }

    console.log("❌ Role mismatch - expected 'admin', got:", decoded.role);
    return res.status(403).json({ message: "Forbidden: Admin access required" });
    
  } catch (err) {
    console.log("❌ JWT VERIFY ERROR:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};