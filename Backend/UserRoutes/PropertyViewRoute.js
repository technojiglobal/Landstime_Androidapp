// Backend/UserRoutes/PropertyViewRoute.js

import express from 'express';
import {
  checkViewAccess,
  recordPropertyView,
  getPropertyViewers,
  getAllPropertyViews
} from '../UserControllers/PropertyViewController.js';
import { verifyToken } from '../UserMiddleware/UserMiddleware.js';
import { verifyAdmin } from '../AdminMiddleware/AdminMiddleware.js';

const router = express.Router();

// User routes (require authentication)
router.post('/check-access', verifyToken, checkViewAccess);
router.post('/record-view', verifyToken, recordPropertyView);

// Admin routes
router.get('/admin/property/:propertyId', verifyAdmin, getPropertyViewers);
router.get('/admin/all', verifyAdmin, getAllPropertyViews);

export default router;