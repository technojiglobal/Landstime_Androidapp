// Backend/routes/propertyRoutes.js
import express from 'express';
const router = express.Router();
//import propertyController from '../controllers/propertyController.js';
import * as propertyController from '../UserControllers/PropertyController.js';
import { verifyToken, checkAdmin } from '../UserMiddleware/UserMiddleware.js';
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

// Admin routes
router.get('/admin/all', verifyToken, checkAdmin, propertyController.getAllProperties);
router.get('/admin/pending', verifyToken, checkAdmin, propertyController.getPendingProperties);
router.patch('/admin/:id/status', verifyToken, checkAdmin, propertyController.updatePropertyStatus);

// Generic ID route LAST
router.get('/:id', verifyToken, propertyController.getPropertyById);
router.put('/:id', verifyToken, propertyController.updateProperty);
router.delete('/:id', verifyToken, propertyController.deleteProperty);
export default router;