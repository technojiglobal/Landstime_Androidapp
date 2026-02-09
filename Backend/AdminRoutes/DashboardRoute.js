// Backend/AdminRoutes/DashboardRoute.js

import express from 'express';
import {
  getDashboardStats,
  getRecentProperties,
  getRecentNotifications,
  getDashboardData
} from '../AdminControllers/DashboardController.js';
import { verifyAdmin } from '../AdminMiddleware/AdminMiddleware.js';

const router = express.Router();

// All routes are protected with admin authentication
router.use(verifyAdmin);

// Get complete dashboard data (recommended - single API call)
router.get('/', getDashboardData);

// Individual endpoints (if you want to fetch separately)
router.get('/stats', getDashboardStats);
router.get('/recent-properties', getRecentProperties);
router.get('/recent-notifications', getRecentNotifications);

export default router;