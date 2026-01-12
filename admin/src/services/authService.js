// Landstime_Androidapp/admin/src/services/authService.js

import axios from "axios";

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

const API_BASE_URL = "http://localhost:8000/api"; 
export const adminLogout = async () => {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${API_BASE_URL}/admin/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw err;
  }

  return await res.json();
};