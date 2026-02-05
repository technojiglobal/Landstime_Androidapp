// // Backend/AdminMiddleware/uploadMiddleware.js


// Backend/AdminMiddleware/uploadMiddleware.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directories if they don't exist
const propertyUploadDir = 'uploads/properties';
const interiorUploadDir = 'uploads/interior-designs';

[propertyUploadDir, interiorUploadDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ========== PROPERTY UPLOADS CONFIGURATION ==========
const propertyStorage = multer.memoryStorage(); // Store in memory as buffer (for base64 conversion)

const allowedPropertyTypes = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const propertyFileFilter = (req, file, cb) => {
  if (allowedPropertyTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, WEBP images and PDF/DOC files are allowed'), false);
  }
};

// ✅ PROPERTY UPLOAD MIDDLEWARE - Multiple field types
export const uploadPropertyFiles = multer({
  storage: propertyStorage,
  fileFilter: propertyFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 28 // Max 28 files total (20 images + 5 ownership + 3 identity)
  }
}).fields([
  { name: 'images', maxCount: 20 },
  { name: 'ownershipDocs', maxCount: 5 },
  { name: 'identityDocs', maxCount: 3 }
]);

// Error handling middleware for property uploads
export const handlePropertyUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  next();
};

// ========== INTERIOR DESIGN UPLOADS (Keep existing) ==========

// ========== INTERIOR DESIGN UPLOADS - CLOUDINARY ==========
// ✅ MODIFIED: Use memory storage for Cloudinary
const interiorStorage = multer.memoryStorage();

const interiorFileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, WEBP images are allowed'), false);
  }
};

export const uploadInteriorImages = multer({
  storage: interiorStorage,
  fileFilter: interiorFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 10 // Max 10 images
  }
}).array('images', 10);

export const handleInteriorUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  next();
};