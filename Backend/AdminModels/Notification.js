// Backend/AdminModels/Notification.js
// ✅ CREATE THIS NEW FILE

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    audience: {
      type: String,
      enum: ["all", "active", "inactive"],
      default: "all",
    },
    sendType: {
      type: String,
      enum: ["now", "schedule"],
      default: "now",
    },
    scheduledDate: {
      type: Date,
      default: null,
    },
    scheduledTime: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "delivered", "completed", "cancelled"],
      default: "pending",
    },
    sentTo: {
      type: String, // "All Users", "Active Users", "Inactive Users"
      required: true,
    },
    sentDate: {
      type: Date,
      default: null,
    },
    deliveredCount: {
      type: Number,
      default: 0,
    },
    totalRecipients: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
notificationSchema.index({ status: 1, createdAt: -1 });
notificationSchema.index({ sendType: 1, scheduledDate: 1 });
notificationSchema.index({ isDeleted: 1, status: 1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;