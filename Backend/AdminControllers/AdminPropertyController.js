// Backend/AdminControllers/AdminPropertyController.js
import Property from '../UserModels/Property.js';
import { translatePropertyFields, normalizeAreaKey } from '../services/translationService.js';
import { handleOfficeProperty } from './commercial/officeController.js';
import { handleRetailProperty } from './commercial/retailController.js';
import { handlePlotProperty } from './commercial/plotController.js';
import { handleStorageProperty } from './commercial/storageController.js';
import { handleIndustryProperty } from './commercial/industryController.js';
import { handleHospitalityProperty } from './commercial/hospitalityController.js';
import {
  uploadToCloudinary,
} from '../utils/cloudinaryHelper.js';

// Utility: Convert buffer to base64

const parseNestedArrays = (data) => {
  // Helper to parse stringified arrays/objects
  const parseStringified = (items) => {
    while (typeof items === 'string') {
      try {
        items = JSON.parse(items);
      } catch {
        return [];
      }
    }
    return Array.isArray(items) ? items : [];
  };

  // Helper to convert object arrays to string arrays
  const convertObjectsToStrings = (items) => {
    return items.map(item => {
      if (typeof item === 'object' && item !== null) {
        // If it has name and count, format as "Name (count)"
        if (item.name) {
          return item.count > 1 ? `${item.name} (${item.count})` : item.name;
        }
        // Otherwise, stringify the object
        return JSON.stringify(item);
      }
      return item;
    });
  };

  // HOUSE - furnishingItems
  if (data.houseDetails?.furnishingItems) {
    const items = parseStringified(data.houseDetails.furnishingItems);
    data.houseDetails.furnishingItems = convertObjectsToStrings(items);
    console.log('✅ [HOUSE] Converted furnishingItems:', data.houseDetails.furnishingItems);
  }

  // COMMERCIAL - Handle all subtypes
  if (data.commercialDetails) {
    const commercial = data.commercialDetails;

    // OFFICE
    if (commercial.officeDetails?.furnishingItems) {
      const items = parseStringified(commercial.officeDetails.furnishingItems);
      commercial.officeDetails.furnishingItems = convertObjectsToStrings(items);
      console.log('✅ [OFFICE] Converted furnishingItems:', commercial.officeDetails.furnishingItems);
    }

    // RETAIL
    if (commercial.retailDetails?.furnishingItems) {
      const items = parseStringified(commercial.retailDetails.furnishingItems);
      commercial.retailDetails.furnishingItems = convertObjectsToStrings(items);
      console.log('✅ [RETAIL] Converted furnishingItems:', commercial.retailDetails.furnishingItems);
    }

    // HOSPITALITY - furnishingDetails
    if (commercial.hospitalityDetails?.furnishingDetails) {
      const items = parseStringified(commercial.hospitalityDetails.furnishingDetails);
      commercial.hospitalityDetails.furnishingDetails = convertObjectsToStrings(items);
      console.log('✅ [HOSPITALITY] Converted furnishingDetails:', commercial.hospitalityDetails.furnishingDetails);
    }

    // STORAGE - Any array fields
    if (commercial.storageDetails?.security) {
      const items = parseStringified(commercial.storageDetails.security);
      commercial.storageDetails.security = items.map(item => typeof item === 'object' ? JSON.stringify(item) : item);
    }

    // INDUSTRY - Any array fields
    if (commercial.industryDetails?.pricing?.amenities) {
      const items = parseStringified(commercial.industryDetails.pricing.amenities);
      commercial.industryDetails.pricing.amenities = items.map(item => typeof item === 'object' ? JSON.stringify(item) : item);
    }

    // PLOT - Any array fields
    if (commercial.plotDetails?.amenities) {
      const items = parseStringified(commercial.plotDetails.amenities);
      commercial.plotDetails.amenities = items.map(item => typeof item === 'object' ? JSON.stringify(item) : item);
    }
  }

  // SITE/PLOT/LAND
  if (data.siteDetails) {
    // Handle any array fields that might be objects
    ['amenities', 'locationAdvantages', 'constructionType', 'approvedBy', 'overlooking'].forEach(field => {
      if (data.siteDetails[field]) {
        const items = parseStringified(data.siteDetails[field]);
        data.siteDetails[field] = items.map(item => typeof item === 'object' ? JSON.stringify(item) : item);
      }
    });
  }

  // RESORT
  if (data.resortDetails?.locationAdvantages) {
    const items = parseStringified(data.resortDetails.locationAdvantages);
    data.resortDetails.locationAdvantages = items.map(item => typeof item === 'object' ? JSON.stringify(item) : item);
  }

  return data;
};
// ✅ ADMIN CREATE PROPERTY - ALL TYPES SUPPORTED
export const adminCreateProperty = async (req, res) => {
  try {
    console.log('📥 [ADMIN] Property upload request');
    
    if (!req.body.propertyData) {
      return res.status(400).json({
        success: false,
        message: 'Property data missing'
      });
    }

    let propertyData;
    try {
      propertyData = JSON.parse(req.body.propertyData);
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid propertyData format',
        error: parseError.message
      });
    }

    // ✅ FIX: Parse furnishingItems if it's a stringified array
   
    propertyData = parseNestedArrays(propertyData);
    // ✅ END OF NEW BLOCK

    // 🔧 Normalize property type to match schema enum
    const normalizePropertyType = (type) => {
      if (!type) return type;
      const t = type.trim().toLowerCase();

      if (t.includes('site') && t.includes('plot')) return 'Site/Plot/Land';
      if (t.includes('house')) return 'House';
      if (t.includes('commercial')) return 'Commercial';
      if (t.includes('resort')) return 'Resort';

      return type;
    };


