// Backend/AdminRoutes/BannerRoutes.js
import express from 'express';
import {
  createBanner,
  getAllBanners,
  getActiveBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
  updateBannerOrder
} from '../AdminControllers/BannerController.js';

import { verifyAdmin } from '../AdminMiddleware/AdminMiddleware.js';

const router = express.Router();

// Public route - No authentication
router.get('/active', getActiveBanners);

// Admin routes - Protected with verifyAdmin
router.post('/', verifyAdmin, createBanner);
router.get('/', verifyAdmin, getAllBanners);
router.get('/:id', verifyAdmin, getBannerById);
router.put('/:id', verifyAdmin, updateBanner);
router.delete('/:id', verifyAdmin, deleteBanner);
router.patch('/:id/toggle', verifyAdmin, toggleBannerStatus);
router.patch('/reorder', verifyAdmin, updateBannerOrder);

export default router;