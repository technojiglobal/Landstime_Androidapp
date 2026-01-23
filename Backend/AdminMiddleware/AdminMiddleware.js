// Backend/AdminMiddleware/AdminMiddleware.js
import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  // ✅ CRITICAL FIX: Skip authentication for OPTIONS (preflight) requests
  if (req.method === 'OPTIONS') {
    console.log("✅ OPTIONS request - skipping auth");
    return next();
  }

  console.log("🚨🚨🚨 ADMIN AUTH MIDDLEWARE 🚨🚨🚨");
  console.log("ADMIN AUTH HEADER:", req.headers.authorization);

  const authHeader = req.headers.authorization;

  // 1️⃣ Check Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ Missing or invalid Authorization header");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔓 DECODED ADMIN TOKEN:", decoded);

    // 3️⃣ Role check (admin OR superadmin)
    if (decoded.role !== "admin" && decoded.role !== "superadmin") {
      console.log("❌ Role mismatch:", decoded.role);
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    // 4️⃣ Attach admin info to request
    req.adminId = decoded.adminId || decoded.id;
    req.adminRole = decoded.role;

    console.log("✅ ADMIN ACCESS GRANTED:", decoded.role);
    next();
  } catch (err) {
    console.log("❌ JWT VERIFY ERROR:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};