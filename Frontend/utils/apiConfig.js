

// Frontend/utils/apiConfig.js

import Constants from 'expo-constants';

const getApiUrl = () => {
  if (__DEV__) {
    const { manifest } = Constants;
    
    if (manifest?.debuggerHost) {
      const host = manifest.debuggerHost.split(':').shift();
      return `http://${host}:8000`;
    }
    
    if (Constants.expoConfig?.hostUri) {
      const host = Constants.expoConfig.hostUri.split(':').shift();
      return `http://${host}:8000`;
    }
    
    // Fallback to .env
    return process.env.EXPO_PUBLIC_IP_ADDRESS || 'http://192.168.31.115:8000';
  }
  
  return process.env.EXPO_PUBLIC_API_URL || 'https://your-production-url.com';
};

export const API_URL = getApiUrl();