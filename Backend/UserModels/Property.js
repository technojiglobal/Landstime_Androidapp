// Backend/models/Property.js
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  // Common fields for all property types
  propertyType: {
    type: String,
    enum: ['House', 'Site/Plot/Land', 'Commercial', 'Resort'],
    required: true
  },
  propertyTitle: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String // Base64 encoded images
  }],
  documents: {
    ownership: [String], // Base64 encoded documents
    identity: [String]   // Base64 encoded documents
  },
  ownerDetails: {
    name: {
      type: String,
      required: [true, "Owner name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Owner phone is required"],
    },
    email: {
      type: String,
      required: [true, "Owner email is required"],
      lowercase: true,
    },
  },

 
  description: String,
  expectedPrice: {
    type: Number,
    required: true
  },
  priceDetails: {
    allInclusive: { type: Boolean, default: false },
    negotiable: { type: Boolean, default: false },
    taxExcluded: { type: Boolean, default: false }
  },
  
  // Status for admin approval
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: String,
  
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Admin soft delete
  adminDeletedStatus: {
    type: String,
    enum: ['active', 'deleted'],
    default: 'active'
  },
  
  // Property availability status
  propertyStatus: {
    type: String,
    enum: ['Available', 'Sold'],
    default: 'Available'
  },

   
  // House specific fields
  houseDetails: {
    floors: Number,
    area: Number,
    areaUnit: { type: String, default: 'sqft' },
    bedrooms: Number,
    bathrooms: Number,
    balconies: Number,
    floorDetails: String,
    availabilityStatus: {
      type: String,
      enum: ['Ready to Move', 'Under Construction']
    },
    ageOfProperty: String,
    ownership: String,
    possessionBy: String,
    otherRooms: [String],
    furnishing: {
      type: String,
      enum: ['Furnished', 'Semi-furnished', 'Unfurnished']
    },
    furnishingItems: [String],
    parking: {
      covered: { type: Number, default: 0 },
      open: { type: Number, default: 0 }
    },
    vaasthuDetails: {
      houseFacing: String,
      masterBedroom: String,
      childrenBedroom: String,
      livingRoom: String,
      kitchenRoom: String,
      poojaRoom: String,
      balcony: String
    }
  },
  
  // Site/Plot/Land specific fields
  siteDetails: {
    area: Number,
    areaUnit: { type: String, default: 'sqft' },
    length: Number,
    breadth: Number,
    floorsAllowed: Number,
    boundaryWall: String,
    openSides: String,
    constructionDone: String,
    constructionType: [String],
    possessionBy: String,
    ownership: [String],
    approvedBy: [String],
    amenities: [String],
    overlooking: [String],
    overlookingAdditional: [String],
    propertyFacing: [String],
    roadWidth: Number,
    roadWidthUnit: String,
    locationAdvantages: [String],
    inGatedSociety: Boolean,
    cornerProperty: Boolean
  },
  
  // Commercial specific fields
  commercialDetails: {
    subType: {
      type: String,
      enum: ['Office', 'Retail', 'Plot/Land', 'Storage', 'Industry', 'Hospitality', 'Other']
    },
    
    // Office specific - REMOVED required: true from schema level
    officeDetails: {
      officeKind: {
        type: String,
        default: null,
      },

      location: {
        type: String,
        // Required validation handled in controller, not schema
        trim: true,
        default: null
      },

      area: {
        type: Number,
        // Required validation handled in controller, not schema
        default: null
      },

      locatedInside: {
        type: String,
        default: null,
      },

      zoneType: {
        type: String,
        default: null,
      },

      areaUnit: {
        type: String,
        default: "sqft",
      },

      carpetArea: {
        type: Number,
        default: null,
      },

      carpetAreaUnit: {
        type: String,
        default: "sqft",
      },

      cabins: {
        type: Number,
        default: null,
      },

      meetingRooms: {
        type: Number,
        default: null,
      },

      seats: {
        type: Number,
        default: null,
      },

      maxSeats: {
        type: Number,
        default: null,
      },

      conferenceRooms: {
        type: String,
        default: null,
      },

      washrooms: {
        public: {
          type: Number,
          default: null,
        },
        private: {
          type: Number,
          default: null,
        },
      },

      receptionArea: {
        type: Boolean,
        default: false,
      },

      furnishing: {
        type: Boolean,
        default: false,
      },

      additionalFeatures: {
        type: [String],
        default: [],
      },

      fireSafetyMeasures: {
        type: [String],
        default: [],
      },

      totalFloors: {
        type: Number,
        default: null,
      },

      staircases: {
        type: String,
        default: null,
      },

      lift: {
        type: String,
        default: null,
      },

      passengerLifts: {
        type: Number,
        default: null,
      },

      serviceLifts: {
        type: Number,
        default: null,
      },

      parking: {
        parkingType: {
          type: String,
          default: null,
        },
        options: {
          basement: { type: Boolean, default: false },
          outside: { type: Boolean, default: false },
          private: { type: Boolean, default: false },
        },
        count: {
          type: Number,
          default: null,
        },
      },

      availability: {
        type: String,
        default: null,
      },

      ageOfProperty: {
        type: String,
        default: null,
      },

      possessionBy: {
        type: String,
        default: null,
      },

      ownership: {
        type: String,
        default: null,
      },
    },

    // Retail specific
    retailDetails: {
      shopType: String,
      area: Number,
      areaUnit: { type: String, default: 'sqft' },
      floors: Number,
      washrooms: Number,
      parking: {
        available: Boolean,
        count: Number
      },
      frontage: Number,
      ceilingHeight: Number,
      entrances: Number,
      cornerShop: Boolean,
      mainRoadFacing: Boolean,
      furnishing: String,
      availability: String,
      ageOfProperty: String,
      ownership: String
    },
    
    // Plot/Land specific for commercial
    plotDetails: {
      plotType: String,
      area: Number,
      areaUnit: { type: String, default: 'sqft' },
      length: Number,
      breadth: Number,
      boundaryWall: String,
      cornerPlot: Boolean,
      approvedBy: [String],
      zoneType: String,
      floorsAllowed: Number,
      roadWidth: Number,
      roadWidthUnit: String,
      openSides: String
    },

    locality: String,

    area: {
      type: Number,
      required: function () {
        return this.commercialDetails?.subType === "Plot/Land";
      },
    },

    areaUnit: { type: String, default: "sqft" },

    dimensions: {
      length: Number,
      breadth: Number,
    },

    roadWidth: Number,
    roadWidthUnit: { type: String, default: "ft" },

    openSides: String,

    constructionDone: String,
    constructionTypes: [String],

    possession: {
      year: String,
      month: String,
    },

    ownership: String,
    authority: String,

    amenities: [String],
    locationAdvantages: [String],

    cornerProperty: Boolean,
  },
   pricingExtras: {
  ownership: { type: String, default: null },
  authority: { type: String, default: null },

  preLeased: { type: String, enum: ["Yes", "No"], default: null },
  leaseDuration: { type: String, default: null },
  monthlyRent: { type: Number, default: null },

  cornerProperty: { type: Boolean, default: false },

  amenities: { type: [String], default: [] },
  locationAdvantages: { type: [String], default: [] },
},

    // Industry specific
    industryDetails: {
      industryType: String,
      area: Number,
      areaUnit: { type: String, default: 'sqft' },
      buildingType: String,
      powerLoad: Number,
      ceilingHeight: Number,
      flooring: String,
      waterAvailability: String,
      drainage: Boolean,
      fireNOC: Boolean,
      pollutionClearance: Boolean
    },
    trim: true,
  },

  area: {
    value: {
      type: Number,
      required: function () {
        return this.commercialDetails?.subType === "Industry";
      },
    },
    unit: {
      type: String,
      enum: ["sqft", "sqm", "acre"],
      default: "sqft",
    },
  },

  /* ---------------- WASHROOM ---------------- */
  washroomType: {
    type: String, // None | Shared | 1 | 2 | 3 | 4+
    default: null,
  },

  /* ---------------- AVAILABILITY ---------------- */
  availability: {
    type: String, // Ready | UnderConstruction
    default: null,
  },

  ageOfProperty: {
    type: String, // 0-1, 1-5, 5-10, 10+ years
    default: null,
  },

  possessionBy: {
    type: String, // Immediate | By 2026 etc
    default: null,
  },

  /* ---------------- APPROVAL DETAILS ---------------- */
  ownership: {
    type: String, // Freehold | Leasehold | Company Owned
    default: null,
  },

  approvedBy: {
    type: String, // Local Authority
    default: null,
  },

  approvedIndustryType: {
    type: String, // Textile / Pharma / IT / etc
    default: null,
  },

  /* ---------------- PRICE ---------------- */
  pricing: {
    expectedPrice: {
      type: Number,
      required: true,
    },

    allInclusive: {
      type: Boolean,
      default: false,
    },

    negotiable: {
      type: Boolean,
      default: false,
    },

    taxExcluded: {
      type: Boolean,
      default: false,
    },

    preLeased: {
      type: String, // Yes | No
      default: null,
    },

    leaseDuration: {
      type: String, // years
      default: null,
    },

    monthlyRent: {
      type: Number,
      default: null,
    },
  },

  /* ---------------- DESCRIPTION ---------------- */
  description: {
    type: String,
    required: true,
  },

  /* ---------------- FEATURES ---------------- */
  amenities: {
    type: [String],
    default: [],
  },

  wheelchairFriendly: {
    type: Boolean,
    default: false,
  },

  locationAdvantages: {
    type: [String],
    default: [],
  },

  /* ---------------- VAASTU DETAILS ---------------- */
  vastuDetails: {
    buildingFacing: String,
    entrance: String,
    machinery: String,
    production: String,
    rawMaterial: String,
    finishedGoods: String,
    office: String,
    electrical: String,
    water: String,
    waste: String,
    washroom: String,
  },
},

    
    // Storage specific
    storageDetails: {
      storageType: String,
      area: Number,
      areaUnit: { type: String, default: 'sqft' },
      covered: Boolean,
      ceilingHeight: Number,
      flooring: String,
      ventilation: String,
      security: [String],
      temperatureControl: Boolean,
      accessibility: String
    },
    unit: {
      type: String,
      enum: ["sqft", "sqm"],
      default: "sqft",
    },
  },

  // Height of storage (important for warehouses)
  ceilingHeight: {
    type: Number, // in feet
  },

  // Infrastructure features
  loadingDock: {
    type: Boolean,
    default: false,
  },

  unloadingDock: {
    type: Boolean,
    default: false,
  },

  powerBackup: {
    type: Boolean,
    default: false,
  },

  fireSafety: {
    type: Boolean,
    default: false,
  },

  // Accessibility
  truckAccess: {
    type: Boolean,
    default: false,
  },

  containerAccess: {
    type: Boolean,
    default: false,
  },

  // Flooring details
  flooringType: {
    type: String,
    enum: ["Concrete", "VDF", "Epoxy", "Normal"],
  },

  // Temperature control (for cold storage)
  temperatureControlled: {
    type: Boolean,
    default: false,
  },

  // Extra notes
  remarks: {
    type: String,
  },
},

    
    // Hospitality specific
    hospitalityDetails: {
      hospitalityType: String,
      area: Number,
      areaUnit: { type: String, default: 'sqft' },
      rooms: Number,
      halls: Number,
      kitchens: Number,
      parking: Number,
      starRating: Number,
      licensesAvailable: [String]
    },
    trim: true,
  },

  rooms: {
    type: Number,
    default: null,
  },

  washroomType: {
    type: String, // None | Shared | 1 | 2 | 3 | 4+
    default: null,
  },

  balconies: {
    type: String, // 0 | 1 | 2 | 3 | More than 3
    default: null,
  },

  otherRooms: {
    type: [String],
    default: [],
  },

  furnishingType: {
    type: String,
    enum: ["Unfurnished", "Semi-furnished", "Furnished"],
    default: "Unfurnished",
  },

  furnishingDetails: {
    type: [String],
    default: [],
  },

  area: {
    type: Number,
    required: function () {
      return this.commercialDetails?.subType === "Hospitality";
    },
  },

  areaUnit: {
    type: String,
    default: "sqft",
  },

  availability: {
    type: String, // Ready | UnderConstruction
    default: null,
  },

  ageOfProperty: {
    type: String, // 0-1 years, 1-5 years etc
    default: null,
  },

  possessionBy: {
    type: String,
    default: null,
  },

  expectedMonth: {
    type: String,
    default: null,
  },
},
hospitalityVastu: {
  buildingFacing: String,
  entrance: String,
  reception: String,
  adminOffice: String,
  guestRooms: String,
  banquet: String,
  kitchen: String,
  dining: String,
  cashCounter: String,
  electrical: String,
  waterStructure: String,
  washroom: String,
  storage: String,
},

    
    // Other specific
    otherDetails: {
      description: String,
      area: Number,
      areaUnit: { type: String, default: 'sqft' },
      features: [String]
    }
  },
  
  // Resort specific fields
  resortDetails: {
    area: Number,
    areaUnit: String,
    rooms: Number,
    amenities: [String],
    // Add more resort fields as needed
  }
  
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Indexes for better query performance
propertySchema.index({ status: 1 });
propertySchema.index({ userId: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ 'commercialDetails.subType': 1 });

const Property = mongoose.model('Property', propertySchema);
export default Property;