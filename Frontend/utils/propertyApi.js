// Frontend/utils/propertyApi.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_BASE_URL = `${process.env.EXPO_PUBLIC_IP_ADDRESS}/api/properties`;
export default API_BASE_URL;


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

    // Helper to append files in a web/native-compatible way
    const appendFile = async (fieldName, fileOrUri, index, defaultPrefix) => {
      // Web: convert blob/data URIs to File objects
      if (Platform.OS === 'web') {
        try {
          if (fileOrUri instanceof File || fileOrUri instanceof Blob) {
            const filename = fileOrUri.name || `${defaultPrefix}_${index}.jpg`;
            formData.append(fieldName, fileOrUri, filename);
            return;
          }

          if (typeof fileOrUri === 'string' && (fileOrUri.startsWith('blob:') || fileOrUri.startsWith('data:'))) {
            const response = await fetch(fileOrUri);
            const blob = await response.blob();
            const ext = (blob.type && blob.type.split('/')[1]) || 'jpg';
            const filename = `${defaultPrefix}_${index}.${ext}`;
            const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });
            formData.append(fieldName, file, filename);
            return;
          }

          // Sometimes objects come with a uri property on web
          if (fileOrUri && fileOrUri.uri && (fileOrUri.uri instanceof File || fileOrUri.uri instanceof Blob)) {
            const f = fileOrUri.uri;
            const filename = f.name || `${defaultPrefix}_${index}.jpg`;
            formData.append(fieldName, f, filename);
            return;
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

// Get all approved properties
// ✅ NEW CODE
export const getApprovedProperties = async (propertyType = null, page = 1, language = 'en') => {
  let endpoint = `/approved?page=${page}&language=${language}`;
  if (propertyType) {
    endpoint += `&propertyType=${propertyType}`;
  }
  return await apiRequest(endpoint);
};

// Get single property by ID
// Get single property by ID
// export const getPropertyById = async (propertyId, language = 'en') => {
//   return await apiRequest(`/${propertyId}?language=${language}`);
// };

export const getPropertyById = async (propertyId, language = 'en') => {
  console.log('🔍 Fetching property with language:', language);
  const response = await apiRequest(`/${propertyId}?language=${language}`);
  console.log('📦 API Response:', response.data);
  return response;
};


// Get user's own properties
export const getUserProperties = async () => {
  const result = await apiRequest('/user/my-properties');
  console.log('📦 getUserProperties result:', result);
  
  // Extract the actual properties array from nested structure
  if (result.success && result.data) {
    return result.data.data || result.data || [];
  }
  
  return [];
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