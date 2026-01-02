// AdminControllers/NotificationController.js

import Notification from "../AdminModels/Notification.js";
import User from "../UserModels/User.js";
import UserNotification from "../UserModels/UserNotification.js";

// ==================== ADMIN NOTIFICATION FUNCTIONS ====================

// Create and Send Notification
export const createNotification = async (req, res) => {
  try {
    const { title, message, audience, sendType, date, time } = req.body;

    // Validation
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required",
      });
    }

    // Get target users based on audience (exclude admins and blocked users)
    let targetUsers = [];
    let sentTo = "";

    const baseFilter = {
      role: { $ne: "Admin" }, // Exclude admins
      isBlocked: false,       // Exclude blocked users
    };

    if (audience === "all") {
      targetUsers = await User.find(baseFilter);
      sentTo = "All Users";
    } else if (audience === "active") {
      // Users who logged in within last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      targetUsers = await User.find({
        ...baseFilter,
        lastLogin: { $gte: thirtyDaysAgo },
      });
      sentTo = "Active Users";
    } else if (audience === "inactive") {
      // Users who haven't logged in for 30+ days or never logged in
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      targetUsers = await User.find({
        ...baseFilter,
        $or: [
          { lastLogin: { $lt: thirtyDaysAgo } },
          { lastLogin: { $exists: false } },
        ],
      });
      sentTo = "Inactive Users";
    }

    // Create notification object
    const notificationData = {
      title,
      message,
      audience,
      sendType,
      sentTo,
      totalRecipients: targetUsers.length,
      createdBy: req.adminId,
    };

    // Handle scheduling
    if (sendType === "schedule") {
      if (!date || !time) {
        return res.status(400).json({
          success: false,
          message: "Date and time are required for scheduled notifications",
        });
      }

      // Combine date and time into a single Date object
      const scheduledDateTime = new Date(`${date}T${time}`);
      
      // Validate that scheduled time is in the future
      if (scheduledDateTime <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Scheduled time must be in the future",
        });
      }

      notificationData.scheduledDate = scheduledDateTime;
      notificationData.scheduledTime = time;
      notificationData.status = "pending";
    } else {
      // Send immediately
      notificationData.status = "delivered";
      notificationData.sentDate = new Date();
      notificationData.deliveredCount = targetUsers.length;

      // TODO: Integrate with push notification service
      // For example: Firebase Cloud Messaging, OneSignal, etc.
      // await sendPushNotification(targetUsers, title, message);
    }

    const notification = await Notification.create(notificationData);

    // ✅ If sending immediately, create user notifications
    if (sendType !== "schedule") {
      const userNotifications = targetUsers.map(user => ({
        userId: user._id,
        notificationId: notification._id,
        title: notification.title,
        message: notification.message,
        sentAt: new Date(),
      }));

      await UserNotification.insertMany(userNotifications);
    }

    return res.status(201).json({
      success: true,
      message:
        sendType === "schedule"
          ? "Notification scheduled successfully"
          : "Notification sent successfully",
      data: notification,
      recipientCount: targetUsers.length,
    });
  } catch (error) {
    console.error("Create notification error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create notification",
      error: error.message,
    });
  }
};

// Get All Notifications (Admin)
export const getAllNotifications = async (req, res) => {
  try {
    const { status, sendType, limit = 50, page = 1 } = req.query;

    const filter = { isDeleted: false };

    if (status) {
      filter.status = status;
    }

    if (sendType) {
      filter.sendType = sendType;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate("createdBy", "name email");

    const total = await Notification.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// Get Recent Notifications (for history)
export const getRecentNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      isDeleted: false,
      status: { $in: ["delivered", "completed"] },
    })
      .sort({ sentDate: -1 })
      .limit(50)
      .select("title message sentTo status sentDate totalRecipients deliveredCount");

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("Get recent notifications error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent notifications",
      error: error.message,
    });
  }
};

// Get Scheduled Notifications
export const getScheduledNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      isDeleted: false,
      status: "pending",
      sendType: "schedule",
    })
      .sort({ scheduledDate: 1 })
      .select("title message sentTo scheduledDate scheduledTime status totalRecipients");

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("Get scheduled notifications error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch scheduled notifications",
      error: error.message,
    });
  }
};

// Get Notification Stats
export const getNotificationStats = async (req, res) => {
  try {
    const totalSent = await Notification.countDocuments({
      isDeleted: false,
      status: { $in: ["delivered", "completed"] },
    });

    const pending = await Notification.countDocuments({
      isDeleted: false,
      status: "pending",
    });

    // Calculate delivery rate
    const delivered = await Notification.aggregate([
      {
        $match: {
          isDeleted: false,
          status: { $in: ["delivered", "completed"] },
        },
      },
      {
        $group: {
          _id: null,
          totalRecipients: { $sum: "$totalRecipients" },
          totalDelivered: { $sum: "$deliveredCount" },
        },
      },
    ]);

    const deliveryRate =
      delivered.length > 0 && delivered[0].totalRecipients > 0
        ? (
            (delivered[0].totalDelivered / delivered[0].totalRecipients) *
            100
          ).toFixed(1)
        : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalSent,
        pending,
        deliveryRate: `${deliveryRate}%`,
      },
    });
  } catch (error) {
    console.error("Get notification stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notification stats",
      error: error.message,
    });
  }
};

