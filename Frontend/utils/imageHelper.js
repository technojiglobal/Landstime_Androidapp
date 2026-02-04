// Frontend/utils/imageHelper.js
import { API_URL } from './apiConfig.js';

/**
 * Check if a URL is a Cloudinary URL
 */
export const isCloudinaryUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
};

/**
 * Get full image URL
 * Handles both Cloudinary URLs and legacy local storage URLs
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL (Cloudinary), return as is
  if (isCloudinaryUrl(imagePath)) {
    return imagePath;
  }
  
  // If it's a full HTTP/HTTPS URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Legacy: Handle local storage paths (for backward compatibility)
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${API_URL}/${cleanPath}`;
};

/**
 * Get array of full image URLs
 */
export const getImageUrls = (imagePaths) => {
  if (!imagePaths || !Array.isArray(imagePaths)) return [];
  return imagePaths.map(path => getImageUrl(path)).filter(url => url !== null);
};

/**
 * Get document URLs organized by type
 */
export const getDocumentUrls = (documents) => {
  if (!documents || typeof documents !== 'object') {
    return { ownership: [], identity: [] };
  }
  
  return {
    ownership: getImageUrls(documents.ownership || []),
    identity: getImageUrls(documents.identity || []),
  };
};

/**
 * Get optimized Cloudinary URL with transformations
 * Only works for Cloudinary URLs, returns original URL otherwise
 */
export const getOptimizedImageUrl = (imagePath, options = {}) => {
  const url = getImageUrl(imagePath);
  
  if (!url || !isCloudinaryUrl(url)) {
    return url; // Return original if not Cloudinary
  }
  
  const {
    width,
    height,
    quality = 'auto:good',
    format = 'auto',
    crop = 'fill',
  } = options;
  
  try {
    // Extract the part before /upload/
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return url;
    
    const baseUrl = url.substring(0, uploadIndex);
    const pathAfterUpload = url.substring(uploadIndex + 8); // +8 for '/upload/'
    
    // Build transformation string
    const transformations = [];
    
    if (width || height) {
      transformations.push(`w_${width || 'auto'},h_${height || 'auto'},c_${crop}`);
    }
    
    transformations.push(`q_${quality}`);
    transformations.push(`f_${format}`);
    
    const transformString = transformations.join(',');
    
    return `${baseUrl}/upload/${transformString}/${pathAfterUpload}`;
  } catch (error) {
    console.error('Error optimizing image URL:', error);
    return url;
  }
};

/**
 * Get thumbnail URL (300x300)
 */
export const getThumbnailUrl = (imagePath) => {
  return getOptimizedImageUrl(imagePath, {
    width: 300,
    height: 300,
    crop: 'fill',
  });
};

/**
 * Get responsive image URLs
 * Returns multiple sizes for responsive images
 */
export const getResponsiveImageUrls = (imagePath) => {
  const baseUrl = getImageUrl(imagePath);
  
  if (!isCloudinaryUrl(baseUrl)) {
    return {
      thumbnail: baseUrl,
      small: baseUrl,
      medium: baseUrl,
      large: baseUrl,
      original: baseUrl,
    };
  }
  
  return {
    thumbnail: getOptimizedImageUrl(imagePath, { width: 150, height: 150 }),
    small: getOptimizedImageUrl(imagePath, { width: 480, height: 480 }),
    medium: getOptimizedImageUrl(imagePath, { width: 768, height: 768 }),
    large: getOptimizedImageUrl(imagePath, { width: 1024, height: 1024 }),
    original: baseUrl,
  };
};

/**
 * Get placeholder/loading image
 * Returns a low-quality placeholder for lazy loading
 */
export const getPlaceholderUrl = (imagePath) => {
  return getOptimizedImageUrl(imagePath, {
    width: 50,
    quality: 'auto:low',
    format: 'auto',
  });
};

/**
 * Preload image
 * Useful for ensuring images are cached before displaying
 */
export const preloadImage = (imagePath) => {
  return new Promise((resolve, reject) => {
    const url = getImageUrl(imagePath);
    if (!url) {
      reject(new Error('Invalid image path'));
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = (error) => reject(error);
    img.src = url;
  });
};

/**
 * Batch preload images
 */
export const preloadImages = async (imagePaths) => {
  const urls = getImageUrls(imagePaths);
  return Promise.all(urls.map(url => preloadImage(url)));
};

/**
 * Extract filename from URL
 */
export const getFilenameFromUrl = (url) => {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split('/');
    return parts[parts.length - 1];
  } catch (error) {
    // If URL parsing fails, try basic string manipulation
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
};

/**
 * Check if image exists (by attempting to load it)
 */
export const checkImageExists = async (imagePath) => {
  try {
    await preloadImage(imagePath);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get image dimensions from Cloudinary URL
 * Extracts dimensions from transformation parameters if present
 */
export const getImageDimensionsFromUrl = (url) => {
  if (!url || !isCloudinaryUrl(url)) {
    return null;
  }
  
  try {
    const transformMatch = url.match(/w_(\d+),h_(\d+)/);
    if (transformMatch) {
      return {
        width: parseInt(transformMatch[1], 10),
        height: parseInt(transformMatch[2], 10),
      };
    }
  } catch (error) {
    console.error('Error extracting dimensions:', error);
  }
  
  return null;
};

export default {
  isCloudinaryUrl,
  getImageUrl,
  getImageUrls,
  getDocumentUrls,
  getOptimizedImageUrl,
  getThumbnailUrl,
  getResponsiveImageUrls,
  getPlaceholderUrl,
  preloadImage,
  preloadImages,
  getFilenameFromUrl,
  checkImageExists,
  getImageDimensionsFromUrl,
};