// Backend/AdminRoutes/InteriorDesignRoute.js

import express from 'express';
import {
  getAllDesigns,
  getDesignById,
  createDesign,
  updateDesign,
  deleteDesign,
  permanentDeleteDesign,
  getDesignStats
} from '../AdminControllers/InteriorDesignController.js';
import { verifyAdmin } from '../AdminMiddleware/AdminMiddleware.js';
import { uploadInteriorImages, handleInteriorUploadError } from '../AdminMiddleware/uploadMiddleware.js';
import { uploadAdditionalImages, deleteDesignImage } from '../AdminControllers/InteriorDesignController.js';
const router = express.Router();

// Public routes (can be accessed without authentication if needed)
router.get('/designs', getAllDesigns);
router.get('/designs/:id', getDesignById);

// Protected routes (Admin only)
router.post('/designs', verifyAdmin, uploadInteriorImages, handleInteriorUploadError, createDesign);
router.put('/designs/:id', verifyAdmin, updateDesign);
router.delete('/designs/:id', verifyAdmin, deleteDesign);
router.delete('/designs/:id/permanent', verifyAdmin, permanentDeleteDesign);
router.get('/designs-stats', verifyAdmin, getDesignStats);
// ✅ NEW: Image management routes


router.post('/designs/:id/images', verifyAdmin, uploadInteriorImages, handleInteriorUploadError, uploadAdditionalImages);
router.delete('/designs/:id/images', verifyAdmin, deleteDesignImage);

export default router;