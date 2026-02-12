// Backend/UserControllers/PropertyController.js
import Property from '../UserModels/Property.js';
import User from '../UserModels/User.js';
import { translatePropertyFields, normalizeAreaKey } from '../services/translationService.js';

// ✅ NEW: Cloudinary imports
import {
  uploadToCloudinary,
  uploadPropertyImages,
  uploadPropertyDocuments,
  deletePropertyImages,
  deletePropertyDocuments,
} from '../utils/cloudinaryHelper.js';

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

  // ✅ ADD Hospitality Types
  'హోటల్/రిసార్ట్స్': 'Hotel/Resorts',
  'होटल/रिसॉर्ट्स': 'Hotel/Resorts',
  'గెస్ట్ హౌస్': 'Guest House',
  'गेस्ट हाउस': 'Guest House',
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

    console.log('📄 Files received:', {
      images: req.files?.images?.length || 0,
      ownershipDocs: req.files?.ownershipDocs?.length || 0,
      identityDocs: req.files?.identityDocs?.length || 0
    });
    
    // ✅ MODIFIED: Upload to Cloudinary instead of local storage
    // ✅ MODIFIED: Upload to Cloudinary with unique IDs
    const uploadTimestamp = Date.now();
let images = [];
if (req.files?.images) {
  console.log(`📸 Uploading ${req.files.images.length} images to Cloudinary...`);
  
  // Generate unique timestamp for this upload batch
  
  
  const uploadPromises = req.files.images.map((file, index) => {
    return uploadToCloudinary(file.buffer, {
      folder: 'property-listings/properties/images',
      public_id: `property_${uploadTimestamp}_image_${index}`,
      resource_type: 'image',
    });
  });

  const uploadResults = await Promise.all(uploadPromises);
  images = uploadResults.map(result => result.url);
  console.log('✅ Images uploaded to Cloudinary:', images);
}

   let ownershipDocs = [];
if (req.files?.ownershipDocs) {
  console.log(`📄 Uploading ${req.files.ownershipDocs.length} ownership docs to Cloudinary...`);
  
  const uploadPromises = req.files.ownershipDocs.map((file, index) => {
    const isPDF = file.mimetype === 'application/pdf';
    return uploadToCloudinary(file.buffer, {
      folder: 'property-listings/properties/documents/ownership',
      public_id: `ownership_${uploadTimestamp}_${index}`,
      resource_type: isPDF ? 'raw' : 'image',
    });
  });

  const uploadResults = await Promise.all(uploadPromises);
  ownershipDocs = uploadResults.map(result => result.url);
  console.log('✅ Ownership docs uploaded to Cloudinary:', ownershipDocs);
} 

    let identityDocs = [];
