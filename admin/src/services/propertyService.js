
// admin/src/services/propertyService.js
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;


// Get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ========== USER PROPERTY OPERATIONS ==========

export const createProperty = async (formData) => {
  try {
    console.log('📤 Sending property data to backend...');
    
    const response = await axios.post(
      `${API_URL}/admin/properties/create`,
      formData,
      {
        headers: getAuthHeader()
      }
    );
    
    console.log('✅ Property created:', response.data);
    return response.data;
  } catch (error) {
    // ✅ ADD THIS DETAILED LOGGING
    console.error('❌ Create property error:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message);
    console.error('Full error:', error.response?.data);
    
    throw error.response?.data || error;
  }
};

export const getUserProperties = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/properties/user/my-properties`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getApprovedProperties = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await axios.get(
      `${API_URL}/properties/approved?${queryParams}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getPropertyById = async (id, language = 'en') => {
  try {
    const response = await axios.get(
      `${API_URL}/properties/${id}?language=${language}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateProperty = async (id, data) => {
  try {
    const response = await axios.put(
      `${API_URL}/properties/${id}`,
      data,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteProperty = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/properties/${id}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ========== IMAGE/DOCUMENT OPERATIONS ==========

export const uploadPropertyImages = async (propertyId, files) => {
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await axios.post(
      `${API_URL}/properties/${propertyId}/images`,
      formData,
      {
        headers: {
          ...getAuthHeader(),
          
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deletePropertyImage = async (propertyId, imageIndex) => {
  try {
    const response = await axios.delete(
      `${API_URL}/properties/${propertyId}/images`,
      {
        headers: getAuthHeader(),
        data: { imageIndex }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const uploadPropertyDocuments = async (propertyId, files, documentType) => {
  try {
    const formData = new FormData();
    const fieldName = `${documentType}Docs`;
    files.forEach(file => {
      formData.append(fieldName, file);
    });
    formData.append('documentType', documentType);

    const response = await axios.post(
      `${API_URL}/properties/${propertyId}/documents`,
      formData,
      {
        headers: {
          ...getAuthHeader(),
          
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deletePropertyDocument = async (propertyId, documentIndex, documentType) => {
  try {
    const response = await axios.delete(
      `${API_URL}/properties/${propertyId}/documents`,
      {
        headers: getAuthHeader(),
        data: { documentIndex, documentType }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ========== ADMIN OPERATIONS ==========

export const getAllProperties = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await axios.get(
      `${API_URL}/properties/admin/all?${queryParams}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getPendingProperties = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/properties/admin/pending`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updatePropertyStatus = async (id, status, rejectionReason) => {
  try {
    const response = await axios.patch(
      `${API_URL}/properties/admin/${id}/status`,
      { status, rejectionReason },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const adminUpdateProperty = async (id, data) => {
  try {
    const response = await axios.put(
      `${API_URL}/properties/admin/${id}`,
      data,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const adminDeleteProperty = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/properties/admin/${id}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updatePropertyAvailability = async (id, propertyStatus) => {
  try {
    const response = await axios.patch(
      `${API_URL}/properties/admin/${id}/availability`,
      { propertyStatus },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};