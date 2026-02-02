// Backend/AdminControllers/commercial/retailController.js
export const handleRetailProperty = (propertyData, finalData) => {
  const { commercialDetails } = propertyData;
  const retailData = commercialDetails?.retailDetails || {};

  console.log('🛍️ [RETAIL] Processing retail property');
  console.log('📦 Raw retailData:', JSON.stringify(retailData, null, 2));

  // ✅ CRITICAL - Set top-level location and area
  finalData.location = propertyData.location;
  finalData.area = propertyData.area;

  // ✅ CRITICAL FIX - Set top-level expectedPrice (REQUIRED by schema)
  const expectedPriceValue = Number(
    retailData.expectedPrice ||
    commercialDetails.expectedPrice ||
    propertyData.expectedPrice
  ) || 0;

  finalData.expectedPrice = expectedPriceValue;

  console.log('💰 [RETAIL] Expected price set:', expectedPriceValue);

  // ✅ NEW - Process furnishing items (convert objects to strings)
  let furnishingItems = retailData.furnishingItems || [];
  console.log('🪑 [RETAIL] Raw furnishing items:', furnishingItems);
  
  if (typeof furnishingItems === 'string') {
    try {
      furnishingItems = JSON.parse(furnishingItems);
    } catch (e) {
      console.error('❌ Failed to parse furnishing items:', e);
      furnishingItems = [];
    }
  }

  // Convert object array to string array
  if (Array.isArray(furnishingItems)) {
    furnishingItems = furnishingItems.map(item => {
      if (typeof item === 'object' && item !== null && item.name) {
        return item.count > 1 ? `${item.name} (${item.count})` : item.name;
      }
      return item;
    });
  }
  
  console.log('✅ [RETAIL] Processed furnishing items:', furnishingItems);

  // ✅ DEBUG - Log what we're receiving (MOVED HERE - BEFORE USAGE)
  console.log('🔍 [RETAIL] Checking Vaastu data:', {
    hasVaasthuDetails: !!retailData.vaasthuDetails,
    hasVastuDetails: !!retailData.vastuDetails,
    hasVaastuDetails: !!retailData.vaastuDetails,
    rawVaasthu: retailData.vaasthuDetails,
    rawVastu: retailData.vastuDetails,
    rawVaastu: retailData.vaastuDetails,
  });

  // ✅ CRITICAL FIX - Safely extract vaastu details with all possible spellings
  const vaasthuSource = retailData.vaasthuDetails || retailData.vastuDetails || retailData.vaastuDetails || {};
  
  console.log('🔧 [RETAIL] Using vaasthu source:', vaasthuSource);

  // ✅ Build retailDetails with correct field mappings
  finalData.commercialDetails.retailDetails = {
    // ========== LOCATION & AREA ==========
    location: retailData.location || propertyData.location,
    neighborhoodArea: retailData.neighborhoodArea || propertyData.area,
    locality: retailData.locality || '',
    locatedInside: retailData.locatedInside || '',

    // ========== CARPET AREA (REQUIRED) ==========
    carpetArea: Number(retailData.carpetArea) || 0,
    carpetAreaUnit: retailData.carpetAreaUnit || 'sqft',

    // ========== SHOP FACADE ==========
    entranceWidth: Number(retailData.entranceWidth) || 0,
    ceilingHeight: Number(retailData.ceilingHeight) || 0,

    // ========== WASHROOM DETAILS ==========
    washroom: Array.isArray(retailData.washroomTypes) && retailData.washroomTypes.length > 0
      ? retailData.washroomTypes.join(', ')
      : 'Not Available',

    // ========== FLOOR DETAILS ==========
    floorDetails: retailData.floorDetails || (retailData.totalFloors ? `${retailData.totalFloors} floors` : ''),
    totalFloors: Number(retailData.totalFloors) || 0,

    // ========== PARKING TYPE ==========
    parkingType: Array.isArray(retailData.parkingType) && retailData.parkingType.length > 0
      ? retailData.parkingType.join(', ')
      : 'Not Available',

    // ========== LOCATED NEAR ==========
    locatedNear: retailData.locatedNear || [],

    // ========== AVAILABILITY & AGE ==========
    availability: retailData.availability || '',
    propertyAge: retailData.propertyAge || '',

    // ========== POSSESSION ==========
    possession: {
      year: retailData.possession?.year || '',
      month: retailData.possession?.month || '',
    },

    // ========== BUSINESS TYPES ==========
    suitableFor: retailData.businessType === 'Other' && retailData.otherBusinessType
      ? [retailData.otherBusinessType]
      : retailData.businessType
        ? [retailData.businessType]
        : [],

    // ========== OWNERSHIP ==========
    ownership: retailData.ownershipType || retailData.ownership || '',

    // ========== FURNISHING ========== 
    furnishingType: retailData.furnishingType || 'Unfurnished',
    furnishingItems: furnishingItems,

    // ========== PRICING ==========
    expectedPrice: expectedPriceValue,
    priceDetails: {
      allInclusive: Boolean(retailData.priceDetails?.allInclusive || retailData.allInclusive),
      negotiable: Boolean(retailData.priceDetails?.negotiable || retailData.negotiable),
      taxExcluded: Boolean(retailData.priceDetails?.taxExcluded || retailData.taxExcluded),
    },

    // ========== PRE-LEASED DETAILS ==========
    preLeased: retailData.preLeased || '',
    leaseDuration: retailData.leaseDuration || '',
    monthlyRent: Number(retailData.rentPerMonth || retailData.monthlyRent) || 0,
    preLeasedAmount: Number(retailData.preLeasedAmount) || 0,

    // ========== DESCRIPTION ==========
    previouslyUsedFor: retailData.previouslyUsedFor || '',
    description: retailData.description || propertyData.description || '',

    // ========== AMENITIES ==========
    amenities: retailData.amenities || [],
    locationAdvantages: retailData.locationAdvantages || [],

    // ========== VAASTU DETAILS ========== 
    // ✅ FIX - Use the safely extracted vaasthuSource
    vaasthuDetails: {
      shopFacing: vaasthuSource.shopFacing || '',
      entrance: vaasthuSource.entrance || '',
      cashCounter: vaasthuSource.cashCounter || '',
      cashLocker: vaasthuSource.cashLocker || '',
      ownerSeating: vaasthuSource.ownerSeating || '',
      staffSeating: vaasthuSource.staffSeating || '',
      storage: vaasthuSource.storage || '',
      displayArea: vaasthuSource.displayArea || '',
      electrical: vaasthuSource.electrical || '',
      pantryArea: vaasthuSource.pantryArea || '',
      staircase: vaasthuSource.staircase || '',
      staircaseInside: vaasthuSource.staircaseInside || '',
    },
  };

  console.log('✅ [RETAIL] Final retail details:', {
    location: finalData.commercialDetails.retailDetails.location,
    neighborhoodArea: finalData.commercialDetails.retailDetails.neighborhoodArea,
    carpetArea: finalData.commercialDetails.retailDetails.carpetArea,
    expectedPrice: finalData.expectedPrice,
    furnishingType: finalData.commercialDetails.retailDetails.furnishingType,
    furnishingItemsCount: finalData.commercialDetails.retailDetails.furnishingItems.length,
    vaasthuShopFacing: finalData.commercialDetails.retailDetails.vaasthuDetails.shopFacing,
    vaasthuEntrance: finalData.commercialDetails.retailDetails.vaasthuDetails.entrance,
    vaasthuCashCounter: finalData.commercialDetails.retailDetails.vaasthuDetails.cashCounter,
  });
};