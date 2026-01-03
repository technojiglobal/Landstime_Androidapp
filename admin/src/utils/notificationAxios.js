// admin/src/utils/notificationAxios.js
// ✅ CREATE THIS NEW FILE - Separate axios instance for notifications

import axios from "axios";

const notificationAxios = axios.create({
  baseURL: "http://localhost:8000/api", // ✅ Base URL for all admin APIs
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach token
notificationAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Same token as admin
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug logging
    console.log(`📤 Notification API: ${config.method.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
notificationAxios.interceptors.response.use(
  (response) => {
    console.log(`✅ Response: ${response.config.url} [${response.status}]`);
    return response;
  },
  (error) => {
    console.error("❌ Notification API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });

    // Handle specific errors
    if (error.response?.status === 401) {
      console.error("🔒 Unauthorized - Please login again");
    }
    
    if (error.response?.status === 404) {
      console.error("🔍 Not Found - Check if backend route is registered");
    }

    if (error.response?.status === 500) {
      console.error("💥 Server Error - Check backend console");
    }

    return Promise.reject(error);
  }
);

export default notificationAxios;