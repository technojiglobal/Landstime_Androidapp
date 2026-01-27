// Backend/middleware/uploadMiddleware.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// ✅ Create upload directories on server start
const createUploadDirs = () => {
  const dirs = [
    'uploads/properties/images',
    'uploads/properties/ownership',
    'uploads/properties/identity',
    'uploads/interior-designs'
  ];
  
  dirs.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });
};

createUploadDirs();

// ✅ DISK STORAGE instead of memory storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'images';
    
    if (file.fieldname === 'ownershipDocs') {
      folder = 'ownership';
    } else if (file.fieldname === 'identityDocs') {
      folder = 'identity';
    }
    
    cb(null, `uploads/properties/${folder}`);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-randomnumber-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

const allowedTypes = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp',
  'application/pdf'
];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, WEBP, or PDF files are allowed'), false);
  }
};

// Middleware to upload multiple images (max 10)
export const uploadImages = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 20 // Total files limit
  }
}).fields([
  { name: 'images', maxCount: 10 },
  { name: 'ownershipDocs', maxCount: 5 },
  { name: 'identityDocs', maxCount: 5 }
]);

// ✅ Separate middleware for interior designs
export const uploadInteriorImages = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/interior-designs');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
  }),
  fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024,
    files: 10
  }
}).array('images', 10);

// Error handling middleware for multer
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Max 5MB per file.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Max 10 images, 5 ownership docs, and 5 identity docs allowed.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field'
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

// ✅ Helper to delete uploaded files on error
export const cleanupUploadedFiles = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // If response has error and files were uploaded, delete them
    if (res.statusCode >= 400 && req.files) {
      const filesToDelete = [];
      
      if (req.files.images) {
        filesToDelete.push(...req.files.images.map(f => f.path));
      }
      if (req.files.ownershipDocs) {
        filesToDelete.push(...req.files.ownershipDocs.map(f => f.path));
      }
      if (req.files.identityDocs) {
        filesToDelete.push(...req.files.identityDocs.map(f => f.path));
      }
      
      filesToDelete.forEach(filePath => {
        fs.unlink(filePath, (err) => {
          if (err) console.error('Failed to delete file:', filePath);
        });
      });
    }
    
    originalSend.call(this, data);
  };
  
  next();
};