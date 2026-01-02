// Frontend/utils/propertyApi.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_BASE_URL = 'http://10.37.92.184:8000/api/properties';

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
const apiRequest = async (endpoint, method = 'GET', body = null, isFormData = false) => {
  try {
    const token = await getToken();
    
    console.log('🔑 Token retrieved:', token ? 'Token exists' : 'No token found');
    
    const headers = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
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
    
    if (body) {
      config.body = isFormData ? body : JSON.stringify(body);
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data: data,
    };
    
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
export const createProperty = async (
  propertyData,
  imageUris = [],
  ownershipDocs = [],
  identityDocs = []
) => {
  try {
    const formData = new FormData();

    console.log("📸 Images:", imageUris);

    // ✅ PROPERTY IMAGES (EXPO SAFE)
   imageUris.forEach((uri, index) => {
  // Clean the URI - remove any file:// prefix if present
  const cleanUri = uri.replace('file://', '');
  
  formData.append("propertyImages", {
    uri: Platform.OS === 'ios' ? cleanUri : `file://${cleanUri}`,
    name: `property_${Date.now()}_${index}.jpg`,
    type: "image/jpeg",
  });
});

    // ✅ OWNERSHIP DOCS
    ownershipDocs.forEach((file, index) => {
      formData.append("ownershipDocs", {
        uri: file.uri.startsWith("file://") ? file.uri : `file://${file.uri}`,
        name: file.name || `ownership_${index}.jpg`,
        type: file.type || "image/jpeg",
      });
    });

    // ✅ IDENTITY DOCS
    identityDocs.forEach((file, index) => {
      formData.append("identityDocs", {
        uri: file.uri.startsWith("file://") ? file.uri : `file://${file.uri}`,
        name: file.name || `identity_${index}.jpg`,
        type: file.type || "image/jpeg",
      });
    });

    // ✅ PROPERTY DATA
    formData.append("propertyData", JSON.stringify(propertyData));

    return await apiRequest("/", "POST", formData, true);
  } catch (error) {
    console.error("❌ createProperty error:", error);
    return { success: false, error: error.message };
  }
};


// Get all approved properties
export const getApprovedProperties = async (propertyType = null, page = 1) => {
  let endpoint = `/approved?page=${page}`;
  if (propertyType) {
    endpoint += `&propertyType=${propertyType}`;
  }
  return await apiRequest(endpoint);
};

// Get single property by ID
export const getPropertyById = async (propertyId) => {
  return await apiRequest(`/${propertyId}`);
};

// Get user's own properties
export const getUserProperties = async () => {
  return await apiRequest('/user/my-properties');
};

// Update property
export const updateProperty = async (propertyId, propertyData) => {
  return await apiRequest(`/${propertyId}`, 'PUT', propertyData);
};

// Delete property
export const deleteProperty = async (propertyId) => {
  return await apiRequest(`/${propertyId}`, 'DELETE');
};

// ADMIN APIs

// Get all pending properties
export const getPendingProperties = async () => {
  return await apiRequest('/admin/pending');
};

// Get all properties (admin)
export const getAllPropertiesAdmin = async (status = null, propertyType = null, page = 1) => {
  let endpoint = `/admin/all?page=${page}`;
  if (status) endpoint += `&status=${status}`;
  if (propertyType) endpoint += `&propertyType=${propertyType}`;
  return await apiRequest(endpoint);
};

// Update property status (admin)
export const updatePropertyStatus = async (propertyId, status, rejectionReason = null) => {
  const body = { status };
  if (rejectionReason) {
    body.rejectionReason = rejectionReason;
  }
  return await apiRequest(`/admin/${propertyId}/status`, 'PATCH', body);
};