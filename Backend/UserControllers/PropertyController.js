// Backend/controllers/propertyController.js

import Property from '../UserModels/Property.js';
import User from '../UserModels/User.js';

const bufferToBase64 = (buffer, mimetype) => {
  return `data:${mimetype};base64,${buffer.toString('base64')}`;
};

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
    
    console.log('📋 Property Data:', JSON.stringify(propertyData, null, 2));
    
    // Owner details validation
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

    // Convert uploaded files to base64
    const images = req.files?.images?.map(file => 
      bufferToBase64(file.buffer, file.mimetype)
    ) || [];

    const ownershipDocs = req.files?.ownershipDocs?.map(file => 
      bufferToBase64(file.buffer, file.mimetype)
    ) || [];

    const identityDocs = req.files?.identityDocs?.map(file => 
      bufferToBase64(file.buffer, file.mimetype)
    ) || [];

    // Backend validation
    if (!propertyData.propertyTitle) {
      return res.status(400).json({ success: false, message: 'Property title is required' });
    }

    if (!propertyData.propertyType) {
      return res.status(400).json({ success: false, message: 'Property type is required' });
    }
    
    // Commercial validation
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

      // Office validation - check if officeDetails exists
      if (commercialDetails.subType.toLowerCase().includes("office")) {
        console.log('🏢 Validating Office Details...');
        console.log('Office Details:', commercialDetails.officeDetails);
        
        if (!commercialDetails.officeDetails) {
          return res.status(400).json({
            success: false,
            message: "Office details are required for Office type",
          });
        }

        if (!commercialDetails.officeDetails.location || commercialDetails.officeDetails.location.trim() === '') {
          return res.status(400).json({
            success: false,
            message: "Office location is required",
          });
        }

        if (!commercialDetails.officeDetails.area || commercialDetails.officeDetails.area <= 0) {
          return res.status(400).json({
            success: false,
            message: "Office area is required and must be greater than 0",
          });
        }
      }

      // Retail validation
      if (commercialDetails.subType.includes("Shop") || commercialDetails.subType.includes("Showroom")) {
        if (!commercialDetails.retailDetails) {
          return res.status(400).json({
            success: false,
            message: "Retail details are required",
          });
        }
      }

      // Plot validation
      if (commercialDetails.subType.includes("Land") || commercialDetails.subType.includes("Plot")) {
        if (!commercialDetails.plotDetails) {
          return res.status(400).json({
            success: false,
            message: "Plot details are required",
          });
        }
      }

      // Industry validation
      if (commercialDetails.subType.includes("Industry")) {
        if (!commercialDetails.industryDetails) {
          return res.status(400).json({
            success: false,
            message: "Industry details are required",
          });
        }
      }

      // Storage validation
      if (commercialDetails.subType.includes("Storage")) {
        if (!commercialDetails.storageDetails) {
          return res.status(400).json({
            success: false,
            message: "Storage details are required",
          });
        }
      }

      // Hospitality validation
      if (commercialDetails.subType.includes("Hospitality")) {
        if (!commercialDetails.hospitalityDetails) {
          return res.status(400).json({
            success: false,
            message: "Hospitality details are required",
          });
        }
      }
    }

    if (images.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one image is required' });
    }

    if (ownershipDocs.length === 0) {
      return res.status(400).json({ success: false, message: 'Ownership document is required' });
    }

    if (identityDocs.length === 0) {
      return res.status(400).json({ success: false, message: 'Identity document is required' });
    }

    // Create property with base64 images
    const property = new Property({
      ...propertyData,
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
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create property',
      error: error.message
    });
  }
};
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
    
    const newImages = req.files?.images?.map(file => 
      bufferToBase64(file.buffer, file.mimetype)
    ) || [];
    
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
    const { imageIndex } = req.body; // Use index instead of path
    
    const property = await Property.findById(id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Remove image by index
    if (imageIndex >= 0 && imageIndex < property.images.length) {
      property.images.splice(imageIndex, 1);
      await property.save();
      
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully',
        data: property
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid image index'
      });
    }
    
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
    
    const fieldName = `${documentType}Docs`;
    const newDocs = req.files?.[fieldName]?.map(file => 
      bufferToBase64(file.buffer, file.mimetype)
    ) || [];
    
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
    const { documentIndex, documentType } = req.body; // Use index instead of path
    
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
    
    // Remove document by index
    const docsArray = documentType === 'ownership' 
      ? property.documents.ownership 
      : property.documents.identity;
    
    if (documentIndex >= 0 && documentIndex < docsArray.length) {
      docsArray.splice(documentIndex, 1);
      await property.save();
      
      res.status(200).json({
        success: true,
        message: 'Document deleted successfully',
        data: property
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid document index'
      });
    }
    
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete document',
      error: error.message
    });
  }
};

// Keep all other existing functions unchanged
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

export const getUserProperties = async (req, res) => {
  try {
    console.log('🔍 getUserProperties called');
    console.log('👤 User ID:', req.user._id);
    
    const properties = await Property.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    console.log('📊 Found properties:', properties.length);
    
    res.status(200).json({
      success: true,
      data: properties
    });
    
  } catch (error) {
    console.error('❌ Get user properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch properties',
      error: error.message
    });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    if (property.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }
    
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

export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
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

export const getAllProperties = async (req, res) => {
  try {
    console.log("📥 Admin fetching all properties");
    
    const { status, propertyType, page = 1, limit = 10 } = req.query;
    
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