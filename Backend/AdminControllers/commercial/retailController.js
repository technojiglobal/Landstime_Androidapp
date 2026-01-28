// // Backend/AdminControllers/commercial/retailController.js
// export const handleRetailProperty = (propertyData, finalData) => {
//   const { commercialDetails } = propertyData;
//   const retailData = commercialDetails?.retailDetails || {};

//   console.log('🛍️ [RETAIL] Processing retail property');
//   console.log('📦 Raw commercialDetails:', JSON.stringify(commercialDetails, null, 2));
//   console.log('📦 Raw retailData:', JSON.stringify(retailData, null, 2));

//   // ✅ CRITICAL - Set top-level location and area from propertyData
//   finalData.location = propertyData.location;
//   finalData.area = propertyData.area;
  
//   // ✅ CRITICAL FIX - Set top-level expectedPrice (REQUIRED by schema)
//   const expectedPriceValue = Number(
//     retailData.expectedPrice || 
//     commercialDetails.expectedPrice || 
//     propertyData.expectedPrice
//   ) || 0;
  
//   finalData.expectedPrice = expectedPriceValue;
  
//   console.log('💰 [RETAIL] Expected price set:', {
//     retailDataPrice: retailData.expectedPrice,
//     commercialDetailsPrice: commercialDetails.expectedPrice,
//     propertyDataPrice: propertyData.expectedPrice,
//     finalPrice: expectedPriceValue,
//   });

//   // ✅ Build retailDetails with correct field mappings from frontend
//   finalData.commercialDetails.retailDetails = {
//     // ========== LOCATION & AREA ==========
//     location: retailData.location || propertyData.location,
    
//     // ✅ CRITICAL FIX - neighborhoodArea from frontend
//     neighborhoodArea: retailData.neighborhoodArea || propertyData.area,
    
//     // ✅ Optional locality field
//     locality: retailData.locality || '',

//     // ========== CARPET AREA (REQUIRED) ==========
//     carpetArea: Number(retailData.carpetArea) || 0,
//     carpetAreaUnit: retailData.carpetAreaUnit || 'sqft',

//     // ========== SHOP FACADE ==========
//     entranceWidth: Number(retailData.entranceWidth) || 0,
//     ceilingHeight: Number(retailData.ceilingHeight) || 0,

//     // ========== WASHROOM DETAILS ==========
//     // Frontend stores as array: ["Private", "Public"] or []
//     // Convert to string description for schema
//     washroom: Array.isArray(retailData.washroomTypes) && retailData.washroomTypes.length > 0
//       ? retailData.washroomTypes.join(', ')
//       : 'Not Available',

//     // ========== FLOOR DETAILS ==========
//     floorDetails: retailData.totalFloors ? `${retailData.totalFloors} floors` : '',

//     // ========== PARKING TYPE ==========
//     // Frontend stores as array: ["Private Parking", "Public Parking", "Multilevel Parking"] or []
//     parkingType: Array.isArray(retailData.parkingType) && retailData.parkingType.length > 0
//       ? retailData.parkingType.join(', ')
//       : 'Not Available',

//     // ========== LOCATED NEAR / AMENITIES ==========
//     locatedNear: retailData.locatedNear || [],

//     // ========== AVAILABILITY & AGE ==========
//     // Frontend stores availability as: "Ready" or "UnderConstruction"
//     availability: retailData.availability || '',
    
//     // Frontend stores propertyAge as string: "0-1 years", "1-5 years", etc.
//     propertyAge: retailData.propertyAge || '',
    
//     // ========== POSSESSION (For Under Construction) ==========
//     possession: {
//       year: retailData.possession?.year || '',
//       month: retailData.possession?.month || '',
//     },

//     // ========== BUSINESS TYPES ==========
//     // Frontend businessType is single selection, but schema expects array
//     // If "Other" is selected, use otherBusinessType
//     suitableFor: retailData.businessType === 'Other' && retailData.otherBusinessType
//       ? [retailData.otherBusinessType]
//       : retailData.businessType
//         ? [retailData.businessType]
//         : [],

//     // ========== OWNERSHIP & PRICING ==========
//     // Frontend stores as string: "Freehold", "Leasehold", "Rent"
//     ownership: retailData.ownershipType || '',