if (req.files?.identityDocs) {
  console.log(`📄 Uploading ${req.files.identityDocs.length} identity docs to Cloudinary...`);
  
  const uploadPromises = req.files.identityDocs.map((file, index) => {
    const isPDF = file.mimetype === 'application/pdf';
    return uploadToCloudinary(file.buffer, {
      folder: 'property-listings/properties/documents/identity',
      public_id: `identity_${uploadTimestamp}_${index}`,
      resource_type: isPDF ? 'raw' : 'image',
    });
  });

  const uploadResults = await Promise.all(uploadPromises);
  identityDocs = uploadResults.map(result => result.url);
  console.log('✅ Identity docs uploaded to Cloudinary:', identityDocs);
}

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
      finalData.area = propertyData.area;
      
      console.log('🏞️ Site property data:', {
        location: finalData.location,
        area: finalData.area,
        sqft: propertyData.siteDetails?.area
      });
      
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

    // ✅ HANDLE RESORT PROPERTIES
    if (propertyData.propertyType === "Resort") {
      finalData.location = propertyData.location;
      finalData.area = propertyData.area;
      
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
      const { commercialDetails } = propertyData;
      if (!commercialDetails || !commercialDetails.subType) {
        return res.status(400).json({
          success: false,
          message: "Commercial subType is required",
        });
      }
      const rawSubType = commercialDetails.subType.trim();
      const subType = rawSubType.toLowerCase();
      
      let canonicalSubType = "Other";
      if (subType.includes("office")) canonicalSubType = "Office";
      else if (subType.includes("retail")) canonicalSubType = "Retail";
      else if (subType.includes("plot")) canonicalSubType = "Plot/Land";
      else if (subType.includes("stor")) canonicalSubType = "Storage";
      else if (subType.includes("industry")) canonicalSubType = "Industry";
      else if (subType.includes("hospital")) canonicalSubType = "Hospitality";
      
      finalData.commercialDetails = {
        subType: canonicalSubType,
      };

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
        
        finalData.location = commercialDetails.officeDetails.location;
        
        const neighborhoodArea = commercialDetails.officeDetails.neighborhoodArea || 
                                 propertyData.area || 
                                 commercialDetails.area || 
                                 '';
        
        finalData.area = neighborhoodArea;
        
        console.log('✅ Office area set to:', finalData.area);
        
        finalData.commercialDetails.officeDetails = {
          officeKind: commercialDetails.officeDetails.officeKind,
          propertyTitle: commercialDetails.officeDetails.propertyTitle,
          location: commercialDetails.officeDetails.location,
          locatedInside: commercialDetails.officeDetails.locatedInside,
          zoneType: commercialDetails.officeDetails.zoneType,
          neighborhoodArea: neighborhoodArea,
          
          carpetArea: Number(commercialDetails.officeDetails.carpetArea) || 0,
          carpetAreaUnit: commercialDetails.officeDetails.carpetAreaUnit || 'sqft',
          
          cabins: Number(commercialDetails.officeDetails.cabins) || 0,
          meetingRooms: Number(commercialDetails.officeDetails.meetingRooms) || 0,
          seats: Number(commercialDetails.officeDetails.seats) || 0,
          maxSeats: Number(commercialDetails.officeDetails.maxSeats) || 0,
          
          conferenceRooms: commercialDetails.officeDetails.conferenceRooms,
          washrooms: {
            public: Number(commercialDetails.officeDetails.washrooms?.public) || 0,
            private: Number(commercialDetails.officeDetails.washrooms?.private) || 0,
          },
          receptionArea: commercialDetails.officeDetails.receptionArea || false,
          furnishing: commercialDetails.officeDetails.furnishing || false,
          
          pantry: commercialDetails.officeDetails.pantry || false,
          pantryType: commercialDetails.officeDetails.pantryType,
          pantrySize: Number(commercialDetails.officeDetails.pantrySize) || 0,
          
          additionalFeatures: commercialDetails.officeDetails.additionalFeatures || [],
          fireSafetyMeasures: commercialDetails.officeDetails.fireSafetyMeasures || [],
          
          totalFloors: Number(commercialDetails.officeDetails.totalFloors) || 0,
          floorNo: Number(commercialDetails.officeDetails.floorNo) || 0,
          staircases: commercialDetails.officeDetails.staircases,
          
          lift: commercialDetails.officeDetails.lift,
          passengerLifts: Number(commercialDetails.officeDetails.passengerLifts) || 0,
          serviceLifts: Number(commercialDetails.officeDetails.serviceLifts) || 0,
          
          parking: {
            type: commercialDetails.officeDetails.parking?.type,
            options: commercialDetails.officeDetails.parking?.options || {
              basement: false,
              outside: false,
              private: false,
            },
            count: Number(commercialDetails.officeDetails.parking?.count) || 0,
          },
          
          availability: commercialDetails.officeDetails.availability,
          ageOfProperty: commercialDetails.officeDetails.ageOfProperty,
          possessionBy: commercialDetails.officeDetails.possessionBy,
          ownership: commercialDetails.officeDetails.ownership,
          
          expectedPrice: Number(commercialDetails.officeDetails.expectedPrice) || 0,
          priceDetails: {
            allInclusive: commercialDetails.officeDetails.priceDetails?.allInclusive || false,
            negotiable: commercialDetails.officeDetails.priceDetails?.negotiable || false,
            taxExcluded: commercialDetails.officeDetails.priceDetails?.taxExcluded || false,
          },
          
          preLeased: commercialDetails.officeDetails.preLeased,
          leaseDuration: commercialDetails.officeDetails.leaseDuration,
          monthlyRent: Number(commercialDetails.officeDetails.monthlyRent) || 0,
          
          nocCertified: commercialDetails.officeDetails.nocCertified,
          occupancyCertified: commercialDetails.officeDetails.occupancyCertified,
          
          previouslyUsedFor: commercialDetails.officeDetails.previouslyUsedFor,
          description: commercialDetails.officeDetails.description,
          
          amenities: commercialDetails.officeDetails.amenities || [],
          locationAdvantages: commercialDetails.officeDetails.locationAdvantages || [],
          
          vaasthuDetails: commercialDetails.officeDetails.vaasthuDetails || {},
        };
        
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
        
        finalData.location = commercialDetails.retailDetails.location;
        
        const neighborhoodArea = commercialDetails.retailDetails.neighborhoodArea || 
                                 propertyData.area || 
                                 commercialDetails.area || 
                                 '';
        
        finalData.area = neighborhoodArea;
        
        console.log('✅ Retail area set to:', finalData.area);
        
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

        commercialDetails.storageDetails.storageType = convertedStorageType;

        console.log('📦 Processing Storage details:', {
          hasNeighborhoodArea: !!commercialDetails.storageDetails.neighborhoodArea,
          propertyDataArea: propertyData.area,
          commercialArea: commercialDetails.area,
          hasStorageType: !!commercialDetails.storageDetails.storageType,
        });

        finalData.location = commercialDetails.storageDetails.location;

        const neighborhoodArea = commercialDetails.storageDetails.neighborhoodArea ||
                                 propertyData.area ||
                                 commercialDetails.area ||
                                 '';

        finalData.area = neighborhoodArea;

        console.log('✅ Storage area set to:', finalData.area);

        finalData.commercialDetails.storageDetails = {
          storageType: commercialDetails.storageDetails.storageType,
          location: commercialDetails.storageDetails.location,
          neighborhoodArea: neighborhoodArea,

          storageArea: {
            value: commercialDetails.storageDetails.storageArea?.value,
            unit: commercialDetails.storageDetails.storageArea?.unit || 'sqft',
          },
          dimensions: {
            length: commercialDetails.storageDetails.dimensions?.length,
            breadth: commercialDetails.storageDetails.dimensions?.breadth,
          },

          ceilingHeight: commercialDetails.storageDetails.ceilingHeight,
          flooring: commercialDetails.storageDetails.flooring,
          ventilation: commercialDetails.storageDetails.ventilation,
          covered: commercialDetails.storageDetails.covered,
          temperatureControl: commercialDetails.storageDetails.temperatureControl,
          security: commercialDetails.storageDetails.security || [],
          accessibility: commercialDetails.storageDetails.accessibility,

          washroomType: commercialDetails.storageDetails.washroomType,

          availability: commercialDetails.storageDetails.availability,
          ageOfProperty: commercialDetails.storageDetails.ageOfProperty,
          possession: commercialDetails.storageDetails.possession,

          ownership: commercialDetails.storageDetails.ownership,
          expectedPrice: commercialDetails.storageDetails.expectedPrice,
          priceDetails: commercialDetails.storageDetails.priceDetails,
          authority: commercialDetails.storageDetails.authority,
          approvedIndustryType: commercialDetails.storageDetails.approvedIndustryType,

          preLeased: commercialDetails.storageDetails.preLeased,
          leaseDuration: commercialDetails.storageDetails.leaseDuration,
          monthlyRent: commercialDetails.storageDetails.monthlyRent,

          description: commercialDetails.storageDetails.description,
          amenities: commercialDetails.storageDetails.amenities || [],
          locationAdvantages: commercialDetails.storageDetails.locationAdvantages || [],

          vastuDetails: commercialDetails.storageDetails.vastuDetails || {},
        };

        console.log('✅ Storage details stored:', {
          location: finalData.location,
          area: finalData.area,
          storageType: finalData.commercialDetails.storageDetails.storageType,
          allFields: Object.keys(finalData.commercialDetails.storageDetails),
          hasVastu: !!finalData.commercialDetails.storageDetails.vastuDetails,
        });

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

        finalData.location = commercialDetails.industryDetails.location;
        const neighborhoodArea = commercialDetails.industryDetails.neighborhoodArea || propertyData.area || '';
        finalData.area = neighborhoodArea;

        finalData.commercialDetails.industryDetails = {
          location: commercialDetails.industryDetails.location,
          neighborhoodArea: neighborhoodArea,

          area: {
            value: commercialDetails.industryDetails.area?.value,
            unit: commercialDetails.industryDetails.area?.unit || 'sqft',
          },
          dimensions: {
            length: commercialDetails.industryDetails.dimensions?.length,
            breadth: commercialDetails.industryDetails.dimensions?.breadth,
          },

          washroomType: commercialDetails.industryDetails.washroomType,

          availability: commercialDetails.industryDetails.availability,
          ageOfProperty: commercialDetails.industryDetails.ageOfProperty,
          possessionBy: commercialDetails.industryDetails.possessionBy,

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

        const rawDetails = commercialDetails.hospitalityDetails;
        const convertedDetails = {
          ...rawDetails,
          possessionBy: toEnglish(rawDetails.possessionBy),
          expectedMonth: toEnglish(rawDetails.expectedMonth),
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
          possessionBy: convertedDetails.possessionBy,
          expectedMonth: convertedDetails.expectedMonth,

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

      // PLOT/LAND
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

        finalData.location = commercialDetails.plotDetails.location;

        const neighborhoodArea = commercialDetails.plotDetails.neighborhoodArea ||
                                 propertyData.area ||
                                 '';

        finalData.area = neighborhoodArea;

        console.log('✅ Plot area set to:', finalData.area);

        const rawPlotDetails = commercialDetails.plotDetails;
        const rawPricingExtras = commercialDetails.pricingExtras || {};
        const rawVastuDetails = commercialDetails.vastuDetails || {};

        console.log('🌐 Raw Plot data before conversion:', {
          plotKind: rawPlotDetails.plotKind,
          constructionTypes: rawPlotDetails.constructionTypes,
          ownership: rawPricingExtras.ownership,
          amenities: rawPricingExtras.amenities,
        });

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
          constructionDone: toEnglish(rawPlotDetails.constructionDone),
          constructionTypes: convertToEnglish(rawPlotDetails.constructionTypes || []),
          possession: rawPlotDetails.possession,
          ownership: toEnglish(rawPricingExtras.ownership) || 'Freehold',
          approvedBy: rawPricingExtras.authority,
          industryType: rawPricingExtras.industryType,
          preLeased: toEnglish(rawPricingExtras.preLeased),
          leaseDuration: rawPricingExtras.leaseDuration,
          monthlyRent: Number(rawPricingExtras.monthlyRent) || 0,
          cornerProperty: rawPricingExtras.cornerProperty || false,
          amenities: convertToEnglish(rawPricingExtras.amenities || []),
          locationAdvantages: convertToEnglish(rawPricingExtras.locationAdvantages || []),
          vastuDetails: convertToEnglish(rawVastuDetails),
        };

        console.log('✅ Converted Plot data:', {
          plotKind: convertedPlotDetails.plotKind,
          constructionTypes: convertedPlotDetails.constructionTypes,
          ownership: convertedPlotDetails.ownership,
          amenities: convertedPlotDetails.amenities,
          vastuDetails: convertedPlotDetails.vastuDetails,
        });

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
   
    if (images.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one image is required' });
    }
    if (ownershipDocs.length === 0) {
      return res.status(400).json({ success: false, message: 'Ownership document is required' });
    }
    if (identityDocs.length === 0) {
      return res.status(400).json({ success: false, message: 'Identity document is required' });
    }

    console.log('🔄 Translating property fields...');
    const originalLanguage = propertyData.originalLanguage || 'en';

    const getPlainText = (field) => {
      if (!field) return '';
      if (typeof field === 'string') return field;
      return field[originalLanguage] || field.en || field.te || field.hi || '';
    };

    let descriptionToTranslate = propertyData.description || '';

    if (propertyData.propertyType === 'Commercial' && propertyData.commercialDetails) {
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

    console.log('📝 Description to translate:', descriptionToTranslate);

    const translatedFields = await translatePropertyFields({
      propertyTitle: getPlainText(propertyData.propertyTitle),
      description: getPlainText(descriptionToTranslate),
      location: getPlainText(finalData.location || propertyData.location),
      area: getPlainText(propertyData.area)
    }, originalLanguage);

    console.log('✅ Translation complete');
    
    const areaKey = normalizeAreaKey(propertyData.area);
    console.log('🔑 Generated areaKey:', areaKey);
    
    finalData.propertyTitle = translatedFields.propertyTitle;
    finalData.description = translatedFields.description;
    finalData.location = translatedFields.location;
    finalData.area = translatedFields.area;
    finalData.areaKey = areaKey;
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
    
    if (!req.files?.images || req.files.images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided'
      });
    }
    
    // ✅ MODIFIED: Upload to Cloudinary
    console.log(`📸 Uploading ${req.files.images.length} additional images to Cloudinary...`);
    const uploadResults = await uploadPropertyImages(
      req.files.images,
      property._id.toString()
    );
    
    const newImageUrls = uploadResults.map(result => result.url);
    property.images = [...property.images, ...newImageUrls];
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
    const { imageIndex } = req.body;
   
    const property = await Property.findById(id);
   
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
   
    if (imageIndex >= 0 && imageIndex < property.images.length) {
      // ✅ MODIFIED: Delete from Cloudinary first
      const imageUrl = property.images[imageIndex];
      console.log('🗑️ Deleting image from Cloudinary:', imageUrl);
      await deletePropertyImages([imageUrl]);
      
      // Remove from array
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
    
    if (!req.files?.[fieldName] || req.files[fieldName].length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No documents provided'
      });
    }
    
    // ✅ MODIFIED: Upload to Cloudinary
    console.log(`📄 Uploading ${req.files[fieldName].length} ${documentType} documents to Cloudinary...`);
    const uploadResults = await uploadPropertyDocuments(
      req.files[fieldName],
      property._id.toString(),
      documentType
    );

    const newDocUrls = uploadResults.map(result => result.url);

    if (!property.documents) {
      property.documents = { ownership: [], identity: [] };
    }

    property.documents[documentType].push(...newDocUrls);
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
    const { documentIndex, documentType } = req.body;
   
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
   
    const docsArray = documentType === 'ownership'
      ? property.documents.ownership
      : property.documents.identity;
   
    if (documentIndex >= 0 && documentIndex < docsArray.length) {
      // ✅ MODIFIED: Delete from Cloudinary first
      const documentUrl = docsArray[documentIndex];
      console.log('🗑️ Deleting document from Cloudinary:', documentUrl);
      await deletePropertyDocuments([documentUrl]);
      
      // Remove from array
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
    
   const query = { 
      status: 'approved',
      $or: [
        { adminDeletedStatus: 'active' },
        { adminDeletedStatus: { $exists: false } }
      ]
    };
    
    if (propertyType) {
      query.propertyType = propertyType;
    }

    if (minPrice || maxPrice) {
      query.expectedPrice = {};
      if (minPrice) query.expectedPrice.$gte = Number(minPrice);
      if (maxPrice) query.expectedPrice.$lte = Number(maxPrice);
    }

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
   
    const transformedProperties = properties.map(prop => {
      let propObj = prop.toObject();

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
   
    const property = await Property.findOne({
      _id: req.params.id,
      // ✅ Add deleted status check
      $or: [
        { adminDeletedStatus: 'active' },
        { adminDeletedStatus: { $exists: false } }
      ]
    }).populate('userId', 'name phone email');
   
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
   
    if (property.status !== 'approved' &&
        property.userId._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Property not available'
      });
    }
   
    let propObj = property.toObject();

    if (propObj.uploadedBy === 'admin' && !propObj.userId) {
      propObj.userId = {
        name: propObj.ownerDetails?.name || 'Admin',
        phone: propObj.ownerDetails?.phone || 'N/A',
        email: propObj.ownerDetails?.email || 'N/A'
      };
    }

    const transformedProperty = {
      ...propObj,
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

// Backend/UserControllers/PropertyController.js

export const getUserProperties = async (req, res) => {
  try {
    console.log('🔍 getUserProperties called');
    console.log('👤 User ID:', req.user._id);
   
    // ✅ Add adminDeletedStatus filter
    const properties = await Property.find({ 
      userId: req.user._id,
      $or: [
        { adminDeletedStatus: 'active' },
        { adminDeletedStatus: { $exists: false } }
      ]
    }).sort({ createdAt: -1 });
    
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
   
    // ✅ MODIFIED: Delete from Cloudinary before deleting property
    if (property.images?.length > 0) {
      console.log('🗑️ Deleting property images from Cloudinary...');
      await deletePropertyImages(property.images);
    }

    if (property.documents?.ownership?.length > 0) {
      console.log('🗑️ Deleting ownership documents from Cloudinary...');
      await deletePropertyDocuments(property.documents.ownership);
    }

    if (property.documents?.identity?.length > 0) {
      console.log('🗑️ Deleting identity documents from Cloudinary...');
      await deletePropertyDocuments(property.documents.identity);
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

    // ✅ NEW: Check if property should be verified (Diamond subscription only)
   if (status === 'approved') {
      const property = await Property.findById(req.params.id).populate('userId');
      
      if (property) {
        // Check if uploaded by admin
        if (property.uploadedBy === 'admin') {
          updateData.isVerified = true;
          console.log(`✅ Property verified - Uploaded by admin`);
        } 
        // Check if user has Diamond subscription
        else if (property.userId) {
          const user = property.userId;
          const hasDiamondSubscription = 
            user.currentSubscription?.planId === 'diamond' && 
            user.currentSubscription?.status === 'active';
          
          if (hasDiamondSubscription) {
            updateData.isVerified = true;
            console.log(`✅ Property verified - User has active Diamond subscription`);
          } else {
            console.log(`ℹ️ Property approved but not verified - User subscription: ${user.currentSubscription?.planId || 'none'}`);
          }
        }
      }
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
   
    // ✅ This query ensures only active properties are shown
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

// Backend/UserControllers/PropertyController.js

export const softDeleteProperty = async (req, res) => {
  try {
    console.log('🗑️ Admin soft-deleting property:', req.params.id);
    
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { 
        adminDeletedStatus: 'deleted',
        status: 'rejected' // Also mark as rejected so it won't show in approved listings
      },
      { new: true }
    );
   
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
   
    console.log('✅ Property soft-deleted successfully');
    
    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
   
  } catch (error) {
    console.error('❌ Soft delete error:', error);
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
   
    const updateData = { propertyStatus };
    if (propertyStatus === 'Sold') {
      updateData.soldBy = 'admin';
    } else {
      updateData.soldBy = null;
    }
   
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
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

// ✅ NEW CODE - Add this entire function
export const userMarkPropertySold = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // ✅ Check if user owns this property
    if (property.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }
    
    // ✅ Check if already sold
    if (property.propertyStatus === 'Sold') {
      return res.status(400).json({
        success: false,
        message: 'Property is already marked as sold'
      });
    }
    
    // ✅ Update to Sold
   // ✅ Update to Sold
property.propertyStatus = 'Sold';
property.soldBy = 'user';
await property.save();
    
    res.status(200).json({
      success: true,
      message: 'Property marked as sold successfully',
      data: property
    });
    
  } catch (error) {
    console.error('User mark sold error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark property as sold',
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
    
    const multilingualFields = ['propertyTitle', 'description', 'location', 'area'];
    const fieldsToTranslate = {};
    
    for (const field of multilingualFields) {
      if (updateData[field] && typeof updateData[field] === 'string') {
        fieldsToTranslate[field] = updateData[field];
      }
    }
    
    if (updateData.area && typeof updateData.area === 'string') {
      updateData.areaKey = normalizeAreaKey(updateData.area);
      console.log('🔑 Updated areaKey:', updateData.areaKey);
    }
    
    if (Object.keys(fieldsToTranslate).length > 0) {
      console.log('🌐 Auto-translating fields:', Object.keys(fieldsToTranslate));
      const translated = await translatePropertyFields(fieldsToTranslate, 'en');
      
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

export const searchProperties = async (req, res) => {
  try {
    const { q: query, language = 'en' } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }
    
    console.log('🔍 Search request:', { query, language });
    
    // Build base search query
    const searchRegex = new RegExp(query.trim(), 'i');
    
    const baseQuery = {
      status: 'approved',
      $or: [
        
        { [`propertyTitle.${language}`]: searchRegex },
        { [`propertyTitle.en`]: searchRegex },
        { [`description.${language}`]: searchRegex },
        { [`description.en`]: searchRegex },
        { [`location.${language}`]: searchRegex },
        { [`location.en`]: searchRegex },
        { [`area.${language}`]: searchRegex },
        { [`area.en`]: searchRegex }
      ]
    };
    
    // Smart keyword detection
    const lowerQuery = query.toLowerCase();
    
    // Property type detection
    if (lowerQuery.match(/house|home|flat|bhk|apartment|villa|ఇల్లు|घर/)) {
      baseQuery.propertyType = { $in: ['House', 'House/Flat'] };
    } else if (lowerQuery.match(/site|plot|land|స్థలం|भूमि/)) {
      baseQuery.propertyType = 'Site/Plot/Land';
    } else if (lowerQuery.match(/commercial|office|shop|retail|store|వాణిజ్య|व्यावसायिक/)) {
      baseQuery.propertyType = 'Commercial';
    } else if (lowerQuery.match(/resort|hotel|రిసార్ట్|रिसॉर्ट/)) {
      baseQuery.propertyType = 'Resort';
    }
    
    // Bedroom detection for houses
    const bedroomMatch = lowerQuery.match(/(\d+)\s*(bhk|bedroom|bed)/);
    if (bedroomMatch && (!baseQuery.propertyType || baseQuery.propertyType.$in?.includes('House'))) {
      const bedrooms = parseInt(bedroomMatch[1]);
      baseQuery['houseDetails.bedrooms'] = bedrooms;
    }
    
    // Execute search
    const properties = await Property.find(baseQuery)
      .populate('userId', 'name phone email')
      .limit(50)
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${properties.length} properties`);
    
    // Group by property type
    const grouped = {
      'House': [],
      'Site/Plot/Land': [],
      'Commercial': [],
      'Resort': []
    };
    
    properties.forEach(prop => {
      const type = prop.propertyType;
      if (type === 'House/Flat') {
        grouped['House'].push(prop);
      } else if (grouped[type]) {
        grouped[type].push(prop);
      }
    });
    
    res.status(200).json({
      success: true,
      data: grouped,
      total: properties.length,
      query: query
    });
    
  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
};