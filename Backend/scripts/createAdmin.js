// Landstime_Androidapp/Backend/scripts/createAdmin.js

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Admin from "../AdminModels/Admin.js";
import "dotenv/config";

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const existing = await Admin.findOne({ email: "admin@realestate.com" });
  if (existing) {
    console.log("❌ Admin already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = new Admin({
    name: "Super Admin",
    email: "admin@realestate.com",
    password: hashedPassword,
  });

  await admin.save();
  console.log("✅ Admin created successfully");
  process.exit();
};

createAdmin();
