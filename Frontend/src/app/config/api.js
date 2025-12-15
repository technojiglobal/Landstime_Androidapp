import axios from 'axios';
import { Platform } from 'react-native';

// IMPORTANT: Replace with your actual backend URL
const getApiUrl = () => {
  if (__DEV__) {
    // Development URLs
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5000'; // Android emulator
      // return 'http://YOUR_LOCAL_IP:5000'; // Physical device (e.g., http://192.168.1.100:5000)
    } else if (Platform.OS === 'ios') {
      return 'http://localhost:8000'; // iOS simulator
    }
    return 'http://localhost:8000'; // Web/default
  }
  
  // Production URL
  return 'https://your-production-api.com';
};

export const API_URL = getApiUrl();
export const API_ENDPOINTS = {
  SEND_OTP: `${API_URL}/api/users/send-otp`,
  VERIFY_OTP: `${API_URL}/api/users/verify-otp`,
  REGISTER: `${API_URL}/api/users/register`,
  LOGIN: `${API_URL}/api/users/login`,
  PROFILE: `${API_URL}/api/users/profile`,
};

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;