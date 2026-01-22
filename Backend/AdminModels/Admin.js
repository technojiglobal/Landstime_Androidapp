// Backend/AdminModels/Admin.js
// REPLACE the existing schema with this updated version:

import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },
  encryptedPassword: {     // ADD: Store encrypted password
    type: String,
    required: true,
  },

  phone: {
    type: String,
    default: "",
  },

  role: {
    type: String,
    enum: ["admin", "superadmin", "Sub-Admin", "Manager", "Admin"],
    default: "admin",
  },

  assignedTo: {
    type: String,
    default: "",
  },

  permissions: {
    type: [String],
    default: [],
  },

  status: {
    type: String,
    enum: ["Active", "Inactive", "Pending"],
    default: "Active",
  },

  lastLogin: {
    type: Date,
    default: null,
  },

  actionCount: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;