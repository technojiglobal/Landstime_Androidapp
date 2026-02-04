// Backend/UserMiddleware/uploadMiddleware.js
import multer from 'multer';
import path from 'path';

// ✅ Use memory storage for Cloudinary
// Files will be stored in memory as Buffer objects and uploaded directly to Cloudinary
const storage = multer.memoryStorage();

// File filter to allow only images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedDocTypes = /pdf/;
  
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  // Check if it's an image
  const isImage = allowedImageTypes.test(extname.slice(1)) && 
                  mimetype.startsWith('image/');
  
  // Check if it's a PDF
  const isPDF = allowedDocTypes.test(extname.slice(1)) && 
                mimetype === 'application/pdf';

  if (isImage || isPDF) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Only images (JPEG, JPG, PNG, GIF, WebP) and PDFs are allowed. Received: ${mimetype}`
      ),
      false
    );
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 20, // Max 20 files per request
  },
});

// ✅ Middleware for handling multiple file uploads
export const uploadImages = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'ownershipDocs', maxCount: 5 },
  { name: 'identityDocs', maxCount: 5 },
]);

// ✅ Error handling middleware
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB per file.',
        error: err.message,
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files uploaded.',
        error: err.message,
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field.',
        error: err.message,
      });
    }
    
    return res.status(400).json({
      success: false,
      message: 'File upload error.',
      error: err.message,
    });
  } else if (err) {
    // Custom errors (e.g., from fileFilter)
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload failed.',
      error: err.message,
    });
  }
  
  next();
};

// ✅ Single file upload middleware (for future use)
export const uploadSingle = upload.single('file');

// ✅ Multiple files with same field name
export const uploadMultiple = upload.array('files', 10);

export default upload;