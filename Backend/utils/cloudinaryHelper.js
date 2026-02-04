// Backend/utils/cloudinaryHelper.js
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

/**
 * Upload file to Cloudinary
 * @param {Buffer|Stream} fileBuffer - File buffer or stream
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result with secure_url and public_id
 */
export const uploadToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const {
      folder = 'property-listings',
      resource_type = 'auto', // auto, image, video, raw
      transformation = [],
      public_id,
      format,
    } = options;

    const uploadOptions = {
      folder,
      resource_type,
      transformation,
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    };

    if (public_id) {
      uploadOptions.public_id = public_id;
    }

    if (format) {
      uploadOptions.format = format;
    }

    // Default transformations for images
    if (resource_type === 'image' || resource_type === 'auto') {
      uploadOptions.transformation = [
        { quality: 'auto:good' }, // Automatic quality optimization
        { fetch_format: 'auto' }, // Automatic format selection (WebP when supported)
        ...transformation,
      ];
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log('✅ Cloudinary upload success:', result.secure_url);
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            resource_type: result.resource_type,
            bytes: result.bytes,
            width: result.width,
            height: result.height,
            created_at: result.created_at,
          });
        }
      }
    );

    // Handle different input types
    if (Buffer.isBuffer(fileBuffer)) {
      const stream = Readable.from(fileBuffer);
      stream.pipe(uploadStream);
    } else if (fileBuffer.pipe) {
      fileBuffer.pipe(uploadStream);
    } else {
      reject(new Error('Invalid file input: must be Buffer or Stream'));
    }
  });
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Public ID of the file to delete
 * @param {string} resourceType - Type of resource (image, raw, video)
 * @returns {Promise<Object>} Deletion result
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true, // Invalidate CDN cache
    });
    
    console.log('✅ Cloudinary delete success:', publicId);
    return result;
  } catch (error) {
    console.error('❌ Cloudinary delete error:', error);
    throw error;
  }
};

/**
 * Delete multiple files from Cloudinary
 * @param {Array<string>} publicIds - Array of public IDs to delete
 * @param {string} resourceType - Type of resource
 * @returns {Promise<Object>} Deletion result
 */
export const deleteMultipleFromCloudinary = async (publicIds, resourceType = 'image') => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type: resourceType,
      invalidate: true,
    });
    
    console.log(`✅ Deleted ${publicIds.length} files from Cloudinary`);
    return result;
  } catch (error) {
    console.error('❌ Cloudinary batch delete error:', error);
    throw error;
  }
};

/**
 * Extract public_id from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null} Public ID or null
 */
export const extractPublicId = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  try {
    // Match Cloudinary URL pattern
    const regex = /\/v\d+\/(.+?)(?:\.[a-z]+)?$/i;
    const match = url.match(regex);
    
    if (match && match[1]) {
      return match[1];
    }
    
    // Alternative pattern for upload URLs
    const uploadRegex = /upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]+)?$/i;
    const uploadMatch = url.match(uploadRegex);
    
    if (uploadMatch && uploadMatch[1]) {
      return uploadMatch[1];
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
};

/**
 * Generate thumbnail URL from Cloudinary URL
 * @param {string} url - Original Cloudinary URL
 * @param {Object} options - Transformation options
 * @returns {string} Thumbnail URL
 */
export const generateThumbnail = (url, options = {}) => {
  const {
    width = 300,
    height = 300,
    crop = 'fill',
    gravity = 'auto',
    quality = 'auto:good',
  } = options;

  const publicId = extractPublicId(url);
  if (!publicId) return url;

  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop, gravity, quality },
      { fetch_format: 'auto' },
    ],
  });
};

/**
 * Upload property images
 * @param {Array} files - Array of file objects from multer
 * @param {string} propertyId - Property ID for folder organization
 * @returns {Promise<Array>} Array of upload results
 */
export const uploadPropertyImages = async (files, propertyId) => {
  const uploadPromises = files.map((file, index) => {
    return uploadToCloudinary(file.buffer, {
      folder: `property-listings/properties/${propertyId}/images`,
      public_id: `property_${propertyId}_image_${index}`,
      resource_type: 'image',
    });
  });

  return Promise.all(uploadPromises);
};

/**
 * Upload property documents
 * @param {Array} files - Array of file objects from multer
 * @param {string} propertyId - Property ID
 * @param {string} docType - Document type (ownership/identity)
 * @returns {Promise<Array>} Array of upload results
 */
export const uploadPropertyDocuments = async (files, propertyId, docType) => {
  const uploadPromises = files.map((file, index) => {
    const isPDF = file.mimetype === 'application/pdf';
    
    return uploadToCloudinary(file.buffer, {
      folder: `property-listings/properties/${propertyId}/documents/${docType}`,
      public_id: `property_${propertyId}_${docType}_${index}`,
      resource_type: isPDF ? 'raw' : 'image',
    });
  });

  return Promise.all(uploadPromises);
};

/**
 * Delete property images
 * @param {Array<string>} imageUrls - Array of image URLs to delete
 * @returns {Promise<Array>} Deletion results
 */
export const deletePropertyImages = async (imageUrls) => {
  const publicIds = imageUrls
    .map(url => extractPublicId(url))
    .filter(id => id !== null);

  if (publicIds.length === 0) return [];

  return deleteMultipleFromCloudinary(publicIds, 'image');
};

/**
 * Delete property documents
 * @param {Array<string>} documentUrls - Array of document URLs to delete
 * @returns {Promise<Array>} Deletion results
 */
export const deletePropertyDocuments = async (documentUrls) => {
  const deletePromises = documentUrls.map(url => {
    const publicId = extractPublicId(url);
    if (!publicId) return Promise.resolve();
    
    // Determine resource type from URL
    const isPDF = url.toLowerCase().includes('.pdf');
    const resourceType = isPDF ? 'raw' : 'image';
    
    return deleteFromCloudinary(publicId, resourceType);
  });

  return Promise.all(deletePromises);
};

/**
 * Check if URL is a Cloudinary URL
 * @param {string} url - URL to check
 * @returns {boolean}
 */
export const isCloudinaryUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
};

/**
 * Get optimized image URL with transformations
 * @param {string} url - Original URL
 * @param {Object} transformations - Transformation options
 * @returns {string} Optimized URL
 */
export const getOptimizedUrl = (url, transformations = {}) => {
  if (!isCloudinaryUrl(url)) return url;
  
  const publicId = extractPublicId(url);
  if (!publicId) return url;

  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto:good',
    format = 'auto',
  } = transformations;

  const transformArray = [
    { quality, fetch_format: format },
  ];

  if (width || height) {
    transformArray.unshift({ width, height, crop });
  }

  return cloudinary.url(publicId, {
    transformation: transformArray,
    secure: true,
  });
};

export default {
  uploadToCloudinary,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
  extractPublicId,
  generateThumbnail,
  uploadPropertyImages,
  uploadPropertyDocuments,
  deletePropertyImages,
  deletePropertyDocuments,
  isCloudinaryUrl,
  getOptimizedUrl,
};