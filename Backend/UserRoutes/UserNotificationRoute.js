// Backend/UserRoutes/UserNotificationRoute.js

import express from "express";
import {
  getUserNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteUserNotification, // ✅ Changed from deleteNotification
  getNotificationCount,
} from "../AdminControllers/NotificationController.js";
import { verifyToken } from "../UserMiddleware/UserMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get all notifications for user
router.get("/", getUserNotifications);

// Get unread notifications only
router.get("/unread", getUnreadNotifications);

// Get notification count
router.get("/count", getNotificationCount);

// Mark notification as read
router.patch("/:id/read", markAsRead);

// Mark all notifications as read
router.patch("/mark-all-read", markAllAsRead);

// Delete notification (user's copy)
router.delete("/:id", deleteUserNotification); // ✅ Uses deleteUserNotification

export default router;