import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getApiUrl = () => {
  // Development mode with Expo Go
  if (__DEV__) {
    // Automatically get the IP from Expo's debugger
    const { manifest } = Constants;
    
    if (manifest?.debuggerHost) {
      const host = manifest.debuggerHost.split(':').shift();
      return `http://${host}:8000`;
    }
    
    // New Expo SDK version
    if (Constants.expoConfig?.hostUri) {
      const host = Constants.expoConfig.hostUri.split(':').shift();
      return `http://${host}:8000`;
    }
  }
  
  // Production or fallback
  return process.env.EXPO_PUBLIC_API_URL || 'https://your-production-url.com';
};

export const API_URL = getApiUrl();

console.log('🌐 API URL:', API_URL); // Debug log