// Backend/controllers/propertyController.js
import Property from '../UserModels/Property.js';
import User from '../UserModels/User.js';
import { translatePropertyFields, normalizeAreaKey } from '../services/translationService.js';

// Utility: normalize filesystem path to URL-friendly forward slashes
const normalizePath = (p) => (p ? p.replace(/\\+/g, '/') : p);

// Create a new property
// Backend/controllers/propertyController.js
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

    // Extract uploaded files
    if (!name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Owner name, phone and email are mandatory",
      });
    }

    // ✅ ADD THIS DEBUG LOG
console.log('📄 Files received:', {
  images: req.files?.images?.length || 0,
  ownershipDocs: req.files?.ownershipDocs?.length || 0,
  identityDocs: req.files?.identityDocs?.length || 0
});
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

    


   const finalData = {
  propertyType: propertyData.propertyType,
  propertyTitle: propertyData.propertyTitle,
  ownerDetails: propertyData.ownerDetails,
  expectedPrice: propertyData.expectedPrice,
  description: propertyData.description || "",
  images,
  documents: {
    ownership: ownershipDocs,
    identity: identityDocs,
  },
  userId: req.user._id,
  status: "pending",
};

// ✅ ADD THIS NEW CODE FOR HOUSE PROPERTIES
if (propertyData.propertyType === "House") {
  finalData.location = propertyData.location;
  finalData.area = propertyData.area; // This should be the neighborhood name from frontend
  finalData.houseDetails = propertyData.houseDetails;
  
  console.log('🏠 House property data:', {
    location: finalData.location,
    area: finalData.area,
    sqft: propertyData.houseDetails?.area
  });
}

// ✅ ADD THIS NEW CODE FOR SITE/PLOT/LAND PROPERTIES
if (propertyData.propertyType === "Site/Plot/Land") {
  finalData.location = propertyData.location;
  finalData.area = propertyData.area; // This is the neighborhood name from frontend
  
  console.log('🏞️ Site property data:', {
    location: finalData.location,
    area: finalData.area,
    sqft: propertyData.siteDetails?.area
  });

  // ✅ ADD THIS NEW SECTION FOR RESORT

  
  finalData.siteDetails = {
    area: propertyData.siteDetails?.area !== "" ? Number(propertyData.siteDetails.area) : undefined,
    areaUnit: propertyData.siteDetails?.areaUnit,
    length: propertyData.siteDetails?.length !== "" ? Number(propertyData.siteDetails.length) : undefined,
    breadth: propertyData.siteDetails?.breadth !== "" ? Number(propertyData.siteDetails.breadth) : undefined,
    floorsAllowed: propertyData.siteDetails?.floorsAllowed ? Number(propertyData.siteDetails.floorsAllowed) : 0,
    boundaryWall: propertyData.siteDetails?.boundaryWall,
    openSides: propertyData.siteDetails?.openSides ? Number(propertyData.siteDetails.openSides) : 0,
    constructionDone: propertyData.siteDetails?.constructionDone,
    constructionType: propertyData.siteDetails?.constructionType || [],
    possessionBy: propertyData.siteDetails?.possessionBy,
    ownership: propertyData.siteDetails?.ownership || "Freehold",
    approvedBy: propertyData.siteDetails?.approvedBy || [],
    amenities: propertyData.siteDetails?.amenities || [],
    propertyFacing: propertyData.siteDetails?.propertyFacing || "East",
    overlooking: propertyData.siteDetails?.overlooking || [],
    inGatedSociety: propertyData.siteDetails?.inGatedSociety || false,
    cornerProperty: propertyData.siteDetails?.cornerProperty || false,
    locationAdvantages: propertyData.siteDetails?.locationAdvantages || [],
    roadWidth: propertyData.siteDetails?.roadWidth ? Number(propertyData.siteDetails.roadWidth) : 0,
    roadWidthUnit: propertyData.siteDetails?.roadWidthUnit,
    vaasthuDetails: propertyData.siteDetails?.vaasthuDetails || {}
  };
}


