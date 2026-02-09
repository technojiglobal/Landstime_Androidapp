// admin/src/services/dashboardApi.js

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Get auth token
const getAuthToken = () => {
  return localStorage.getItem("adminToken");
};

// Get complete dashboard data (recommended - single API call)
export const getDashboardData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch dashboard data");
    }

    return data;
  } catch (error) {
    console.error("Fetch dashboard data error:", error);
    throw error;
  }
};

// Get dashboard statistics only
export const getDashboardStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch dashboard stats");
    }

    return data;
  } catch (error) {
    console.error("Fetch dashboard stats error:", error);
    throw error;
  }
};

// Get recent properties
export const getRecentProperties = async (limit = 5) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/recent-properties?limit=${limit}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch recent properties");
    }

    return data;
  } catch (error) {
    console.error("Fetch recent properties error:", error);
    throw error;
  }
};

// Get recent notifications
export const getRecentNotifications = async (limit = 4) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/recent-notifications?limit=${limit}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch recent notifications");
    }

    return data;
  } catch (error) {
    console.error("Fetch recent notifications error:", error);
    throw error;
  }
};