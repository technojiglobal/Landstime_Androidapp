// Backend/AdminMiddleware/uploadMiddleware.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads/interior-designs';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const allowedTypes = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp'
];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, WEBP images are allowed'), false);
  }
};

// Middleware to upload multiple images (max 10)
export const uploadInteriorImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB per image
}).array('images', 10);

// Error handling middleware for multer
export const handleInteriorUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Max 5MB per image.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Max 10 images allowed.'
      });
    }
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  next();
};