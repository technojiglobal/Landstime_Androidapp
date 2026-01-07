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

areaKey: {
  type: String,
  lowercase: true,
  trim: true,
  index: true  // Add index for faster queries
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

   // Site / Plot / Land specific fields
siteDetails: {
  /* ---------- AREA & DIMENSIONS ---------- */
  area: {
    type: Number,
    required: function () {
       return this.propertyType === "Site/Plot/Land";
    },
  },

  areaUnit: {
    type: String,
    enum: ["sqft", "sqm", "acre"],
    default: "sqft",
  },

  length: {
    type: Number,
    required: function () {
       return this.propertyType === "Site/Plot/Land";
    },
  },

  breadth: {
    type: Number,
    required: function () {
       return this.propertyType === "Site/Plot/Land";
    },
  },

  floorsAllowed: {
    type: Number,
    default: 0,
  },

  /* ---------- BOUNDARY & ACCESS ---------- */
  boundaryWall: {
    type: Boolean,
    default: false,
  },

  openSides: {
    type: Number, // 1,2,3,3+
  },

  roadWidth: {
    type: Number,
  },

  roadWidthUnit: {
    type: String,
    enum: ["sqft", "sqm", "acre"],
    default: "sqft",
  },

  /* ---------- CONSTRUCTION ---------- */
  constructionDone: {
    type: Boolean,
    default: false,
  },

  constructionType: {
    type: [String], // Shed, Room, Washroom, Other
    default: [],
  },

  /* ---------- POSSESSION & OWNERSHIP ---------- */
  possessionBy: {
    type: String, // Immediate / 1-3 months / etc
  },

  ownership: {
    type: String,
    default: "Freehold",
  },

  approvedBy: {
    type: [String], // GHMC, HMDA, DTCP
    default: [],
  },

  /* ---------- FEATURES ---------- */
  amenities: {
    type: [String],
    default: [],
  },

  propertyFacing: {
    type: String,
  },

  overlooking: {
    type: [String], // park, pool, mainroad
    default: [],
  },

  inGatedSociety: {
    type: Boolean,
    default: false,
  },

  cornerProperty: {
    type: Boolean,
    default: false,
  },

  locationAdvantages: {
    type: [String],
    default: [],
  },

  /* ---------- VASTU DETAILS ---------- */
  vaasthuDetails: {
    plotFacing: String,
    mainEntryDirection: String,
    plotSlope: String,
    openSpace: String,
    plotShape: String,
    roadPosition: String,
    waterSource: String,
    drainageDirection: String,
    compoundWallHeight: String,
    existingStructures: String,
  },
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
 
  
  // Commercial specific fields
  commercialDetails: {
    subType: {
      type: String,
      enum: ['Office', 'Retail', 'Plot/Land', 'Storage', 'Industry', 'Hospitality', 'Other']
    },
officeDetails: {
  officeKind: String,
  propertyTitle: String,
  
  location: String,
  locatedInside: String,
  zoneType: String,
  
  // ✅ CRITICAL: This must be here
  neighborhoodArea: String,
  
  carpetArea: Number,
  carpetAreaUnit: {
    type: String,
    enum: ["sqft", "sqm"],
    default: "sqft",
  },
  
  cabins: Number,
  meetingRooms: Number,
  seats: Number,
  maxSeats: Number,
  
  conferenceRooms: String,
  
  washrooms: {
    public: Number,
    private: Number,
  },
  
  receptionArea: Boolean,
  furnishing: Boolean,
  
  additionalFeatures: [String],
  fireSafetyMeasures: [String],
  
  totalFloors: Number,
  floorNo: Number,
  staircases: String,
  
  lift: String,
  passengerLifts: Number,
  serviceLifts: Number,
  
  // ✅ THIS IS THE CRITICAL FIX
  parking: {
    type: {
      type: String,
      enum: ["Available", "Not-Available"],
    },
    options: {
      basement: { type: Boolean, default: false },
      outside: { type: Boolean, default: false },
      private: { type: Boolean, default: false },
    },
    count: { type: Number, default: 0 },
  },
  
  availability: String,
  ageOfProperty: String,
  possessionBy: String,
  ownership: String,
  
  expectedPrice: Number,
  
  priceDetails: {
    allInclusive: { type: Boolean, default: false },
    negotiable: { type: Boolean, default: false },
    taxExcluded: { type: Boolean, default: false },
  },
  
  preLeased: String,
  leaseDuration: String,
  monthlyRent: Number,
  
  nocCertified: String,
  occupancyCertified: String,
  
  previouslyUsedFor: String,
  
  description: String,
  
  amenities: {
    type: [String],
    default: [],
  },
  
  locationAdvantages: {
    type: [String],
    default: [],
  },
  
  vaasthuDetails: {
    officeFacing: String,
    entrance: String,
    cabin: String,
    workstations: String,
    conference: String,
    reception: String,
    accounts: String,
    pantry: String,
    server: String,
    washrooms: String,
    staircase: String,
    storage: String,
    cashLocker: String,
  },
},

retailDetails: {
  /* ---------- LOCATION & AREA (MATCHING OFFICE STRUCTURE) ---------- */
  
  location: {
    type: String,
    required: function () {
      return this.commercialDetails?.subType === "Retail";
    },
  },

  locality: String, // ✅ NEW - City/locality

  neighborhoodArea: String, // ✅ CRITICAL - Area/Neighborhood (e.g., "Akkayapalem")

  // ✅ FIXED - Carpet area in sqft (separate from neighborhoodArea)
  carpetArea: {
    type: Number,
    required: function () {
      return this.commercialDetails?.subType === "Retail";
    },
  },

  carpetAreaUnit: {
    type: String,
    enum: ["sqft", "sqm"],
    default: "sqft",
  },

  /* ---------- SHOP FACADE SIZE ---------- */
  
  entranceWidth: Number, // ✅ NEW
  ceilingHeight: Number, // ✅ NEW

  /* ---------- FACILITIES ---------- */
  
  washroom: String, // ✅ NEW - "+Private Washrooms" / "+Public Washrooms" / "Not Available"

  floorDetails: String, // ✅ NEW - Total floors

  locatedNear: { // ✅ NEW
    type: [String],
    default: [],
  },

  parkingType: String, // ✅ NEW

  /* ---------- AVAILABILITY & AGE ---------- */
  
  availability: String, // "Ready to move" / "Under Construction"

  propertyAge: String, // ✅ RENAMED from ageOfProperty

  possession: { // ✅ NEW - For under construction
    year: String,
    month: String,
  },

  /* ---------- BUSINESS TYPES ---------- */
  
  suitableFor: { // ✅ NEW
    type: [String],
    default: [],
  },

  /* ---------- PRICING (FLATTENED STRUCTURE) ---------- */
  
  ownership: String, // ✅ MOVED from nested pricing

  expectedPrice: { // ✅ MOVED from nested pricing
    type: Number,
    required: function () {
      return this.commercialDetails?.subType === "Retail";
    },
  },

  priceDetails: { // ✅ RENAMED from pricing object
    allInclusive: { type: Boolean, default: false },
    negotiable: { type: Boolean, default: false },
    taxExcluded: { type: Boolean, default: false },
  },

  preLeased: String, // ✅ MOVED from nested pricing

  leaseDuration: String, // ✅ MOVED from nested pricing

  monthlyRent: Number, // ✅ MOVED from nested pricing

  /* ---------- PREVIOUS USE & DESCRIPTION ---------- */
  
  previouslyUsedFor: String, // ✅ NEW

  description: String, // ✅ NEW

  /* ---------- FEATURES ---------- */
  
  amenities: {
    type: [String],
    default: [],
  },

  locationAdvantages: {
    type: [String],
    default: [],
  },

  /* ---------- VAASTU DETAILS (MATCHING RetailVaastu.jsx) ---------- */
  
  vaastuDetails: { // ✅ FIXED - Double 'a' spelling
    shopFacing: String, // Matches "officeFacing" field in code
    entrance: String,
    cashCounter: String, // Matches "cabin" field in code
    cashLocker: String, // Matches "workstations" field in code
    ownerSeating: String, // Matches "conference" field in code
    staffSeating: String, // Matches "reception" field in code
    storage: String, // Matches "accounts" field in code
    displayArea: String, // Matches "pantry" field in code
    electrical: String, // Matches "server" field in code
    pantryArea: String, // Matches "washrooms" field in code (confusing naming)
    staircase: String,
    staircaseInside: String, // Matches "storage" field in code
  },
},


    
    // Plot/Land specific for commercial
    plotDetails: {
  plotType: {
    type: String, // Residential / Commercial / Industrial
  },

  location: {
    type: String,
    required: function () {
      return this.commercialDetails?.subType === "Plot/Land";
    },
    trim: true,
  },

  area: {
    type: Number,
    required: function () {
      return this.commercialDetails?.subType === "Plot/Land";
    },
  },

  areaUnit: {
    type: String,
    enum: ["sqft", "sqm", "acre"],
    default: "sqft",
  },

  dimensions: {
    length: Number,
    breadth: Number,
  },

  roadWidth: Number,
  roadWidthUnit: {
    type: String,
    default: "ft",
  },

  openSides: String,
  boundaryWall: String,
  floorsAllowed: Number,
  zoneType: String,

  constructionDone: String,
  constructionTypes: [String],

  possession: {
    year: String,
    month: String,
  },

  ownership: String,
  approvedBy: String,

  amenities: {
    type: [String],
    default: [],
  },

  locationAdvantages: {
    type: [String],
    default: [],
  },

  cornerProperty: {
    type: Boolean,
    default: false,
  },

  /* ✅ PLOT VASTU DETAILS */
  vastuDetails: {
    plotFacing: String,
    mainEntry: String,
    plotSlope: String,
    openSpace: String,
    shape: String,
    roadPosition: String,
    waterSource: String,
    drainage: String,
    compoundWall: String,
    structures: String,
  },
},

    
    // Industry specific
   industryDetails: {
  location: {
    type: String,
    required: function() {
      return this.commercialDetails.subType === 'Industry';
    },
  },

  area: {
    value: {
      type: Number,
      required: function() {
        return this.commercialDetails.subType === 'Industry';
      },
    },
    unit: {
      type: String,
      enum: ["sqft", "sqm", "acre"],
      default: "sqft",
    },
  },

  washroomType: String,
  availability: String,
  ageOfProperty: String,
  possessionBy: String,

  pricing: {
    ownership: String,
    expectedPrice: {
      type: Number,
      required: function() {
        return this.commercialDetails.subType === 'Industry';
      },
    },

    priceDetails: {
      allInclusive: Boolean,
      negotiable: Boolean,
      taxExcluded: Boolean,
    },

    approvedBy: String,
    approvedIndustryType: String,

    preLeased: String,
    leaseDuration: String,
    monthlyRent: Number,

    amenities: [String],
    locationAdvantages: [String],
    wheelchairFriendly: Boolean,
  },

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
}
,
    
    // Storage specific
    storageDetails: {
  storageType: {
    type: String,
  },

  area: {
    type: Number,
  },

  areaUnit: {
    type: String,
    default: "sqft",
  },

  covered: {
    type: Boolean,
    default: false,
  },

  ceilingHeight: {
    type: Number,
  },

  flooring: {
    type: String,
  },

  ventilation: {
    type: String,
  },

  security: {
    type: [String],
    default: [],
  },

  temperatureControl: {
    type: Boolean,
    default: false,
  },

  accessibility: {
    type: String,
  },

  /* ✅ STORAGE VASTU DETAILS (THIS IS REQUIRED) */
  vastuDetails: {
    buildingFacing: { type: String },
    entrance: { type: String },
    storageArea: { type: String },
    lightGoods: { type: String },
    loading: { type: String },
    office: { type: String },
    electrical: { type: String },
    water: { type: String },
    washroom: { type: String },
    height: { type: String },
  },
},

    
    // Hospitality specific
    hospitalityDetails: {
  location: {
    type: String,
    required: function() {
      return this.commercialDetails.subType === 'Hospitality';
    },
  },

  area: {
    value: {
      type: Number,
      required: function() {
        return this.commercialDetails.subType === 'Hospitality';
      },
    },
    unit: {
      type: String,
      enum: ["sqft", "sqm", "acre"],
      default: "sqft",
    },
  },

  hospitalityType: String,
  rooms: Number,
  halls: Number,
  kitchens: Number,
  parking: Number,
  starRating: Number,
  licensesAvailable: [String],

  availability: String,
  ageOfProperty: String,
  possessionBy: String,

  pricing: {
    ownership: String,
    expectedPrice: Number,
    negotiable: Boolean,
    amenities: [String],
    locationAdvantages: [String],
  },

  vastuDetails: {
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
}
,
    
    // Other specific
    otherDetails: {
      description: String,
      area: Number,
      areaUnit: { type: String, default: 'sqft' },
      features: [String]
    }
  },
  
resortDetails: {
  resortType: {
    type: String,
    required: function () {
      return this.propertyType === "Resort";
    },
  },

  location: {
    type: String,
    required: function () {
      return this.propertyType === "Resort";
    },
  },

  landArea: {
    type: Number,
    required: function () {
      return this.propertyType === "Resort";
    },
  },

  buildArea: {
    type: Number,
    required: function () {
      return this.propertyType === "Resort";
    },
  },

  rooms: { type: Number, default: 0 },
  floors: { type: Number, default: 0 },

  description: {
    type: String,
    required: function () {
      return this.propertyType === "Resort";
    },
  },

  locationAdvantages: {
    type: [String],
    default: [],
  },

  vaasthuDetails: {
    propertyFacing: {
      type: String,
      required: function () {
        return this.parent().parent().propertyType === "Resort";
      },
    },
    entranceDirection: {
      type: String,
      required: function () {
        return this.parent().parent().propertyType === "Resort";
      },
    },
    receptionAreaFacing: {
      type: String,
      required: function () {
        return this.parent().parent().propertyType === "Resort";
      },
    },
    mainLobbyDirection: {
      type: String,
      required: function () {
        return this.parent().parent().propertyType === "Resort";
      },
    },
    masterSuitroom: {
      type: String,
      required: function () {
        return this.parent().parent().propertyType === "Resort";
      },
    },
    guestRoom: {
      type: String,
      required: function () {
        return this.parent().parent().propertyType === "Resort";
      },
    },
    restaurantDirection: {
      type: String,
      required: function () {
        return this.parent().parent().propertyType === "Resort";
      },
    },
    vipSuite: {
      type: String,
      required: function () {
        return this.parent().parent().propertyType === "Resort";
      },
    },
    conferenceDirection: {
      type: String,
      required: function () {
        return this.parent().parent().propertyType === "Resort";
      },
    },
    spaRoom: {
      type: String,
      required: function () {
        return this.parent().parent().propertyType === "Resort";
      },
    },
    swimmingPool: {
      type: String,
      required: function () {
        return this.parent().parent().propertyType === "Resort";
      },
    },
    yoga: {
      type: String,
      required: function () {
        return this.parent().parent().propertyType === "Resort";
      },
    },
    kitchenRoom: {
      type: String,
      required: function () {
        return this.parent().parent().propertyType === "Resort";
      },
    },
    poojaRoom: {
      type: String,
      required: function () {
        return this.parent().parent().propertyType === "Resort";
      },
    },
    office: {
      type: String,
      required: function () {
        return this.parent().parent().propertyType === "Resort";
      },
    },
    recreation: {
      type: String,
      required: function () {
        return this.parent().parent().propertyType === "Resort";
      },
    },
    balcony: {
      type: String,
      required: function () {
        return this.parent().parent().propertyType === "Resort";
      },
    },
    garden: {
      type: String,
      required: function () {
        return this.parent().parent().propertyType === "Resort";
      },
    },
  },
},




  
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