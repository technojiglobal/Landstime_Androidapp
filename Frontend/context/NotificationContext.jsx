// Frontend/contexts/NotificationContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AppState } from 'react-native';
import { API_URL } from '../utils/apiConfig';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [error, setError] = useState(null);
  
  // Track active requests to prevent duplicates
  const activeRequest = useRef(false);
  const retryCount = useRef(0);
  const maxRetries = 3;

  // Fetch notification count with retry logic
  const fetchNotificationCount = useCallback(async (forceRefresh = false) => {
    try {
      // Prevent multiple simultaneous calls
      if (activeRequest.current && !forceRefresh) {
        console.log("⏳ Request already in progress, skipping...");
        return;
      }

      // Check if we fetched recently (within last 10 seconds) unless force refresh
      const now = Date.now();
      if (!forceRefresh && lastFetchTime && (now - lastFetchTime < 10000)) {
        console.log("⏱️ Fetched recently, skipping...");
        return;
      }

      activeRequest.current = true;
      setIsLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        setUnreadCount(0);
        setIsLoading(false);
        activeRequest.current = false;
        return;
      }

      const endpoint = `${API_URL}/api/user/notifications/unread`;
      console.log("🔔 Fetching notification count from:", endpoint);

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000, // Increased timeout to 15 seconds
      });

      if (response.data.success) {
        const count = response.data.data.length;
        setUnreadCount(count);
        setLastFetchTime(now);
        retryCount.current = 0; // Reset retry count on success
        console.log("✅ Notification count updated:", count);
      }
    } catch (err) {
      console.error("❌ Failed to fetch notification count:", err.message);
      
      // Only log detailed error info if it's not a network timeout
      if (err.response) {
        console.error("❌ Error details:", {
          url: err.config?.url,
          method: err.config?.method,
          status: err.response?.status,
          data: err.response?.data
        });
        setError(`Server error: ${err.response?.status}`);
      } else if (err.code === 'ECONNABORTED') {
        console.error("⏱️ Request timeout");
        setError('Request timeout');
      } else {
        console.error("🌐 Network error - backend might be down");
        setError('Network error');
        
        // Retry logic for network errors
        if (retryCount.current < maxRetries) {
          retryCount.current += 1;
          console.log(`🔄 Retry attempt ${retryCount.current}/${maxRetries} in 5 seconds...`);
          
          setTimeout(() => {
            activeRequest.current = false;
            fetchNotificationCount(true);
          }, 5000);
          return;
        } else {
          console.log("❌ Max retries reached, giving up");
          retryCount.current = 0;
        }
      }
      
      // Don't reset count on error, keep previous value
    } finally {
      setIsLoading(false);
      activeRequest.current = false;
    }
  }, [lastFetchTime]);

  // Refresh count (force refresh)
  const refreshCount = useCallback(() => {
    retryCount.current = 0; // Reset retry count on manual refresh
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

      const endpoint = `${API_URL}/api/user/notifications/${notificationId}/read`;
      console.log("📝 Marking notification as read:", endpoint);

      await axios.patch(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      decrementCount();
      console.log("✅ Notification marked as read");
      return true;
    } catch (err) {
      console.error("❌ Failed to mark notification as read:", err.message);
      if (err.response) {
        console.error("Error details:", err.response.data);
      }
      return false;
    }
  }, [decrementCount]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) throw new Error("No token found");

      const endpoint = `${API_URL}/api/user/notifications/mark-all-read`;
      console.log("📝 Marking all notifications as read:", endpoint);

      await axios.patch(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      setUnreadCount(0);
      console.log("✅ All notifications marked as read");
      return true;
    } catch (err) {
      console.error("❌ Failed to mark all as read:", err.message);
      if (err.response) {
        console.error("Error details:", err.response.data);
      }
      throw err;
    }
  }, []);

  // Initial fetch with delay to avoid race conditions
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotificationCount();
    }, 1000); // Wait 1 second after mount

    return () => clearTimeout(timer);
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Only auto-refresh if not currently loading and no active request
      if (!isLoading && !activeRequest.current) {
        fetchNotificationCount();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchNotificationCount, isLoading]);

  // Handle app state changes (when app comes to foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        console.log("📱 App became active, refreshing notifications...");
        // Small delay to ensure network is ready
        setTimeout(() => {
          refreshCount();
        }, 500);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [refreshCount]);

  const value = {
    unreadCount,
    isLoading,
    error,
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