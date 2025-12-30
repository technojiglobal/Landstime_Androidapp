// Backend/routes/propertyRoutes.js
import express from 'express';
const router = express.Router();
//import propertyController from '../controllers/propertyController.js';
import * as propertyController from '../UserControllers/PropertyController.js';
// ✅ NEW CODE
import { verifyToken, checkAdmin } from '../UserMiddleware/UserMiddleware.js';
import { verifyAdmin } from '../AdminMiddleware/AdminMiddleware.js';
import { uploadImages,handleUploadError } from '../UserMiddleware/uploadMiddleware.js';

// Public routes
router.get('/approved', propertyController.getApprovedProperties);

// Protected routes (Authenticated users)
router.post(
  '/',
  verifyToken,
  uploadImages,
  handleUploadError,
  propertyController.createProperty
);

router.get('/user/my-properties', verifyToken, propertyController.getUserProperties);

// Admin routes - Use verifyAdmin instead
router.get('/admin/all', verifyAdmin, propertyController.getAllProperties);
router.get('/admin/pending', verifyAdmin, propertyController.getPendingProperties);
router.get('/admin/debug', verifyAdmin, propertyController.debugProperties);
router.patch('/admin/:id/status', verifyAdmin, propertyController.updatePropertyStatus);
router.patch('/admin/:id/soft-delete', verifyAdmin, propertyController.softDeleteProperty);
router.patch('/admin/:id/property-status', verifyAdmin, propertyController.updatePropertyAvailability);
router.put('/admin/:id/update', verifyAdmin, propertyController.adminUpdateProperty);


// Image and Document management routes (Admin only)
router.post('/admin/:id/upload-images', verifyAdmin, uploadImages, handleUploadError, propertyController.uploadAdditionalImages);
router.delete('/admin/:id/delete-image', verifyAdmin, propertyController.deletePropertyImage);
router.post('/admin/:id/upload-documents', verifyAdmin, uploadImages, handleUploadError, propertyController.uploadAdditionalDocuments);
router.delete('/admin/:id/delete-document', verifyAdmin, propertyController.deletePropertyDocument);

// Generic ID route LAST
router.get('/:id', verifyToken, propertyController.getPropertyById);
router.put('/:id', verifyToken, propertyController.updateProperty);
router.delete('/:id', verifyToken, propertyController.deleteProperty);
export default router;