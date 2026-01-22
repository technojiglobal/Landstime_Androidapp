//Backend//UserRoutes/PropertyViewRoute.js

import express from 'express';
import {
  checkViewAccess,
  recordPropertyView
} from '../UserControllers/PropertyViewController.js';
import { verifyToken } from '../UserMiddleware/UserMiddleware.js';

const router = express.Router();

// User routes (require authentication)
router.post('/check-access', verifyToken, checkViewAccess);
router.post('/record', verifyToken, recordPropertyView);

export default router;