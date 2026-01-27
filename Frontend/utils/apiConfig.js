

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
    return process.env.EXPO_PUBLIC_IP_ADDRESS;
  }
  
  return process.env.EXPO_PUBLIC_API_URL;
};

export const API_URL = getApiUrl();