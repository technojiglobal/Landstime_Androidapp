// Landstime_Androidapp/admin/src/utils/axiosInstance.js

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/properties",
});


// Attach admin JWT token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // admin token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;




// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:8000/api/properties",
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add token to all requests
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('adminToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;