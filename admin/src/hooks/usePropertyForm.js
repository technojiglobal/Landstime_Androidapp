// // admin/src/hooks/usePropertyForm.js
// import { useState } from 'react';

// const usePropertyForm = () => {
//   const [formData, setFormData] = useState({
//     // Common top-level fields
//     location: '',
//     description: '',
//     ownerName: '',
//     mobileNumber: '',
//     email: '',
//     expectedPrice: '',
//     priceDetails: {
//       allInclusive: false,
//       negotiable: false,
//       taxExcluded: false
//     },

//     // House/Flat specific fields
//     houseDetails: {
//       floors: '',
//       area: '',
//       areaUnit: 'sqft',
//       bedrooms: '',
//       bathrooms: '',
//       balconies: '',
//       floorDetails: '',
//       availabilityStatus: 'Ready to Move',
//       ageOfProperty: '',
//       ownership: '',
//       possessionBy: '',
//       otherRooms: [],
//       furnishing: 'Unfurnished',
//       furnishingItems: [],
//       parking: {
//         covered: 0,
//         open: 0
//       },
//       vaasthuDetails: {
//         houseFacing: '',
//         masterBedroom: '',
//         childrenBedroom: '',
//         livingRoom: '',
//         kitchenRoom: '',
//         poojaRoom: '',
//         balcony: ''
//       }
//     },

//     // Site/Plot specific fields
//     siteDetails: {
//       area: '',
//       areaUnit: 'sqft',
//       length: '',
//       breadth: '',
//       floorsAllowed: '',
//       boundaryWall: false,
//       openSides: '',
//       roadWidth: '',
//       roadWidthUnit: 'ft',
//       constructionDone: false,
//       constructionType: [],
//       possessionBy: '',
//       ownership: 'Freehold',
//       approvedBy: [],
//       amenities: [],
//       propertyFacing: '',
//       overlooking: [],
//       inGatedSociety: false,
//       cornerProperty: false,
//       locationAdvantages: [],
//       vaasthuDetails: {
//         plotFacing: '',
//         mainEntryDirection: '',
//         plotSlope: '',
//         openSpace: '',
//         plotShape: '',
//         roadPosition: '',
//         waterSource: '',
//         drainageDirection: '',
//         compoundWallHeight: '',
//         existingStructures: ''
//       }
//     },

//     // Resort specific fields
//     resortDetails: {
//       resortType: '',
//       rooms: '',
//       landArea: '',
//       floors: '',
//       buildArea: '',
//       expectedPrice: '',
//       priceDetails: {
//         allInclusive: false,
//         negotiable: false,
//         taxExcluded: false
//       },
//       locationAdvantages: [],
//       vaasthuDetails: {
//         propertyFacing: '',
//         entranceDirection: '',
//         receptionAreaFacing: '',
//         mainLobbyDirection: '',
//         masterSuitroom: '',
//         guestRoom: '',
//         restaurantDirection: '',
//         vipSuite: '',
//         conferenceDirection: '',
//         spaRoom: '',
//         swimmingPool: '',
//         yoga: '',
//         kitchenRoom: '',
//         poojaRoom: '',
//         office: '',
//         recreation: '',
//         balcony: '',
//         garden: ''
//       }
//     },

//     // Commercial fields - ✅ CRITICAL: All must use vaasthuDetails (double 'a', not vastuDetails or vassthuDetails)
//     commercialDetails: {
//       subType: '',
//       officeDetails: { vaasthuDetails: {} },
//       retailDetails: { vaasthuDetails: {} },
//       plotDetails: { vaasthuDetails: {} },
//       industryDetails: { vaasthuDetails: {} },
//       storageDetails: { vaasthuDetails: {} },
//       hospitalityDetails: { vaasthuDetails: {} },
//       otherDetails: { vaasthuDetails: {} }
//     },

//     // Vastu details (top-level for backward compatibility)
//     vaasthuDetails: {}
//   });

