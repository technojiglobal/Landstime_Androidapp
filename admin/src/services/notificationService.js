// src/services/notificationService.js
// ✅ UPDATED to use notificationAxios

import notificationAxios from "../utils/notificationAxios"; // ✅ Changed import

// Create and send notification
export const createNotification = async (notificationData) => {
  try {
    const response = await notificationAxios.post(
      "/admin/notifications/create",
      notificationData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get all notifications with filters
export const getAllNotifications = async (params = {}) => {
  try {
    const response = await notificationAxios.get("/admin/notifications/all", {
      params,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get recent notifications
export const getRecentNotifications = async () => {
  try {
    const response = await notificationAxios.get("/admin/notifications/recent");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get scheduled notifications
export const getScheduledNotifications = async () => {
  try {
    const response = await notificationAxios.get("/admin/notifications/scheduled");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get notification statistics
export const getNotificationStats = async () => {
  try {
    const response = await notificationAxios.get("/admin/notifications/stats");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get user statistics (for audience dropdown)
export const getUserStats = async () => {
  try {
    const response = await notificationAxios.get("/admin/notifications/user-stats");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete notification
export const deleteNotification = async (id) => {
  try {
    const response = await notificationAxios.delete(
      `/admin/notifications/${id}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Cancel scheduled notification
export const cancelScheduledNotification = async (id) => {
  try {
    const response = await notificationAxios.patch(
      `/admin/notifications/${id}/cancel`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update scheduled notification
export const updateScheduledNotification = async (id, notificationData) => {
  try {
    const response = await notificationAxios.put(
      `/admin/notifications/${id}`,
      notificationData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};