//✅ HANDLE RESORT PROPERTIES (MOVED OUTSIDE AND FIXED)
if (propertyData.propertyType === "Resort") {
  finalData.location = propertyData.location;
  finalData.area = propertyData.area; // neighborhood name
  
  console.log('🏨 Resort property data:', {
    location: finalData.location,
    area: finalData.area,
    landArea: propertyData.resortDetails?.landArea,
    buildArea: propertyData.resortDetails?.buildArea,
    resortType: propertyData.resortDetails?.resortType
  });
  
  finalData.resortDetails = {
    resortType: propertyData.resortDetails?.resortType,
    landArea: Number(propertyData.resortDetails?.landArea) || 0,
    buildArea: Number(propertyData.resortDetails?.buildArea) || 0,
    rooms: Number(propertyData.resortDetails?.rooms) || 0,
    floors: Number(propertyData.resortDetails?.floors) || 0,
    locationAdvantages: propertyData.resortDetails?.locationAdvantages || [],
    vaasthuDetails: {
      propertyFacing: propertyData.resortDetails?.vaasthuDetails?.propertyFacing,
      entranceDirection: propertyData.resortDetails?.vaasthuDetails?.entranceDirection,
      receptionAreaFacing: propertyData.resortDetails?.vaasthuDetails?.receptionAreaFacing,
      mainLobbyDirection: propertyData.resortDetails?.vaasthuDetails?.mainLobbyDirection,
      masterSuitroom: propertyData.resortDetails?.vaasthuDetails?.masterSuitroom,
      guestRoom: propertyData.resortDetails?.vaasthuDetails?.guestRoom,
      restaurantDirection: propertyData.resortDetails?.vaasthuDetails?.restaurantDirection,
      vipSuite: propertyData.resortDetails?.vaasthuDetails?.vipSuite,
      conferenceDirection: propertyData.resortDetails?.vaasthuDetails?.conferenceDirection,
      spaRoom: propertyData.resortDetails?.vaasthuDetails?.spaRoom,
      swimmingPool: propertyData.resortDetails?.vaasthuDetails?.swimmingPool,
      yoga: propertyData.resortDetails?.vaasthuDetails?.yoga,
      kitchenRoom: propertyData.resortDetails?.vaasthuDetails?.kitchenRoom,
      poojaRoom: propertyData.resortDetails?.vaasthuDetails?.poojaRoom,
      office: propertyData.resortDetails?.vaasthuDetails?.office,
      recreation: propertyData.resortDetails?.vaasthuDetails?.recreation,
      balcony: propertyData.resortDetails?.vaasthuDetails?.balcony,
      garden: propertyData.resortDetails?.vaasthuDetails?.garden,
    }
  };
  
  console.log('✅ Resort details to save:', JSON.stringify(finalData.resortDetails, null, 2));
}





