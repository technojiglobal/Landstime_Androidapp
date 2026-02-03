// Backend/UserControllers/PropertyController.js
import Property from '../UserModels/Property.js';
import User from '../UserModels/User.js';
import { translatePropertyFields, normalizeAreaKey } from '../services/translationService.js';

// ✅ ADD THIS - Reverse translation utility
const reverseTranslationMap = {
  // Ownership
  'ఇతర': 'Other',
  'अन्य': 'Other',
  'ఫ్రీహోల్డ్': 'Freehold',
  'फ्रीहोल्ड': 'Freehold',
  'లీజ్‌హోల్డ్': 'Leasehold',
  'लीजहोल्ड': 'Leasehold',
  'కో-ఆపరేటివ్ సొసైటీ': 'Co-operative Society',
  'सहकारी समिति': 'Co-operative Society',

  // Authority
  'స్థానిక అథారిటీ': 'Local Authority',
  'स्थानीय प्राधिकरण': 'Local Authority',

  // Flooring
  'కాంక్రీటు': 'Concrete',
  'कंक्रीट': 'Concrete',
  'పాలరాయి': 'Marble',
  'संगमरमर': 'Marble',
  'సిరామిక్': 'Ceramic',
  'सिरेमिक': 'Ceramic',
  'మొజాయిక్': 'Mosaic',
  'मोज़ेक': 'Mosaic',
  'సిమెంట్': 'Cement',
  'सीमेंट': 'Cement',
  'రాయి': 'Stone',
  'पत्थर': 'Stone',
  'వినైల్': 'Vinyl',
  'विनाइल': 'Vinyl',
  'స్పార్టెక్స్': 'Spartex',
  'स्पार्टेक्स': 'Spartex',
  'ఐపీఎస్': 'IPS',
  'आईपीएस': 'IPS',
  'విట్రిఫైడ్': 'Vitrified',
  'विट्रिफाइड': 'Vitrified',
  'చెక్క': 'Wooden',
  'लकड़ी': 'Wooden',
  'గ్రానైట్': 'Granite',
  'ग्रेनाइट': 'Granite',
  'ఇతరములు': 'Others',
  'अन्य': 'Others',

  // Directions
  'ఈశాన్యం': 'North-East',
  'उत्तर-पूर्व': 'North-East',
  'ఉత్తరం': 'North',
  'उत्तर': 'North',
  'తూర్పు': 'East',
  'पूर्व': 'East',
  'పడమర': 'West',
  'पश्चिम': 'West',
  'దక్షిణం': 'South',
  'दक्षिण': 'South',
  'నైరుతి': 'South-West',
  'दक्षिण-पश्चिम': 'South-West',
  'వాయువ్యం': 'North-West',
  'उत्तर-पश्चिम': 'North-West',
  'ఆగ్నేయం': 'South-East',
  'दक्षिण-पूर्व': 'South-East',

  // Vastu specific
  'ఉత్తరం వైపు': 'Towards North',
  'उत्तर की ओर': 'Towards North',
  'సంతులిత ఓపెన్ స్పేస్': 'Balanced Open Space',
  'संतुलित खुली जगह': 'Balanced Open Space',
  'చతురస్రం': 'Square',
  'वर्ग': 'Square',
  'ఉత్తరం నీటి వనరు': 'Water Source in North',
  'उत्तर में जल स्रोत': 'Water Source in North',
  'సమాన ఎత్తు': 'Equal Height',
  'समान ऊंचाई': 'Equal Height',
  'నిర్మాణాలు లేవు': 'No Structures Above',
  'कोई संरचना नहीं': 'No Structures Above',

  // Other Rooms
  'పూజా గది': 'Pooja Room',
  'पूजा कक्ष': 'Pooja Room',
  'అధ్యయన గది': 'Study Room',
  'अध्ययन कक्ष': 'Study Room',
  'సేవకుల గది': 'Servant Room',
  'नौकर का कमरा': 'Servant Room',

  // Washroom
  'ఏదీ లేదు': 'None',
  'कोई नहीं': 'None',
  'భాగస్వామ్యం': 'Shared',
  'साझा': 'Shared',

  // Balconies
  '3 కంటే ఎక్కువ': 'More than 3',
  '3 से अधिक': 'More than 3',

  // Furnishing
  'అమర్చబడనిది': 'Unfurnished',
  'असुसज्जित': 'Unfurnished',
  'పాక్షిక సమర్పించబడింది': 'Semi-furnished',
  'अर्ध-सुसज्जित': 'Semi-furnished',
  'అమర్చబడినది': 'Furnished',
  'सुसज्जित': 'Furnished',

  // Yes/No
  'అవును': 'Yes',
  'हाँ': 'Yes',
  'లేదు': 'No',
  'नहीं': 'No',
  // Construction Types
'+ Shed': '+ Shed',
'+ Room(s)': '+ Room(s)',
'+ Washroom': '+ Washroom',
'+ Other': '+ Other',
'+ शेड': '+ Shed',
'+ कमरा(ए)': '+ Room(s)',
'+ वॉशरूम': '+ Washroom',
'+ अन्य': '+ Other',
'+ షెడ్': '+ Shed',
'+ గది(లు)': '+ Room(s)',
'+ వాష్‌రూమ్': '+ Washroom',
'+ ఇతర': '+ Other',

// Vastu Directions - Towards
'తూర్పు వైపు': 'Towards East',
'पूर्व की ओर': 'Towards East',
'దక్షిణం వైపు': 'Towards South',
'दक्षिण की ओर': 'Towards South',
'పడమర వైపు': 'Towards West',
'पश्चिम की ओर': 'Towards West',

// Open Space
'ఉత్తరం & తూర్పులో ఎక్కువ': 'More in North & East',
'उत्तर और पूर्व में अधिक': 'More in North & East',

};

