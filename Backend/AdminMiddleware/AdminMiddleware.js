// Landstime_Androidapp/Backend/AdminMiddleware/AdminMiddleware.js

import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin" && decoded.role !== "superadmin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.adminId = decoded.id;
    req.adminRole = decoded.role; // Store role for potential use in controllers
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