if (propertyData.propertyType === "Commercial") {
  // Commercial handling code...
  const { commercialDetails } = propertyData;
  if (!commercialDetails || !commercialDetails.subType) {
    return res.status(400).json({
      success: false,
      message: "Commercial subType is required",
    });
  }
  const rawSubType = commercialDetails.subType.trim();
  const subType = rawSubType.toLowerCase();
  // f to the enum values expected by the model
  let canonicalSubType = "Other";
  if (subType.includes("office")) canonicalSubType = "Office";
  else if (subType.includes("retail")) canonicalSubType = "Retail";
  else if (subType.includes("plot")) canonicalSubType = "Plot/Land";
  else if (subType.includes("stor")) canonicalSubType = "Storage";
  else if (subType.includes("industry")) canonicalSubType = "Industry";
  else if (subType.includes("hospital")) canonicalSubType = "Hospitality";
  // store canonical enum value in DB
  finalData.commercialDetails = {
    subType: canonicalSubType,
  };
  // OFFICE
// OFFICE
// OFFICE
if (canonicalSubType === "Office") {
  if (
    !commercialDetails.officeDetails ||
    !commercialDetails.officeDetails.location
  ) {
    return res.status(400).json({
      success: false,
      message: "Office location is required",
    });
  }
  
  console.log('🏢 Processing Office details:', {
    hasNeighborhoodArea: !!commercialDetails.officeDetails.neighborhoodArea,
    propertyDataArea: propertyData.area,
    commercialArea: commercialDetails.area,
  });
  
  // ✅ CRITICAL FIX: Store location and area properly
  finalData.location = commercialDetails.officeDetails.location;
  
  // ✅ Priority order for area
  const neighborhoodArea = commercialDetails.officeDetails.neighborhoodArea || 
                           propertyData.area || 
                           commercialDetails.area || 
                           '';
  
  finalData.area = neighborhoodArea;
  
  console.log('✅ Office area set to:', finalData.area);
  
  // ✅ IMPORTANT: Store complete office details without filtering
  finalData.commercialDetails.officeDetails = {
    ...commercialDetails.officeDetails, // Keep all fields
    neighborhoodArea: propertyData.area || commercialDetails.officeDetails.neighborhoodArea,
  };
  
  console.log('✅ Office details stored:', {
    location: finalData.location,
    area: finalData.area,
    allFields: Object.keys(finalData.commercialDetails.officeDetails),
  });
}



  // RETAIL
 // RETAIL
if (canonicalSubType === "Retail") {
  if (
    !commercialDetails.retailDetails ||
    !commercialDetails.retailDetails.location
  ) {
    return res.status(400).json({
      success: false,
      message: "Retail location is required",
    });
  }
  
  console.log('🏪 Processing Retail details:', {
    hasNeighborhoodArea: !!commercialDetails.retailDetails.neighborhoodArea,
    propertyDataArea: propertyData.area,
    commercialArea: commercialDetails.area,
  });
  
  // ✅ CRITICAL FIX: Store location properly
  finalData.location = commercialDetails.retailDetails.location;
  
  // ✅ Priority order for neighborhoodArea
  const neighborhoodArea = commercialDetails.retailDetails.neighborhoodArea || 
                           propertyData.area || 
                           commercialDetails.area || 
                           '';
  
  finalData.area = neighborhoodArea;
  
  console.log('✅ Retail area set to:', finalData.area);
  
  // ✅ IMPORTANT: Store complete retail details without filtering
  finalData.commercialDetails.retailDetails = {
    ...commercialDetails.retailDetails,
    neighborhoodArea: neighborhoodArea,
  };
  
  console.log('✅ Retail details stored:', {
    location: finalData.location,
    area: finalData.area,
    carpetArea: finalData.commercialDetails.retailDetails.carpetArea,
    allFields: Object.keys(finalData.commercialDetails.retailDetails),
  });
}

  // STORAGE
// Backend/controllers/propertyController.js - Storage Section Only

// STORAGE
if (canonicalSubType === "Storage") {
  if (
    !commercialDetails.storageDetails ||
    !commercialDetails.storageDetails.location ||
    !commercialDetails.storageDetails.storageArea?.value
  ) {
    return res.status(400).json({
      success: false,
      message: "Storage location and storage area are required",
    });
  }

  console.log('📦 Processing Storage details:', {
    hasNeighborhoodArea: !!commercialDetails.storageDetails.neighborhoodArea,
    propertyDataArea: propertyData.area,
    commercialArea: commercialDetails.area,
    hasStorageType: !!commercialDetails.storageDetails.storageType,
  });

  // ✅ CRITICAL FIX: Store location and area properly
  finalData.location = commercialDetails.storageDetails.location;

  // ✅ Priority order for neighborhoodArea
  const neighborhoodArea = commercialDetails.storageDetails.neighborhoodArea ||
                           propertyData.area ||
                           commercialDetails.area ||
                           '';

  finalData.area = neighborhoodArea;

  console.log('✅ Storage area set to:', finalData.area);

  // ✅ IMPORTANT: Store COMPLETE storage details without filtering
  finalData.commercialDetails.storageDetails = {
    // Basic Info
    storageType: commercialDetails.storageDetails.storageType,
    location: commercialDetails.storageDetails.location,
    neighborhoodArea: neighborhoodArea,

    // Area & Dimensions
    storageArea: {
      value: commercialDetails.storageDetails.storageArea?.value,
      unit: commercialDetails.storageDetails.storageArea?.unit || 'sqft',
    },
    dimensions: {
      length: commercialDetails.storageDetails.dimensions?.length,
      breadth: commercialDetails.storageDetails.dimensions?.breadth,
    },

    // ✅ NEW FIELDS - Storage Specifications
    ceilingHeight: commercialDetails.storageDetails.ceilingHeight,
    flooring: commercialDetails.storageDetails.flooring,
    ventilation: commercialDetails.storageDetails.ventilation,
    covered: commercialDetails.storageDetails.covered,
    temperatureControl: commercialDetails.storageDetails.temperatureControl,
    security: commercialDetails.storageDetails.security || [],
    accessibility: commercialDetails.storageDetails.accessibility,

    // Facilities
    washroomType: commercialDetails.storageDetails.washroomType,

    // Availability
    availability: commercialDetails.storageDetails.availability,
    ageOfProperty: commercialDetails.storageDetails.ageOfProperty,
    possession: commercialDetails.storageDetails.possession,

    // Pricing (from StorageNext.jsx)
    ownership: commercialDetails.storageDetails.ownership,
    expectedPrice: commercialDetails.storageDetails.expectedPrice,
    priceDetails: commercialDetails.storageDetails.priceDetails,
    authority: commercialDetails.storageDetails.authority,
    approvedIndustryType: commercialDetails.storageDetails.approvedIndustryType,

    // Lease Details
    preLeased: commercialDetails.storageDetails.preLeased,
    leaseDuration: commercialDetails.storageDetails.leaseDuration,
    monthlyRent: commercialDetails.storageDetails.monthlyRent,

    // Description & Features
    description: commercialDetails.storageDetails.description,
    amenities: commercialDetails.storageDetails.amenities || [],
    locationAdvantages: commercialDetails.storageDetails.locationAdvantages || [],

    // Vastu Details
    vastuDetails: commercialDetails.storageDetails.vastuDetails || {},
  };

  console.log('✅ Storage details stored:', {
    location: finalData.location,
    area: finalData.area,
    storageType: finalData.commercialDetails.storageDetails.storageType,
    allFields: Object.keys(finalData.commercialDetails.storageDetails),
    hasVastu: !!finalData.commercialDetails.storageDetails.vastuDetails,
  });

  // ✅ Handle pricing extras if provided
  if (commercialDetails.pricingExtras) {
    finalData.commercialDetails.pricingExtras = commercialDetails.pricingExtras;
  }
}


// INDUSTRY
if (canonicalSubType === "Industry") {
if (
!commercialDetails.industryDetails ||
!commercialDetails.industryDetails.location ||
!commercialDetails.industryDetails.area?.value
) {
return res.status(400).json({
success: false,
message: "Industry location and area are required",
});
}
console.log('🏭 Processing Industry details:', {
hasNeighborhoodArea: !!commercialDetails.industryDetails.neighborhoodArea,
propertyDataArea: propertyData.area,
});
finalData.location = commercialDetails.industryDetails.location;
// ✅ Priority order for neighborhoodArea
const neighborhoodArea = commercialDetails.industryDetails.neighborhoodArea ||
propertyData.area ||
'';
finalData.area = neighborhoodArea;
console.log('✅ Industry area set to:', finalData.area);
// ✅ Store complete industry details
finalData.commercialDetails.industryDetails = {
...commercialDetails.industryDetails,
neighborhoodArea: neighborhoodArea,
};
console.log('✅ Industry details stored:', {
location: finalData.location,
area: finalData.area,
allFields: Object.keys(finalData.commercialDetails.industryDetails),
});
}
// HOSPITALITY
if (canonicalSubType === "Hospitality") {
  if (
    !commercialDetails.hospitalityDetails ||
    !commercialDetails.hospitalityDetails.location ||
    !commercialDetails.hospitalityDetails.area?.value
  ) {
    return res.status(400).json({
      success: false,
      message: "Hospitality location and area are required",
    });
  }
  console.log('🏨 Processing Hospitality details:', {
  hasNeighborhoodArea: !!commercialDetails.hospitalityDetails.neighborhoodArea,
  propertyDataArea: propertyData.area,
  });
  finalData.location = commercialDetails.hospitalityDetails.location;

  // ✅ Priority order for area
const neighborhoodArea = commercialDetails.hospitalityDetails.neighborhoodArea ||
propertyData.area ||
'';
finalData.area = neighborhoodArea;
console.log('✅ Hospitality area set to:', finalData.area);

  finalData.commercialDetails.hospitalityDetails =
    commercialDetails.hospitalityDetails;
}
  // PLOT / LAND
if (canonicalSubType === "Plot/Land") {
  if (
    !commercialDetails.plotDetails ||
    !commercialDetails.plotDetails.location ||
    !commercialDetails.plotDetails.area
  ) {
    return res.status(400).json({
      success: false,
      message: "Plot location and area are required",
    });
  }

  console.log('🏞️ Processing Plot details:', {
    hasNeighborhoodArea: !!commercialDetails.plotDetails.neighborhoodArea,
    propertyDataArea: propertyData.area,
  });

  // ✅ CRITICAL FIX: Store location and area properly
  finalData.location = commercialDetails.plotDetails.location;

  // ✅ Priority order for neighborhoodArea
  const neighborhoodArea = commercialDetails.plotDetails.neighborhoodArea ||
                           propertyData.area ||
                           '';

  finalData.area = neighborhoodArea;

  console.log('✅ Plot area set to:', finalData.area);

  // ✅ IMPORTANT: Store complete plot details
  finalData.commercialDetails.plotDetails = {
    ...commercialDetails.plotDetails,
    neighborhoodArea: neighborhoodArea,
  };

  console.log('✅ Plot details stored:', {
    location: finalData.location,
    area: finalData.area,
    allFields: Object.keys(finalData.commercialDetails.plotDetails),
  });

  if (commercialDetails.pricingExtras) {
    finalData.commercialDetails.pricingExtras = commercialDetails.pricingExtras;
  }
}
}
 
