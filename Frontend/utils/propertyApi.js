// Frontend/utils/propertyApi.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { API_URL } from './apiConfig.js';
import { getImageUrl, getImageUrls, getDocumentUrls } from './imageHelper.js';
const API_BASE_URL = `${API_URL}/api/properties`;
export default API_BASE_URL;


// Helper function to get token
// Helper function to get token
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    
    if (!token) {
      console.error('❌ No token found in AsyncStorage');
      return null;
    }
    
    // ✅ Clean token (remove any whitespace, quotes, or Bearer prefix)
    const cleanToken = token.trim().replace(/^["']|["']$/g, '').replace(/^Bearer\s+/i, '');
    
    console.log('🔍 Token retrieved:', cleanToken.substring(0, 20) + '...');
    console.log('🔢 Token length:', cleanToken.length);
    
    // ✅ Validate token format (JWT has 3 parts separated by dots)
    if (!cleanToken.includes('.')) {
      console.error('❌ Invalid token format - not a JWT');
      return null;
    }
    
    return cleanToken;
  } catch (error) {
    console.error('❌ Error getting token:', error);
    return null;
  }
};

// Helper function for API requests
const apiRequest = async (endpoint, method = 'GET', body = null, isFormData = false) => {
  try {
    const token = await getToken();
    
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log('🌐 Full Request URL:', fullUrl);
    console.log('🔑 Token exists:', !!token);
    console.log('📤 Method:', method);
    console.log('📦 Is FormData:', isFormData);
    
    const headers = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
      method,
      headers,
    };
    
    if (body) {
      config.body = isFormData ? body : JSON.stringify(body);
    }
    
    console.log('🚀 Sending request to:', fullUrl);
    const response = await fetch(fullUrl, config);
    console.log('📡 Response received. Status:', response.status);
    
    const data = await response.json();
    //console.log('📥 Response data:', data);
    
    return {
      success: response.ok,
      status: response.status,
      data: data,
    };
    
  } catch (error) {
    console.error('❌ API Request Error:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
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

    // Helper to append files in a web/native-compatible way
   const appendFile = async (fieldName, fileOrUri, index, defaultPrefix) => {
  // Web: convert blob/data URIs to File objects
  if (Platform.OS === 'web') {
    try {
      // ✅ Handle File/Blob objects
      if (fileOrUri instanceof File || fileOrUri instanceof Blob) {
        const filename = fileOrUri.name || `${defaultPrefix}_${index}.jpg`;
        formData.append(fieldName, fileOrUri, filename);
        return;
      }

      // ✅ Handle string blob/data URIs
      if (typeof fileOrUri === 'string' && (fileOrUri.startsWith('blob:') || fileOrUri.startsWith('data:'))) {
        const response = await fetch(fileOrUri);
        const blob = await response.blob();
        const ext = (blob.type && blob.type.split('/')[1]) || 'jpg';
        const filename = `${defaultPrefix}_${index}.${ext}`;
        const file = new File([blob], filename, { type: blob.type || 'application/pdf' });
        formData.append(fieldName, file, filename);
        return;
      }

      // ✅ NEW: Handle objects with uri property (blob URLs)
      if (fileOrUri && fileOrUri.uri) {
        const uri = fileOrUri.uri;
        
        // Check if uri is a File/Blob
        if (uri instanceof File || uri instanceof Blob) {
          const filename = uri.name || fileOrUri.name || `${defaultPrefix}_${index}.jpg`;
          formData.append(fieldName, uri, filename);
          return;
        }
        
        // ✅ NEW: Handle uri as blob URL string
        if (typeof uri === 'string' && (uri.startsWith('blob:') || uri.startsWith('data:'))) {
          const response = await fetch(uri);
          const blob = await response.blob();
          
          // Determine file extension from blob type or filename
          let ext = 'pdf';
          if (blob.type) {
            const parts = blob.type.split('/');
            ext = parts[1] || 'pdf';
          } else if (fileOrUri.name) {
            const nameParts = fileOrUri.name.split('.');
            ext = nameParts[nameParts.length - 1] || 'pdf';
          }
          
          const filename = fileOrUri.name || `${defaultPrefix}_${index}.${ext}`;
          const mimeType = blob.type || fileOrUri.type || 'application/pdf';
          const file = new File([blob], filename, { type: mimeType });
          formData.append(fieldName, file, filename);
          return;
        }
      }

      console.warn(`Unsupported web file for ${fieldName}:`, fileOrUri);
        } catch (err) {
          console.error('Error preparing web file for upload:', err);
        }
      } else {
        // Native platforms (iOS/Android): append as {uri,name,type}
        const uri = typeof fileOrUri === 'string' ? fileOrUri : (fileOrUri.uri || fileOrUri);
        formData.append(fieldName, {
          uri: uri.startsWith('file://') ? uri : `file://${uri}`,
          name: fileOrUri.name || `${defaultPrefix}_${index}.jpg`,
          type: fileOrUri.type || 'image/jpeg',
        });
      }
    };

    // Append property images
    for (let i = 0; i < imageUris.length; i += 1) {
      // support either string URIs or objects
      await appendFile('images', imageUris[i], i, `property_${i}`);
    }

    // Append ownership docs
    for (let i = 0; i < ownershipDocs.length; i += 1) {
      await appendFile('ownershipDocs', ownershipDocs[i], i, `ownership_${i}`);
    }

    // Append identity docs
    for (let i = 0; i < identityDocs.length; i += 1) {
      await appendFile('identityDocs', identityDocs[i], i, `identity_${i}`);
    }

    // ✅ PROPERTY DATA with debug logging
    console.log("📦 Property Data being sent:", {
      originalLanguage: propertyData.originalLanguage,
      propertyTitle: propertyData.propertyTitle,
      location: propertyData.location?.substring(0, 30)
    });

    formData.append("propertyData", JSON.stringify(propertyData));

    return await apiRequest("/", "POST", formData, true);
  } catch (error) {
    console.error("❌ createProperty error:", error);
    return { success: false, error: error.message };
  }
};

