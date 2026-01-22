// Landstime_Androidapp/admin/src/services/authService.js

import axios from "axios";
const API_BASE_URL = "http://localhost:8000/api"; 
const API = axios.create({
  baseURL: "http://localhost:8000/api/admin",
});

export const adminLogin = async (email, password) => {
  console.log("🔍 Sending login request with:", { email, password }); // Debug log
  const res = await API.post("/login", { email, password });
  console.log("✅ Login response:", res.data); // Debug log
  return res.data;
};

// NEW CODE (add to existing file):


export const adminLogout = async () => {
  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");  // ✅ ADD || localStorage.getItem("adminToken")
  
  const res = await axios.post(  // ✅ CHANGE from fetch to axios
    `${API_BASE_URL}/admin/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;  // ✅ CHANGE from if (!res.ok) to just return res.data
};