// Plot handling is normalized above with other commercial subtypes
   
  
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
console.log('🔄 Translating property fields...');
// ✅ FIX: Ensure we're translating the actual string values
const originalLanguage = propertyData.originalLanguage || 'en';

// ✅ Extract plain text if it's already an object
const getPlainText = (field) => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[originalLanguage] || field.en || field.te || field.hi || '';
};

const translatedFields = await translatePropertyFields({
  propertyTitle: getPlainText(propertyData.propertyTitle),
  description: getPlainText(propertyData.description),
  location: getPlainText(finalData.location || propertyData.location),
  area: getPlainText(propertyData.area)
}, originalLanguage);
console.log('✅ Translation complete');
// ✅ NEW: Generate areaKey for consistent filtering
const areaKey = normalizeAreaKey(propertyData.area);
console.log('🔑 Generated areaKey:', areaKey);
finalData.propertyTitle = translatedFields.propertyTitle;
finalData.description = translatedFields.description;
finalData.location = translatedFields.location;
finalData.area = translatedFields.area;
finalData.areaKey = areaKey; // ✅ NEW FIELD
finalData.originalLanguage = originalLanguage;
 
   const property = new Property(finalData);
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
    const { propertyType, page = 1, limit = 3000, language = 'en' } = req.query;  // ✅ ADD language from query
    
    const query = { status: 'approved' };
    if (propertyType) {
      query.propertyType = propertyType;
    }
   
    const properties = await Property.find(query)
      .populate('userId', 'name phone email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
   
    // ✅ Helper function to extract language-specific text
    // const getLocalizedText = (field) => {
    //   if (!field) return '';
    //   if (typeof field === 'string') return field;
    //   return field[language] || field.en || field.te || field.hi || '';
    // };
   
  const transformedProperties = properties.map(prop => {
  const propObj = prop.toObject();
  
  // ✅ DON'T transform here - send the full multilingual object
  return {
    ...propObj,
    // Keep the original multilingual objects intact
    propertyTitle: propObj.propertyTitle,
    description: propObj.description,
    location: propObj.location,
    area: propObj.area,
    areaKey: propObj.areaKey || ''
  };
});

console.log('✅ First transformed property:', {
  original: properties[0]?.propertyTitle,
  transformed: transformedProperties[0]?.propertyTitle,
  language: language
});
   
    console.log('✅ Transformed first property:', transformedProperties[0] ? {
      propertyTitle: transformedProperties[0].propertyTitle,
      location: transformedProperties[0].location
    } : 'No properties');
   
    const count = await Property.countDocuments(query);
   
    res.status(200).json({
      success: true,
      data: transformedProperties,
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
    const { language = 'en' } = req.query;
   
    console.log('🔍 Getting property by ID:', req.params.id);
    console.log('🌐 Requested language:', language);
   
    const property = await Property.findById(req.params.id)
      .populate('userId', 'name phone email');
   
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
   
    console.log('📦 Raw property data:', {
      propertyTitle: property.propertyTitle,
      location: property.location,
      description: property.description
    });
   
    // Only show approved properties to non-owners/non-admins
    if (property.status !== 'approved' &&
        property.userId._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Property not available'
      });
    }
   
    const propObj = property.toObject();
   
    // ✅ Helper function to extract language-specific text
    // const getLocalizedText = (field) => {
    //   if (!field) return '';
    //   if (typeof field === 'string') return field;
    //   return field[language] || field.en || field.te || field.hi || '';
    // };
   
    // Transform to requested language
   const transformedProperty = {
  ...propObj,
  // ✅ Send full multilingual objects - let frontend handle language selection
  propertyTitle: propObj.propertyTitle,
  description: propObj.description,
  location: propObj.location,
  area: propObj.area,
  areaKey: propObj.areaKey || ''
};
   
    console.log('✅ Transformed property:', {
      propertyTitle: transformedProperty.propertyTitle,
      location: transformedProperty.location,
      description: transformedProperty.description
    });
   
    res.status(200).json({
      success: true,
      data: transformedProperty
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
    
    // Attach full image URLs
    const host = req.protocol + '://' + req.get('host');
    const propertiesWithUrls = properties.map((p) => ({
      ...p.toObject(),
      images: p.images || [],
    }));
    res.status(200).json({
      success: true,
      data: propertiesWithUrls
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

    const responseError = {
      message: error.message,
      name: error.name,
    };

    // If it's a Mongoose validation error, include the field errors and return 400
    if (error.name === 'ValidationError') {
      responseError.validation = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed while updating property',
        error: responseError
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update property',
      error: responseError
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
    
    const host = req.protocol + '://' + req.get('host');
    const propertiesWithUrls = properties.map((p) => {
      const obj = p.toObject();
      return {
        ...obj,
        imageUrls: (obj.images || [])
          .filter((img) => typeof img === "string")
          .map((img) => `${host}/${img.replace(/^\\\//, "")}`),
        documentUrls: {
          ownership: (obj.documents?.ownership || [])
            .filter((doc) => typeof doc === "string")
            .map((doc) => `${host}/${doc.replace(/^\\\//, "")}`),
          identity: (obj.documents?.identity || [])
            .filter((doc) => typeof doc === "string")
            .map((doc) => `${host}/${doc.replace(/^\\\//, "")}`),
        },
      };
    });

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
   
    let updateData = req.body;
    
    // ✅ AUTO-TRANSLATE multilingual fields if they're strings (edited by admin)
    const multilingualFields = ['propertyTitle', 'description', 'location', 'area'];
    const fieldsToTranslate = {};
    
    for (const field of multilingualFields) {
      if (updateData[field] && typeof updateData[field] === 'string') {
        // Admin edited English text, need to translate
        fieldsToTranslate[field] = updateData[field];
      }
    }
    
    // Translate if any fields need it
    if (Object.keys(fieldsToTranslate).length > 0) {
      console.log('🌐 Auto-translating fields:', Object.keys(fieldsToTranslate));
      const translated = await translatePropertyFields(fieldsToTranslate, 'en');
      
      // Replace string values with multilingual objects
      for (const field in translated) {
        updateData[field] = translated[field];
      }
      
      console.log('✅ Translation complete');
    }
   
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
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
    console.error('Error details:', error.message);

    const responseError = {
      message: error.message,
      name: error.name,
    };

    if (error.name === 'ValidationError') {
      responseError.validation = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed while updating property',
        error: responseError
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update property',
      error: responseError
    });
  }
};
