// Landstime_Androidapp/Backend/scripts/createAdmin.js

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Admin from "../AdminModels/Admin.js";
import "dotenv/config";

const createAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📡 Connected to MongoDB");

    // Create regular admin
    const existingAdmin = await Admin.findOne({ email: "admin@gmail.com" });
    if (!existingAdmin) {
      const hashedAdminPassword = await bcrypt.hash("admin123", 10);

      const admin = new Admin({
        name: "Admin User",
        email: "admin@gmail.com",
        password: hashedAdminPassword,
        role: "admin"
      });

      await admin.save();
      console.log("✅ Regular Admin created successfully");
    } else {
      console.log("⚠️ Regular Admin already exists");
    }

    // Create superadmin
    const existingSuperAdmin = await Admin.findOne({ email: "superadmin@gmail.com" });
    if (!existingSuperAdmin) {
      const hashedSuperAdminPassword = await bcrypt.hash("super123", 10);

      const superAdmin = new Admin({
        name: "Super Admin",
        email: "superadmin@gmail.com",
        password: hashedSuperAdminPassword,
        role: "superadmin"
      });

      await superAdmin.save();
      console.log("✅ SuperAdmin created successfully");
    } else {
      console.log("⚠️ SuperAdmin already exists");
    }

    console.log("🎉 Admin setup completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admins:", error);
    process.exit(1);
  }
};

createAdmins();
