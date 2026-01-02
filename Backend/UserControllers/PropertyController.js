// Backend/controllers/propertyController.js

import Property from '../UserModels/Property.js';
import User from '../UserModels/User.js'; // Import User model
import { translatePropertyFields } from "../services/translationService.js";

// Create a new property
// Backend/controllers/propertyController.js

export const createProperty = async (req, res) => {
  try {
    console.log('📥 Property upload request');

    if (!req.body.propertyData) {
      return res.status(400).json({
        success: false,
        message: 'Property data missing'
      });
    }

    const propertyData = JSON.parse(req.body.propertyData);
      // 🔐 Owner details validation
if (!propertyData.ownerDetails) {
  return res.status(400).json({
    success: false,
    message: "Owner details are required",
  });
}

const { name, phone, email } = propertyData.ownerDetails;

if (!name || !phone || !email) {
  return res.status(400).json({
    success: false,
    message: "Owner name, phone and email are mandatory",
  });
}

    // Extract uploaded files
const images = req.files?.images?.map(file => file.path) || [];



    const ownershipDocs = req.files?.ownershipDocs?.map(file => file.path) || [];
    const identityDocs = req.files?.identityDocs?.map(file => file.path) || [];

    // 🔐 Backend validation (DO NOT SKIP)
    // ✅ NEW CODE
if (!propertyData.propertyTitle) {
  return res.status(400).json({ 
    success: false, 
    message: 'Property title is required' 
  });
}

// Extract original language (sent from frontend)
// ✅ Extract and validate original language
const originalLanguage = propertyData.originalLanguage || 'en';
console.log('📝 Property uploaded in language:', originalLanguage);
console.log('📝 Original title:', propertyData.propertyTitle);
console.log('📝 Original location:', propertyData.location);

console.log('🔄 Starting translation...');

    

    if (!propertyData.propertyType) {
      return res.status(400).json({ success: false, message: 'Property type is required' });
    }
   if (propertyData.propertyType === "Commercial") {
  const { commercialDetails } = propertyData;

  if (!commercialDetails) {
    return res.status(400).json({
      success: false,
      message: "Commercial details are required",
    });
  }

  if (!commercialDetails.subType) {
    return res.status(400).json({
      success: false,
      message: "Commercial subType is required",
    });
  }

  // OFFICE
 if (commercialDetails.subType.toLowerCase().includes("office")) {
  if (!commercialDetails.officeDetails?.location) {
    return res.status(400).json({
      success: false,
      message: "Office location is required",
    });
  }

  if (!commercialDetails.officeDetails?.area) {
    return res.status(400).json({
      success: false,
      message: "Office area is required",
    });
  }
}

  // RETAIL
  if (commercialDetails.subType.includes("Shop") || commercialDetails.subType.includes("Showroom")) {
    if (!commercialDetails.retailDetails) {
      return res.status(400).json({
        success: false,
        message: "Retail details are required",
      });
    }
  }

  // PLOT
  if (commercialDetails.subType.includes("Land")) {
    if (!commercialDetails.plotDetails) {
      return res.status(400).json({
        success: false,
        message: "Plot details are required",
      });
    }
  }
}

/* ✅ END OF COMMERCIAL VALIDATION */
    if (images.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one image is required' });
    }

    if (ownershipDocs.length === 0) {
      return res.status(400).json({ success: false, message: 'Ownership document is required' });
    }

    if (identityDocs.length === 0) {
      return res.status(400).json({ success: false, message: 'Identity document is required' });
    }

    // Create property
   // ✅ NEW CODE
console.log('🔄 Translating property fields...');

// Translate text fields to all 3 languages
const translatedFields = await translatePropertyFields({
  propertyTitle: propertyData.propertyTitle,
  description: propertyData.description,
  location: propertyData.location
}, originalLanguage);

console.log('✅ Translation complete');

const property = new Property({
  ...propertyData,
  propertyTitle: translatedFields.propertyTitle, // Now has {te, hi, en}
  description: translatedFields.description,     // Now has {te, hi, en}
  location: translatedFields.location,           // Now has {te, hi, en}
  originalLanguage,                              // Store which language user used
  ownerDetails: propertyData.ownerDetails,
  images,
  documents: {
    ownership: ownershipDocs,
    identity: identityDocs
  },
  userId: req.user._id,
  status: 'pending'
});

    await property.save();
   console.log("✅ PROPERTY SAVED TO DATABASE");
console.log("🆔 Property ID:", property._id);
console.log("🏷 Property Type:", property.propertyType);

    res.status(201).json({
      success: true,
      message: 'Property submitted successfully and pending approval',
      data: property
    });

  } catch (error) {
    console.error('❌ Property creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create property',
      error: error.message
    });
  }
};

