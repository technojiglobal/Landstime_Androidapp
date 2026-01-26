// Backend/AdminControllers/commercial/industryController.js

export const handleIndustryProperty = (propertyData, finalData) => {
  const { commercialDetails } = propertyData;
  const industryDetails = commercialDetails?.industryDetails || {};

  console.log('🏭 [INDUSTRY] Processing Industry property');
  console.log('📊 [INDUSTRY] Input data:', JSON.stringify(industryDetails, null, 2));

  // ==================== BASIC INFORMATION ====================
  const location = industryDetails.location || propertyData.location || '';
  const neighborhoodArea = industryDetails.neighborhoodArea || propertyData.area || '';

  console.log('📍 [INDUSTRY] Location data:', {
    location,
    neighborhoodArea
  });

  // Validation: location is required
  if (!location) {
    console.error('❌ [INDUSTRY] Location is required but missing');
  }

  // ==================== AREA & DIMENSIONS ====================
  const areaValue = Number(
    industryDetails.plotArea || 
    industryDetails.carpetArea ||
    industryDetails.area?.value
  ) || 0;
  
  const areaUnit = industryDetails.carpetAreaUnit || 
                   industryDetails.areaUnit || 
                   industryDetails.area?.unit || 
                   'sqft';

  // Validation: area is required
  if (!areaValue || areaValue === 0) {
    console.error('❌ [INDUSTRY] Area is required but missing or zero');
  }

  const length = Number(
    industryDetails.length || 
    industryDetails.dimensions?.length
  ) || 0;
  
  const breadth = Number(
    industryDetails.breadth || 
    industryDetails.dimensions?.breadth
  ) || 0;

  console.log('📐 [INDUSTRY] Area & Dimensions:', {
    areaValue,
    areaUnit,
    length,
    breadth
  });

  // ==================== WASHROOM ====================
  const washroomType = industryDetails.noOfWashrooms || 
                       industryDetails.washroomType || 
                       '';

  console.log('🚻 [INDUSTRY] Washroom:', washroomType);

  // ==================== AVAILABILITY & AGE ====================
  let availability = industryDetails.availabilityStatus || 
                     industryDetails.availability || 
                     '';

  // Map to schema enum: 'Ready to Move' or 'Under Construction'
  if (availability === 'Ready to move' || availability === 'Ready') {
    availability = 'Ready to Move';
  } else if (availability === 'Under construction' || availability === 'UnderConstruction') {
    availability = 'Under Construction';
  } else if (!availability) {
    availability = 'Ready to Move'; // Default
  }

  const ageOfProperty = industryDetails.ageOfProperty || '';
  const possessionBy = industryDetails.possessionBy || '';

  console.log('📅 [INDUSTRY] Availability:', {
    availability,
    ageOfProperty,
    possessionBy
  });

  // ==================== OWNERSHIP & APPROVALS ====================
  const ownership = industryDetails.ownershipType || 
                    industryDetails.ownership || 
                    industryDetails.pricing?.ownership || 
                    '';
  
  const approvedBy = industryDetails.approvedBy || 
                     industryDetails.pricing?.approvedBy || 
                     '';
  
  const approvedIndustryType = industryDetails.approvedIndustryType || 
                               industryDetails.pricing?.approvedIndustryType || 
                               '';

  console.log('📜 [INDUSTRY] Ownership & Approvals:', {
    ownership,
    approvedBy,
    approvedIndustryType
  });

  // ==================== PRICING DETAILS ====================
  const expectedPrice = Number(
    industryDetails.expectedPrice || 
    industryDetails.pricing?.expectedPrice ||
    propertyData.expectedPrice || 
    0
  );

  const priceDetails = {
    allInclusive: industryDetails.pricing?.priceDetails?.allInclusive || 
                   industryDetails.priceDetails?.allInclusive ||
                   industryDetails.allInclusive || 
                   false,
    negotiable: industryDetails.pricing?.priceDetails?.negotiable ||
                industryDetails.priceDetails?.negotiable ||
                industryDetails.priceNegotiable ||
                industryDetails.negotiable || 
                false,
    taxExcluded: industryDetails.pricing?.priceDetails?.taxExcluded ||
                 industryDetails.priceDetails?.taxExcluded ||
                 industryDetails.taxCharges ||
                 industryDetails.taxExcluded || 
                 false
  };

  console.log('💰 [INDUSTRY] Pricing:', {
    expectedPrice,
    priceDetails
  });

  // ==================== PRE-LEASED DETAILS ====================
  const preLeased = industryDetails.preLeased || 
                    industryDetails.pricing?.preLeased || 
                    'No';
  
  const leaseDuration = industryDetails.leaseTenure || 
                        industryDetails.leaseDuration ||
                        industryDetails.pricing?.leaseDuration || 
                        '';
  
  const monthlyRent = Number(
    industryDetails.currentRent || 
    industryDetails.monthlyRent ||
    industryDetails.pricing?.monthlyRent
  ) || 0;

  console.log('📋 [INDUSTRY] Lease Details:', {
    preLeased,
    leaseDuration,
    monthlyRent
  });

  // ==================== DESCRIPTION ====================
  const description = industryDetails.description || 
                      industryDetails.pricing?.description ||
                      propertyData.description || 
                      '';

  // ==================== FEATURES ====================
  const amenities = industryDetails.amenities || 
                    industryDetails.pricing?.amenities || 
                    [];
  
  const locationAdvantages = industryDetails.locationAdvantages || 
                             industryDetails.pricing?.locationAdvantages || 
                             [];
  
  const wheelchairFriendly = industryDetails.wheelchairFriendly || 
                             industryDetails.pricing?.wheelchairFriendly || 
                             false;

  console.log('✨ [INDUSTRY] Features:', {
    amenitiesCount: amenities.length,
    locationAdvantagesCount: locationAdvantages.length,
    wheelchairFriendly
  });

  // ==================== VASTU DETAILS ====================
  // Form sends vaasthuDetails (double 'a'), schema expects vastuDetails (single 'a')
  const vastuDetails = {
    buildingFacing: industryDetails.vaasthuDetails?.buildingFacing || 
                    industryDetails.vastuDetails?.buildingFacing || '',
    entrance: industryDetails.vaasthuDetails?.entrance || 
              industryDetails.vastuDetails?.entrance || '',
    machinery: industryDetails.vaasthuDetails?.machineryArea || 
               industryDetails.vastuDetails?.machinery || '',
    production: industryDetails.vaasthuDetails?.productionArea || 
                industryDetails.vastuDetails?.production || '',
    rawMaterial: industryDetails.vaasthuDetails?.rawMaterialStorage || 
                 industryDetails.vastuDetails?.rawMaterial || '',
    finishedGoods: industryDetails.vaasthuDetails?.finishedGoodsStorage || 
                   industryDetails.vastuDetails?.finishedGoods || '',
    office: industryDetails.vaasthuDetails?.officeArea || 
            industryDetails.vastuDetails?.office || '',
    electrical: industryDetails.vaasthuDetails?.electricalRoom || 
                industryDetails.vastuDetails?.electrical || '',
    water: industryDetails.vaasthuDetails?.waterTank || 
           industryDetails.vastuDetails?.water || '',
    waste: industryDetails.vaasthuDetails?.wasteDisposal || 
           industryDetails.vastuDetails?.waste || '',
    washroom: industryDetails.vaasthuDetails?.washrooms || 
              industryDetails.vastuDetails?.washroom || ''
  };

  console.log('🧭 [INDUSTRY] Vastu Details (converted from vaasthuDetails to vastuDetails):', vastuDetails);

  // ==================== BUILD FINAL STRUCTURE ====================
  finalData.location = location;
  finalData.area = neighborhoodArea;

  finalData.commercialDetails.industryDetails = {
    // Location (REQUIRED)
    location,
    neighborhoodArea,

    // Area (REQUIRED)
    area: {
      value: areaValue,
      unit: areaUnit
    },

    // Dimensions
    dimensions: {
      length,
      breadth
    },

    // Washroom
    washroomType,

    // Availability & Age
    availability,
    ageOfProperty,
    possessionBy,

    // Pricing structure (nested as per schema)
    pricing: {
      ownership,
      expectedPrice,
      priceDetails,
      approvedBy,
      approvedIndustryType,
      preLeased,
      leaseDuration,
      monthlyRent,
      description,
      amenities,
      locationAdvantages,
      wheelchairFriendly
    },

    // Vastu
    vastuDetails
  };

  // Update top-level expectedPrice
  finalData.expectedPrice = expectedPrice;

  console.log('✅ [INDUSTRY] Final structure built successfully');
  console.log('📦 [INDUSTRY] Output preview:', {
    hasLocation: !!finalData.location,
    location: finalData.commercialDetails.industryDetails.location,
    hasArea: !!finalData.area,
    areaValue: finalData.commercialDetails.industryDetails.area.value,
    areaUnit: finalData.commercialDetails.industryDetails.area.unit,
    availability: finalData.commercialDetails.industryDetails.availability,
    expectedPrice: finalData.commercialDetails.industryDetails.pricing.expectedPrice,
    hasVastu: !!Object.values(vastuDetails).some(v => v)
  });

  return finalData;
};