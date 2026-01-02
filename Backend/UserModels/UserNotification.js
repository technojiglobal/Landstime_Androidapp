// Backend/UserModels/UserNotification.js
// ✅ CREATE THIS NEW FILE

import mongoose from "mongoose";

const userNotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // For faster queries
    },
    notificationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    sentAt: {
      type: Date,
      default: Date.now,
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

// Compound indexes for efficient queries
userNotificationSchema.index({ userId: 1, isRead: 1, sentAt: -1 });
userNotificationSchema.index({ userId: 1, isDeleted: 1, sentAt: -1 });

const UserNotification = mongoose.model("UserNotification", userNotificationSchema);

export default UserNotification;