//   // Enhanced updateField to handle nested paths
//   const updateField = (path, value) => {
//     setFormData(prev => {
//       // Handle simple top-level updates
//       if (!path.includes('.')) {
//         return { ...prev, [path]: value };
//       }

//       // Handle nested paths like 'houseDetails.bedrooms' or 'houseDetails.vaasthuDetails.houseFacing'
//       const keys = path.split('.');
//       const newData = { ...prev };
//       let current = newData;

//       // Navigate to the parent object
//       for (let i = 0; i < keys.length - 1; i++) {
//         // Create the nested object if it doesn't exist
//         if (!current[keys[i]]) {
//           current[keys[i]] = {};
//         } else {
//           // Clone the object to avoid mutation
//           current[keys[i]] = { ...current[keys[i]] };
//         }
//         current = current[keys[i]];
//       }

//       // Set the final value
//       current[keys[keys.length - 1]] = value;

//       return newData;
//     });
//   };

//   const resetForm = () => {
//     setFormData({
//       location: '',
//       description: '',
//       ownerName: '',
//       mobileNumber: '',
//       email: '',
//       expectedPrice: '',
//       priceDetails: {
//         allInclusive: false,
//         negotiable: false,
//         taxExcluded: false
//       },
//       houseDetails: {
//         floors: '',
//         area: '',
//         areaUnit: 'sqft',
//         bedrooms: '',
//         bathrooms: '',
//         balconies: '',
//         floorDetails: '',
//         availabilityStatus: 'Ready to Move',
//         ageOfProperty: '',
//         ownership: '',
//         possessionBy: '',
//         otherRooms: [],
//         furnishing: '',
//         furnishingItems: [],
//         parking: {
//           covered: 0,
//           open: 0
//         },
//         vaasthuDetails: {}
//       },
//       siteDetails: {
//         area: '',
//         areaUnit: 'sqft',
//         length: '',
//         breadth: '',
//         floorsAllowed: '',
//         boundaryWall: false,
//         openSides: '',
//         roadWidth: '',
//         roadWidthUnit: 'ft',
//         constructionDone: false,
//         constructionType: [],
//         possessionBy: '',
//         ownership: 'Freehold',
//         approvedBy: [],
//         amenities: [],
//         propertyFacing: '',
//         overlooking: [],
//         inGatedSociety: false,
//         cornerProperty: false,
//         locationAdvantages: [],
//         vaasthuDetails: {}
//       },
//       resortDetails: {
//         resortType: '',
//         rooms: '',
//         landArea: '',
//         floors: '',
//         buildArea: '',
//         expectedPrice: '',
//         priceDetails: {
//           allInclusive: false,
//           negotiable: false,
//           taxExcluded: false
//         },
//         locationAdvantages: [],
//         vaasthuDetails: {}
//       },
//       // ✅ CRITICAL: All must use vaasthuDetails (double 'a', not vastuDetails or vassthuDetails)
//       commercialDetails: {
//         subType: '',
//         officeDetails: { vaasthuDetails: {} },
//         retailDetails: { vaasthuDetails: {} },
//         plotDetails: { vaasthuDetails: {} },
//         industryDetails: { vaasthuDetails: {} },
//         storageDetails: { vaasthuDetails: {} },
//         hospitalityDetails: { vaasthuDetails: {} },
//         otherDetails: { vaasthuDetails: {} }
//       },
//       vaasthuDetails: {}
//     });
//   };

//   return { formData, updateField, resetForm };
// };

// export default usePropertyForm;
// admin/src/hooks/usePropertyForm.js
import { useState } from 'react';

