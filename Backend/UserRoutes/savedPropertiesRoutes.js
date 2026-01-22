// Backend/routes/savedPropertiesRoutes.js
import express from 'express';
const router = express.Router();
import {
  saveProperty,
  unsaveProperty,
  getSavedProperties,
  checkIfSaved
} from '../UserControllers/savedPropertiesController.js';
import { verifyToken } from '../UserMiddleware/UserMiddleware.js';

// All routes require authentication
router.use(verifyToken);

// Save/Unsave routes
router.post('/save', saveProperty);
router.post('/unsave', unsaveProperty);

// Get saved properties
router.get('/', getSavedProperties);

// Check if saved
router.get('/check', checkIfSaved);


export default router;