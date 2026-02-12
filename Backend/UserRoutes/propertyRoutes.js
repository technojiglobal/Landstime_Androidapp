// Backend/UserRoutes/propertyRoutes.js
import express from 'express';
const router = express.Router();
import * as propertyController from '../UserControllers/PropertyController.js';
import * as similarPropertiesController from '../UserControllers/similarPropertiesController.js';
// ✅ NEW CODE
import { verifyToken, checkAdmin } from '../UserMiddleware/UserMiddleware.js';
import { verifyAdmin } from '../AdminMiddleware/AdminMiddleware.js';
import Property from '../UserModels/Property.js';

import { uploadImages,handleUploadError } from '../UserMiddleware/uploadMiddleware.js';

// Public routes
router.get('/approved', propertyController.getApprovedProperties);

router.get('/search', propertyController.searchProperties);

// Protected routes (Authenticated users)
router.post(
  '/',
  verifyToken,
  uploadImages,
  handleUploadError,
  propertyController.createProperty
);

router.get('/user/my-properties', verifyToken, propertyController.getUserProperties);

// ✅ NEW CODE - Add this route
router.patch('/user/:id/mark-sold', verifyToken, propertyController.userMarkPropertySold);

// Admin routes - Use verifyAdmin instead
router.get('/admin/all', verifyAdmin, propertyController.getAllProperties);
router.get('/admin/pending', verifyAdmin, propertyController.getPendingProperties);
router.get('/admin/debug', verifyAdmin, propertyController.debugProperties);
router.patch('/admin/:id/status', verifyAdmin, propertyController.updatePropertyStatus);
router.delete('/admin/:id', verifyAdmin, propertyController.softDeleteProperty);
router.patch('/admin/:id/soft-delete', verifyAdmin, propertyController.softDeleteProperty);
router.patch('/admin/:id/availability', verifyAdmin, propertyController.updatePropertyAvailability);
router.put('/admin/:id/update', verifyAdmin, propertyController.adminUpdateProperty);


// Image and Document management routes (Admin only)
router.post('/admin/:id/upload-images', verifyAdmin, uploadImages, handleUploadError, propertyController.uploadAdditionalImages);
router.delete('/admin/:id/delete-image', verifyAdmin, propertyController.deletePropertyImage);
router.post('/admin/:id/upload-documents', verifyAdmin, uploadImages, handleUploadError, propertyController.uploadAdditionalDocuments);
router.delete('/admin/:id/delete-document', verifyAdmin, propertyController.deletePropertyDocument);

// Generic ID route LAST

router.get('/similar/:propertyId', similarPropertiesController.getSimilarProperties);

router.get('/:id', verifyToken, propertyController.getPropertyById);
router.put('/:id', verifyToken, propertyController.updateProperty);
router.delete('/:id', verifyToken, propertyController.deleteProperty);
// Add this temporary route to Backend/UserRoutes/PropertyRoute.js
router.get('/debug/my-properties', verifyToken, async (req, res) => {
  try {
    const properties = await Property.find({ userId: req.user._id });
    res.json({
      userId: req.user._id,
      count: properties.length,
      properties: properties
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;