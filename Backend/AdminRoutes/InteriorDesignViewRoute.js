// Backend/AdminRoutes/InteriorDesignViewRoute.js

import express from 'express';
import {
  getAllDesignViews,
  getDesignViewers,
  exportDesignViews,
  updateDesignViewStatus
} from '../AdminControllers/InteriorDesignViewController.js';
import { verifyAdmin } from '../AdminMiddleware/AdminMiddleware.js';

const router = express.Router();

// Admin routes (require admin authentication)
router.get('/all', verifyAdmin, getAllDesignViews);
router.get('/design/:designId', verifyAdmin, getDesignViewers);
router.get('/export', verifyAdmin, exportDesignViews);
router.put('/design/:designId/status', verifyAdmin, updateDesignViewStatus);  // ✅ NEW


export default router;