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
  te: { type: String, trim: true },
  hi: { type: String, trim: true },
  en: { type: String, trim: true }
},
  images: [{
    type: String // URLs of uploaded images
  }],
  documents: {
  ownership: [String], // Sale deed, conveyance
  identity: [String]   // PAN, Aadhaar, etc
},
ownerDetails: {
  name: {
    type: String,
    required: [true, "Owner name is required"],
    trim: true,
  },
  // ✅ NEW CODE - Add this new field
originalLanguage: {
  type: String,
  enum: ['te', 'hi', 'en'],
  default: 'en'
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

  location: {
  te: { type: String, trim: true },
  hi: { type: String, trim: true },
  en: { type: String, trim: true }
},
area: {
  te: { type: String, trim: true },
  hi: { type: String, trim: true },
  en: { type: String, trim: true }
},


  // ✅ NEW CODE
description: {
  te: { type: String },
  hi: { type: String },
  en: { type: String }
},
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
    
    // Office specific
   officeDetails: {
  /* -------- BASIC (OPTIONAL) -------- */
  officeKind: {
    type: String,          // IT / Co-working / Business Center / etc
    default: null,
  },

  /* -------- REQUIRED -------- */
  location: {
    type: String,
    required: false,
    trim: true,
  },

  area: {
    type: Number,
    required: false,
  },

  /* -------- LOCATION INFO (OPTIONAL) -------- */
  locatedInside: {
    type: String,
    default: null,
  },

  zoneType: {
    type: String,
    default: null,
  },

  /* -------- AREA DETAILS (OPTIONAL) -------- */
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

  /* -------- OFFICE SETUP (OPTIONAL) -------- */
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
    type: String,          // "1", "2", "3", "4+"
    default: null,
  },

  /* -------- WASHROOMS (OPTIONAL) -------- */
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

  /* -------- FEATURES (OPTIONAL) -------- */
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

  /* -------- FLOORS & LIFTS (OPTIONAL) -------- */
  totalFloors: {
    type: Number,
    default: null,
  },

  staircases: {
    type: String,
    default: null,
  },

  lift: {
    type: String,          // "Available" | "Not-Available"
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

  /* -------- PARKING (OPTIONAL, FIXED) -------- */
  parking: {
    parkingType: {
      type: String,        // "Available" | "Not-Available"
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

  /* -------- AVAILABILITY (OPTIONAL) -------- */
  availability: {
    type: String,          // "Ready" | "UnderConstruction"
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
    type: String,          // Freehold / Leasehold / etc
    default: null,
  },
},


    
    // Plot/Land specific for commercial
    plotDetails: {
      plotType: String,
      // Add plot specific fields
    },
    
    // Industry specific
    industryDetails: {
      // Add industry specific fields
    },
    
    // Storage specific
    storageDetails: {
      // Add storage specific fields
    },
    
    // Hospitality specific
    hospitalityDetails: {
      // Add hospitality specific fields
    },
    
    // Other specific
    otherDetails: {
      // Add other specific fields
    }
  },
  
  // Resort specific fields
  resortDetails: {
    // Add resort specific fields
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

// NEW CODE at the end
const Property = mongoose.model('Property', propertySchema);
export default Property;