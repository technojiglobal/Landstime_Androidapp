// Backend/UserControllers/InteriorDesignViewController.js

import InteriorDesignView from '../UserModels/InteriorDesignView.js';
import InteriorDesign from '../AdminModels/InteriorDesign.js';
import User from '../UserModels/User.js';

// ==================== HELPER: Strip phone number ====================
const stripPhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/[\s\-\+]/g, '').replace(/^91/, '');
};

// ==================== CHECK DESIGN VIEW ACCESS ====================
export const checkDesignViewAccess = async (req, res) => {
  try {
    const { designId, userName, userPhone } = req.body;
    const userId = req.user._id;

    console.log('🔍 Checking design view access:', { designId, userName, userPhone, userId });

    if (!designId || !userName || !userPhone) {
      return res.status(400).json({
        success: false,
        canView: false,
        reason: 'validation_failed',
        message: 'Design ID, name, and phone are required'
      });
    }

    // Get user details
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        canView: false,
        reason: 'user_not_found',
        message: 'User not found'
      });
    }

    // Verify credentials (name & phone must match)
    const strippedInputPhone = stripPhone(userPhone);
    const strippedUserPhone = stripPhone(user.phone);
    const phoneMatch = strippedInputPhone === strippedUserPhone;

    let userEnglishName = '';
    if (typeof user.name === 'string') {
      userEnglishName = user.name;
    } else if (user.name && typeof user.name === 'object') {
      userEnglishName = user.name.en || user.name.te || user.name.hi || '';
    }

    const nameMatch = userName.toLowerCase().trim() === userEnglishName.toLowerCase().trim();

    console.log('🔐 Credential verification:', {
      phoneMatch,
      nameMatch,
      inputPhone: strippedInputPhone,
      userPhone: strippedUserPhone,
      inputName: userName.toLowerCase().trim(),
      userName: userEnglishName.toLowerCase().trim()
    });

    if (!phoneMatch || !nameMatch) {
      return res.status(403).json({
        success: false,
        canView: false,
        reason: 'verification_failed',
        message: 'Name or phone number doesn\'t match your account details'
      });
    }

    // Get design details
    const design = await InteriorDesign.findById(designId);
    
    if (!design) {
      return res.status(404).json({
        success: false,
        canView: false,
        reason: 'design_not_found',
        message: 'Interior design not found'
      });
    }

    // Check if already viewed
    const designView = await InteriorDesignView.findOne({ designId });
    const alreadyViewed = designView?.viewers.some(
      viewer => viewer.userId.toString() === userId.toString()
    );

    if (alreadyViewed) {
      console.log('✅ Design already viewed - granting access without recording');
      
      return res.status(200).json({
        success: true,
        canView: true,
        alreadyViewed: true,
        message: 'Access granted (previously viewed)',
        designerDetails: {
          name: design.designer,
          phone: design.phone
        }
      });
    }

    // NEW VIEW - Free for all users (no subscription check)
    console.log('✅ Access granted for new design view (FREE)');
    
    return res.status(200).json({
      success: true,
      canView: true,
      alreadyViewed: false,
      message: 'You can view this contact (FREE)'
    });

  } catch (error) {
    console.error('❌ Check design view access error:', error);
    return res.status(500).json({
      success: false,
      canView: false,
      reason: 'server_error',
      message: 'Failed to check access',
      error: error.message
    });
  }
};

// ==================== RECORD DESIGN VIEW ====================
export const recordDesignView = async (req, res) => {
  try {
    const { designId } = req.body;
    const userId = req.user._id;

    console.log('📝 Recording design view:', { designId, userId });

    if (!designId) {
      return res.status(400).json({
        success: false,
        message: 'Design ID is required'
      });
    }

    // Get design details
    const design = await InteriorDesign.findById(designId);
    
    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Interior design not found'
      });
    }

    // Get user details
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Extract user name
    let userNameText = 'User';
    if (typeof user.name === 'string') {
      userNameText = user.name;
    } else if (user.name && typeof user.name === 'object') {
      userNameText = user.name.en || user.name.te || user.name.hi || 'User';
    }

    // Get user's subscription plan (can be null)
    const subscriptionPlan = user.currentSubscription?.planId || null;

    // Find or create InteriorDesignView document
    let designView = await InteriorDesignView.findOne({ designId: design._id });
    
    if (!designView) {
      // Create new document
      designView = new InteriorDesignView({
        designId: design._id,
        designTitle: design.name,
        designerName: design.designer,
        designerPhone: design.phone,
        category: design.category,
        viewers: [],
        totalViews: 0
      });
    }

    // Check if user already viewed (double-check)
    const alreadyViewed = designView.viewers.some(
      viewer => viewer.userId.toString() === userId.toString()
    );

    if (alreadyViewed) {
      console.log('⚠️ Design already viewed - returning existing data');
      return res.status(200).json({
        success: true,
        message: 'Contact already viewed',
        designerDetails: {
          name: design.designer,
          phone: design.phone
        }
      });
    }

    // Add new viewer
    designView.viewers.push({
      userId: user._id,
      userName: userNameText,
      userPhone: user.phone,
      userEmail: user.email,
      subscriptionPlan: subscriptionPlan,
      viewedAt: new Date()
    });

    designView.totalViews = designView.viewers.length;
    await designView.save();

    console.log('✅ Design view recorded successfully (FREE - no quota deduction)');

    return res.status(200).json({
      success: true,
      message: 'Contact view recorded successfully',
      designerDetails: {
        name: design.designer,
        phone: design.phone
      }
    });

  } catch (error) {
    console.error('❌ Record design view error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to record view',
      error: error.message
    });
  }
};