const toEnglish = (text) => {
  if (!text) return text;
  if (typeof text !== 'string') return text;
  return reverseTranslationMap[text.trim()] || text;
};

const convertToEnglish = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return typeof obj === 'string' ? toEnglish(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertToEnglish(item));
  }

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip multilingual fields
    if (['propertyTitle', 'description', 'location', 'area'].includes(key)) {
      result[key] = value;
    } else {
      result[key] = convertToEnglish(value);
    }
  }
  
  return result;
};

// Utility: normalize filesystem path to URL-friendly forward slashes
const normalizePath = (p) => (p ? p.replace(/\\+/g, '/') : p);

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
    
     const images = req.files?.images?.map(file => 
      `/uploads/properties/images/${file.filename}`
    ) || [];

    const ownershipDocs = req.files?.ownershipDocs?.map(file => 
      `/uploads/properties/ownership/${file.filename}`
    ) || [];

    const identityDocs = req.files?.identityDocs?.map(file => 
      `/uploads/properties/identity/${file.filename}`
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
   if (propertyData.propertyType === "House" || propertyData.propertyType === "House/Flat") {
      finalData.location = propertyData.location;
      finalData.area = propertyData.area;
      finalData.houseDetails = propertyData.houseDetails;
      
      console.log(`🏠 ${propertyData.propertyType} property data:`, {
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
if (canonicalSubType === "Office") {
  if (
    !commercialDetails.officeDetails ||
    !commercialDetails.officeDetails.location ||
    !commercialDetails.officeDetails.carpetArea
  ) {
    return res.status(400).json({
      success: false,
      message: "Office location and carpet area are required",
    });
  }
  
  console.log('🏢 Processing Office details:', {
    hasNeighborhoodArea: !!commercialDetails.officeDetails.neighborhoodArea,
    propertyDataArea: propertyData.area,
    hasAllFields: !!commercialDetails.officeDetails.officeKind,
  });
  
  // ✅ CRITICAL FIX: Store location and area properly
  finalData.location = commercialDetails.officeDetails.location;
  
  // ✅ Priority order for neighborhoodArea
  const neighborhoodArea = commercialDetails.officeDetails.neighborhoodArea || 
                           propertyData.area || 
                           commercialDetails.area || 
                           '';
  
  finalData.area = neighborhoodArea;
  
  console.log('✅ Office area set to:', finalData.area);
  
  // ✅ IMPORTANT: Store COMPLETE office details
  finalData.commercialDetails.officeDetails = {
    // Basic Info
    officeKind: commercialDetails.officeDetails.officeKind,
    propertyTitle: commercialDetails.officeDetails.propertyTitle,
    location: commercialDetails.officeDetails.location,
    locatedInside: commercialDetails.officeDetails.locatedInside,
    zoneType: commercialDetails.officeDetails.zoneType,
    neighborhoodArea: neighborhoodArea,
    
    // Area
    carpetArea: Number(commercialDetails.officeDetails.carpetArea) || 0,
    carpetAreaUnit: commercialDetails.officeDetails.carpetAreaUnit || 'sqft',
    
    // Office Setup (from Office.jsx)
    cabins: Number(commercialDetails.officeDetails.cabins) || 0,
    meetingRooms: Number(commercialDetails.officeDetails.meetingRooms) || 0,
    seats: Number(commercialDetails.officeDetails.seats) || 0,
    maxSeats: Number(commercialDetails.officeDetails.maxSeats) || 0,
    
    // Features
    conferenceRooms: commercialDetails.officeDetails.conferenceRooms,
    washrooms: {
      public: Number(commercialDetails.officeDetails.washrooms?.public) || 0,
      private: Number(commercialDetails.officeDetails.washrooms?.private) || 0,
    },
    receptionArea: commercialDetails.officeDetails.receptionArea || false,
    furnishing: commercialDetails.officeDetails.furnishing || false,
    
    // ✅ Pantry Details
    pantry: commercialDetails.officeDetails.pantry || false,
    pantryType: commercialDetails.officeDetails.pantryType,
    pantrySize: Number(commercialDetails.officeDetails.pantrySize) || 0,
    
    additionalFeatures: commercialDetails.officeDetails.additionalFeatures || [],
    fireSafetyMeasures: commercialDetails.officeDetails.fireSafetyMeasures || [],
    
    // Floor Details
    totalFloors: Number(commercialDetails.officeDetails.totalFloors) || 0,
    floorNo: Number(commercialDetails.officeDetails.floorNo) || 0,
    staircases: commercialDetails.officeDetails.staircases,
    
    // Lift
    lift: commercialDetails.officeDetails.lift,
    passengerLifts: Number(commercialDetails.officeDetails.passengerLifts) || 0,
    serviceLifts: Number(commercialDetails.officeDetails.serviceLifts) || 0,
    
    // Parking
    parking: {
      type: commercialDetails.officeDetails.parking?.type,
      options: commercialDetails.officeDetails.parking?.options || {
        basement: false,
        outside: false,
        private: false,
      },
      count: Number(commercialDetails.officeDetails.parking?.count) || 0,
    },
    
    // Availability
    availability: commercialDetails.officeDetails.availability,
    ageOfProperty: commercialDetails.officeDetails.ageOfProperty,
    possessionBy: commercialDetails.officeDetails.possessionBy,
    ownership: commercialDetails.officeDetails.ownership,
    
    // Pricing (from OfficeNext.jsx)
    expectedPrice: Number(commercialDetails.officeDetails.expectedPrice) || 0,
    priceDetails: {
      allInclusive: commercialDetails.officeDetails.priceDetails?.allInclusive || false,
      negotiable: commercialDetails.officeDetails.priceDetails?.negotiable || false,
      taxExcluded: commercialDetails.officeDetails.priceDetails?.taxExcluded || false,
    },
    
    // Pre-Leased Details
    preLeased: commercialDetails.officeDetails.preLeased,
    leaseDuration: commercialDetails.officeDetails.leaseDuration,
    monthlyRent: Number(commercialDetails.officeDetails.monthlyRent) || 0,
    
    // Certifications
    nocCertified: commercialDetails.officeDetails.nocCertified,
    occupancyCertified: commercialDetails.officeDetails.occupancyCertified,
    
    // Additional Info
    previouslyUsedFor: commercialDetails.officeDetails.previouslyUsedFor,
    description: commercialDetails.officeDetails.description,
    
    amenities: commercialDetails.officeDetails.amenities || [],
    locationAdvantages: commercialDetails.officeDetails.locationAdvantages || [],
    
    // Vastu Details (from OfficeVaastu.jsx)
    vaasthuDetails: commercialDetails.officeDetails.vaasthuDetails || {},
  };
  
  // ✅ NEW - Override root expectedPrice with office price
  finalData.expectedPrice = Number(commercialDetails.officeDetails.expectedPrice) || 0;
  
  console.log('✅ Office details stored:', {
    location: finalData.location,
    area: finalData.area,
    officeKind: finalData.commercialDetails.officeDetails.officeKind,
    carpetArea: finalData.commercialDetails.officeDetails.carpetArea,
    expectedPrice: finalData.expectedPrice,
    hasDescription: !!finalData.commercialDetails.officeDetails.description,
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

  // ✅ ADD THIS CONVERSION HERE
  const storageTypeMap = {
    'వేర్‌హౌస్': 'Warehouse',
    'गोदाम': 'Warehouse',
    'కోల్డ్ స్టోరేజ్': 'Cold Storage',
    'कोल्ड स्टोरेज': 'Cold Storage'
  };

  const rawStorageType = commercialDetails.storageDetails.storageType;
  const convertedStorageType = storageTypeMap[rawStorageType] || rawStorageType;

  console.log('🔄 Backend Storage Type Conversion:', {
    raw: rawStorageType,
    converted: convertedStorageType
  });

  // ✅ OVERRIDE with English value
  commercialDetails.storageDetails.storageType = convertedStorageType;


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

  // ✅✅✅ ADD THESE 3 LINES HERE - THIS IS WHAT YOU'RE MISSING! ✅✅✅
  finalData.location = commercialDetails.industryDetails.location;
  const neighborhoodArea = commercialDetails.industryDetails.neighborhoodArea || propertyData.area || '';
  finalData.area = neighborhoodArea;
  // ✅✅✅ END OF NEW LINES ✅✅✅

  // ✅ IMPORTANT: Store COMPLETE industry details without filtering
  finalData.commercialDetails.industryDetails = {
    // Basic Info
    location: commercialDetails.industryDetails.location,
    neighborhoodArea: neighborhoodArea,  // ✅ Now this variable exists!

    // Area & Dimensions
    area: {
      value: commercialDetails.industryDetails.area?.value,
      unit: commercialDetails.industryDetails.area?.unit || 'sqft',
    },
    dimensions: {
      length: commercialDetails.industryDetails.dimensions?.length,
      breadth: commercialDetails.industryDetails.dimensions?.breadth,
    },

    // Facilities
    washroomType: commercialDetails.industryDetails.washroomType,

    // Availability
    availability: commercialDetails.industryDetails.availability,
    ageOfProperty: commercialDetails.industryDetails.ageOfProperty,
    possessionBy: commercialDetails.industryDetails.possessionBy,

    // Pricing (from nested pricing object)
    pricing: {
      ownership: commercialDetails.industryDetails.pricing?.ownership,
      expectedPrice: commercialDetails.industryDetails.pricing?.expectedPrice,
      priceDetails: commercialDetails.industryDetails.pricing?.priceDetails,
      approvedBy: commercialDetails.industryDetails.pricing?.approvedBy,
      approvedIndustryType: commercialDetails.industryDetails.pricing?.approvedIndustryType,
      preLeased: commercialDetails.industryDetails.pricing?.preLeased,
      leaseDuration: commercialDetails.industryDetails.pricing?.leaseDuration,
      monthlyRent: commercialDetails.industryDetails.pricing?.monthlyRent,
      description: commercialDetails.industryDetails.pricing?.description,
      amenities: commercialDetails.industryDetails.pricing?.amenities || [],
      locationAdvantages: commercialDetails.industryDetails.pricing?.locationAdvantages || [],
      wheelchairFriendly: commercialDetails.industryDetails.pricing?.wheelchairFriendly,
    },

    // Vastu Details
    vastuDetails: commercialDetails.industryDetails.vastuDetails || {},
  };

  console.log('✅ Industry details stored:', {
    location: finalData.location,
    area: finalData.area,
    hasDescription: !!finalData.commercialDetails.industryDetails.pricing?.description,
    allFields: Object.keys(finalData.commercialDetails.industryDetails),
    hasPricing: !!finalData.commercialDetails.industryDetails.pricing,
    hasVastu: !!finalData.commercialDetails.industryDetails.vastuDetails,
  });
}




// HOSPITALITY
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
    hasHospitalityType: !!commercialDetails.hospitalityType,
    rawPossessionBy: commercialDetails.hospitalityDetails.possessionBy,
    rawExpectedMonth: commercialDetails.hospitalityDetails.expectedMonth,
  });

  finalData.location = commercialDetails.hospitalityDetails.location;

  const neighborhoodArea = commercialDetails.hospitalityDetails.neighborhoodArea ||
                           propertyData.area ||
                           '';

  finalData.area = neighborhoodArea;

  console.log('✅ Hospitality area set to:', finalData.area);

  // ✅ CRITICAL - Convert ALL Telugu/Hindi to English BEFORE saving
  const rawDetails = commercialDetails.hospitalityDetails;
  const convertedDetails = {
    ...rawDetails,
    // ✅ Convert possession timeline
    possessionBy: toEnglish(rawDetails.possessionBy),
    expectedMonth: toEnglish(rawDetails.expectedMonth),
    // ✅ Convert other fields
    ownership: toEnglish(rawDetails.ownership),
    washroomType: toEnglish(rawDetails.washroomType),
    balconies: toEnglish(rawDetails.balconies),
    otherRooms: convertToEnglish(rawDetails.otherRooms || []),
    furnishingType: toEnglish(rawDetails.furnishingType),
    IndustryApprovedBy: toEnglish(rawDetails.IndustryApprovedBy),
    preLeased: toEnglish(rawDetails.preLeased),
    flooringType: toEnglish(rawDetails.flooringType),
    amenities: convertToEnglish(rawDetails.amenities || []),
    locationAdvantages: convertToEnglish(rawDetails.locationAdvantages || []),
    vastuDetails: convertToEnglish(rawDetails.vastuDetails || {}),
  };

  console.log('🌐 Converted Hospitality data:', {
    possessionBy: convertedDetails.possessionBy,
    expectedMonth: convertedDetails.expectedMonth,
    ownership: convertedDetails.ownership,
    flooringType: convertedDetails.flooringType,
  });

  finalData.commercialDetails.hospitalityDetails = {
    // ✅ CRITICAL - hospitalityType from multiple sources
    hospitalityType: commercialDetails.hospitalityType || 
                     commercialDetails.hospitalityDetails.hospitalityType ||
                     propertyData.hospitalityType,

    location: convertedDetails.location,
    neighborhoodArea: neighborhoodArea,

    area: {
      value: Number(convertedDetails.area?.value) || 0,
      unit: convertedDetails.area?.unit || 'sqft',
    },

    rooms: Number(convertedDetails.rooms) || 0,
    washroomType: convertedDetails.washroomType,
    balconies: convertedDetails.balconies,
    otherRooms: convertedDetails.otherRooms,

    furnishingType: convertedDetails.furnishingType || 'Unfurnished',
    furnishingDetails: convertedDetails.furnishingDetails || [],

    availability: convertedDetails.availability,
    ageOfProperty: convertedDetails.ageOfProperty,
    possessionBy: convertedDetails.possessionBy, // ✅ Now in English
    expectedMonth: convertedDetails.expectedMonth, // ✅ Now in English

    ownership: convertedDetails.ownership,
    IndustryApprovedBy: convertedDetails.IndustryApprovedBy,
    approvedIndustryType: convertedDetails.approvedIndustryType,
    expectedPrice: Number(convertedDetails.expectedPrice) || 0,
    priceDetails: {
      allInclusive: convertedDetails.priceDetails?.allInclusive || false,
      negotiable: convertedDetails.priceDetails?.negotiable || false,
      taxExcluded: convertedDetails.priceDetails?.taxExcluded || false,
    },

    preLeased: convertedDetails.preLeased,
    leaseDuration: convertedDetails.leaseDuration,
    monthlyRent: Number(convertedDetails.monthlyRent) || 0,

    description: convertedDetails.description,
    amenities: convertedDetails.amenities,
    locationAdvantages: convertedDetails.locationAdvantages,
    wheelchairFriendly: convertedDetails.wheelchairFriendly || false,
    flooringType: convertedDetails.flooringType,

    vastuDetails: convertedDetails.vastuDetails,
  };

  finalData.expectedPrice = Number(convertedDetails.expectedPrice) || 0;

  console.log('✅ Hospitality details stored with English values:', {
    hospitalityType: finalData.commercialDetails.hospitalityDetails.hospitalityType,
    possessionBy: finalData.commercialDetails.hospitalityDetails.possessionBy,
    expectedMonth: finalData.commercialDetails.hospitalityDetails.expectedMonth,
  });
}


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
    hasPlotKind: !!commercialDetails.plotDetails.plotKind,
  });

  // ✅ CRITICAL FIX: Store location and area properly
  finalData.location = commercialDetails.plotDetails.location;

  // ✅ Priority order for neighborhoodArea
  const neighborhoodArea = commercialDetails.plotDetails.neighborhoodArea ||
                           propertyData.area ||
                           '';

  finalData.area = neighborhoodArea;

  console.log('✅ Plot area set to:', finalData.area);

  // ✅ CRITICAL - Convert Telugu/Hindi to English BEFORE saving
  const rawPlotDetails = commercialDetails.plotDetails;
  const rawPricingExtras = commercialDetails.pricingExtras || {};
  const rawVastuDetails = commercialDetails.vastuDetails || {};

  console.log('🌐 Raw Plot data before conversion:', {
    plotKind: rawPlotDetails.plotKind,
    constructionTypes: rawPlotDetails.constructionTypes,
    ownership: rawPricingExtras.ownership,
    amenities: rawPricingExtras.amenities,
  });

  // ✅ Convert all Telugu/Hindi values to English
  const convertedPlotDetails = {
    plotKind: toEnglish(rawPlotDetails.plotKind),
    location: rawPlotDetails.location,
    locality: rawPlotDetails.locality,
    neighborhoodArea: neighborhoodArea,
    plotType: rawPlotDetails.plotType,
    area: Number(rawPlotDetails.area),
    areaUnit: rawPlotDetails.areaUnit || 'sqft',
    dimensions: {
      length: Number(rawPlotDetails.dimensions?.length) || 0,
      breadth: Number(rawPlotDetails.dimensions?.breadth) || 0,
    },
    roadWidth: Number(rawPlotDetails.roadWidth) || 0,
    roadWidthUnit: rawPlotDetails.roadWidthUnit || 'ft',
    openSides: rawPlotDetails.openSides,
    boundaryWall: rawPlotDetails.boundaryWall,
    floorsAllowed: Number(rawPlotDetails.floorsAllowed) || 0,
    zoneType: rawPlotDetails.zoneType,
    constructionDone: toEnglish(rawPlotDetails.constructionDone), // ✅ Convert
    constructionTypes: convertToEnglish(rawPlotDetails.constructionTypes || []), // ✅ Convert array
    possession: rawPlotDetails.possession,
    ownership: toEnglish(rawPricingExtras.ownership) || 'Freehold', // ✅ Convert
    approvedBy: rawPricingExtras.authority,
    industryType: rawPricingExtras.industryType,
    preLeased: toEnglish(rawPricingExtras.preLeased), // ✅ Convert
    leaseDuration: rawPricingExtras.leaseDuration,
    monthlyRent: Number(rawPricingExtras.monthlyRent) || 0,
    cornerProperty: rawPricingExtras.cornerProperty || false,
    amenities: convertToEnglish(rawPricingExtras.amenities || []), // ✅ Convert array
    locationAdvantages: convertToEnglish(rawPricingExtras.locationAdvantages || []), // ✅ Convert array
    vastuDetails: convertToEnglish(rawVastuDetails), // ✅ Convert all vastu fields
  };

  console.log('✅ Converted Plot data:', {
    plotKind: convertedPlotDetails.plotKind,
    constructionTypes: convertedPlotDetails.constructionTypes,
    ownership: convertedPlotDetails.ownership,
    amenities: convertedPlotDetails.amenities,
    vastuDetails: convertedPlotDetails.vastuDetails,
  });

  // ✅ Store converted data
  finalData.commercialDetails.plotDetails = convertedPlotDetails;
  finalData.expectedPrice = Number(commercialDetails.expectedPrice) || 0;

  console.log('✅ Plot details stored with English values:', {
    location: finalData.location,
    area: finalData.area,
    plotKind: finalData.commercialDetails.plotDetails.plotKind,
    constructionDone: finalData.commercialDetails.plotDetails.constructionDone,
    ownership: finalData.commercialDetails.plotDetails.ownership,
    amenitiesCount: finalData.commercialDetails.plotDetails.amenities.length,
    expectedPrice: finalData.expectedPrice,
  });
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
// ✅ Extract plain text if it's already an object
const getPlainText = (field) => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[originalLanguage] || field.en || field.te || field.hi || '';
};

