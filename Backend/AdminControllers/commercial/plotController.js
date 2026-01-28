// Backend/AdminControllers/commercial/plotController.js

export const handlePlotProperty = (propertyData, finalData) => {
  const { commercialDetails } = propertyData;
  const plotDetails = commercialDetails?.plotDetails || {};

  console.log('🏗️ [PLOT] Processing Plot/Land property');
  console.log('📊 [PLOT] Input data:', JSON.stringify(plotDetails, null, 2));

  // ==================== BASIC INFORMATION ====================
  const location = plotDetails.location || propertyData.location || '';
  const neighborhoodArea = plotDetails.neighborhoodArea || propertyData.area || '';
  const locality = plotDetails.locality || '';

  console.log('📍 [PLOT] Location data:', {
    location,
    neighborhoodArea,
    locality
  });

  // ==================== PLOT KIND & TYPE ====================
  const plotKind = plotDetails.plotKind || '';
  const plotType = plotDetails.plotType || '';

  // ==================== AREA & DIMENSIONS ====================
  const area = Number(plotDetails.plotArea || plotDetails.area) || 0;
  const areaUnit = plotDetails.areaUnit || 'sqft';

  const length = Number(plotDetails.lengthOfPlot || plotDetails.dimensions?.length) || 0;
  const breadth = Number(plotDetails.breadthOfPlot || plotDetails.dimensions?.breadth) || 0;

  console.log('📐 [PLOT] Area & Dimensions:', {
    area,
    areaUnit,
    length,
    breadth
  });

  // ==================== ROAD & OPEN SIDES ====================
  const roadWidth = Number(plotDetails.widthOfFacingRoad || plotDetails.roadWidth) || 0;
  const roadWidthUnit = plotDetails.roadWidthUnit || 'ft';
  const openSides = plotDetails.noOfOpenSides || plotDetails.openSides || '';

  console.log('🛣️ [PLOT] Road & Access:', {
    roadWidth,
    roadWidthUnit,
    openSides
  });

  // ==================== CONSTRUCTION DETAILS ====================
  const constructionDone = plotDetails.constructionDone || 'No';
  const constructionTypes = [];

  if (constructionDone === 'Yes' && plotDetails.constructionType) {
    constructionTypes.push(plotDetails.constructionType);
  }

  console.log('🏗️ [PLOT] Construction:', {
    constructionDone,
    constructionTypes
  });

  // ==================== POSSESSION ====================
  const possession = {
    year: plotDetails.possessionYear || plotDetails.possession?.year || '',
    month: plotDetails.possessionMonth || plotDetails.possession?.month || ''
  };

  console.log('📅 [PLOT] Possession:', possession);

  // ==================== OWNERSHIP & APPROVALS ====================
  const ownership = plotDetails.ownershipType || plotDetails.ownership || 'Freehold';
  const approvedBy = plotDetails.authorityApproval || plotDetails.approvedBy || '';
  const industryType = plotDetails.industryType || '';

  console.log('📜 [PLOT] Ownership & Approvals:', {
    ownership,
    approvedBy,
    industryType
  });

  // ==================== PRICING DETAILS ====================
  const expectedPrice = Number(
    plotDetails.expectedPrice ||
    propertyData.expectedPrice ||
    0
  );

  const priceDetails = {
    allInclusive: plotDetails.priceDetails?.allInclusive ||
      plotDetails.allInclusive ||
      false,
    negotiable: plotDetails.priceDetails?.negotiable ||
      plotDetails.negotiable ||
      false,
    taxExcluded: plotDetails.priceDetails?.taxExcluded ||
      plotDetails.taxExcluded ||
      false
  };

  console.log('💰 [PLOT] Pricing:', {
    expectedPrice,
    priceDetails
  });

  // ==================== PRE-LEASED DETAILS ====================
  const preLeased = plotDetails.preLeased || 'No';
  const leaseDuration = plotDetails.leaseDuration || '';
  const monthlyRent = Number(plotDetails.monthlyRent) || 0;

  const nocCertified = plotDetails.nocCertified || '';
  const occupancyCertified = plotDetails.occupancyCertified || '';

  console.log('📋 [PLOT] Lease Details:', {
    preLeased,
    leaseDuration,
    monthlyRent
  });

  // ==================== FEATURES ====================
  const cornerProperty = plotDetails.otherFeatures?.includes('Corner Property') ||
    plotDetails.cornerProperty ||
    false;

  const amenities = plotDetails.amenities || [];
  const locationAdvantages = plotDetails.locationAdvantages || [];

  console.log('✨ [PLOT] Features:', {
    cornerProperty,
    amenitiesCount: amenities.length,
    locationAdvantagesCount: locationAdvantages.length
  });

  // ==================== DESCRIPTION ====================
  const description = plotDetails.description || propertyData.description || '';

  // ==================== VASTU DETAILS ====================
  const vastuDetails = {
    plotFacing: plotDetails.vaasthuDetails?.plotFacing ||
      plotDetails.vastuDetails?.plotFacing || '',
    mainEntry: plotDetails.vaasthuDetails?.mainEntryDirection ||
      plotDetails.vastuDetails?.mainEntry || '',
    plotSlope: plotDetails.vaasthuDetails?.plotSlope ||
      plotDetails.vastuDetails?.plotSlope || '',
    openSpace: plotDetails.vaasthuDetails?.openSpace ||
      plotDetails.vastuDetails?.openSpace || '',
    shape: plotDetails.vaasthuDetails?.plotShape ||
      plotDetails.vastuDetails?.shape || '',
    roadPosition: plotDetails.vaasthuDetails?.roadPosition ||
      plotDetails.vastuDetails?.roadPosition || '',
    waterSource: plotDetails.vaasthuDetails?.waterSource ||
      plotDetails.vastuDetails?.waterSource || '',
    drainage: plotDetails.vaasthuDetails?.drainageDirection ||
      plotDetails.vastuDetails?.drainage || '',
    compoundWall: plotDetails.vaasthuDetails?.compoundWallHeight ||
      plotDetails.vastuDetails?.compoundWall || '',
    structures: plotDetails.vaasthuDetails?.existingStructures ||
      plotDetails.vastuDetails?.structures || ''
  };

  console.log('🧭 [PLOT] Vastu Details:', vastuDetails);

  // ==================== BUILD FINAL STRUCTURE ====================
  finalData.location = location;
  finalData.area = neighborhoodArea;

  finalData.commercialDetails.plotDetails = {
    // Basic Information
    plotKind,
    plotType,
    location,
    neighborhoodArea,
    locality,

    // Area & Dimensions
    area,
    areaUnit,
    dimensions: {
      length,
      breadth
    },

    // Road & Access
    roadWidth,
    roadWidthUnit,
    openSides,

    // Construction
    constructionDone,
    constructionTypes,

    // Possession
    possession,

    // Ownership & Approvals
    ownership,
    approvedBy,
    industryType,

    // Pricing
    expectedPrice,
    priceDetails,

    // Pre-Leased
    preLeased,
    leaseDuration,
    monthlyRent,
    nocCertified,
    occupancyCertified,

    // Features
    cornerProperty,
    amenities,
    locationAdvantages,

    // Description
    description,

    // Vastu
    vastuDetails
  };

  // Update top-level expectedPrice
  finalData.expectedPrice = expectedPrice;

  console.log('✅ [PLOT] Final structure built successfully');
  console.log('📦 [PLOT] Output preview:', {
    hasLocation: !!finalData.location,
    hasArea: !!finalData.area,
    plotArea: finalData.commercialDetails.plotDetails.area,
    dimensions: finalData.commercialDetails.plotDetails.dimensions,
    expectedPrice: finalData.commercialDetails.plotDetails.expectedPrice,
    hasVastu: !!Object.values(vastuDetails).some(v => v)
  });

  return finalData;
};