// Get all approved properties (for public viewing)
// ✅ NEW CODE
export const getApprovedProperties = async (req, res) => {
  try {
    const { propertyType, page = 1, limit = 10, language = 'en' } = req.query;
    
    const query = { status: 'approved' };
    if (propertyType) {
      query.propertyType = propertyType;
    }
    
    const properties = await Property.find(query)
      .populate('userId', 'name phone email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    // ✅ ADD THIS: Transform properties to return only requested language
    const transformedProperties = properties.map(prop => {
      const propObj = prop.toObject();
      
      return {
        ...propObj,
        propertyTitle: propObj.propertyTitle?.[language] || propObj.propertyTitle?.en || '',
        description: propObj.description?.[language] || propObj.description?.en || '',
        location: propObj.location?.[language] || propObj.location?.en || ''
      };
    });
    
    const count = await Property.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: transformedProperties, // ✅ CHANGED from properties
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
// ✅ NEW CODE
export const getAllProperties = async (req, res) => {
  try {
    console.log("📥 Admin fetching all properties");
    
    const { status, propertyType, page = 1, limit = 10 } = req.query;
    
    // Fetch properties that are NOT deleted (including old properties without the field)
    const query = { 
      $or: [
        { adminDeletedStatus: 'active' },
        { adminDeletedStatus: { $exists: false } }
      ]
    };
    if (status) query.status = status;
    if (propertyType) query.propertyType = propertyType;
    
   const properties = await Property.find(query)
  .populate({
    path: 'userId',
    select: 'name phone email currentSubscription'
  })
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

// Add this AFTER the getAllProperties function
export const debugProperties = async (req, res) => {
  try {
    const allProps = await Property.find({}).select('propertyTitle adminDeletedStatus status');
    const activeProps = await Property.find({ adminDeletedStatus: 'active' });
    const withoutDeleteStatus = await Property.find({ adminDeletedStatus: { $exists: false } });
    
    res.json({
      total: allProps.length,
      allProperties: allProps,
      activeProperties: activeProps.length,
      propertiesWithoutDeleteStatus: withoutDeleteStatus.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Soft delete property (Admin only)
export const softDeleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { adminDeletedStatus: 'deleted' },
      { new: true }
    );
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
    
  } catch (error) {
    console.error('Soft delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete property',
      error: error.message
    });
  }
};

// Update property status (Available/Sold) - Admin only
export const updatePropertyAvailability = async (req, res) => {
  try {
    const { propertyStatus } = req.body;
    
    if (!['Available', 'Sold'].includes(propertyStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property status'
      });
    }
    
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { propertyStatus },
      { new: true }
    );
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Property status updated successfully',
      data: property
    });
    
  } catch (error) {
    console.error('Update property status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update property status',
      error: error.message
    });
  }
};

// Admin update property details - Admin only
// Admin update property details - Admin only
export const adminUpdateProperty = async (req, res) => {
  try {
    console.log('📝 Admin updating property:', req.params.id);
    console.log('📦 Update data:', req.body);
    
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Admin can update without changing status
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name phone email currentSubscription');
    
    console.log('✅ Property updated successfully');
    
    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: updatedProperty
    });
    
  } catch (error) {
    console.error('❌ Admin update property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update property',
      error: error.message
    });
  }
};


// Add at the end of the file, before the export statements

// Upload additional images to existing property
export const uploadAdditionalImages = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    const newImages = req.files?.images?.map(file => file.path) || [];
    
    if (newImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided'
      });
    }
    
    // Add new images to existing ones
    property.images = [...property.images, ...newImages];
    await property.save();
    
    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: property
    });
    
  } catch (error) {
    console.error('Upload additional images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
};

// Delete specific image from property
export const deletePropertyImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imagePath } = req.body;
    
    const property = await Property.findById(id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Remove image from array
    property.images = property.images.filter(img => img !== imagePath);
    await property.save();
    
    // Optional: Delete file from filesystem
    // import fs from 'fs';
    // import path from 'path';
    // try {
    //   fs.unlinkSync(path.join(__dirname, '..', imagePath));
    // } catch (err) {
    //   console.error('Failed to delete file:', err);
    // }
    
    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: property
    });
    
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
};

// Upload additional documents to existing property
export const uploadAdditionalDocuments = async (req, res) => {
  try {
    const { documentType } = req.body; // 'ownership' or 'identity'
    
    if (!['ownership', 'identity'].includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document type'
      });
    }
    
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    const newDocs = req.files?.[`${documentType}Docs`]?.map(file => file.path) || [];
    
    if (newDocs.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No documents provided'
      });
    }
    
    // Add new documents to existing ones
    if (documentType === 'ownership') {
      property.documents.ownership = [...property.documents.ownership, ...newDocs];
    } else {
      property.documents.identity = [...property.documents.identity, ...newDocs];
    }
    
    await property.save();
    
    res.status(200).json({
      success: true,
      message: 'Documents uploaded successfully',
      data: property
    });
    
  } catch (error) {
    console.error('Upload additional documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload documents',
      error: error.message
    });
  }
};

// Delete specific document from property
export const deletePropertyDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { documentPath, documentType } = req.body;
    
    if (!['ownership', 'identity'].includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document type'
      });
    }
    
    const property = await Property.findById(id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Remove document from array
    if (documentType === 'ownership') {
      property.documents.ownership = property.documents.ownership.filter(doc => doc !== documentPath);
    } else {
      property.documents.identity = property.documents.identity.filter(doc => doc !== documentPath);
    }
    
    await property.save();
    
    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
      data: property
    });
    
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete document',
      error: error.message
    });
  }
};