// ✅ NEW - Extract description from correct source BEFORE translation
let descriptionToTranslate = propertyData.description || '';

// ✅ For Commercial properties, check commercialDetails
if (propertyData.propertyType === 'Commercial' && propertyData.commercialDetails) {
  const commercialDetails = propertyData.commercialDetails;
  
  // Check different commercial subtypes
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

console.log('📝 Description to translate:', descriptionToTranslate);

const translatedFields = await translatePropertyFields({
  propertyTitle: getPlainText(propertyData.propertyTitle),
  description: getPlainText(descriptionToTranslate), // ✅ Use extracted description
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
    
    // ✅ NEW: Store paths instead of base64
    const newImages = req.files?.images?.map(file =>
      `/uploads/properties/images/${file.filename}`
    ) || [];
    
    if (newImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided'
      });
    }
    
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
    const { documentType } = req.body;
    
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
    
    // ✅ NEW: Store paths instead of base64
    const newDocs = req.files?.[fieldName]?.map(file =>
      `/uploads/properties/${documentType}/${file.filename}`
    ) || [];
    
    if (newDocs.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No documents provided'
      });
    }
    
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
    const { 
      propertyType, 
      page = 1, 
      limit = 3000, 
      language = 'en',
      // ✅ NEW: Filter parameters
      minPrice,
      maxPrice,
      resortType,
      minRooms,
      maxRooms,
      minFloors,
      maxFloors,
      minLandArea,
      maxLandArea,
      minBuildArea,
      maxBuildArea,
      locationAdvantages
    } = req.query;
    
    const query = { status: 'approved' };
    if (propertyType) {
      query.propertyType = propertyType;
    }

    // ✅ NEW: Price filter (works for all property types)
    if (minPrice || maxPrice) {
      query.expectedPrice = {};
      if (minPrice) query.expectedPrice.$gte = Number(minPrice);
      if (maxPrice) query.expectedPrice.$lte = Number(maxPrice);
    }

    // ✅ NEW: Resort-specific filters
    if (propertyType === 'Resort') {
      if (resortType) {
        query['resortDetails.resortType'] = resortType;
      }
      
      if (minRooms || maxRooms) {
        query['resortDetails.rooms'] = {};
        if (minRooms) query['resortDetails.rooms'].$gte = Number(minRooms);
        if (maxRooms) query['resortDetails.rooms'].$lte = Number(maxRooms);
      }

      if (minFloors || maxFloors) {
        query['resortDetails.floors'] = {};
        if (minFloors) query['resortDetails.floors'].$gte = Number(minFloors);
        if (maxFloors) query['resortDetails.floors'].$lte = Number(maxFloors);
      }

      if (minLandArea || maxLandArea) {
        query['resortDetails.landArea'] = {};
        if (minLandArea) query['resortDetails.landArea'].$gte = Number(minLandArea);
        if (maxLandArea) query['resortDetails.landArea'].$lte = Number(maxLandArea);
      }

      if (minBuildArea || maxBuildArea) {
        query['resortDetails.buildArea'] = {};
        if (minBuildArea) query['resortDetails.buildArea'].$gte = Number(minBuildArea);
        if (maxBuildArea) query['resortDetails.buildArea'].$lte = Number(maxBuildArea);
      }

      if (locationAdvantages) {
        const advantages = Array.isArray(locationAdvantages) 
          ? locationAdvantages 
          : [locationAdvantages];
        query['resortDetails.locationAdvantages'] = { $in: advantages };
      }
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
    let propObj = prop.toObject();

    // ✅ Normalize user data for consistent frontend handling
    if (propObj.uploadedBy === 'admin' && !propObj.userId) {
      propObj.userId = {
        name: propObj.ownerDetails?.name || 'Admin',
        phone: propObj.ownerDetails?.phone || 'N/A',
        email: propObj.ownerDetails?.email || 'N/A'
      };
    }

    return {
      ...propObj,
      propertyTitle: propObj.propertyTitle,
      description: propObj.description,
      location: propObj.location,
      area: propObj.area,
      areaKey: propObj.areaKey || ''
    };
  });


   
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
   
    let propObj = property.toObject();

    // ✅ Normalize user data for consistent frontend handling
    if (propObj.uploadedBy === 'admin' && !propObj.userId) {
      propObj.userId = {
        name: propObj.ownerDetails?.name || 'Admin',
        phone: propObj.ownerDetails?.phone || 'N/A',
        email: propObj.ownerDetails?.email || 'N/A'
      };
    }

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
    
    // ✅ NEW: Update areaKey if area is being changed
    if (updateData.area && typeof updateData.area === 'string') {
      updateData.areaKey = normalizeAreaKey(updateData.area);
      console.log('🔑 Updated areaKey:', updateData.areaKey);
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
