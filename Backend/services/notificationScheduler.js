// Backend/services/notificationScheduler.js
// ✅ CREATE THIS NEW FILE

import cron from 'node-cron';
import Notification from '../AdminModels/Notification.js';
import User from '../UserModels/User.js';
import UserNotification from '../UserModels/UserNotification.js'; // ✅ NEW

// This will run every minute to check for scheduled notifications
export const startNotificationScheduler = () => {
  console.log('📅 Notification Scheduler started - checking every minute');

  // Run every minute: "* * * * *"
  cron.schedule('* * * * *', async () => {
    try {
      await checkAndSendScheduledNotifications();
    } catch (error) {
      console.error('❌ Scheduler error:', error);
    }
  });
};

// Check for notifications that need to be sent
const checkAndSendScheduledNotifications = async () => {
  try {
    const now = new Date();
    
    // Find all pending scheduled notifications where scheduled time has passed
    const notifications = await Notification.find({
      status: 'pending',
      sendType: 'schedule',
      isDeleted: false,
      scheduledDate: { $lte: now }
    });

    if (notifications.length === 0) {
      return; // No notifications to send
    }

    console.log(`📬 Found ${notifications.length} notification(s) to send`);

    for (const notification of notifications) {
      await sendScheduledNotification(notification);
    }
  } catch (error) {
    console.error('Error checking scheduled notifications:', error);
  }
};

// Send a scheduled notification
const sendScheduledNotification = async (notification) => {
  try {
    console.log(`📤 Sending scheduled notification: "${notification.title}"`);

    // Get target users based on audience
    const baseFilter = {
      role: { $ne: "Admin" },
      isBlocked: false,
    };

    let targetUsers = [];

    if (notification.audience === "all") {
      targetUsers = await User.find(baseFilter);
    } else if (notification.audience === "active") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      targetUsers = await User.find({
        ...baseFilter,
        lastLogin: { $gte: thirtyDaysAgo },
      });
    } else if (notification.audience === "inactive") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      targetUsers = await User.find({
        ...baseFilter,
        $or: [
          { lastLogin: { $lt: thirtyDaysAgo } },
          { lastLogin: { $exists: false } },
        ],
      });
    }

    // TODO: Send actual push notifications here
    // Example: await sendPushNotification(targetUsers, notification.title, notification.message);
    
    // ✅ Create notification for each user
    const userNotifications = targetUsers.map(user => ({
      userId: user._id,
      notificationId: notification._id,
      title: notification.title,
      message: notification.message,
      sentAt: new Date(),
    }));

    await UserNotification.insertMany(userNotifications);
    
    // Update notification status
    notification.status = 'delivered';
    notification.sentDate = new Date();
    notification.deliveredCount = targetUsers.length;
    notification.totalRecipients = targetUsers.length;
    await notification.save();

    console.log(`✅ Notification sent to ${targetUsers.length} users`);
  } catch (error) {
    console.error(`❌ Error sending notification ${notification._id}:`, error);
    
    // Mark as failed (you can add a 'failed' status to your schema)
    notification.status = 'cancelled';
    await notification.save();
  }
};

// Function to manually trigger a specific notification (optional)
export const triggerScheduledNotification = async (notificationId) => {
  try {
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.status !== 'pending') {
      throw new Error('Notification is not pending');
    }

    await sendScheduledNotification(notification);
    return true;
  } catch (error) {
    console.error('Error triggering notification:', error);
    throw error;
  }
};