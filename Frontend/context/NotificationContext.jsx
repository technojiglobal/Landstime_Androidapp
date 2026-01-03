// Frontend/contexts/NotificationContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AppState } from 'react-native';

const API_URL = "http://10.10.2.39:8000/api";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  // Fetch notification count
  const fetchNotificationCount = useCallback(async (forceRefresh = false) => {
    try {
      // Prevent multiple simultaneous calls
      if (isLoading && !forceRefresh) return;

      // Check if we fetched recently (within last 10 seconds) unless force refresh
      const now = Date.now();
      if (!forceRefresh && lastFetchTime && (now - lastFetchTime < 10000)) {
        return;
      }

      setIsLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        setUnreadCount(0);
        setIsLoading(false);
        return;
      }

      console.log("🔔 Fetching notification count...");

      const response = await axios.get(`${API_URL}/user/notifications/unread`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      });

      if (response.data.success) {
        const count = response.data.data.length;
        setUnreadCount(count);
        setLastFetchTime(now);
        console.log("✅ Notification count updated:", count);
      }
    } catch (err) {
      console.error("❌ Failed to fetch notification count:", err.message);
      // Don't reset count on error, keep previous value
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, lastFetchTime]);

  // Refresh count (force refresh)
  const refreshCount = useCallback(() => {
    return fetchNotificationCount(true);
  }, [fetchNotificationCount]);

  // Decrement count (when marking as read)
  const decrementCount = useCallback(() => {
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      await axios.patch(
        `${API_URL}/user/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      decrementCount();
      console.log("✅ Notification marked as read");
    } catch (err) {
      console.error("❌ Failed to mark notification as read:", err);
    }
  }, [decrementCount]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      await axios.patch(
        `${API_URL}/user/notifications/mark-all-read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUnreadCount(0);
      console.log("✅ All notifications marked as read");
    } catch (err) {
      console.error("❌ Failed to mark all as read:", err);
      throw err;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchNotificationCount();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotificationCount();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchNotificationCount]);

  // Handle app state changes (when app comes to foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        console.log("📱 App became active, refreshing notifications...");
        refreshCount();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [refreshCount]);

  const value = {
    unreadCount,
    isLoading,
    fetchNotificationCount,
    refreshCount,
    decrementCount,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};