// Frontend/utils/propertyViewApi.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './apiConfig';

const API_BASE_URL = `${API_URL}/api/property-views`;

console.log('🔍 Property View API Base URL:', API_BASE_URL);

// Helper function to get token
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.error('❌ No token found');
      return null;
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '').replace(/^Bearer\s+/i, '');
    return cleanToken;
  } catch (error) {
    console.error('❌ Error getting token:', error);
    return null;
  }
};

// Helper function for API requests
const apiRequest = async (endpoint, method = 'GET', body = null) => {
  try {
    const token = await getToken();
    
    if (!token) {
      return {
        success: false,
        error: 'No authentication token found. Please login again.'
      };
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    const config = {
      method,
      headers,
    };
    
    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }
    
    console.log('📤 Property View API Request:', `${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    console.log('📥 Property View API Response:', data);
    
    return {
      success: response.ok,
      status: response.status,
      data: data,
    };
    
  } catch (error) {
    console.error('❌ Property View API Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// ===== PROPERTY VIEW APIs =====

// Check if user can view contact
export const checkViewAccess = async (propertyId, userName, userPhone) => {
  try {
    return await apiRequest('/check-access', 'POST', {
      propertyId,
      userName,
      userPhone
    });
  } catch (error) {
    console.error('Check view access error:', error);
    return { success: false, error: error.message };
  }
};

// Record property view
export const recordPropertyView = async (propertyId) => {
  try {
    return await apiRequest('/record-view', 'POST', {
      propertyId
    });
  } catch (error) {
    console.error('Record property view error:', error);
    return { success: false, error: error.message };
  }
};

// Get property viewers (Admin only)
export const getPropertyViewers = async (propertyId, page = 1, limit = 10) => {
  try {
    return await apiRequest(`/admin/property/${propertyId}?page=${page}&limit=${limit}`);
  } catch (error) {
    console.error('Get property viewers error:', error);
    return { success: false, error: error.message };
  }
};

// Get all property views (Admin only)
export const getAllPropertyViews = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    return await apiRequest(`/admin/all?${queryParams}`);
  } catch (error) {
    console.error('Get all property views error:', error);
    return { success: false, error: error.message };
  }
};

export default {
  checkViewAccess,
  recordPropertyView,
  getPropertyViewers,
  getAllPropertyViews
};