// Backend/routes/propertyRoutes.js
import express from 'express';
const router = express.Router();
//import propertyController from '../controllers/propertyController.js';
import * as propertyController from '../UserControllers/PropertyController.js';
import { verifyToken, checkAdmin } from '../UserMiddleware/UserMiddleware.js';
//import { uploadImages } from '../middleware/uploadMiddleware.js';
import { uploadImages } from '../UserMiddleware/uploadMiddleware.js';

// Public routes
router.get('/approved', propertyController.getApprovedProperties);
router.get('/:id', verifyToken, propertyController.getPropertyById);

// Protected routes (Authenticated users)
router.post(
  '/',
  verifyToken,
  uploadImages,
  propertyController.createProperty
);
router.get('/user/my-properties', verifyToken, propertyController.getUserProperties);
router.put('/:id', verifyToken, propertyController.updateProperty);
router.delete('/:id', verifyToken, propertyController.deleteProperty);

// Admin routes
router.get('/admin/all', verifyToken, checkAdmin, propertyController.getAllProperties);
router.get('/admin/pending', verifyToken, checkAdmin, propertyController.getPendingProperties);
router.patch('/admin/:id/status', verifyToken, checkAdmin, propertyController.updatePropertyStatus);

export default router;
