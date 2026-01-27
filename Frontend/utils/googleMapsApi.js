// utils/googleMapsApi.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './apiConfig';

// Cache for API key (valid for current session)
let cachedApiKey = null;
let cachedConfig = null;
let cacheTimestamp = null;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

/**
 * Fetch Google Maps API Key from backend
 * @returns {Promise<string>} Google Maps API key
 */
export const getGoogleMapsApiKey = async () => {
  try {
    // Return cached key if still valid
    if (cachedApiKey && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
      console.log('🗺️  Using cached Google Maps API key');
      return cachedApiKey;
    }

    // Get authentication token
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('Authentication required. Please login to access maps.');
    }

    console.log('🗺️  Fetching Google Maps API key from backend...');
    console.log('📡 Backend URL:', `${API_URL}/api/config/google-maps`);
    
    // Fetch configuration from backend
    const response = await axios.get(
      `${API_URL}/api/config/google-maps`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 10000 // 10 second timeout
      }
    );

    console.log('📥 Response received:', response.data);

    if (response.data.success && response.data.data) {
      const { apiKey, ...config } = response.data.data;
      
      if (!apiKey) {
        throw new Error('API key not found in response');
      }

      // Cache the key and config
      cachedApiKey = apiKey;
      cachedConfig = config;
      cacheTimestamp = Date.now();
      
      console.log('✅ Google Maps API key fetched and cached successfully');
      console.log('📍 Default location:', config.defaultLocation);
      
      return apiKey;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('❌ Error fetching Google Maps API key:', error);
    
    // Provide user-friendly error messages
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message;
      
      if (status === 401) {
        throw new Error('Session expired. Please login again to access maps.');
      } else if (status === 500) {
        throw new Error(message || 'Maps service temporarily unavailable. Please try again later.');
      } else {
        throw new Error(message || 'Failed to load maps configuration.');
      }
    } else if (error.request) {
      throw new Error('Cannot connect to server. Please check your internet connection.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your internet connection.');
    } else {
      throw new Error(error.message || 'Failed to load maps. Please try again.');
    }
  }
};

/**
 * Get complete Google Maps configuration
 * @returns {Promise<Object>} Complete configuration object
 */
export const getGoogleMapsConfig = async () => {
  try {
    // If config is cached, return it
    if (cachedConfig && cachedApiKey && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
      return {
        apiKey: cachedApiKey,
        ...cachedConfig
      };
    }

    // Fetch fresh config
    await getGoogleMapsApiKey();
    
    return {
      apiKey: cachedApiKey,
      ...cachedConfig
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Clear cached API key and configuration
 * Call this on logout or when user session ends
 */
export const clearGoogleMapsCache = () => {
  cachedApiKey = null;
  cachedConfig = null;
  cacheTimestamp = null;
  console.log('🗑️  Google Maps cache cleared');
};

/**
 * Check if Maps API is working properly
 * @returns {Promise<boolean>} True if API is healthy
 */
export const checkMapsApiHealth = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.warn('⚠️  Cannot check Maps API health: not authenticated');
      return false;
    }

    console.log('🏥 Checking Maps API health...');
    
    const response = await axios.get(
      `${API_URL}/api/config/google-maps/health`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 10000
      }
    );

    const isHealthy = response.data.success;
    console.log(isHealthy ? '✅ Maps API is healthy' : '❌ Maps API health check failed');
    
    return isHealthy;
  } catch (error) {
    console.error('❌ Maps API health check failed:', error.message);
    return false;
  }
};

/**
 * Prefetch API key in background (useful for app initialization)
 * Call this when app starts or user logs in
 */
export const prefetchGoogleMapsKey = async () => {
  try {
    await getGoogleMapsApiKey();
    console.log('🚀 Google Maps API key prefetched successfully');
    return true;
  } catch (error) {
    console.warn('⚠️  Failed to prefetch Google Maps API key:', error.message);
    return false;
  }
};

/**
 * Get cached API key without making network request
 * Returns null if not cached
 */
export const getCachedApiKey = () => {
  if (cachedApiKey && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
    return cachedApiKey;
  }
  return null;
};

/**
 * Check if API key is cached and valid
 */
export const hasValidCache = () => {
  return !!(cachedApiKey && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION));
};