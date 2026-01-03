// AdminRoutes/NotificationRoute.js

import express from "express";
import {
  createNotification,
  getAllNotifications,
  getRecentNotifications,
  getScheduledNotifications,
  getNotificationStats,
  getUserStats,
  deleteNotification,
  cancelScheduledNotification,
  updateScheduledNotification,
} from "../AdminControllers/NotificationController.js";
import { verifyAdmin } from "../AdminMiddleware/AdminMiddleware.js";

const router = express.Router();

// All routes are protected with admin authentication
router.use(verifyAdmin);

// Create and send notification
router.post("/create", createNotification);

// Get all notifications with filters
router.get("/all", getAllNotifications);

// Get recent notifications (for Recent tab)
router.get("/recent", getRecentNotifications);

// Get scheduled notifications (for Scheduled tab)
router.get("/scheduled", getScheduledNotifications);

// Get notification statistics
router.get("/stats", getNotificationStats);

// Get user statistics (for audience info)
router.get("/user-stats", getUserStats);

// Delete notification (soft delete)
router.delete("/:id", deleteNotification);

// Cancel scheduled notification
router.patch("/:id/cancel", cancelScheduledNotification);

// Update scheduled notification
router.put("/:id", updateScheduledNotification);

export default router;