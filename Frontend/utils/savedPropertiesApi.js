// Frontend/utils/savedPropertiesApi.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './apiConfig';

const BASE_URL = `${API_URL}/api/saved`;

// Get auth token
const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Save a property or interior
export const saveProperty = async (entityId, entityType) => {
  try {
    const token = await getAuthToken();
    
    // ✅ ADD THESE LOGS:
    console.log('💾 saveProperty called');
    console.log('Entity ID:', entityId);
    console.log('Entity Type:', entityType);
    console.log('Token exists:', !!token);
    
    if (!token) {
      return { success: false, error: 'Not authenticated' };
    }

    const payload = { 
      entityId, 
      entityType: entityType === 'interior' ? 'InteriorDesign' : 'Property' 
    };
    
    // ✅ ADD THIS LOG:
    console.log('Payload being sent:', payload);

    const response = await fetch(`${BASE_URL}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    // ✅ ADD THIS LOG:
    console.log('Backend response:', response.status, data);
    
    return data;
  } catch (error) {
    console.error('Error saving property:', error);
    return { success: false, error: error.message };
  }
};

// Unsave a property or interior
export const unsaveProperty = async (entityId, entityType) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, error: 'Not authenticated' };
    }

    const response = await fetch(`${BASE_URL}/unsave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
  entityId, 
  entityType: entityType === 'interior' ? 'InteriorDesign' : 'Property' 
})
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error unsaving property:', error);
    return { success: false, error: error.message };
  }
};

// Get all saved properties
export const getSavedProperties = async (entityType = null) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, error: 'Not authenticated' };
    }

    const url = entityType 
  ? `${BASE_URL}?entityType=${entityType === 'interior' ? 'InteriorDesign' : entityType === 'property' ? 'Property' : entityType}`
  : BASE_URL;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching saved properties:', error);
    return { success: false, error: error.message };
  }
};

// Check if a property is saved
export const checkIfSaved = async (entityId, entityType) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, error: 'Not authenticated' };
    }

    const response = await fetch(
     `${BASE_URL}/check?entityId=${entityId}&entityType=${entityType === 'interior' ? 'InteriorDesign' : 'Property'}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking saved status:', error);
    return { success: false, error: error.message };
  }
};