// Get User Statistics for Notifications
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({
      role: { $ne: "Admin" },
      isBlocked: false,
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeUsers = await User.countDocuments({
      role: { $ne: "Admin" },
      isBlocked: false,
      lastLogin: { $gte: thirtyDaysAgo },
    });

    const inactiveUsers = await User.countDocuments({
      role: { $ne: "Admin" },
      isBlocked: false,
      $or: [
        { lastLogin: { $lt: thirtyDaysAgo } },
        { lastLogin: { $exists: false } },
      ],
    });

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user statistics",
      error: error.message,
    });
  }
};

// Delete Admin Notification (Soft Delete) - Used by Admin Route
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (notification.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Notification already deleted",
      });
    }

    // Soft delete
    notification.isDeleted = true;
    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Delete notification error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};

// Cancel Scheduled Notification
export const cancelScheduledNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (notification.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending notifications can be cancelled",
      });
    }

    notification.status = "cancelled";
    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel notification error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel notification",
      error: error.message,
    });
  }
};

// Update Scheduled Notification
export const updateScheduledNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, audience, date, time } = req.body;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (notification.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending notifications can be updated",
      });
    }

    // Update fields
    if (title) notification.title = title;
    if (message) notification.message = message;
    if (audience) {
      notification.audience = audience;
      
      // Recalculate target users
      const baseFilter = {
        role: { $ne: "Admin" },
        isBlocked: false,
      };

      let targetUsers = [];
      let sentTo = "";

      if (audience === "all") {
        targetUsers = await User.find(baseFilter);
        sentTo = "All Users";
      } else if (audience === "active") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        targetUsers = await User.find({
          ...baseFilter,
          lastLogin: { $gte: thirtyDaysAgo },
        });
        sentTo = "Active Users";
      } else if (audience === "inactive") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        targetUsers = await User.find({
          ...baseFilter,
          $or: [
            { lastLogin: { $lt: thirtyDaysAgo } },
            { lastLogin: { $exists: false } },
          ],
        });
        sentTo = "Inactive Users";
      }

      notification.sentTo = sentTo;
      notification.totalRecipients = targetUsers.length;
    }
    
    if (date && time) {
      const scheduledDateTime = new Date(`${date}T${time}`);
      
      if (scheduledDateTime <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Scheduled time must be in the future",
        });
      }
      
      notification.scheduledDate = scheduledDateTime;
      notification.scheduledTime = time;
    } else if (date) {
      notification.scheduledDate = new Date(date);
    } else if (time) {
      notification.scheduledTime = time;
    }

    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification updated successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Update notification error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update notification",
      error: error.message,
    });
  }
};

// ==================== USER NOTIFICATION FUNCTIONS ====================

// Get All Notifications for User
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.userId; // From verifyToken middleware
    const { limit = 20, page = 1 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notifications = await UserNotification.find({
      userId: userId,
      isDeleted: false,
    })
      .sort({ sentAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await UserNotification.countDocuments({
      userId: userId,
      isDeleted: false,
    });

    const unreadCount = await UserNotification.countDocuments({
      userId: userId,
      isRead: false,
      isDeleted: false,
    });

    return res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get user notifications error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// Get Unread Notifications Only
export const getUnreadNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 20, page = 1 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notifications = await UserNotification.find({
      userId: userId,
      isRead: false,
      isDeleted: false,
    })
      .sort({ sentAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await UserNotification.countDocuments({
      userId: userId,
      isRead: false,
      isDeleted: false,
    });

    return res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get unread notifications error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch unread notifications",
      error: error.message,
    });
  }
};

// Get Notification Count (Unread)
export const getNotificationCount = async (req, res) => {
  try {
    const userId = req.userId;

    const unreadCount = await UserNotification.countDocuments({
      userId: userId,
      isRead: false,
      isDeleted: false,
    });

    const totalCount = await UserNotification.countDocuments({
      userId: userId,
      isDeleted: false,
    });

    return res.status(200).json({
      success: true,
      data: {
        unreadCount,
        totalCount,
      },
    });
  } catch (error) {
    console.error("Get notification count error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notification count",
      error: error.message,
    });
  }
};

// Mark Single Notification as Read
export const markAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const notification = await UserNotification.findOne({
      _id: id,
      userId: userId,
      isDeleted: false,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (notification.isRead) {
      return res.status(200).json({
        success: true,
        message: "Notification already marked as read",
        data: notification,
      });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

// Mark All Notifications as Read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await UserNotification.updateMany(
      { 
        userId: userId, 
        isRead: false,
        isDeleted: false 
      },
      { 
        isRead: true, 
        readAt: new Date() 
      }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: {
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
      error: error.message,
    });
  }
};

// Delete User Notification (Soft Delete) - Used by User Route
export const deleteUserNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const notification = await UserNotification.findOne({
      _id: id,
      userId: userId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (notification.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Notification already deleted",
      });
    }

    notification.isDeleted = true;
    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Delete user notification error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};