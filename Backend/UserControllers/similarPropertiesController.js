import Property from '../UserModels/Property.js';

export const getSimilarProperties = async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    console.log('🔍 Finding similar properties for:', propertyId);
    
    // Fetch the current property
    const currentProperty = await Property.findById(propertyId);
    
    if (!currentProperty) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    console.log('📋 Current property type:', currentProperty.propertyType);
    console.log('📍 Current property area:', currentProperty.areaKey);
    
    // Base query - always apply these filters
    const baseQuery = {
      _id: { $ne: propertyId }, // Exclude current property
      status: 'approved',
      propertyType: currentProperty.propertyType,
      areaKey: currentProperty.areaKey // Same neighborhood
    };
    
    let typeSpecificQuery = {};
    let sortCriteria = { createdAt: -1 }; // Default: newest first
    
    // Apply type-specific matching logic
    switch (currentProperty.propertyType) {
      case 'House':
      case 'House/Flat':
        const bedrooms = currentProperty.houseDetails?.bedrooms || 2;
        const housePrice = currentProperty.expectedPrice;
        
        typeSpecificQuery = {
          'houseDetails.bedrooms': {
            $gte: Math.max(1, bedrooms - 1),
            $lte: bedrooms + 1
          },
          expectedPrice: {
            $gte: housePrice * 0.7,
            $lte: housePrice * 1.3
          }
        };
        
        console.log('🏠 House filters:', {
          bedrooms: `${bedrooms-1} to ${bedrooms+1}`,
          price: `${housePrice * 0.7} to ${housePrice * 1.3}`
        });
        break;
        
      case 'Site/Plot/Land':
        const siteArea = currentProperty.siteDetails?.area || 1000;
        const sitePrice = currentProperty.expectedPrice;
        
        typeSpecificQuery = {
          'siteDetails.area': {
            $gte: siteArea * 0.8,
            $lte: siteArea * 1.2
          },
          expectedPrice: {
            $gte: sitePrice * 0.7,
            $lte: sitePrice * 1.3
          }
        };
        
        console.log('🏞️ Site filters:', {
          area: `${siteArea * 0.8} to ${siteArea * 1.2} sqft`,
          price: `${sitePrice * 0.7} to ${sitePrice * 1.3}`
        });
        break;
        
      case 'Resort':
        const resortType = currentProperty.resortDetails?.resortType;
        const resortRooms = currentProperty.resortDetails?.rooms || 10;
        const resortPrice = currentProperty.expectedPrice;
        
        typeSpecificQuery = {
          expectedPrice: {
            $gte: resortPrice * 0.6,
            $lte: resortPrice * 1.4
          }
        };
        
        // Add resort type filter if available
        if (resortType) {
          typeSpecificQuery['resortDetails.resortType'] = resortType;
        }
        
        // Add rooms range filter
        typeSpecificQuery['resortDetails.rooms'] = {
          $gte: Math.max(1, resortRooms - 5),
          $lte: resortRooms + 5
        };
        
        console.log('🏨 Resort filters:', {
          type: resortType,
          rooms: `${resortRooms - 5} to ${resortRooms + 5}`,
          price: `${resortPrice * 0.6} to ${resortPrice * 1.4}`
        });
        break;
        
      case 'Commercial':
        const subType = currentProperty.commercialDetails?.subType;
        const commercialPrice = currentProperty.expectedPrice;
        
        // MUST match subType exactly
        typeSpecificQuery = {
          'commercialDetails.subType': subType,
          expectedPrice: {
            $gte: commercialPrice * 0.7,
            $lte: commercialPrice * 1.3
          }
        };
        
        // Add subType-specific filters
        if (subType === 'Office' && currentProperty.commercialDetails?.officeDetails) {
          const carpetArea = currentProperty.commercialDetails.officeDetails.carpetArea || 1000;
          typeSpecificQuery['commercialDetails.officeDetails.carpetArea'] = {
            $gte: carpetArea * 0.8,
            $lte: carpetArea * 1.2
          };
        } else if (subType === 'Retail' && currentProperty.commercialDetails?.retailDetails) {
          const carpetArea = currentProperty.commercialDetails.retailDetails.carpetArea || 500;
          typeSpecificQuery['commercialDetails.retailDetails.carpetArea'] = {
            $gte: carpetArea * 0.8,
            $lte: carpetArea * 1.2
          };
        } else if (subType === 'Plot/Land' && currentProperty.commercialDetails?.plotDetails) {
          const area = currentProperty.commercialDetails.plotDetails.area || 1000;
          typeSpecificQuery['commercialDetails.plotDetails.area'] = {
            $gte: area * 0.8,
            $lte: area * 1.2
          };
        }
        
        console.log('🏢 Commercial filters:', {
          subType,
          price: `${commercialPrice * 0.7} to ${commercialPrice * 1.3}`
        });
        break;
    }
    
    // Combine base query with type-specific query
    const finalQuery = { ...baseQuery, ...typeSpecificQuery };
    
    console.log('🔎 Final query:', JSON.stringify(finalQuery, null, 2));
    
    // Find similar properties
    let similarProperties = await Property.find(finalQuery)
      .sort(sortCriteria)
      .limit(5)
      .select('propertyTitle location area areaKey expectedPrice images propertyType houseDetails siteDetails resortDetails commercialDetails')
      .lean();
    
    console.log(`✅ Found ${similarProperties.length} similar properties`);
    
    // If less than 2 properties found in same area, try without area restriction
   console.log(`✅ Found ${similarProperties.length} similar properties`);

// If less than 3 properties found in same area, try without area restriction
if (similarProperties.length < 3) {
  console.log('⚠️ Less than 3 properties found, removing area restriction...');
  
  const fallbackQuery = {
    _id: { $ne: propertyId },
    status: 'approved',
    propertyType: currentProperty.propertyType,
    ...typeSpecificQuery
  };
  
  // Don't fetch if we already have some properties
  const remainingSlots = 5 - similarProperties.length;
  
  if (remainingSlots > 0) {
    const fallbackProperties = await Property.find(fallbackQuery)
      .sort(sortCriteria)
      .limit(remainingSlots)
      .select('propertyTitle location area areaKey expectedPrice images propertyType houseDetails siteDetails resortDetails commercialDetails')
      .lean();
    
    // Combine existing properties with fallback properties
    similarProperties = [...similarProperties, ...fallbackProperties];
    
    console.log(`✅ After fallback: ${similarProperties.length} properties total`);
  }
}

// If still no properties, try to get ANY properties of same type (last resort)
if (similarProperties.length === 0) {
  console.log('⚠️ No properties found with filters, getting latest properties of same type...');
  
  similarProperties = await Property.find({
    _id: { $ne: propertyId },
    status: 'approved',
    propertyType: currentProperty.propertyType
  })
    .sort(sortCriteria)
    .limit(5)
    .select('propertyTitle location area areaKey expectedPrice images propertyType houseDetails siteDetails resortDetails commercialDetails')
    .lean();
  
  console.log(`✅ Last resort found ${similarProperties.length} properties`);
}
    
    res.status(200).json({
      success: true,
      data: similarProperties,
      count: similarProperties.length
    });
    
  } catch (error) {
    console.error('❌ Get similar properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch similar properties',
      error: error.message
    });
  }
};