// Frontend/utils/api.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Base URL - Change this to your backend URL


const API_BASE_URL = 'http://10.10.7.122:8000/api/user';


// Helper function to get token from AsyncStorage
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Helper function to make API requests
const apiRequest = async (endpoint, method = 'GET', body = null, requiresAuth = false) => {
  try {
    console.log('🌐 API Request:', {
      endpoint,
      method,
      body,
      url: `${API_BASE_URL}${endpoint}`
    });

    const headers = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if required
    if (requiresAuth) {
      const token = await getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('🔑 Token added to request');
      }
    }

    const config = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    console.log('📤 Sending request...');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    console.log('📥 Response status:', response.status, response.ok ? '✅' : '❌');
    
    const data = await response.json();
    console.log('📦 Response data:', data);

    return {
      success: response.ok,
      status: response.status,
      data: data,
    };
  } catch (error) {
    console.error('💥 API Request Error:', error);
    console.error('Error details:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

// API Functions

// Send OTP
export const sendOTP = async (phone, countryCode = '+91') => {
  console.log('📞 sendOTP called with:', { phone, countryCode });
  const result = await apiRequest('/send-otp', 'POST', { phone, countryCode });
  console.log('📞 sendOTP result:', result);
  return result;
};

// Verify OTP
export const verifyOTP = async (phone, otp) => {
  return await apiRequest('/verify-otp', 'POST', { phone, otp });
};

// Resend OTP
export const resendOTP = async (phone, countryCode = '+91') => {
  return await apiRequest('/resend-otp', 'POST', { phone, countryCode });
};

// Register User
export const registerUser = async (userData) => {
  return await apiRequest('/register', 'POST', userData);
};

// Login User
export const loginUser = async (phone) => {
  return await apiRequest('/login', 'POST', { phone });
};

// Get User Profile (Protected)
export const getUserProfile = async () => {
  return await apiRequest('/profile', 'GET', null, true);
};

// Save token to AsyncStorage
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem('userToken', token);
    return true;
  } catch (error) {
    console.error('Error saving token:', error);
    return false;
  }
};

// Remove token from AsyncStorage
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
    return true;
  } catch (error) {
    console.error('Error removing token:', error);
    return false;
  }
};

// Save user data to AsyncStorage
export const saveUserData = async (userData) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

// Get user data from AsyncStorage
export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Clear all user data
export const clearUserData = async () => {
  try {
    await AsyncStorage.multiRemove(['userToken', 'userData']);
    return true;
  } catch (error) {
    console.error('Error clearing user data:', error);
    return false;
  }
};



// export const checkPhoneExists = async (phone) => {

//   try {
//     const response = await fetch(`${API_URL}/check-phone`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ phone }),
//     });
//     const data = await response.json();
//     return { success: response.ok, data };
//   } catch (error) {
//     console.error('Check phone error:', error);
//     return { success: false, error: error.message };
//   }
// };


export const checkPhoneExists = async (phone) => {
  console.log('🔍 Checking if phone exists:', phone);
  return await apiRequest('/check-phone', 'POST', { phone });  // ✅ Use apiRequest for consistency
};


// ===== PROPERTY APIs =====

const PROPERTY_API_BASE_URL = 'http://10.10.7.122:8000/api/properties';

// Create property with images
export const createProperty = async (propertyData, imageUris) => {
  try {
    const token = await getToken();
    
    const formData = new FormData();
    
    // Append images
    imageUris.forEach((uri, index) => {
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('images', {
        uri,
        name: filename,
        type
      });
    });
    
    // Append all property data fields
    Object.keys(propertyData).forEach(key => {
      if (typeof propertyData[key] === 'object') {
        formData.append(key, JSON.stringify(propertyData[key]));
      } else {
        formData.append(key, propertyData[key]);
      }
    });
    
    const response = await fetch(`${PROPERTY_API_BASE_URL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData - it sets boundary automatically
      },
      body: formData
    });
    
    const data = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data: data
    };
    
  } catch (error) {
    console.error('Create property error:', error);
    return { success: false, error: error.message };
  }
};