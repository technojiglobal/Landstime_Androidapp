// Backend/UserRoutes/InteriorDesignViewRoute.js

import express from 'express';
import {
  checkDesignViewAccess,
  recordDesignView
} from '../UserControllers/InteriorDesignViewController.js';
import { verifyToken } from '../UserMiddleware/UserMiddleware.js';

const router = express.Router();

// User routes (require authentication)
router.post('/check-access', verifyToken, checkDesignViewAccess);
router.post('/record', verifyToken, recordDesignView);

export default router;