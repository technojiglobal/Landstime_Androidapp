// ==================== SUBSCRIPTION CONTROLLER ====================

import Subscription from '../UserModels/Subscription.js';
import User from '../UserModels/User.js';
import { SUBSCRIPTION_LIMITS } from '../config/subscriptionConfig.js';
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
  fetchPaymentDetails,
  generateReceiptId,
} from '../utils/razorpayService.js';

// ==================== CREATE SUBSCRIPTION ORDER ====================
export const createSubscriptionOrder = async (req, res) => {
  try {
    const { planId, planName, amount, features } = req.body;
    const userId = req.userId; // From verifyToken middleware

    // Validate inputs
    if (!planId || !planName || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Plan details are required',
      });
    }

    // Validate plan
    const validPlans = ['gold', 'platinum', 'diamond'];
    if (!validPlans.includes(planId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan selected',
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // NEW - Check if user already has an active subscription for this plan
    const existingActiveSubscription = await Subscription.findOne({
      userId: userId,
      planId: planId,
      status: 'active',
      endDate: { $gt: new Date() }
    });

    if (existingActiveSubscription) {
      return res.status(400).json({
        success: false,
        message: `You already have an active ${planName} subscription until ${existingActiveSubscription.endDate.toLocaleDateString()}`,
        data: {
          currentPlan: existingActiveSubscription.planName,
          expiresOn: existingActiveSubscription.endDate
        }
      });
    }

    // Generate receipt ID

    // Generate receipt ID
    const receiptId = generateReceiptId(userId, planId);

    // Create Razorpay order
    const orderResult = await createRazorpayOrder(
      amount,
      'INR',
      receiptId,
      {
        userId: userId.toString(),
        planId: planId,
        planName: planName,
      }
    );

    if (!orderResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create payment order',
        error: orderResult.message,
      });
    }

    // Save subscription with pending status
    const subscription = new Subscription({
      userId: userId,
      planId: planId,
      planName: planName,
      amount: amount,
      currency: 'INR',
      status: 'pending',
      razorpayOrderId: orderResult.order.id,
      features: features || [],
    });

    await subscription.save();

    return res.status(200).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: orderResult.order.id,
        amount: orderResult.order.amount,
        currency: orderResult.order.currency,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        subscriptionId: subscription._id,
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    console.error('Error in createSubscriptionOrder:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// ==================== VERIFY PAYMENT ====================
// ==================== VERIFY PAYMENT ====================
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      subscriptionId,
    } = req.body;
    const userId = req.userId;

    // Validate inputs
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !subscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment details',
      });
    }

    // Find subscription
    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    // Verify subscription belongs to user
    if (subscription.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to subscription',
      });
    }

    // Verify Razorpay signature
    const isValidSignature = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValidSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }

    // Fetch payment details from Razorpay
    const paymentResult = await fetchPaymentDetails(razorpayPaymentId);

    if (!paymentResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to verify payment',
        error: paymentResult.message,
      });
    }

    // Calculate subscription dates (30 days from now)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    // Update subscription
    subscription.status = 'active';
    subscription.razorpayPaymentId = razorpayPaymentId;
    subscription.razorpaySignature = razorpaySignature;
    subscription.paymentMethod = paymentResult.payment.method;
    subscription.startDate = startDate;
    subscription.endDate = endDate;

    await subscription.save();

    // ✅ Initialize quota based on plan
    const planLimit = SUBSCRIPTION_LIMITS[subscription.planId];
    
    console.log(`🎯 Initializing quota for ${subscription.planName} plan: ${planLimit} views`);

    // ✅ Update user's current subscription WITH QUOTA
    await User.findByIdAndUpdate(userId, {
      currentSubscription: {
        subscriptionId: subscription._id,
        planId: subscription.planId,
        planName: subscription.planName,
        status: 'active',
        startDate: startDate,
        endDate: endDate,
        // ✅ QUOTA FIELDS
        contactViewsRemaining: planLimit,
        contactViewsUsed: 0,
        viewedProperties: []
      }
    });

    console.log(`✅ Quota initialized: ${planLimit} contact views for ${subscription.planName} plan`);

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        subscriptionId: subscription._id,
        planName: subscription.planName,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        contactViewsRemaining: planLimit,
        totalViews: planLimit
      },
    });
  } catch (error) {
    console.error('Error in verifyPayment:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
// ==================== GET USER SUBSCRIPTIONS ====================
export const getUserSubscriptions = async (req, res) => {
  try {
    const userId = req.userId;

    const subscriptions = await Subscription.find({ userId: userId })
      .sort({ createdAt: -1 })
      .select('-__v');

    return res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    console.error('Error in getUserSubscriptions:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// ==================== GET ACTIVE SUBSCRIPTION ====================
export const getActiveSubscription = async (req, res) => {
  try {
    const userId = req.userId;

    const activeSubscription = await Subscription.findOne({
      userId: userId,
      status: 'active',
      endDate: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!activeSubscription) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No active subscription found',
      });
    }

    return res.status(200).json({
      success: true,
      data: activeSubscription,
    });
  } catch (error) {
    console.error('Error in getActiveSubscription:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// ==================== CANCEL SUBSCRIPTION ====================
export const cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.userId;

    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      userId: userId,
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    if (subscription.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Only active subscriptions can be cancelled',
      });
    }

    subscription.status = 'cancelled';
    subscription.autoRenew = false;
    await subscription.save();

    return res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: subscription,
    });
  } catch (error) {
    console.error('Error in cancelSubscription:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};



// ==================== GET CURRENT USER SUBSCRIPTION ====================
export const getCurrentUserSubscription = async (req, res) => {
 try {
    const userId = req.userId;

    const user = await User.findById(userId).select('currentSubscription isBlocked');

    if (!user || !user.currentSubscription || !user.currentSubscription.planId) {
      return res.status(200).json({
        success: true,
        hasActiveSubscription: false,
        data: null,
        message: 'No active subscription'
      });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(200).json({
        success: true,
        hasActiveSubscription: false,
        data: { ...user.currentSubscription.toObject(), status: 'blocked' },
        message: 'User is blocked'
      });
    }

    // Check if subscription is still valid
    const now = new Date();
    const endDate = new Date(user.currentSubscription.endDate);

    if (endDate < now) {
      // Subscription expired
      await User.findByIdAndUpdate(userId, {
        'currentSubscription.status': 'expired'
      });

      return res.status(200).json({
        success: true,
        hasActiveSubscription: false,
        data: user.currentSubscription,
        message: 'Subscription expired'
      });
    }

    return res.status(200).json({
      success: true,
      hasActiveSubscription: true,
      data: user.currentSubscription
    });

  } catch (error) {
    console.error('Error in getCurrentUserSubscription:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};