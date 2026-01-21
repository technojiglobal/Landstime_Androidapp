// Backend/UserControllers/PropertyViewController.js

import PropertyView from '../UserModels/PropertyView.js';
import Property from '../UserModels/Property.js';
import User from '../UserModels/User.js';
import { SUBSCRIPTION_LIMITS, PLAN_FEATURES } from '../config/subscriptionConfig.js';

// ==================== HELPER: Strip phone number ====================
const stripPhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/[\s\-\+]/g, '').replace(/^91/, '');
};

// ==================== CHECK VIEW ACCESS ====================
export const checkViewAccess = async (req, res) => {
  try {
    const { propertyId, userName, userPhone } = req.body;
    const userId = req.user._id;

    console.log('🔍 Checking view access:', { propertyId, userName, userPhone, userId });

    if (!propertyId || !userName || !userPhone) {
      return res.status(400).json({
        success: false,
        canView: false,
        reason: 'validation_failed',
        message: 'Property ID, name, and phone are required'
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        canView: false,
        reason: 'user_not_found',
        message: 'User not found'
      });
    }

    // Verify credentials
    const strippedInputPhone = stripPhone(userPhone);
    const strippedUserPhone = stripPhone(user.phone);
    const phoneMatch = strippedInputPhone === strippedUserPhone;

    let userEnglishName = '';
    if (typeof user.name === 'string') {
      userEnglishName = user.name;
    } else if (user.name && typeof user.name === 'object') {
      userEnglishName = user.name.en || '';
    }

    const nameMatch = userName.toLowerCase().trim() === userEnglishName.toLowerCase().trim();

    console.log('🔐 Credential verification:', {
      phoneMatch,
      nameMatch,
      inputPhone: strippedInputPhone,
      userPhone: strippedUserPhone
    });

    if (!phoneMatch || !nameMatch) {
      return res.status(403).json({
        success: false,
        canView: false,
        reason: 'verification_failed',
        message: 'Name or phone number doesn\'t match your account details'
      });
    }

    if (!user.currentSubscription || !user.currentSubscription.planId) {
      return res.status(403).json({
        success: false,
        canView: false,
        reason: 'no_subscription',
        message: 'Please purchase a subscription to view contact details'
      });
    }

    if (user.currentSubscription.status !== 'active') {
      if (user.currentSubscription.status === 'expired') {
        return res.status(403).json({
          success: false,
          canView: false,
          reason: 'subscription_expired',
          message: 'Your subscription has expired. Please renew to continue.'
        });
      }
      return res.status(403).json({
        success: false,
        canView: false,
        reason: 'subscription_inactive',
        message: `Your subscription is ${user.currentSubscription.status}. Please contact support.`
      });
    }

    const now = new Date();
    const endDate = new Date(user.currentSubscription.endDate);
    
    if (endDate < now) {
      await User.findByIdAndUpdate(userId, {
        'currentSubscription.status': 'expired'
      });
      
      return res.status(403).json({
        success: false,
        canView: false,
        reason: 'subscription_expired',
        message: 'Your subscription has expired. Please renew to continue.'
      });
    }

    const planId = user.currentSubscription.planId;
    const planLimit = SUBSCRIPTION_LIMITS[planId];
    const planFeatures = PLAN_FEATURES[planId];

    const alreadyViewed = user.currentSubscription.viewedProperties?.includes(propertyId);

    if (alreadyViewed) {
      const property = await Property.findById(propertyId);
      
      if (!property) {
        return res.status(404).json({
          success: false,
          canView: false,
          reason: 'property_not_found',
          message: 'Property not found'
        });
      }

      console.log('✅ Property already viewed - granting access without deducting quota');
      
      return res.status(200).json({
        success: true,
        canView: true,
        alreadyViewed: true,
        remainingViews: user.currentSubscription.contactViewsRemaining || 0,
        totalViews: planLimit,
        planName: planFeatures.name,
        message: 'Access granted (previously viewed)',
        ownerDetails: {
          name: property.ownerDetails.name,
          phone: property.ownerDetails.phone,
          email: property.ownerDetails.email,
          company: property.ownerDetails.company || 'N/A'
        },
        quota: {
          remainingViews: user.currentSubscription.contactViewsRemaining || 0,
          usedViews: user.currentSubscription.contactViewsUsed || 0,
          totalViews: planLimit,
          planName: planFeatures.name
        }
      });
    }

    const remainingViews = user.currentSubscription.contactViewsRemaining || 0;

    if (!alreadyViewed && remainingViews <= 0) {
      return res.status(403).json({
        success: false,
        canView: false,
        reason: 'limit_exceeded',
        planName: planFeatures.name,
        usedViews: user.currentSubscription.contactViewsUsed || 0,
        totalViews: planLimit,
        message: `Your ${planFeatures.name} plan allows ${planLimit} property contacts. You've used all ${planLimit} views.`
      });
    }

    console.log('✅ Access granted for new property');
    
    return res.status(200).json({
      success: true,
      canView: true,
      alreadyViewed: false,
      remainingViews: remainingViews,
      totalViews: planLimit,
      planName: planFeatures.name,
      message: 'You can view this contact'
    });

  } catch (error) {
    console.error('❌ Check view access error:', error);
    return res.status(500).json({
      success: false,
      canView: false,
      reason: 'server_error',
      message: 'Failed to check access',
      error: error.message
    });
  }
};

