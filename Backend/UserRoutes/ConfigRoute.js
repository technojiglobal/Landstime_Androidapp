// UserRoutes/ConfigRoute.js
import express from 'express';
import { 
  getGoogleMapsConfig, 
  checkMapsApiHealth
  // Removed getMapsApiStats
} from '../UserControllers/ConfigController.js';
const router = express.Router();
import { verifyToken } from '../UserMiddleware/UserMiddleware.js';

/**
 * @route   GET /api/config/google-maps
 * @desc    Get Google Maps API configuration
 * @access  Protected - Requires authentication
 */
router.get('/google-maps', verifyToken, getGoogleMapsConfig);

/**
 * @route   GET /api/config/google-maps/health
 * @desc    Check if Google Maps API is working
 * @access  Protected - Requires authentication
 */
router.get('/google-maps/health', verifyToken, checkMapsApiHealth);


export default router;