// Frontend/utils/interiorDesignViewApi.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './apiConfig';

const BASE_URL = `${API_URL}/api/user/interior-design-views`;

// Get auth token
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');  // ✅ Changed from 'token' to 'userToken'
    if (!token) {
      console.error('❌ No token found');
      return null;
    }
    const cleanToken = token.trim().replace(/^["']|["']$/g, '').replace(/^Bearer\s+/i, '');
    console.log('🔑 interiorDesignViewApi - Token retrieved:', cleanToken ? 'exists' : 'null');
    return cleanToken;
  } catch (error) {
    console.error('❌ Error getting token:', error);
    return null;
  }
};

// ==================== CHECK DESIGN VIEW ACCESS ====================
export const checkDesignViewAccess = async (designId, userName, userPhone) => {
  try {
    const token = await getToken();
    
    console.log('🔍 checkDesignViewAccess - Token check:', {
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'null'
    });
    
    if (!token) {
      console.log('❌ No token found in AsyncStorage');
      return {
        success: false,
        canView: false,
        reason: 'no_token',
        message: 'Please login to continue'
      };
    }

    console.log('🔍 Checking design view access:', { designId, userName, userPhone });

    const response = await fetch(`${BASE_URL}/check-access`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        designId,
        userName,
        userPhone
      })
    });

    const data = await response.json();
    console.log('📥 Access check response:', data);

    return {
      success: data.success,
      canView: data.canView,
      alreadyViewed: data.alreadyViewed,
      designerDetails: data.designerDetails,
      reason: data.reason,
      message: data.message
    };

  } catch (error) {
    console.error('❌ Check design view access error:', error);
    return {
      success: false,
      canView: false,
      reason: 'network_error',
      message: 'Network error. Please try again.'
    };
  }
};

// ==================== RECORD DESIGN VIEW ====================
export const recordDesignView = async (designId) => {
  try {
    const token = await getToken();
    
    if (!token) {
      return {
        success: false,
        message: 'Please login to continue'
      };
    }

    console.log('📝 Recording design view:', designId);

    const response = await fetch(`${BASE_URL}/record`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        designId
      })
    });

    const data = await response.json();
    console.log('📥 Record view response:', data);

    return {
      success: data.success,
      designerDetails: data.designerDetails,
      message: data.message
    };

  } catch (error) {
    console.error('❌ Record design view error:', error);
    return {
      success: false,
      message: 'Failed to record view. Please try again.'
    };
  }
};