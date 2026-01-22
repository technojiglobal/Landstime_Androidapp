// // Backend/AdminMiddleware/uploadMiddleware.js
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// // Create uploads directory if it doesn't exist
// const uploadDir = 'uploads/interior-designs';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Configure multer for image uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
//   }
// });

// const allowedTypes = [
//   'image/jpeg',
//   'image/png',
//   'image/jpg',
//   'image/webp',
//   'application/pdf'
// ];

// const fileFilter = (req, file, cb) => {
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only JPG, PNG, WEBP images and PDF files are allowed'), false);
//   }
// };

// // Middleware to upload multiple files (unlimited)
// export const uploadInteriorImages = multer({
//   storage,
//   fileFilter,
//   limits: { 
//     fileSize: Infinity, // Unlimited file size
//     files: Infinity     // Unlimited number of files
//   }
// }).array('images');

// // Error handling middleware for multer
// export const handleInteriorUploadError = (err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     return res.status(400).json({
//       success: false,
//       message: `Upload error: ${err.message}`
//     });
//   }

//   if (err) {
//     return res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }

//   next();
// };
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
const interiorStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, interiorUploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const interiorFileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp',
    'application/pdf'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, WEBP images and PDF files are allowed'), false);
  }
};

export const uploadInteriorImages = multer({
  storage: interiorStorage,
  fileFilter: interiorFileFilter,
  limits: {
    fileSize: Infinity,
    files: Infinity
  }
}).array('images');

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