const normalizedPropertyType = normalizePropertyType(propertyData.propertyType);

    console.log('📋 [ADMIN] Property Data:', JSON.stringify(propertyData, null, 2));

    // ✅ ADMIN BYPASS - Owner details optional with defaults
    const ownerDetails = propertyData.ownerDetails || {
      name: 'Admin Upload',
      phone: '0000000000',
      email: 'admin@landstime.com'
    };

   console.log('📄 [ADMIN] Files received:', {
  images: req.files?.images?.length || 0,
  ownershipDocs: req.files?.ownershipDocs?.length || 0,
  identityDocs: req.files?.identityDocs?.length || 0
});

// ✅ Generate unique timestamp for this upload
const uploadTimestamp = Date.now();

// ✅ Upload images to Cloudinary
let images = [];
if (req.files?.images && req.files.images.length > 0) {
  console.log(`📸 Uploading ${req.files.images.length} images to Cloudinary...`);
  
  const uploadPromises = req.files.images.map((file, index) => {
    return uploadToCloudinary(file.buffer, {
      folder: 'property-listings/admin-properties/images',
      public_id: `admin_property_${uploadTimestamp}_image_${index}`,
      resource_type: 'image',
    });
  });

  const uploadResults = await Promise.all(uploadPromises);
  images = uploadResults.map(result => result.url);
  
  console.log('✅ Images uploaded to Cloudinary:', images);
}

// ✅ Upload ownership documents to Cloudinary
let ownershipDocs = [];
if (req.files?.ownershipDocs && req.files.ownershipDocs.length > 0) {
  console.log(`📄 Uploading ${req.files.ownershipDocs.length} ownership docs to Cloudinary...`);
  
  const uploadPromises = req.files.ownershipDocs.map((file, index) => {
    const isPDF = file.mimetype === 'application/pdf';
    return uploadToCloudinary(file.buffer, {
      folder: 'property-listings/admin-properties/documents/ownership',
      public_id: `admin_ownership_${uploadTimestamp}_${index}`,
      resource_type: isPDF ? 'raw' : 'image',
    });
  });

  const uploadResults = await Promise.all(uploadPromises);
  ownershipDocs = uploadResults.map(result => result.url);
  
  console.log('✅ Ownership docs uploaded to Cloudinary:', ownershipDocs);
}

