

// Backend/AdminControllers/commercial/officeController.js

export const handleOfficeProperty = (propertyData, finalData) => {
  const { commercialDetails } = propertyData;
  const officeData = commercialDetails?.officeDetails || {};

  console.log('🏢 [OFFICE] Processing office property');
  console.log('📦 Raw commercialDetails:', JSON.stringify(commercialDetails, null, 2));
  console.log('📦 Raw officeData:', JSON.stringify(officeData, null, 2));

  // ✅ CRITICAL - Set top-level location and area from propertyData
  finalData.location = propertyData.location;
  finalData.area = propertyData.area;
  
  // ✅ CRITICAL FIX - Set top-level expectedPrice (REQUIRED by schema)
  const expectedPriceValue = Number(
    officeData.expectedPrice || 
    commercialDetails.expectedPrice || 
    propertyData.expectedPrice
  ) || 0;
  
  finalData.expectedPrice = expectedPriceValue;
  
  console.log('💰 [OFFICE] Expected price set:', {
    officeDataPrice: officeData.expectedPrice,
    commercialDetailsPrice: commercialDetails.expectedPrice,
    propertyDataPrice: propertyData.expectedPrice,
    finalPrice: expectedPriceValue,
  });

  // ✅ Build officeDetails with correct field mappings from frontend
  finalData.commercialDetails.officeDetails = {
    // ========== OFFICE KIND & TITLE ==========
    officeKind: officeData.officeKind || propertyData.officeKind,
    propertyTitle: officeData.propertyTitle || propertyData.propertyTitle,

    // ========== LOCATION (CRITICAL FIELDS) ==========
    location: officeData.location || propertyData.location,
    
    // ✅ CRITICAL FIX - neighborhoodArea from frontend
    neighborhoodArea: officeData.neighborhoodArea || propertyData.area,
    
    locatedInside: officeData.locatedInside || '',
    zoneType: officeData.zoneType || '',

    // ========== CARPET AREA (REQUIRED) ==========
    carpetArea: Number(officeData.carpetArea) || 0,
    carpetAreaUnit: officeData.carpetAreaUnit || 'sqft',

    // ========== OFFICE CONFIGURATION ==========
    cabins: Number(officeData.cabins) || 0,
    meetingRooms: Number(officeData.meetingRooms) || 0,
    seats: Number(officeData.seats) || 0,
    maxSeats: Number(officeData.maxSeats) || 0,

    // ========== CONFERENCE ROOMS ==========
    // Frontend stores as string: "1", "2", "3", "4+"
    conferenceRooms: officeData.conferenceRooms || '',

    // ========== WASHROOMS ==========
    washrooms: {
      public: Number(officeData.washrooms?.public) || 0,
      private: Number(officeData.washrooms?.private) || 0,
    },

    // ========== RECEPTION & FURNISHING ==========
    receptionArea: Boolean(officeData.receptionArea),
    furnishing: Boolean(officeData.furnishing),

    // ========== PANTRY DETAILS ==========
    pantry: Boolean(officeData.pantry),
    pantryType: officeData.pantryType || '', // "Private" or "Shared"
    pantrySize: Number(officeData.pantrySize) || 0,

    // ========== ADDITIONAL FEATURES ==========
    // Frontend stores as array: ["Central AC", "Oxygen Duct", "UPS"]
    additionalFeatures: officeData.additionalFeatures || [],
    
    // ========== FIRE SAFETY MEASURES ==========
    // Frontend stores as array: ["Fire Extinguisher", "Fire Sensors", etc.]
    fireSafetyMeasures: officeData.fireSafetyMeasures || [],

    // ========== BUILDING DETAILS ==========
    totalFloors: Number(officeData.totalFloors) || 0,
    floorNo: Number(officeData.floorNo) || 0,
    
    // Frontend stores as string: "1", "2", "3", "4+"
    staircases: officeData.staircases || '',

    // ========== LIFTS ==========
    // Frontend stores as string: "Available" or "Not-Available"
    lift: officeData.lift || '',
    passengerLifts: Number(officeData.passengerLifts) || 0,
    serviceLifts: Number(officeData.serviceLifts) || 0,

    // ========== PARKING ==========
    parking: {
      // Frontend stores type as: "Available" or "Not-Available"
      type: officeData.parking?.type || 'Not-Available',
      
      // Frontend stores options as object: { basement: true/false, outside: true/false, private: true/false }
      options: {
        basement: Boolean(officeData.parking?.options?.basement),
        outside: Boolean(officeData.parking?.options?.outside),
        private: Boolean(officeData.parking?.options?.private),
      },
      
      count: Number(officeData.parking?.count) || 0,
    },

    // ========== AVAILABILITY ==========
    // Frontend stores as: "Ready" or "UnderConstruction"
    availability: officeData.availability || '',
    
    // Frontend stores ageOfProperty as string: "0-1 years", "1-5 years", etc.
    ageOfProperty: officeData.ageOfProperty || '',
    
    // Frontend stores possessionBy as string: "Immediate", "Within 3 months", "By 2026", etc.
    possessionBy: officeData.possessionBy || '',

    // ========== OWNERSHIP ==========
    // Frontend stores as string: "Freehold", "Leasehold", "Company Owned", "Other"
    ownership: officeData.ownership || '',

    // ========== PRICING (from OfficeNext.jsx) ==========
    // ✅ FIX: Check multiple locations for expectedPrice
    expectedPrice: expectedPriceValue, // Use the value we set above
    
    priceDetails: {
      allInclusive: Boolean(officeData.priceDetails?.allInclusive),
      negotiable: Boolean(officeData.priceDetails?.negotiable),
      taxExcluded: Boolean(officeData.priceDetails?.taxExcluded),
    },

    // ========== PRE-LEASED DETAILS ==========
    // Frontend stores as: "Yes" or "No"
    preLeased: officeData.preLeased || '',
    
    // Frontend stores leaseDuration as string: "3 Years", etc.
    leaseDuration: officeData.leaseDuration || '',
    
    monthlyRent: Number(officeData.monthlyRent) || 0,

    // ========== CERTIFICATIONS ==========
    // Frontend stores as: "Yes" or "No"
    nocCertified: officeData.nocCertified || '',
    occupancyCertified: officeData.occupancyCertified || '',

    // ========== PREVIOUS USE & DESCRIPTION ==========
    // Frontend stores as: "Commercial", "Residential", "Warehouse"
    previouslyUsedFor: officeData.previouslyUsedFor || '',
    
    description: officeData.description || propertyData.description || '',

    // ========== AMENITIES & ADVANTAGES ==========
    // Frontend stores as arrays of strings
    amenities: officeData.amenities || [],
    locationAdvantages: officeData.locationAdvantages || [],

    // ========== VAASTU DETAILS (from OfficeVaastu.jsx) ==========
    // ✅ FIX: Vaastu might be at officeData.vaasthuDetails OR officeData.vaastuDetails (typo check)
    vaasthuDetails: {
      officeFacing: officeData.vaasthuDetails?.officeFacing || officeData.vaastuDetails?.officeFacing || '',
      entrance: officeData.vaasthuDetails?.entrance || officeData.vaastuDetails?.entrance || '',
      cabin: officeData.vaasthuDetails?.cabin || officeData.vaastuDetails?.cabin || '',
      workstations: officeData.vaasthuDetails?.workstations || officeData.vaastuDetails?.workstations || '',
      conference: officeData.vaasthuDetails?.conference || officeData.vaastuDetails?.conference || '',
      reception: officeData.vaasthuDetails?.reception || officeData.vaastuDetails?.reception || '',
      accounts: officeData.vaasthuDetails?.accounts || officeData.vaastuDetails?.accounts || '',
      pantry: officeData.vaasthuDetails?.pantry || officeData.vaastuDetails?.pantry || '',
      server: officeData.vaasthuDetails?.server || officeData.vaastuDetails?.server || '',
      washrooms: officeData.vaasthuDetails?.washrooms || officeData.vaastuDetails?.washrooms || '',
      staircase: officeData.vaasthuDetails?.staircase || officeData.vaastuDetails?.staircase || '',
      storage: officeData.vaasthuDetails?.storage || officeData.vaastuDetails?.storage || '',
      cashLocker: officeData.vaasthuDetails?.cashLocker || officeData.vaastuDetails?.cashLocker || '',
    },
  };

  console.log('✅ [OFFICE] Office details processed:', {
    officeKind: finalData.commercialDetails.officeDetails.officeKind,
    location: finalData.commercialDetails.officeDetails.location,
    neighborhoodArea: finalData.commercialDetails.officeDetails.neighborhoodArea,
    carpetArea: finalData.commercialDetails.officeDetails.carpetArea,
    cabins: finalData.commercialDetails.officeDetails.cabins,
    totalFloors: finalData.commercialDetails.officeDetails.totalFloors,
    expectedPriceInDetails: finalData.commercialDetails.officeDetails.expectedPrice,
    expectedPriceTopLevel: finalData.expectedPrice,
    hasVaastu: !!finalData.commercialDetails.officeDetails.vaasthuDetails.officeFacing,
    vaastuFirstField: finalData.commercialDetails.officeDetails.vaasthuDetails.officeFacing,
    vaastuKeys: Object.keys(finalData.commercialDetails.officeDetails.vaasthuDetails || {}),
    rawVaastuData: officeData.vaasthuDetails,
  });
};