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