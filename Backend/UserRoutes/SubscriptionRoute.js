// SubscriptionRoute.js

import express from 'express';
import {
  createSubscriptionOrder,
  verifyPayment,
  getUserSubscriptions,
  getActiveSubscription,
  cancelSubscription,
  getCurrentUserSubscription,
} from '../UserControllers/SubscriptionController.js';
import { verifyToken } from '../UserMiddleware/UserMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Create subscription order
router.post('/create-order', createSubscriptionOrder);

// Verify payment
router.post('/verify-payment', verifyPayment);

// Get all user subscriptions
router.get('/my-subscriptions', getUserSubscriptions);

// Get active subscription
router.get('/active', getActiveSubscription);

// NEW - Get current user's subscription from User model
router.get('/current', getCurrentUserSubscription);



// Cancel subscription
router.put('/cancel/:subscriptionId', cancelSubscription);

export default router;