const usePropertyForm = () => {
  const [formData, setFormData] = useState({
    // Common top-level fields
    location: '',
    description: '',
    ownerName: '',
    mobileNumber: '',
    email: '',
    expectedPrice: '',
    priceDetails: {
      allInclusive: false,
      negotiable: false,
      taxExcluded: false
    },

    // House/Flat specific fields
    houseDetails: {
      floors: '',
      area: '',
      areaUnit: 'sqft',
      bedrooms: '',
      bathrooms: '',
      balconies: '',
      floorDetails: '',
      availabilityStatus: 'Ready to Move',
      ageOfProperty: '',
      ownership: '',
      possessionBy: '',
      otherRooms: [],
      furnishing: 'Unfurnished',
      furnishingItems: [],
      parking: {
        covered: 0,
        open: 0
      },
      vaasthuDetails: {
        houseFacing: '',
        masterBedroom: '',
        childrenBedroom: '',
        livingRoom: '',
        kitchenRoom: '',
        poojaRoom: '',
        balcony: ''
      }
    },

    // Site/Plot specific fields
    siteDetails: {
      area: '',
      areaUnit: 'sqft',
      length: '',
      breadth: '',
      floorsAllowed: '',
      boundaryWall: false,
      openSides: '',
      roadWidth: '',
      roadWidthUnit: 'ft',
      constructionDone: false,
      constructionType: [],
      possessionBy: '',
      ownership: 'Freehold',
      approvedBy: [],
      amenities: [],
      propertyFacing: '',
      overlooking: [],
      inGatedSociety: false,
      cornerProperty: false,
      locationAdvantages: [],
      vaasthuDetails: {
        plotFacing: '',
        mainEntryDirection: '',
        plotSlope: '',
        openSpace: '',
        plotShape: '',
        roadPosition: '',
        waterSource: '',
        drainageDirection: '',
        compoundWallHeight: '',
        existingStructures: ''
      }
    },

    // Resort specific fields
    resortDetails: {
      resortType: '',
      rooms: '',
      landArea: '',
      floors: '',
      buildArea: '',
      expectedPrice: '',
      priceDetails: {
        allInclusive: false,
        negotiable: false,
        taxExcluded: false
      },
      locationAdvantages: [],
      vaasthuDetails: {
        propertyFacing: '',
        entranceDirection: '',
        receptionAreaFacing: '',
        mainLobbyDirection: '',
        masterSuitroom: '',
        guestRoom: '',
        restaurantDirection: '',
        vipSuite: '',
        conferenceDirection: '',
        spaRoom: '',
        swimmingPool: '',
        yoga: '',
        kitchenRoom: '',
        poojaRoom: '',
        office: '',
        recreation: '',
        balcony: '',
        garden: ''
      }
    },

    // Commercial fields - ✅ CRITICAL: All must use vaasthuDetails (double 'a', not vastuDetails or vassthuDetails)
    commercialDetails: {
      subType: '',
      officeDetails: { vaasthuDetails: {} },
      retailDetails: { vaasthuDetails: {} },
      plotDetails: { vaasthuDetails: {} },
industryDetails: { 
  plotArea: '',
  carpetAreaUnit: 'sqft',
  noOfWashrooms: '',
  availabilityStatus: 'Ready to move',
  ageOfProperty: '',
  possessionBy: '',
  ownershipType: '',
  approvedBy: '',
  approvedIndustryType: '',
  expectedPrice: '',
  pricing: {
    allInclusive: false,
    negotiable: false,
    taxExcluded: false
  },
  preLeased: 'No',
  currentRent: '',
  leaseTenure: '',
  description: '',
  amenities: [],
  locationAdvantages: [],
  wheelchairFriendly: false,
  vaasthuDetails: {
    industryFacing: '',
    mainEntranceDirection: '',
    machineryDirection: '',
    productionAreaDirection: '',
    storageDirection: '',
    finishedGoodsDirection: '',
    officeAreaDirection: '',
    washroomDirection: '',
    electricityDirection: '',
    waterSourceDirection: '',
    wasteAreaDirection: '',
    staircaseDirection: ''
  }
},
      storageDetails: { vaasthuDetails: {} },
      hospitalityDetails: { vaasthuDetails: {} },
      otherDetails: { vaasthuDetails: {} }
    },

    // Vastu details (top-level for backward compatibility)
    vaasthuDetails: {}
  });

  // Enhanced updateField to handle nested paths
  const updateField = (path, value) => {
    setFormData(prev => {
      // Handle simple top-level updates
      if (!path.includes('.')) {
        return { ...prev, [path]: value };
      }

      // Handle nested paths like 'houseDetails.bedrooms' or 'houseDetails.vaasthuDetails.houseFacing'
      const keys = path.split('.');
      const newData = { ...prev };
      let current = newData;

      // Navigate to the parent object
      for (let i = 0; i < keys.length - 1; i++) {
        // Create the nested object if it doesn't exist
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        } else {
          // Clone the object to avoid mutation
          current[keys[i]] = { ...current[keys[i]] };
        }
        current = current[keys[i]];
      }

      // Set the final value
      current[keys[keys.length - 1]] = value;

      return newData;
    });
  };

  const resetForm = () => {
    setFormData({
      location: '',
      description: '',
      ownerName: '',
      mobileNumber: '',
      email: '',
      expectedPrice: '',
      priceDetails: {
        allInclusive: false,
        negotiable: false,
        taxExcluded: false
      },
      houseDetails: {
        floors: '',
        area: '',
        areaUnit: 'sqft',
        bedrooms: '',
        bathrooms: '',
        balconies: '',
        floorDetails: '',
        availabilityStatus: 'Ready to Move',
        ageOfProperty: '',
        ownership: '',
        possessionBy: '',
        otherRooms: [],
        furnishing: '',
        furnishingItems: [],
        parking: {
          covered: 0,
          open: 0
        },
        vaasthuDetails: {}
      },
      siteDetails: {
        area: '',
        areaUnit: 'sqft',
        length: '',
        breadth: '',
        floorsAllowed: '',
        boundaryWall: false,
        openSides: '',
        roadWidth: '',
        roadWidthUnit: 'ft',
        constructionDone: false,
        constructionType: [],
        possessionBy: '',
        ownership: 'Freehold',
        approvedBy: [],
        amenities: [],
        propertyFacing: '',
        overlooking: [],
        inGatedSociety: false,
        cornerProperty: false,
        locationAdvantages: [],
        vaasthuDetails: {}
      },
      resortDetails: {
        resortType: '',
        rooms: '',
        landArea: '',
        floors: '',
        buildArea: '',
        expectedPrice: '',
        priceDetails: {
          allInclusive: false,
          negotiable: false,
          taxExcluded: false
        },
        locationAdvantages: [],
        vaasthuDetails: {}
      },
      // ✅ CRITICAL: All must use vaasthuDetails (double 'a', not vastuDetails or vassthuDetails)
      commercialDetails: {
        subType: '',
        officeDetails: { vaasthuDetails: {} },
        retailDetails: { vaasthuDetails: {} },
        plotDetails: { vaasthuDetails: {} },
industryDetails: { 
  plotArea: '',
  carpetAreaUnit: 'sqft',
  noOfWashrooms: '',
  availabilityStatus: 'Ready to move',
  ageOfProperty: '',
  possessionBy: '',
  ownershipType: '',
  approvedBy: '',
  approvedIndustryType: '',
  expectedPrice: '',
  pricing: {
    allInclusive: false,
    negotiable: false,
    taxExcluded: false
  },
  preLeased: 'No',
  currentRent: '',
  leaseTenure: '',
  description: '',
  amenities: [],
  locationAdvantages: [],
  wheelchairFriendly: false,
  vaasthuDetails: {
    industryFacing: '',
    mainEntranceDirection: '',
    machineryDirection: '',
    productionAreaDirection: '',
    storageDirection: '',
    finishedGoodsDirection: '',
    officeAreaDirection: '',
    washroomDirection: '',
    electricityDirection: '',
    waterSourceDirection: '',
    wasteAreaDirection: '',
    staircaseDirection: ''
  }
},
        storageDetails: { vaasthuDetails: {} },
        hospitalityDetails: { vaasthuDetails: {} },
        otherDetails: { vaasthuDetails: {} }
      },
      vaasthuDetails: {}
    });
  };

  return { formData, updateField, resetForm };
};

export default usePropertyForm;