// Add this import at the top


// Add this helper function after getToken()
const transformPropertyData = (property) => {
  if (!property) return null;

  return {
    ...property,
    // Transform image paths to full URLs
    images: getImageUrls(property.images),
    imageUrls: getImageUrls(property.images), // Keep both for compatibility
    
    // Transform document paths to full URLs
    documents: {
      ownership: getImageUrls(property.documents?.ownership || []),
      identity: getImageUrls(property.documents?.identity || [])
    },
    documentUrls: getDocumentUrls(property.documents),
    
    // Keep original paths for reference
    _originalImages: property.images,
    _originalDocuments: property.documents
  };
};

// ✅ UPDATE: Modify getApprovedProperties
export const getApprovedProperties = async (propertyType = null, page = 1, language = 'en') => {
  let endpoint = `/approved?page=${page}&language=${language}`;
  if (propertyType) {
    endpoint += `&propertyType=${propertyType}`;
  }
  
  const result = await apiRequest(endpoint);
  
  // Transform all properties with image URLs
  if (result.success && result.data?.data) {
    result.data.data = result.data.data.map(transformPropertyData);
  }
  
  return result;
};

// ✅ UPDATE: Modify getPropertyById
export const getPropertyById = async (propertyId, language = 'en') => {
  console.log('🔍 Fetching property with language:', language);
  const response = await apiRequest(`/${propertyId}?language=${language}`);
  
  // Transform property with image URLs
  if (response.success && response.data?.data) {
    response.data.data = transformPropertyData(response.data.data);
  }
  
  console.log('📦 API Response:', response.data);
  return response;
};

// ✅ UPDATE: Modify getUserProperties
export const getUserProperties = async () => {
  const result = await apiRequest('/user/my-properties');
  console.log('📦 getUserProperties result:', result);
  
  let properties = [];
  
  // Extract the actual properties array from nested structure
  if (result.success && result.data) {
    properties = result.data.data || result.data || [];
  }
  
  // Transform all properties with image URLs
  properties = properties.map(transformPropertyData);
  
  return properties;
};
// Update property
export const updateProperty = async (propertyId, propertyData) => {
  return await apiRequest(`/${propertyId}`, 'PUT', propertyData);
};

// Delete property
export const deleteProperty = async (propertyId) => {
  return await apiRequest(`/${propertyId}`, 'DELETE');
};

// Delete property image by index
export const deletePropertyImage = async (propertyId, imageIndex) => {
  return await apiRequest(`/${propertyId}/image`, 'DELETE', { imageIndex });
};

// Upload additional images
export const uploadAdditionalImages = async (propertyId, imageUris) => {
  try {
    const formData = new FormData();
    
    imageUris.forEach((uri, index) => {
      formData.append("images", {
        uri: uri.startsWith("file://") ? uri : `file://${uri}`,
        name: `additional_${index}.jpg`,
        type: "image/jpeg",
      });
    });

    return await apiRequest(`/${propertyId}/images`, 'POST', formData, true);
  } catch (error) {
    console.error("❌ uploadAdditionalImages error:", error);
    return { success: false, error: error.message };
  }
};

// Delete property document by index
export const deletePropertyDocument = async (propertyId, documentIndex, documentType) => {
  return await apiRequest(`/${propertyId}/document`, 'DELETE', { 
    documentIndex, 
    documentType 
  });
};

// Upload additional documents
export const uploadAdditionalDocuments = async (propertyId, documents, documentType) => {
  try {
    const formData = new FormData();
    
    formData.append('documentType', documentType);
    
    const fieldName = `${documentType}Docs`;
    documents.forEach((file, index) => {
      formData.append(fieldName, {
        uri: file.uri.startsWith("file://") ? file.uri : `file://${file.uri}`,
        name: file.name || `${documentType}_${index}.jpg`,
        type: file.type || "image/jpeg",
      });
    });

    return await apiRequest(`/${propertyId}/documents`, 'POST', formData, true);
  } catch (error) {
    console.error("❌ uploadAdditionalDocuments error:", error);
    return { success: false, error: error.message };
  }
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

// Soft delete property (admin)
export const softDeleteProperty = async (propertyId) => {
  return await apiRequest(`/admin/${propertyId}`, 'DELETE');
};

// Update property availability (admin)
export const updatePropertyAvailability = async (propertyId, propertyStatus) => {
  return await apiRequest(`/admin/${propertyId}/availability`, 'PATCH', { propertyStatus });
};

// Admin update property details
export const adminUpdateProperty = async (propertyId, propertyData) => {
  return await apiRequest(`/admin/${propertyId}`, 'PUT', propertyData);
};

// Add this test function at the bottom
export const testBackendConnection = async () => {
  try {
    console.log('🧪 Testing backend connection...');
    console.log('🎯 API_URL:', API_URL);
    console.log('🎯 Full URL:', `${API_URL}/api/properties/approved`);
    
    const response = await fetch(`${API_URL}/api/properties/approved`);
    console.log('✅ Response status:', response.status);
    
    const data = await response.json();
    console.log('✅ Backend is reachable!', data);
    return true;
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    return false;
  }
};