//     // ✅ FIX: Check multiple locations for expectedPrice
//     expectedPrice: expectedPriceValue, // Use the value we set above
    
//     priceDetails: {
//       allInclusive: Boolean(retailData.priceDetails?.allInclusive),
//       negotiable: Boolean(retailData.priceDetails?.negotiable),
//       taxExcluded: Boolean(retailData.priceDetails?.taxExcluded),
//     },

//     // ========== PRE-LEASED DETAILS ==========
//     // Frontend stores as: "Yes" or "No"
//     preLeased: retailData.preLeased || '',
    
//     // Frontend stores leaseDuration as string: "3 Years", etc.
//     leaseDuration: retailData.leaseDuration || '',
    
//     monthlyRent: Number(retailData.rentPerMonth) || 0,

//     // ========== PREVIOUS USE & DESCRIPTION ==========
//     previouslyUsedFor: retailData.previouslyUsedFor || '',
    
//     description: retailData.description || propertyData.description || '',

//     // ========== AMENITIES & ADVANTAGES ==========
//     // Frontend stores as arrays of strings
//     amenities: retailData.amenities || [],
//     locationAdvantages: retailData.locationAdvantages || [],

//     // ========== VAASTU DETAILS (from retailVaasthuFields constant) ==========
//     // ✅ Map frontend field names to schema field names
//     vaastuDetails: {
//       shopFacing: retailData.vaasthuDetails?.mainFacing || retailData.vaastuDetails?.mainFacing || '',
//       entrance: retailData.vaasthuDetails?.mainEntranceDirection || retailData.vaastuDetails?.mainEntranceDirection || '',
//       cashCounter: retailData.vaasthuDetails?.cashCounterDirection || retailData.vaastuDetails?.cashCounterDirection || '',
//       cashLocker: retailData.vaasthuDetails?.cashLockerDirection || retailData.vaastuDetails?.cashLockerDirection || '',
//       ownerSeating: retailData.vaasthuDetails?.ownerSeatingDirection || retailData.vaastuDetails?.ownerSeatingDirection || '',
//       staffSeating: retailData.vaasthuDetails?.staffSeatingDirection || retailData.vaastuDetails?.staffSeatingDirection || '',
//       storage: retailData.vaasthuDetails?.storageDirection || retailData.vaastuDetails?.storageDirection || '',
//       displayArea: retailData.vaasthuDetails?.displayArea || retailData.vaastuDetails?.displayArea || '', // Not in vaastu fields - keeping for backward compat
//       electrical: retailData.vaasthuDetails?.electricityDirection || retailData.vaastuDetails?.electricityDirection || '',
//       pantryArea: retailData.vaasthuDetails?.pantryDirection || retailData.vaastuDetails?.pantryDirection || '',
//       staircase: retailData.vaasthuDetails?.['Staircase/Lift Direction(If inside shop)'] || retailData.vaastuDetails?.['Staircase/Lift Direction(If inside shop)'] || '',
//       staircaseInside: retailData.vaasthuDetails?.['Staircase/Lift Direction(If inside shop)'] || retailData.vaastuDetails?.['Staircase/Lift Direction(If inside shop)'] || '', // Same as staircase
//     },
//   };

