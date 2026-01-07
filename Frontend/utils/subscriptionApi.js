//Frontend/utils/subscriptionApi.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.37.92.184:8000/api/subscriptions';



// Helper function to get token
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Helper function for API requests
const apiRequest = async (endpoint, method = 'GET', body = null) => {
  try {
    const token = await getToken();
    
    console.log('🔑 Token retrieved:', token ? 'Token exists' : 'No token found');
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('✅ Authorization header added');
    } else {
      console.error('❌ No token available for authenticated request');
    }
    
    const config = {
      method,
      headers,
    };
    
    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }
    
    console.log('📤 Subscription API Request:', `${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    console.log('📥 Subscription API Response:', data);
    
    return {
      success: response.ok,
      status: response.status,
      data: data,
    };
    
  } catch (error) {
    console.error('Subscription API Request Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// ===== SUBSCRIPTION APIs =====

// Create subscription order
export const createSubscriptionOrder = async (planId, planName, amount, features) => {
  try {
    const body = {
      planId,
      planName,
      amount,
      features
    };
    
    return await apiRequest('/create-order', 'POST', body);
    
  } catch (error) {
    console.error('Create subscription order error:', error);
    return { success: false, error: error.message };
  }
};

// Verify payment
export const verifySubscriptionPayment = async (razorpayOrderId, razorpayPaymentId, razorpaySignature, subscriptionId) => {
  try {
    const body = {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      subscriptionId
    };
    
    return await apiRequest('/verify-payment', 'POST', body);
    
  } catch (error) {
    console.error('Verify payment error:', error);
    return { success: false, error: error.message };
  }
};

// Get user's all subscriptions
export const getUserSubscriptions = async () => {
  try {
    return await apiRequest('/my-subscriptions');
    
  } catch (error) {
    console.error('Get subscriptions error:', error);
    return { success: false, error: error.message };
  }
};

// Get active subscription
export const getActiveSubscription = async () => {
  try {
    return await apiRequest('/active');
    
  } catch (error) {
    console.error('Get active subscription error:', error);
    return { success: false, error: error.message };
  }
};

// Cancel subscription
export const cancelSubscription = async (subscriptionId) => {
  try {
    return await apiRequest(`/cancel/${subscriptionId}`, 'PUT');
    
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return { success: false, error: error.message };
  }
};

// Check if user has active subscription
export const checkActiveSubscription = async () => {
  try {
    const result = await getActiveSubscription();
    
    if (result.success && result.data.success && result.data.data) {
      // User has active subscription
      return {
        hasActive: true,
        subscription: result.data.data
      };
    } else {
      // No active subscription
      return {
        hasActive: false,
        subscription: null
      };
    }
    
  } catch (error) {
    console.error('Check active subscription error:', error);
    return {
      hasActive: false,
      subscription: null,
      error: error.message
    };
  }
};

// Get current user subscription (from User model)
export const getCurrentUserSubscription = async () => {
  try {
    return await apiRequest('/current');
    
  } catch (error) {
    console.error('Get current user subscription error:', error);
    return { success: false, error: error.message };
  }
};