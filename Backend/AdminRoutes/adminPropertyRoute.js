// Backend/AdminRoutes/propertyRoute.js
import express from 'express';
import {
  createProperty,
  getApprovedProperties,
  getPropertyById,
  getUserProperties,
  updateProperty,
  deleteProperty,
  uploadAdditionalImages,
  deletePropertyImage,
  uploadAdditionalDocuments,
  deletePropertyDocument,
  // Admin routes
  getPendingProperties,
  updatePropertyStatus,
  getAllProperties,
  softDeleteProperty,
  updatePropertyAvailability,
  adminUpdateProperty
} from '../UserControllers/PropertyController.js';
import { verifyToken as protect } from '../UserMiddleware/UserMiddleware.js';
import { verifyAdmin } from '../AdminMiddleware/AdminMiddleware.js';
import { uploadPropertyFiles, handlePropertyUploadError } from '../AdminMiddleware/uploadMiddleware.js';
import { adminCreateProperty } from '../AdminControllers/AdminPropertyController.js';

const router = express.Router();
// ✅ DEBUG MIDDLEWARE
router.use((req, res, next) => {
  console.log(`📨 Property Route: ${req.method} ${req.path}`);
  next();
});
// ========== ADMIN ROUTES (MUST BE FIRST) ==========
// ✅ Admin create property - HIGHEST PRIORITY
router.post(
  '/create',  // ✅ NEW - will become /api/admin/properties/create
  verifyAdmin,
  uploadPropertyFiles,
  handlePropertyUploadError,
  adminCreateProperty
);
router.get('/admin/all', verifyAdmin, getAllProperties);
router.get('/admin/pending', verifyAdmin, getPendingProperties);
router.patch('/admin/:id/status', verifyAdmin, updatePropertyStatus);
router.delete('/admin/:id', verifyAdmin, softDeleteProperty);
router.patch('/admin/:id/availability', verifyAdmin, updatePropertyAvailability);
router.put('/admin/:id', verifyAdmin, adminUpdateProperty);

// ========== PUBLIC ROUTES ==========
router.get('/approved', getApprovedProperties);
router.get('/:id', getPropertyById);

// ========== USER PROTECTED ROUTES ==========
router.post(
  '/',
  protect,
  uploadPropertyFiles,
  handlePropertyUploadError,
  createProperty
);

router.get('/user/my-properties', protect, getUserProperties);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

// Additional uploads
router.post(
  '/:id/images',
  protect,
  uploadPropertyFiles,
  handlePropertyUploadError,
  uploadAdditionalImages
);

router.delete('/:id/images', protect, deletePropertyImage);

router.post(
  '/:id/documents',
  protect,
  uploadPropertyFiles,
  handlePropertyUploadError,
  uploadAdditionalDocuments
);

router.delete('/:id/documents', protect, deletePropertyDocument);

export default router;