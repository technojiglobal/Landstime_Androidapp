// admin/src/services/adminApi.js
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Get auth token
const getAuthToken = () => {
  return localStorage.getItem("adminToken");
};

// Create admin account
export const createAdmin = async (adminData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/admins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(adminData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to create admin");
    }

    return data;
  } catch (error) {
    console.error("Create admin error:", error);
    throw error;
  }
};

// Get all admins
export const fetchAllAdmins = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/admins`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch admins");
    }

    return data;
  } catch (error) {
    console.error("Fetch admins error:", error);
    throw error;
  }
};

// Update admin status
export const updateAdminStatus = async (adminId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/admins/${adminId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to update admin status");
    }

    return data;
  } catch (error) {
    console.error("Update admin status error:", error);
    throw error;
  }
};

// Delete admin
export const deleteAdmin = async (adminId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/admins/${adminId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete admin");
    }

    return data;
  } catch (error) {
    console.error("Delete admin error:", error);
    throw error;
  }
};