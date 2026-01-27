// Frontend/utils/imageHelper.js
import { Platform } from 'react-native';
import { API_URL } from './apiConfig.js';

/**
 * Converts backend file paths to full URLs
 * Handles both old base64 format and new file paths
 */
export const getImageUrl = (path) => {
  // Return placeholder if no path
  // if (!path) {
  //   return require('../assets/placeholder.jpg'); // or your placeholder
  // }

  // If already base64 data URI, return as-is (backward compatibility)
  if (typeof path === 'string' && path.startsWith('data:')) {
    return path;
  }

  // If already a complete HTTP URL, return as-is
  if (typeof path === 'string' && (path.startsWith('http://') || path.startsWith('https://'))) {
    return path;
  }

  // Otherwise, prepend backend URL
  const baseUrl = API_URL.replace(/\/$/, ''); // Remove trailing slash
  const imagePath = path.startsWith('/') ? path : `/${path}`;
  
  const fullUrl = `${baseUrl}${imagePath}`;
  
  console.log('🖼️ Image URL generated:', fullUrl);
  return fullUrl;
};

/**
 * Converts array of paths to array of URLs
 */
export const getImageUrls = (paths = []) => {
  if (!Array.isArray(paths)) return [];
  return paths.map(path => getImageUrl(path));
};

/**
 * Get document URL (same logic as images)
 */
export const getDocumentUrl = (path) => {
  return getImageUrl(path);
};

/**
 * Get all document URLs from documents object
 */
export const getDocumentUrls = (documents = {}) => {
  return {
    ownership: getImageUrls(documents.ownership || []),
    identity: getImageUrls(documents.identity || [])
  };
};

/**
 * Validate if image URL is accessible
 */
export const validateImageUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('❌ Image validation failed:', error);
    return false;
  }
};