// ==================== RECORD PROPERTY VIEW ====================
export const recordPropertyView = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = req.user._id;

    console.log('📝 Recording property view:', { propertyId, userId });

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        message: 'Property ID is required'
      });
    }

    const property = await Property.findById(propertyId);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const user = await User.findById(userId);
    
    if (!user || !user.currentSubscription || !user.currentSubscription.planId) {
      return res.status(403).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    const alreadyViewed = user.currentSubscription.viewedProperties?.includes(propertyId);
    
    if (alreadyViewed) {
      console.log('⚠️ Property already viewed - skipping deduction');
      return res.status(200).json({
        success: true,
        message: 'Contact already viewed',
        ownerDetails: {
          name: property.ownerDetails.name,
          phone: property.ownerDetails.phone,
          email: property.ownerDetails.email,
          company: property.ownerDetails.company || 'N/A'
        },
        quota: {
          remainingViews: user.currentSubscription.contactViewsRemaining || 0,
          usedViews: user.currentSubscription.contactViewsUsed || 0,
          totalViews: SUBSCRIPTION_LIMITS[user.currentSubscription.planId],
          planName: PLAN_FEATURES[user.currentSubscription.planId].name
        }
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId,
        'currentSubscription.planId': { $exists: true },
        'currentSubscription.contactViewsRemaining': { $gt: 0 }
      },
      {
        $inc: {
          'currentSubscription.contactViewsRemaining': -1,
          'currentSubscription.contactViewsUsed': 1
        },
        $addToSet: {
          'currentSubscription.viewedProperties': propertyId
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(403).json({
        success: false,
        message: 'Failed to deduct quota. You may have exhausted your views.'
      });
    }

    const propertyTitleText = typeof property.propertyTitle === 'string' 
      ? property.propertyTitle 
      : (property.propertyTitle.en || property.propertyTitle.te || property.propertyTitle.hi || 'Property');

    let userNameText = 'User';
    if (typeof user.name === 'string') {
      userNameText = user.name;
    } else if (user.name && typeof user.name === 'object') {
      userNameText = user.name.en || 'User';
    }

    let propertyView = await PropertyView.findOne({ propertyId: property._id });

    if (!propertyView) {
      propertyView = new PropertyView({
        propertyId: property._id,
        propertyTitle: propertyTitleText,
        propertyOwnerName: property.ownerDetails.name,
        propertyStatus: property.propertyStatus || 'Available',
        ownerPhone: property.ownerDetails.phone || 'N/A',
        ownerEmail: property.ownerDetails.email || 'N/A',
        viewers: [],
        totalViews: 0
      });
    } else {
      propertyView.propertyStatus = property.propertyStatus || 'Available';
      propertyView.ownerPhone = property.ownerDetails.phone || 'N/A';
      propertyView.ownerEmail = property.ownerDetails.email || 'N/A';
    }

    propertyView.viewers.push({
      userId: user._id,
      userName: userNameText,
      userPhone: user.phone,
      userEmail: user.email,
      subscriptionPlan: updatedUser.currentSubscription.planId,
      viewedAt: new Date()
    });

    propertyView.totalViews = propertyView.viewers.length;

    await propertyView.save();

    console.log('✅ Property view recorded successfully');
    const planLimit = SUBSCRIPTION_LIMITS[updatedUser.currentSubscription.planId];

    return res.status(200).json({
      success: true,
      message: 'Contact view recorded successfully',
      ownerDetails: {
        name: property.ownerDetails.name,
        phone: property.ownerDetails.phone,
        email: property.ownerDetails.email,
        company: property.ownerDetails.company || 'N/A'
      },
      quota: {
        remainingViews: updatedUser.currentSubscription.contactViewsRemaining,
        usedViews: updatedUser.currentSubscription.contactViewsUsed,
        totalViews: planLimit,
        planName: PLAN_FEATURES[updatedUser.currentSubscription.planId].name
      }
    });

  } catch (error) {
    console.error('❌ Record property view error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to record view',
      error: error.message
    });
  }
};