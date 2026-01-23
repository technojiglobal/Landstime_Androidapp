// // Landstime_Androidapp/admin/src/services/propertyService.js

// import axiosInstance from "../utils/axiosInstance";

// // Fetch ALL properties (admin)
// export const fetchAllProperties = async () => {
//   try {
//     const res = await axiosInstance.get("/properties/admin/all");
//     return res.data.data; // backend sends { success, data }
//   } catch (err) {
//     console.error('fetchAllProperties error:', err.response?.status, err.response?.data || err.message);
//     throw err;
//   }
// };

// // Update property status (approve / reject)
// export const updatePropertyStatus = async (id, status) => {
//   const res = await axiosInstance.patch(`/properties/admin/${id}/status`, {
//     status,
//   });
//   return res.data.data;
// };


// // Soft delete property
// export const softDeleteProperty = async (id) => {
//   const res = await axiosInstance.patch(`/properties/admin/${id}/soft-delete`);
//   return res.data;
// };

// // Update property availability
// export const updatePropertyAvailability = async (id, propertyStatus) => {
//   const res = await axiosInstance.patch(`/properties/admin/${id}/property-status`, {
//     propertyStatus
//   });
//   return res.data;
// };

// // Update property details
// // Update property details
// export const updatePropertyDetails = async (id, updatedData) => {
//   const res = await axiosInstance.put(`/properties/admin/${id}/update`, updatedData);
//   return res.data.data;
// };


// // Add to existing propertyService.js

// // Upload additional images
// export const uploadPropertyImages = async (propertyId, imageFiles) => {
//   try {
//     const formData = new FormData();
    
//     imageFiles.forEach(file => {
//       formData.append('images', file);
//     });
    
//     const response = await fetch(
//       `${import.meta.env.VITE_API_URL}/api/properties/admin/${propertyId}/upload-images`,
//       {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('adminToken')}`
//         },
//         body: formData
//       }
//     );
    
//     return await response.json();
//   } catch (error) {
//     console.error('Upload images error:', error);
//     throw error;
//   }
// };

// // Delete property image
// // Delete property image
// export const deletePropertyImage = async (propertyId, imageIndex) => {
//   try {
//     const response = await fetch(
//       `${import.meta.env.VITE_API_URL}/api/properties/admin/${propertyId}/delete-image`,
//       {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('adminToken')}`
//         },
//         body: JSON.stringify({ imageIndex })  // ✅ FIXED: Send index, not path
//       }
//     );
    
//     return await response.json();
//   } catch (error) {
//     console.error('Delete image error:', error);
//     throw error;
//   }
// };

// // Upload additional documents
// export const uploadPropertyDocuments = async (propertyId, documentFiles, documentType) => {
//   try {
//     const formData = new FormData();
//     formData.append('documentType', documentType);
    
//     documentFiles.forEach(file => {
//       formData.append(`${documentType}Docs`, file);
//     });
    
//     const response = await fetch(
//       `${import.meta.env.VITE_API_URL}/api/properties/admin/${propertyId}/upload-documents`,
//       {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('adminToken')}`
//         },
//         body: formData
//       }
//     );
    
//     return await response.json();
//   } catch (error) {
//     console.error('Upload documents error:', error);
//     throw error;
//   }
// };


// // Delete property document
// export const deletePropertyDocument = async (propertyId, documentIndex, documentType) => {
//   try {
//     const response = await fetch(
//       `${import.meta.env.VITE_API_URL}/api/properties/admin/${propertyId}/delete-document`,
//       {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('adminToken')}`
//         },
//         body: JSON.stringify({ documentIndex, documentType })
//       }
//     );
    
//     return await response.json();
//   } catch (error) {
//     console.error('Delete document error:', error);
//     throw error;
//   }
// };

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