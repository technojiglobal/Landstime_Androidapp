// Landstime_Androidapp/admin/src/services/propertyService.js

import axiosInstance from "../utils/axiosInstance";

// Fetch ALL properties (admin)
export const fetchAllProperties = async () => {
  try {
    const res = await axiosInstance.get("/properties/admin/all");
    return res.data.data; // backend sends { success, data }
  } catch (err) {
    console.error('fetchAllProperties error:', err.response?.status, err.response?.data || err.message);
    throw err;
  }
};

// Update property status (approve / reject)
export const updatePropertyStatus = async (id, status) => {
  const res = await axiosInstance.patch(`/properties/admin/${id}/status`, {
    status,
  });
  return res.data.data;
};


// Soft delete property
export const softDeleteProperty = async (id) => {
  const res = await axiosInstance.patch(`/properties/admin/${id}/soft-delete`);
  return res.data;
};

// Update property availability
export const updatePropertyAvailability = async (id, propertyStatus) => {
  const res = await axiosInstance.patch(`/properties/admin/${id}/property-status`, {
    propertyStatus
  });
  return res.data;
};

// Update property details
// Update property details
export const updatePropertyDetails = async (id, updatedData) => {
  const res = await axiosInstance.put(`/properties/admin/${id}/update`, updatedData);
  return res.data.data;
};


// Add to existing propertyService.js

// Upload additional images
export const uploadPropertyImages = async (propertyId, imageFiles) => {
  try {
    const formData = new FormData();
    
    imageFiles.forEach(file => {
      formData.append('images', file);
    });
    
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/properties/admin/${propertyId}/upload-images`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('adminToken')}`
        },
        body: formData
      }
    );
    
    return await response.json();
  } catch (error) {
    console.error('Upload images error:', error);
    throw error;
  }
};

// Delete property image
export const deletePropertyImage = async (propertyId, imagePath) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/properties/admin/${propertyId}/delete-image`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ imagePath })
      }
    );
    
    return await response.json();
  } catch (error) {
    console.error('Delete image error:', error);
    throw error;
  }
};

// Upload additional documents
export const uploadPropertyDocuments = async (propertyId, documentFiles, documentType) => {
  try {
    const formData = new FormData();
    formData.append('documentType', documentType);
    
    documentFiles.forEach(file => {
      formData.append(`${documentType}Docs`, file);
    });
    
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/properties/admin/${propertyId}/upload-documents`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('adminToken')}`
        },
        body: formData
      }
    );
    
    return await response.json();
  } catch (error) {
    console.error('Upload documents error:', error);
    throw error;
  }
};

// Delete property document
export const deletePropertyDocument = async (propertyId, documentPath, documentType) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/properties/admin/${propertyId}/delete-document`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ documentPath, documentType })
      }
    );
    
    return await response.json();
  } catch (error) {
    console.error('Delete document error:', error);
    throw error;
  }
};