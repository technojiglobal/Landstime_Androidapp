// Backend/AdminControllers/commercial/storageController.js

export const handleStorageProperty = (propertyData, finalData) => {
  const { commercialDetails } = propertyData;
  const storageDetails = commercialDetails?.storageDetails || {};

  console.log('🏭 [STORAGE] Processing Storage property');
  console.log('📊 [STORAGE] Input data:', JSON.stringify(storageDetails, null, 2));

  // ==================== BASIC INFORMATION ====================
  const location = storageDetails.location || propertyData.location || '';
  const neighborhoodArea = storageDetails.neighborhoodArea || propertyData.area || '';
  const locality = storageDetails.locality || '';

  console.log('📍 [STORAGE] Location data:', {
    location,
    neighborhoodArea,
    locality
  });

  // Validation: location is required
  if (!location) {
    console.error('❌ [STORAGE] Location is required but missing');
  }

  // ==================== STORAGE TYPE ====================
  const storageType = storageDetails.storageType || propertyData.plotType || 'Warehouse';

  // ==================== AREA & DIMENSIONS ====================
  const storageAreaValue = Number(storageDetails.plotArea || storageDetails.storageArea || storageDetails.storageArea?.value) || 0;
  const areaUnit = storageDetails.areaUnit || storageDetails.storageArea?.unit || 'sqft';

  // Validation: storage area is required
  if (!storageAreaValue || storageAreaValue === 0) {
    console.error('❌ [STORAGE] Storage area is required but missing or zero');
  }

  const length = Number(storageDetails.lengthOfPlot || storageDetails.length || storageDetails.dimensions?.length) || 0;
  const breadth = Number(storageDetails.breadthOfPlot || storageDetails.breadth || storageDetails.dimensions?.breadth) || 0;

  console.log('📐 [STORAGE] Area & Dimensions:', {
    storageAreaValue,
    areaUnit,
    length,
    breadth
  });

  // ==================== ROAD & OPEN SIDES ====================
  const roadWidth = Number(storageDetails.widthOfFacingRoad || storageDetails.roadWidth) || 0;
  const roadWidthUnit = storageDetails.roadWidthUnit || 'ft';
  const openSides = storageDetails.noOfOpenSides || storageDetails.openSides || '';

  console.log('🛣️ [STORAGE] Road & Access:', {
    roadWidth,
    roadWidthUnit,
    openSides
  });

  // ==================== CONSTRUCTION DETAILS ====================
  const constructionDone = storageDetails.constructionDone || 'No';
  const constructionTypes = [];

  if (constructionDone === 'Yes' && storageDetails.constructionType) {
    constructionTypes.push(storageDetails.constructionType);
  }

  console.log('🏗️ [STORAGE] Construction:', {
    constructionDone,
    constructionTypes
  });

  // ==================== AVAILABILITY & AGE ====================
  // Map frontend values to schema enum values
  let availability = storageDetails.availabilityStatus || storageDetails.availability || '';

  // Ensure availability matches schema enum: 'Ready' or 'UnderConstruction'
  if (availability === 'Ready to Move' || availability === 'Ready') {
    availability = 'Ready';
  } else if (availability === 'Under Construction' || availability === 'UnderConstruction') {
    availability = 'UnderConstruction';
  } else if (!availability) {
    availability = 'Ready'; // Default to Ready if not specified
  }

  const ageOfProperty = storageDetails.ageOfProperty || '';

  const possession = {
    expectedBy: storageDetails.possessionYear || storageDetails.possession?.expectedBy || storageDetails.possession?.year || ''
  };

  console.log('📅 [STORAGE] Availability:', {
    availability,
    ageOfProperty,
    possession
  });

  // ==================== OWNERSHIP & APPROVALS ====================
  const ownership = storageDetails.ownershipType || storageDetails.ownership || 'Freehold';
  const authority = storageDetails.authorityApproval || storageDetails.authority || '';
  const approvedIndustryType = storageDetails.industryType || storageDetails.approvedIndustryType || '';

  console.log('📜 [STORAGE] Ownership & Approvals:', {
    ownership,
    authority,
    approvedIndustryType
  });

  // ==================== PRICING DETAILS ====================
  const expectedPrice = Number(
    storageDetails.expectedPrice ||
    propertyData.expectedPrice ||
    0
  );

  const priceDetails = {
    allInclusive: storageDetails.priceDetails?.allInclusive ||
      storageDetails.allInclusive ||
      false,
    negotiable: storageDetails.priceDetails?.negotiable ||
      storageDetails.priceNegotiable ||
      storageDetails.negotiable ||
      false,
    taxExcluded: storageDetails.priceDetails?.taxExcluded ||
      storageDetails.taxCharges ||
      storageDetails.taxExcluded ||
      false
  };

  console.log('💰 [STORAGE] Pricing:', {
    expectedPrice,
    priceDetails
  });

  // ==================== PRE-LEASED DETAILS ====================
  const preLeased = storageDetails.preLeased || 'No';
  const leaseDuration = storageDetails.leaseDuration || '';
  const monthlyRent = Number(storageDetails.monthlyRent) || 0;

  const nocCertified = storageDetails.nocCertified || '';
  const occupancyCertified = storageDetails.occupancyCertified || '';

  console.log('📋 [STORAGE] Lease Details:', {
    preLeased,
    leaseDuration,
    monthlyRent
  });

  // ==================== FEATURES ====================
  const amenities = storageDetails.amenities || [];
  const locationAdvantages = storageDetails.locationAdvantages || [];

  console.log('✨ [STORAGE] Features:', {
    amenitiesCount: amenities.length,
    locationAdvantagesCount: locationAdvantages.length
  });

  // ==================== DESCRIPTION ====================
  const description = storageDetails.description || propertyData.description || '';

  // ==================== VASTU DETAILS ====================
  // Form sends vaasthuDetails (double 'a'), schema expects vastuDetails (single 'a')
  const vastuDetails = {
    buildingFacing: storageDetails.vaasthuDetails?.storageBuildingFacing ||
      storageDetails.vastuDetails?.buildingFacing || '',
    entrance: storageDetails.vaasthuDetails?.mainEntranceDirection ||
      storageDetails.vastuDetails?.entrance || '',
    storageArea: storageDetails.vaasthuDetails?.storageAreaDirection ||
      storageDetails.vastuDetails?.storageArea || '',
    lightGoods: storageDetails.vaasthuDetails?.lightGoodsDirection ||
      storageDetails.vastuDetails?.lightGoods || '',
    loading: storageDetails.vaasthuDetails?.loadingUnloadingDirection ||
      storageDetails.vastuDetails?.loading || '',
    office: storageDetails.vaasthuDetails?.officeAreaDirection ||
      storageDetails.vastuDetails?.office || '',
    electrical: storageDetails.vaasthuDetails?.electricalDirection ||
      storageDetails.vastuDetails?.electrical || '',
    water: storageDetails.vaasthuDetails?.waterSourceDirection ||
      storageDetails.vastuDetails?.water || '',
    washroom: storageDetails.vaasthuDetails?.washroomDirection ||
      storageDetails.vastuDetails?.washroom || '',
    height: storageDetails.vaasthuDetails?.heightLevel ||
      storageDetails.vastuDetails?.height || ''
  };

  console.log('🧭 [STORAGE] Vastu Details (converted from vaasthuDetails to vastuDetails):', vastuDetails);

  // ==================== BUILD FINAL STRUCTURE ====================
  finalData.location = location;
  finalData.area = neighborhoodArea;

  finalData.commercialDetails.storageDetails = {
    // Storage Type
    storageType,

    // Location (REQUIRED)
    location,
    neighborhoodArea,
    locality,

    // Area & Dimensions (storageArea.value is REQUIRED)
    storageArea: {
      value: storageAreaValue,
      unit: areaUnit
    },
    dimensions: {
      length,
      breadth
    },

    // Road & Access
    roadWidth,
    roadWidthUnit,

    // Washroom
    washroomType: storageDetails.washroomType || '',

    // Availability & Age (REQUIRED - must be 'Ready' or 'UnderConstruction')
    availability,
    ageOfProperty,
    possession,

    // Ownership & Approvals
    ownership,
    authority,
    approvedIndustryType,

    // Pricing
    expectedPrice,
    priceDetails,

    // Pre-Leased
    preLeased,
    leaseDuration,
    monthlyRent,
    nocCertified,
    occupancyCertified,

    // Description
    description,

    // Features
    amenities,
    locationAdvantages,

    // Vastu
    vastuDetails
  };

  // Update top-level expectedPrice
  finalData.expectedPrice = expectedPrice;

  console.log('✅ [STORAGE] Final structure built successfully');
  console.log('📦 [STORAGE] Output preview:', {
    hasLocation: !!finalData.location,
    location: finalData.commercialDetails.storageDetails.location,
    hasArea: !!finalData.area,
    storageAreaValue: finalData.commercialDetails.storageDetails.storageArea.value,
    storageAreaUnit: finalData.commercialDetails.storageDetails.storageArea.unit,
    dimensions: finalData.commercialDetails.storageDetails.dimensions,
    availability: finalData.commercialDetails.storageDetails.availability,
    expectedPrice: finalData.commercialDetails.storageDetails.expectedPrice,
    hasVastu: !!Object.values(vastuDetails).some(v => v)
  });

  return finalData;
};