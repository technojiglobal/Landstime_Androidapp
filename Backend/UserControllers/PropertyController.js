// Backend/controllers/propertyController.js

import Property from '../UserModels/Property.js';
import User from '../UserModels/User.js'; // Import User model

// Create a new property
// Backend/controllers/propertyController.js

export const createProperty = async (req, res) => {
  try {
    console.log('📥 Request received');
    console.log('📋 Raw body:', req.body);
    console.log('📁 Files:', req.files);
    
    // Parse propertyData from FormData
    const propertyData = JSON.parse(req.body.propertyData);
    console.log('✅ Parsed propertyData:', propertyData);
    
    // Get uploaded image URLs
    const images = req.files ? req.files.map(file => file.path) : [];
    console.log('🖼️ Images:', images);
    
    // Validate required fields
    if (!propertyData.propertyTitle) {
      return res.status(400).json({
        success: false,
        message: 'Property title is required'
      });
    }
    
    if (!propertyData.location) {
      return res.status(400).json({
        success: false,
        message: 'Location is required'
      });
    }
    
    if (!propertyData.expectedPrice) {
      return res.status(400).json({
        success: false,
        message: 'Expected price is required'
      });
    }
    
    if (!propertyData.propertyType) {
      return res.status(400).json({
        success: false,
        message: 'Property type is required'
      });
    }
    
    // Create property object
    const property = new Property({
      ...propertyData,
      images,
      userId: req.user._id,
      status: 'pending'
    });
    
    console.log('💾 Saving property...');
    await property.save();
    console.log('✅ Property saved successfully');
    
    res.status(201).json({
      success: true,
      message: 'Property uploaded successfully and pending approval',
      data: property
    });
    
  } catch (error) {
    console.error('❌ Create property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create property',
      error: error.message
    });
  }
};

// Get all approved properties (for public viewing)
export const getApprovedProperties = async (req, res) => {
  try {
    const { propertyType, page = 1, limit = 10 } = req.query;
    
    const query = { status: 'approved' };
    if (propertyType) {
      query.propertyType = propertyType;
    }
    
    const properties = await Property.find(query)
      .populate('userId', 'name phone email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Property.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: properties,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
    
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch properties',
      error: error.message
    });
  }
};

// Get single property by ID
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('userId', 'name phone email');
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Only show approved properties to non-owners/non-admins
    if (property.status !== 'approved' && 
        property.userId._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Property not available'
      });
    }
    
    res.status(200).json({
      success: true,
      data: property
    });
    
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch property',
      error: error.message
    });
  }
};

// Get user's own properties
export const getUserProperties = async (req, res) => {
  try {
    const properties = await Property.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: properties
    });
    
  } catch (error) {
    console.error('Get user properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch properties',
      error: error.message
    });
  }
};

// Update property (only owner can update)
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Check ownership
    if (property.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }
    
    // If updating, reset status to pending
    req.body.status = 'pending';
    
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: updatedProperty
    });
    
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update property',
      error: error.message
    });
  }
};

// Delete property (only owner can delete)
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Check ownership
    if (property.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property'
      });
    }
    
    await property.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete property',
      error: error.message
    });
  }
};

// ADMIN CONTROLLERS

// Get all pending properties (Admin only)
export const getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'pending' })
      .populate('userId', 'name phone email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: properties
    });
    
  } catch (error) {
    console.error('Get pending properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending properties',
      error: error.message
    });
  }
};

// Update property status (Admin only)
export const updatePropertyStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const updateData = { status };
    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }
    
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('userId', 'name phone email');
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Property ${status} successfully`,
      data: property
    });
    
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update property status',
      error: error.message
    });
  }
};

// Get all properties (Admin only)
export const getAllProperties = async (req, res) => {
  try {
    const { status, propertyType, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (propertyType) query.propertyType = propertyType;
    
    const properties = await Property.find(query)
      .populate('userId', 'name phone email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Property.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: properties,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
    
  } catch (error) {
    console.error('Get all properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch properties',
      error: error.message
    });
  }
};