// ✅ Upload identity documents to Cloudinary
let identityDocs = [];
if (req.files?.identityDocs && req.files.identityDocs.length > 0) {
  console.log(`📄 Uploading ${req.files.identityDocs.length} identity docs to Cloudinary...`);
  
  const uploadPromises = req.files.identityDocs.map((file, index) => {
    const isPDF = file.mimetype === 'application/pdf';
    return uploadToCloudinary(file.buffer, {
      folder: 'property-listings/admin-properties/documents/identity',
      public_id: `admin_identity_${uploadTimestamp}_${index}`,
      resource_type: isPDF ? 'raw' : 'image',
    });
  });

  const uploadResults = await Promise.all(uploadPromises);
  identityDocs = uploadResults.map(result => result.url);
  
  console.log('✅ Identity docs uploaded to Cloudinary:', identityDocs);
}

    // Backend validation
    if (!propertyData.propertyTitle) {
      return res.status(400).json({ 
        success: false, 
        message: 'Property title is required' 
      });
    }
    
    if (!propertyData.propertyType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Property type is required' 
      });
    }

    // ✅ Build final data with admin-specific settings
    const finalData = {
      propertyType: normalizedPropertyType,
      propertyTitle: propertyData.propertyTitle,
      ownerDetails: ownerDetails,
      expectedPrice: propertyData.expectedPrice || 0,
      description: propertyData.description || "",
      images,
      documents: {
        ownership: ownershipDocs,
        identity: identityDocs,
      },
      userId: null, // ✅ NULL for admin uploads
      uploadedBy: 'admin', // ✅ Mark as admin upload
      status: "approved", // ✅ AUTO-APPROVED
      adminDeletedStatus: "active"
    };

    // ==================== PROPERTY TYPE HANDLING ====================
    
    // HOUSE
    if (normalizedPropertyType === "House") {
      finalData.location = propertyData.location;
      finalData.area = propertyData.area;
      finalData.houseDetails = propertyData.houseDetails;
      
      console.log('🏠 [ADMIN] House property data:', {
        location: finalData.location,
        area: finalData.area,
        bedrooms: propertyData.houseDetails?.bedrooms,
        bathrooms: propertyData.houseDetails?.bathrooms
      });
    }

    // SITE/PLOT/LAND
    if (normalizedPropertyType === "Site/Plot/Land") {
      finalData.location = propertyData.location;
      finalData.area = propertyData.area; // This is the neighborhood/locality name

      const details = propertyData.siteDetails || propertyData; // Allow fields at top level for admin simplicity

      console.log('🏞️ [ADMIN] Site/Plot/Land property data:', details);

      finalData.siteDetails = {
        // Area and dimensions
        area: Number(details.area) || 0,
        areaUnit: details.areaUnit || 'sqft',
        length: Number(details.length) || 0,
        breadth: Number(details.breadth) || 0,
        floorsAllowed: Number(details.floorsAllowed) || 0,

        // Boundary and access
        boundaryWall: details.boundaryWall || false,
        openSides: Number(details.openSides) || 0,
        roadWidth: Number(details.roadWidth) || 0,
        roadWidthUnit: details.roadWidthUnit || 'ft',

        // Construction
        constructionDone: details.constructionDone || false,
        constructionType: details.constructionType || [],

        // Possession and ownership
        possessionBy: details.possessionBy,
        ownership: details.ownership || 'Freehold',
        approvedBy: details.approvedBy || [],

        // Features
        amenities: details.amenities || [],
        propertyFacing: details.propertyFacing,
        overlooking: details.overlooking || [],
        inGatedSociety: details.inGatedSociety || false,
        cornerProperty: details.cornerProperty || false,
        locationAdvantages: details.locationAdvantages || [],

        // Vastu
        vaasthuDetails: details.vaasthuDetails || {},
      };

      // Validation for required fields
      if (!finalData.siteDetails.area || !finalData.siteDetails.length || !finalData.siteDetails.breadth) {
        return res.status(400).json({
          success: false,
          message: 'Site/Plot/Land requires numerical area, length, and breadth in siteDetails.'
        });
      }
    }



    // RESORT
    if (normalizedPropertyType === "Resort") {
      finalData.location = propertyData.location;
      finalData.area = propertyData.area;
      
      console.log('🏨 [ADMIN] Resort property data:', {
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
    }

    // COMMERCIAL (all subtypes)
    
if (normalizedPropertyType === "Commercial") {
  const { commercialDetails } = propertyData;

  if (!commercialDetails || !commercialDetails.subType) {
    return res.status(400).json({
      success: false,
      message: "Commercial subType is required",
    });
  }

  const rawSubType = commercialDetails.subType.trim().toLowerCase();

  let canonicalSubType = "Other";
  if (rawSubType.includes("office")) canonicalSubType = "Office";
  else if (rawSubType.includes("retail")) canonicalSubType = "Retail";
  else if (rawSubType.includes("plot")) canonicalSubType = "Plot/Land";
  else if (rawSubType.includes("stor")) canonicalSubType = "Storage";
  else if (rawSubType.includes("industry")) canonicalSubType = "Industry";
  else if (rawSubType.includes("hospital")) canonicalSubType = "Hospitality";

  finalData.commercialDetails = {
    subType: canonicalSubType,
  };

  /// 🔹 OFFICE HANDLING
if (canonicalSubType === "Office") {
  // ✅ FIX: Ensure officeDetails has expectedPrice from top level
  if (!commercialDetails.officeDetails) {
    commercialDetails.officeDetails = {};
  }
  
  // ✅ Copy expectedPrice to officeDetails if not already there
  if (!commercialDetails.officeDetails.expectedPrice && propertyData.expectedPrice) {
    commercialDetails.officeDetails.expectedPrice = propertyData.expectedPrice;
  }
  
  console.log('🔍 [ADMIN] Office details before controller:', {
    hasExpectedPrice: !!commercialDetails.officeDetails.expectedPrice,
    expectedPrice: commercialDetails.officeDetails.expectedPrice,
    hasVaastu: !!commercialDetails.officeDetails.vaasthuDetails,
    vaastuFields: Object.keys(commercialDetails.officeDetails.vaasthuDetails || {}),
  });
  
  handleOfficeProperty(propertyData, finalData);
}
// 🔹 RETAIL HANDLING
if (canonicalSubType === "Retail") {
  if (!commercialDetails.retailDetails) {
    commercialDetails.retailDetails = {};
  }
  
  if (!commercialDetails.retailDetails.expectedPrice && propertyData.expectedPrice) {
    commercialDetails.retailDetails.expectedPrice = propertyData.expectedPrice;
  }
  
  console.log('🔍 [ADMIN] Retail details before controller:', {
    hasExpectedPrice: !!commercialDetails.retailDetails.expectedPrice,
    expectedPrice: commercialDetails.retailDetails.expectedPrice,
    hasVaastu: !!commercialDetails.retailDetails.vaasthuDetails,
    vaastuFields: Object.keys(commercialDetails.retailDetails.vaasthuDetails || {}),
  });
  
  handleRetailProperty(propertyData, finalData);
}
if (canonicalSubType === "Plot/Land") {
  if (!commercialDetails.plotDetails) {
    commercialDetails.plotDetails = {};
  }
  
  if (!commercialDetails.plotDetails.expectedPrice && propertyData.expectedPrice) {
    commercialDetails.plotDetails.expectedPrice = propertyData.expectedPrice;
  }
  
  console.log('🔍 [ADMIN] Plot details before controller:', {
    hasExpectedPrice: !!commercialDetails.plotDetails.expectedPrice,
    expectedPrice: commercialDetails.plotDetails.expectedPrice,
    hasVastu: !!commercialDetails.plotDetails.vaasthuDetails,
    vaastuFields: Object.keys(commercialDetails.plotDetails.vaasthuDetails || {}),
  });
  
  handlePlotProperty(propertyData, finalData);
}
// 🔹 STORAGE HANDLING
if (canonicalSubType === "Storage") {
  if (!commercialDetails.storageDetails) {
    commercialDetails.storageDetails = {};
  }
  
  if (!commercialDetails.storageDetails.expectedPrice && propertyData.expectedPrice) {
    commercialDetails.storageDetails.expectedPrice = propertyData.expectedPrice;
  }
  
  console.log('🔍 [ADMIN] Storage details before controller:', {
    hasExpectedPrice: !!commercialDetails.storageDetails.expectedPrice,
    expectedPrice: commercialDetails.storageDetails.expectedPrice,
    hasVastu: !!commercialDetails.storageDetails.vaasthuDetails,
    vaastuFields: Object.keys(commercialDetails.storageDetails.vaasthuDetails || {}),
  });
  
  handleStorageProperty(propertyData, finalData);
}
// 🔹 INDUSTRY HANDLING
if (canonicalSubType === "Industry") {
  if (!commercialDetails.industryDetails) {
    commercialDetails.industryDetails = {};
  }
  
  if (!commercialDetails.industryDetails.expectedPrice && propertyData.expectedPrice) {
    commercialDetails.industryDetails.expectedPrice = propertyData.expectedPrice;
  }
  
  console.log('🔍 [ADMIN] Industry details before controller:', {
    hasExpectedPrice: !!commercialDetails.industryDetails.expectedPrice,
    expectedPrice: commercialDetails.industryDetails.expectedPrice,
    hasVastu: !!commercialDetails.industryDetails.vaasthuDetails,
    vaastuFields: Object.keys(commercialDetails.industryDetails.vaasthuDetails || {}),
  });
  
  handleIndustryProperty(propertyData, finalData);
}
if (canonicalSubType === "Hospitality") {
  if (!commercialDetails.hospitalityDetails) {
    commercialDetails.hospitalityDetails = {};
  }
  
  if (!commercialDetails.hospitalityDetails.expectedPrice && propertyData.expectedPrice) {
    commercialDetails.hospitalityDetails.expectedPrice = propertyData.expectedPrice;
  }
  
  console.log('🔍 [ADMIN] Hospitality details before controller:', {
    hasExpectedPrice: !!commercialDetails.hospitalityDetails.expectedPrice,
    expectedPrice: commercialDetails.hospitalityDetails.expectedPrice,
    hasVaastu: !!commercialDetails.hospitalityDetails.vaasthuDetails,
    vaastuFields: Object.keys(commercialDetails.hospitalityDetails.vaasthuDetails || {}),
  });
  
  handleHospitalityProperty(propertyData, finalData);
}

  console.log('🏢 [ADMIN] Commercial property:', canonicalSubType);
}


    // Validation
    if (images.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least one image is required' 
      });
    }

    // ==================== TRANSLATION SECTION ====================
    console.log('🔄 [ADMIN] Translating property fields...');
    const originalLanguage = propertyData.originalLanguage || 'en';

    const getPlainText = (field) => {
      if (!field) return '';
      if (typeof field === 'string') return field;
      return field[originalLanguage] || field.en || field.te || field.hi || '';
    };

    let descriptionToTranslate = propertyData.description || '';

    if (normalizedPropertyType === 'Commercial' && propertyData.commercialDetails) {
      const commercialDetails = propertyData.commercialDetails;
      
      descriptionToTranslate = commercialDetails.description || 
                              commercialDetails.pricingExtras?.description ||
                              commercialDetails.officeDetails?.description ||
                              commercialDetails.retailDetails?.description ||
                              commercialDetails.plotDetails?.description ||
                              commercialDetails.storageDetails?.description ||
                              commercialDetails.industryDetails?.pricing?.description ||
                              commercialDetails.hospitalityDetails?.description ||
                              propertyData.description ||
                              '';
    }

    console.log('📝 [ADMIN] Fields to translate:', {
      propertyTitle: getPlainText(propertyData.propertyTitle),
      description: getPlainText(descriptionToTranslate),
      location: getPlainText(finalData.location || propertyData.location),
      area: getPlainText(propertyData.area)
    });

    const translatedFields = await translatePropertyFields({
      propertyTitle: getPlainText(propertyData.propertyTitle),
      description: getPlainText(descriptionToTranslate),
      location: getPlainText(finalData.location || propertyData.location),
      area: getPlainText(propertyData.area)
    }, originalLanguage);

    console.log('✅ [ADMIN] Translation complete');

    // Generate areaKey for filtering
    const areaKey = normalizeAreaKey(propertyData.area);
    console.log('🔑 [ADMIN] Generated areaKey:', areaKey);

    // Store multilingual data
    finalData.propertyTitle = translatedFields.propertyTitle;
    finalData.description = translatedFields.description;
    finalData.location = translatedFields.location;
    finalData.area = translatedFields.area;
    finalData.areaKey = areaKey;
    finalData.originalLanguage = originalLanguage;

    console.log('💾 [ADMIN] Final data to save:', {
      propertyType: finalData.propertyType,
      userId: finalData.userId,
      uploadedBy: finalData.uploadedBy,
      status: finalData.status,
      hasTranslations: typeof finalData.propertyTitle === 'object'
    });

    // ✅ Create and save property
    const property = new Property(finalData);
    await property.save();

    console.log("✅ [ADMIN] PROPERTY SAVED - AUTO-APPROVED");
    console.log("🆔 Property ID:", property._id);
    console.log("👤 User ID:", property.userId || 'NULL (Admin Upload)');
    console.log("🏷 Property Type:", property.propertyType);

    res.status(201).json({
      success: true,
      message: 'Property created successfully by admin (auto-approved with translations)',
      data: property
    });

  } catch (error) {
    console.error('❌ [ADMIN] Property creation error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create property',
      error: error.message
    });
  }
};