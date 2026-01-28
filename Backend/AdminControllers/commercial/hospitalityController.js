// Backend/AdminControllers/commercial/hospitalityController.js

export const handleHospitalityProperty = (propertyData, finalData) => {
  const { commercialDetails } = propertyData;
  const hospitalityData = commercialDetails?.hospitalityDetails || {};

  console.log('🏨 [HOSPITALITY] Processing hospitality property');
  console.log('📦 Raw commercialDetails:', JSON.stringify(commercialDetails, null, 2));
  console.log('📦 Raw hospitalityData:', JSON.stringify(hospitalityData, null, 2));

  // ✅ CRITICAL - Set top-level location and area from propertyData
  finalData.location = propertyData.location;
  finalData.area = propertyData.area;

  // ✅ CRITICAL FIX - Set top-level expectedPrice (REQUIRED by schema)
  const expectedPriceValue = Number(
    hospitalityData.expectedPrice ||
    commercialDetails.expectedPrice ||
    propertyData.expectedPrice
  ) || 0;

  finalData.expectedPrice = expectedPriceValue;

  console.log('💰 [HOSPITALITY] Expected price set:', {
    hospitalityDataPrice: hospitalityData.expectedPrice,
    commercialDetailsPrice: commercialDetails.expectedPrice,
    propertyDataPrice: propertyData.expectedPrice,
    finalPrice: expectedPriceValue,
  });

  // ✅ NEW: Extract location string from propertyData
  const locationString = typeof propertyData.location === 'string'
    ? propertyData.location
    : (propertyData.location?.en || propertyData.location?.te || propertyData.location?.hi || '');

  // ✅ NEW: Extract area value (this could be from multiple sources)
  const areaValue = Number(
    hospitalityData.area?.value ||
    hospitalityData.area ||
    propertyData.area?.value ||
    propertyData.buildArea ||
    0
  );

  console.log('🔍 [HOSPITALITY] Critical fields extracted:', {
    locationString,
    areaValue,
    rawLocation: propertyData.location,
    rawArea: hospitalityData.area,
    propertyArea: propertyData.area,
  });

  // ✅ Build hospitalityDetails with correct field mappings from frontend
  finalData.commercialDetails.hospitalityDetails = {
    // ========== HOSPITALITY TYPE ==========
    hospitalityType: hospitalityData.hospitalityType || propertyData.hospitalityType,  // ✅ NEW

    // ========== PROPERTY TITLE ==========
    propertyTitle: hospitalityData.propertyTitle || propertyData.propertyTitle,

    // ========== LOCATION (CRITICAL REQUIRED FIELD) ==========
    location: locationString,  // ✅ FIXED - Always string format

    // ✅ CRITICAL FIX - neighborhoodArea from frontend
    neighborhoodArea: hospitalityData.neighborhoodArea || propertyData.area,

    // ========== AREA (CRITICAL REQUIRED FIELD) ==========
    // ✅ Schema requires area.value and area.unit structure
    area: {
      value: areaValue,  // ✅ NEW - REQUIRED Number
      unit: hospitalityData.area?.unit || 'sqft',  // ✅ NEW - Default to sqft
    },

    // ========== FLOORS ==========
    totalFloors: hospitalityData.totalFloors || hospitalityData.noOfFloors || '',

    // ========== ROOM DETAILS ==========
    // Frontend stores noOfRooms as number
    rooms: Number(hospitalityData.rooms) || 0,  // ✅ FIXED - correct field name

    // Frontend stores washroomType as string: "None", "Shared", "1", "2", "3", "4+"
    washroomType: hospitalityData.washroomType || '',  // ✅ FIXED - correct field name

    // Frontend stores balconies as string: "0", "1", "2", "3", "More than 3"
    balconies: hospitalityData.balconies || '',  // ✅ FIXED - updated comment

    // Frontend stores otherRooms as array: ["Pooja Room", "Study Room", "Servant Room", "Other"]
    otherRooms: hospitalityData.otherRooms || [],

    // ========== FURNISHING ==========
    // Frontend stores as: "Unfurnished", "Semi-Furnished", "Furnished"
    furnishingType: hospitalityData.furnishingType || '',  // ✅ FIXED - correct field name

    // Frontend stores furnishingDetails as array of selected items from modal
    furnishingDetails: hospitalityData.furnishingDetails || [],  // ✅ FIXED - correct field name

    // ========== AVAILABILITY ==========
    // Frontend stores as: "Ready to move" or "Under construction"
    availability: hospitalityData.availability || '',  // ✅ FIXED - correct field name

    // Frontend stores ageOfProperty as string for "Ready" properties
    ageOfProperty: hospitalityData.ageOfProperty || '',  // ✅ FIXED - now string

    // Frontend stores possessionBy as string for "UnderConstruction"
    possessionBy: hospitalityData.possessionBy || '',

    // Frontend stores expectedMonth for possession
    expectedMonth: hospitalityData.expectedMonth || '',

    // ========== OWNERSHIP ==========
    // Frontend stores as string: "Freehold", "Leasehold", "Co-operative Society", "Power of Attorney"
    ownership: hospitalityData.ownership || '',

    // ========== AUTHORITY APPROVAL ==========
    // Frontend stores as string (optional field)
    IndustryApprovedBy: hospitalityData.IndustryApprovedBy || '',

    // ========== INDUSTRY TYPE ==========
    // Frontend stores as: "Hospitality", "Hotel", "Resort", "Guest House", "Restaurant", "Other"
    approvedIndustryType: hospitalityData.approvedIndustryType || '',

    // ========== PRICING DETAILS ==========
    expectedPrice: expectedPriceValue,  // ✅ REQUIRED - Use the value we calculated above

    // ✅ Pricing details from PricingSection component
    priceDetails: {
      allInclusive: Boolean(hospitalityData.priceDetails?.allInclusive),
      negotiable: Boolean(hospitalityData.priceDetails?.negotiable),  // ✅ FIXED - correct field name
      taxExcluded: Boolean(hospitalityData.priceDetails?.taxExcluded),  // ✅ FIXED - correct field name
    },

    // ========== PRE-LEASED/PRE-RENTED ==========
    // Frontend stores as: "Yes" or "No"
    preLeased: hospitalityData.preLeased || '',

    // Only if preLeased === "Yes"
    leaseDuration: hospitalityData.leaseDuration || '',
    monthlyRent: Number(hospitalityData.monthlyRent) || 0,

    // ========== OTHER FEATURES ==========
    wheelchairFriendly: Boolean(hospitalityData.wheelchairFriendly),

    // ========== FLOORING ==========
    // Frontend stores as: "Marble", "Concrete", "Pooja Room", "Granite", "Ceramic Tiles", "Mosaic", "Cement", "Stone", "Vinyl", "Wood", "Vitified", "Spartex", "IPSFinish", "Other"
    flooringType: hospitalityData.flooringType || '',

    // ========== DESCRIPTION ==========
    description: hospitalityData.description || propertyData.description || '',

    // ========== AMENITIES ==========
    // Frontend stores as array from CheckboxGroup
    // HOSPITALITY_AMENITIES: ["Maintenance Staff", "Water Storage", "Waste Disposal", "Rain Water Harvesting", "Water Purifier", "Security/Fire Alarm", "Visitor Parking", "Shopping Centre", "Fitness Centre/GYM", "WheelChair Accessible", "DG Availability", "CCTV Surveillance", "Grocery Shop", "Power Back-up", "Feng Shui/Vaastu Compliant", "Intercom Facility", "Lift(s)", "Piped-gas", "Park", "Swimming Pool"]
    amenities: hospitalityData.amenities || [],

    // ========== LOCATION ADVANTAGES (if added) ==========
    locationAdvantages: hospitalityData.locationAdvantages || [],

    // ========== VAASTU DETAILS (if added) ==========
    // ✅ FIX: Vaastu might be at hospitalityData.vaasthuDetails OR hospitalityData.vaastuDetails (typo check)
    vastuDetails: {  // ✅ FIXED - correct spelling
      buildingFacing: hospitalityData.vastuDetails?.buildingFacing || hospitalityData.vaasthuDetails?.buildingFacing || '',  // ✅ CORRECT
      entrance: hospitalityData.vastuDetails?.entrance || hospitalityData.vaasthuDetails?.entrance || '',  // ✅ CORRECT
      reception: hospitalityData.vastuDetails?.reception || hospitalityData.vaasthuDetails?.reception || '',  // ✅ CORRECT
      adminOffice: hospitalityData.vastuDetails?.adminOffice || hospitalityData.vaasthuDetails?.adminOffice || '',  // ✅ CORRECT
      guestRooms: hospitalityData.vastuDetails?.guestRooms || hospitalityData.vaasthuDetails?.guestRooms || '',  // ✅ CORRECT
      banquet: hospitalityData.vastuDetails?.banquet || hospitalityData.vaasthuDetails?.banquet || '',  // ✅ CORRECT
      kitchen: hospitalityData.vastuDetails?.kitchen || hospitalityData.vaasthuDetails?.kitchen || '',  // ✅ CORRECT
      dining: hospitalityData.vastuDetails?.dining || hospitalityData.vaasthuDetails?.dining || '',  // ✅ CORRECT
      cashCounter: hospitalityData.vastuDetails?.cashCounter || hospitalityData.vaasthuDetails?.cashCounter || '',  // ✅ CORRECT
      electrical: hospitalityData.vastuDetails?.electrical || hospitalityData.vaasthuDetails?.electrical || '',  // ✅ CORRECT
      waterStructure: hospitalityData.vastuDetails?.waterStructure || hospitalityData.vaasthuDetails?.waterStructure || '',  // ✅ CORRECT
      washroom: hospitalityData.vastuDetails?.washroom || hospitalityData.vaasthuDetails?.washroom || '',  // ✅ CORRECT
      storage: hospitalityData.vastuDetails?.storage || hospitalityData.vaasthuDetails?.storage || '',  // ✅ CORRECT
    },
  };

  console.log('✅ [HOSPITALITY] Hospitality details processed:', {
    hospitalityType: finalData.commercialDetails.hospitalityDetails.hospitalityType,  // ✅ NEW
    location: finalData.commercialDetails.hospitalityDetails.location,
    neighborhoodArea: finalData.commercialDetails.hospitalityDetails.neighborhoodArea,
    areaValue: finalData.commercialDetails.hospitalityDetails.area.value,  // ✅ NEW
    areaUnit: finalData.commercialDetails.hospitalityDetails.area.unit,  // ✅ NEW
    rooms: finalData.commercialDetails.hospitalityDetails.rooms,  // ✅ FIXED
    washroomType: finalData.commercialDetails.hospitalityDetails.washroomType,  // ✅ FIXED
    balconies: finalData.commercialDetails.hospitalityDetails.balconies,
    furnishingType: finalData.commercialDetails.hospitalityDetails.furnishingType,  // ✅ FIXED
    availability: finalData.commercialDetails.hospitalityDetails.availability,  // ✅ FIXED
    ownership: finalData.commercialDetails.hospitalityDetails.ownership,  // ✅ FIXED
    expectedPriceInDetails: finalData.commercialDetails.hospitalityDetails.expectedPrice,
    expectedPriceTopLevel: finalData.expectedPrice,
    preLeased: finalData.commercialDetails.hospitalityDetails.preLeased,
    flooringType: finalData.commercialDetails.hospitalityDetails.flooringType,
    amenitiesCount: finalData.commercialDetails.hospitalityDetails.amenities.length,
    hasVastu: !!finalData.commercialDetails.hospitalityDetails.vastuDetails.buildingFacing,  // ✅ FIXED
    vastuFirstField: finalData.commercialDetails.hospitalityDetails.vastuDetails.buildingFacing,  // ✅ FIXED
    vastuKeys: Object.keys(finalData.commercialDetails.hospitalityDetails.vastuDetails || {}),  // ✅ FIXED
  });
};