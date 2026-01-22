// admin/src/hooks/usePropertyUpload.js
import { useState } from 'react';
import { createProperty } from '../services/propertyService';

const usePropertyUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadProperty = async (propertyData, files) => {
    setLoading(true);
    setError(null);

    try {
      console.log('📋 Preparing FormData...', {
        propertyData,
        images: files.images?.length || 0,
        ownershipDocs: files.ownershipDocs?.length || 0,
        identityDocs: files.identityDocs?.length || 0
      });

      // Create FormData for multipart upload
      const uploadData = new FormData();

      // Add property data as JSON string
      uploadData.append('propertyData', JSON.stringify(propertyData));

      // Add images
      if (files.images && files.images.length > 0) {
        files.images.forEach(file => {
          uploadData.append('images', file);
        });
      }

      // Add ownership documents
      if (files.ownershipDocs && files.ownershipDocs.length > 0) {
        files.ownershipDocs.forEach(file => {
          uploadData.append('ownershipDocs', file);
        });
      }

      // Add identity documents
      if (files.identityDocs && files.identityDocs.length > 0) {
        files.identityDocs.forEach(file => {
          uploadData.append('identityDocs', file);
        });
      }

      const result = await createProperty(uploadData);

      console.log('✅ Property uploaded successfully:', result);

      setLoading(false);
      return result;

    } catch (err) {
      console.error('❌ Upload error:', err);
      setError(err.message || 'Failed to upload property');
      setLoading(false);
      throw err;
    }
  };

  return { uploadProperty, loading, error };
};

export default usePropertyUpload;