//   console.log('✅ [RETAIL] Retail details processed:', {
//     location: finalData.commercialDetails.retailDetails.location,
//     neighborhoodArea: finalData.commercialDetails.retailDetails.neighborhoodArea,
//     carpetArea: finalData.commercialDetails.retailDetails.carpetArea,
//     washroom: finalData.commercialDetails.retailDetails.washroom,
//     parkingType: finalData.commercialDetails.retailDetails.parkingType,
//     suitableFor: finalData.commercialDetails.retailDetails.suitableFor,
//     expectedPriceInDetails: finalData.commercialDetails.retailDetails.expectedPrice,
//     expectedPriceTopLevel: finalData.expectedPrice,
//     hasVaastu: !!finalData.commercialDetails.retailDetails.vaastuDetails.shopFacing,
//     vaastuFirstField: finalData.commercialDetails.retailDetails.vaastuDetails.shopFacing,
//     vaastuKeys: Object.keys(finalData.commercialDetails.retailDetails.vaastuDetails || {}),
//     rawVaastuData: retailData.vaasthuDetails,
//   });
// };
// Backend/AdminControllers/commercial/retailController.js
export const handleRetailProperty = (propertyData, finalData) => {
  const { commercialDetails } = propertyData;
  const retailData = commercialDetails?.retailDetails || {};

  console.log('🛍️ [RETAIL] Processing retail property');
  console.log('📦 Raw commercialDetails:', JSON.stringify(commercialDetails, null, 2));
  console.log('📦 Raw retailData:', JSON.stringify(retailData, null, 2));

  // ✅ CRITICAL - Set top-level location and area from propertyData
  finalData.location = propertyData.location;
  finalData.area = propertyData.area;
  
  // ✅ CRITICAL FIX - Set top-level expectedPrice (REQUIRED by schema)
  const expectedPriceValue = Number(
    retailData.expectedPrice || 
    commercialDetails.expectedPrice || 
    propertyData.expectedPrice
  ) || 0;
  
  finalData.expectedPrice = expectedPriceValue;
  
  console.log('💰 [RETAIL] Expected price set:', {
    retailDataPrice: retailData.expectedPrice,
    commercialDetailsPrice: commercialDetails.expectedPrice,
    propertyDataPrice: propertyData.expectedPrice,
    finalPrice: expectedPriceValue,
  });

  // ✅ Build retailDetails with correct field mappings from frontend
  finalData.commercialDetails.retailDetails = {
    // ========== LOCATION & AREA ==========
    location: retailData.location || propertyData.location,
    
    // ✅ CRITICAL FIX - neighborhoodArea from frontend
    neighborhoodArea: retailData.neighborhoodArea || propertyData.area,
    
    // ✅ Optional locality field
    locality: retailData.locality || '',

    // ✅ NEW - Located Inside (from frontend)
    locatedInside: retailData.locatedInside || propertyData.locatedInside || '',

    // ========== CARPET AREA (REQUIRED) ==========
    carpetArea: Number(retailData.carpetArea) || 0,
    carpetAreaUnit: retailData.carpetAreaUnit || 'sqft',

    // ========== SHOP FACADE ==========
    entranceWidth: Number(retailData.entranceWidth) || 0,
    ceilingHeight: Number(retailData.ceilingHeight) || 0,

    // ========== WASHROOM DETAILS ==========
    // Frontend stores as array: ["Private", "Public"] or []
    // Convert to string description for schema
    washroom: Array.isArray(retailData.washroomTypes) && retailData.washroomTypes.length > 0
      ? retailData.washroomTypes.join(', ')
      : 'Not Available',

    // ========== FLOOR DETAILS ==========
    floorDetails: retailData.totalFloors ? `${retailData.totalFloors} floors` : '',

    // ========== PARKING TYPE ==========
    // Frontend stores as array: ["Private Parking", "Public Parking", "Multilevel Parking"] or []
    parkingType: Array.isArray(retailData.parkingType) && retailData.parkingType.length > 0
      ? retailData.parkingType.join(', ')
      : 'Not Available',

    // ========== LOCATED NEAR / AMENITIES ==========
    locatedNear: retailData.locatedNear || [],

    // ========== AVAILABILITY & AGE ==========
    // Frontend stores availability as: "Ready" or "UnderConstruction"
    availability: retailData.availability || '',
    
    // Frontend stores propertyAge as string: "0-1 years", "1-5 years", etc.
    propertyAge: retailData.propertyAge || '',
    
    // ========== POSSESSION (For Under Construction) ==========
    possession: {
      year: retailData.possession?.year || '',
      month: retailData.possession?.month || '',
    },

    // ========== BUSINESS TYPES ==========
    // Frontend businessType is single selection, but schema expects array
    // If "Other" is selected, use otherBusinessType
    suitableFor: retailData.businessType === 'Other' && retailData.otherBusinessType
      ? [retailData.otherBusinessType]
      : retailData.businessType
        ? [retailData.businessType]
        : [],

    // ========== OWNERSHIP & PRICING ==========
    // Frontend stores as string: "Freehold", "Leasehold", "Rent"
    ownership: retailData.ownershipType || '',

    // ✅ FIX: Check multiple locations for expectedPrice
    expectedPrice: expectedPriceValue, // Use the value we set above
    
    // ✅ NEW - Properly capture price details from frontend
    priceDetails: {
      allInclusive: Boolean(retailData.priceDetails?.allInclusive || retailData.allInclusive),
      negotiable: Boolean(retailData.priceDetails?.negotiable || retailData.negotiable),
      taxExcluded: Boolean(retailData.priceDetails?.taxExcluded || retailData.taxExcluded),
    },

    // ========== PRE-LEASED DETAILS ==========
    // Frontend stores as: "Yes" or "No"
    preLeased: retailData.preLeased || '',
    
    // Frontend stores leaseDuration as string: "3 Years", etc.
    leaseDuration: retailData.leaseDuration || '',
    
    // ✅ FIX - Capture both rentPerMonth AND preLeasedAmount
    monthlyRent: Number(retailData.rentPerMonth || retailData.monthlyRent) || 0,
    preLeasedAmount: Number(retailData.preLeasedAmount) || 0,

    // ========== PREVIOUS USE & DESCRIPTION ==========
    previouslyUsedFor: retailData.previouslyUsedFor || '',
    
    description: retailData.description || propertyData.description || '',

    // ========== AMENITIES & ADVANTAGES ==========
    // Frontend stores as arrays of strings
    amenities: retailData.amenities || [],
    locationAdvantages: retailData.locationAdvantages || [],

    // ✅ NEW - Furnishing Items (if applicable)
    furnishingItems: retailData.furnishingItems || [],

    // ========== VAASTU DETAILS (from retailVaasthuFields constant) ==========
    // ✅ FIXED - Use consistent spelling (vaasthuDetails) throughout
    vaastuDetails: {
      shopFacing: retailData.vaasthuDetails?.mainFacing || '',
      entrance: retailData.vaasthuDetails?.mainEntranceDirection || '',
      cashCounter: retailData.vaasthuDetails?.cashCounterDirection || '',
      cashLocker: retailData.vaasthuDetails?.cashLockerDirection || '',
      ownerSeating: retailData.vaasthuDetails?.ownerSeatingDirection || '',
      staffSeating: retailData.vaasthuDetails?.staffSeatingDirection || '',
      storage: retailData.vaasthuDetails?.storageDirection || '',
      displayArea: retailData.vaasthuDetails?.displayArea || '',
      electrical: retailData.vaasthuDetails?.electricityDirection || '',
      pantryArea: retailData.vaasthuDetails?.pantryDirection || '',
      staircase: retailData.vaasthuDetails?.['Staircase/Lift Direction(If inside shop)'] || '',
      staircaseInside: retailData.vaasthuDetails?.['Staircase/Lift Direction(If inside shop)'] || '',
    },
  };

  console.log('✅ [RETAIL] Retail details processed:', {
    location: finalData.commercialDetails.retailDetails.location,
    neighborhoodArea: finalData.commercialDetails.retailDetails.neighborhoodArea,
    locatedInside: finalData.commercialDetails.retailDetails.locatedInside,
    carpetArea: finalData.commercialDetails.retailDetails.carpetArea,
    washroom: finalData.commercialDetails.retailDetails.washroom,
    parkingType: finalData.commercialDetails.retailDetails.parkingType,
    suitableFor: finalData.commercialDetails.retailDetails.suitableFor,
    expectedPriceInDetails: finalData.commercialDetails.retailDetails.expectedPrice,
    expectedPriceTopLevel: finalData.expectedPrice,
    preLeasedAmount: finalData.commercialDetails.retailDetails.preLeasedAmount,
    furnishingItems: finalData.commercialDetails.retailDetails.furnishingItems,
    hasVaastu: !!finalData.commercialDetails.retailDetails.vaastuDetails.shopFacing,
    vaastuFirstField: finalData.commercialDetails.retailDetails.vaastuDetails.shopFacing,
    vaastuKeys: Object.keys(finalData.commercialDetails.retailDetails.vaastuDetails || {}),
  });
};