// Backend/Usermodels/Property.js
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  // Common fields for all property types
  propertyType: {
    type: String,
    enum: ['House', 'House/Flat', 'Site/Plot/Land', 'Commercial', 'Resort'], // ✅ Added 'House/Flat'
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
  validate: {
    validator: function(v) {
      // Matches Indian phone numbers: 10 digits, optional +91 or 0 prefix
      return /^(?:\+91|91|0)?[6-9]\d{9}$/.test(v);
    },
    message: props => `${props.value} is not a valid phone number!`
  },
  trim: true
},
email: {
  type: String,
  required: [true, "Owner email is required"],
  lowercase: true,
  trim: true,
  validate: {
    validator: function(v) {
      // Standard email validation regex
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    },
    message: props => `${props.value} is not a valid email address!`
  }
}
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
  uploadedBy: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function () {
      return this.uploadedBy !== 'admin';
    },
    default: null
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

  isVerified: {
    type: Boolean,
    default: false
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
  enum: ["ft", "m", "sqft", "sqm", "acre"], // ✅ ADD "ft" and "m"
  default: "ft",
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

      neighborhoodArea: String, // ✅ Area/Neighborhood

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

      conferenceRooms: String, // ✅ "1", "2", "3", "4+"

      washrooms: {
        public: Number,
        private: Number,
      },

      receptionArea: Boolean,
      furnishing: Boolean,

      // ✅ NEW - Pantry Details
      pantry: Boolean, // ✅ NEW
      pantryType: String, // ✅ NEW - "Private" or "Shared"
      pantrySize: Number, // ✅ NEW

      additionalFeatures: [String],
      fireSafetyMeasures: [String],

      totalFloors: Number,
      floorNo: Number,
      staircases: String,

      lift: String,
      passengerLifts: Number,
      serviceLifts: Number,

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

      // ✅ NEW - Located Inside (Business Park, IT Park, Mall, etc.)
      locatedInside: String,

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

      totalFloors: Number, // ✅ ADD THIS
  
  furnishingType: {  // ✅ ADD THIS
    type: String,
    enum: ['Unfurnished', 'Semi-furnished', 'Furnished']
  },
  
  furnishingItems: [String], // ✅ ADD THIS
  
  ownershipType: String, // ✅ ADD THIS (alias for ownership)

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

      // ✅ NEW - Pre-leased amount (when preLeased is "Yes")
      preLeasedAmount: Number,

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

      // ✅ NEW - Furnishing Items (if furnished)
      furnishingItems: {
        type: [String],
        default: [],
      },

      /* ---------- VAASTU DETAILS (MATCHING RetailVaastu.jsx) ---------- */

      vaasthuDetails: {  // ✅ Single 'a' spelling
    shopFacing: String,
    entrance: String,
    cashCounter: String,
    cashLocker: String,
    ownerSeating: String,
    staffSeating: String,
    storage: String,
    displayArea: String,
    electrical: String,
    pantryArea: String,
    staircase: String,
    staircaseInside: String,
  },
},



    plotDetails: {
      // ✅ NEW - Plot Kind (Agricultural/Residential/Commercial)
      plotKind: {
        type: String,
      },

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

      neighborhoodArea: {
        type: String,
        trim: true,
      },

      locality: {
        type: String,
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

      openSides: String, // "1", "2", "3", "4"

      floorsAllowed: {
        type: Number,
        default: 0,
      },

      boundaryWall: {
        type: String, // "Yes" / "No"
      },

      zoneType: {
        type: String,
      },

      constructionDone: String, // "Yes" / "No"
      constructionTypes: [String], // ["+ Shed", "+ Room(s)", etc.]

      possession: {
        year: String,
        month: String,
      },

      // ✅ Pricing fields (from PlotNext.jsx)
      ownership: {
        type: String,
        default: 'Freehold',
      },

      approvedBy: {
        type: String, // Authority approval
      },

      industryType: String, // ✅ NEW - Approved for industry type

      preLeased: {
        type: String, // "Yes" / "No"
      },

      leaseDuration: {
        type: String,
      },

      monthlyRent: {
        type: Number,
        default: 0,
      },

      // ✅ NEW - Approvals
      nocCertified: String,
      occupancyCertified: String,

      cornerProperty: {
        type: Boolean,
        default: false,
      },

      amenities: {
        type: [String],
        default: [],
      },

      locationAdvantages: {
        type: [String],
        default: [],
      },

      // ✅ Vastu Details (from PlotVaastu.jsx)
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




    industryDetails: {
      location: {
        type: String,
        required: function () {
          return this.commercialDetails.subType === 'Industry';
        },
      },
      neighborhoodArea: String, // NEW
      area: {
        value: {
          type: Number,
          required: function () {
            return this.commercialDetails.subType === 'Industry';
          },
        },
        unit: {
          type: String,
          enum: ["sqft", "sqm", "acre"],
          default: "sqft",
        },
      },
      dimensions: { // NEW
        length: Number,
        breadth: Number,
      },
      washroomType: String,
      availability: String,
      ageOfProperty: String,
      possessionBy: String,
      pricing: {
        ownership: String,
        expectedPrice: {
          type: Number,
          required: function () {
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
        description: String,  // or { type: String }
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
    },

    // Backend/models/Property.js - Storage Schema Section Only

    storageDetails: {
      storageType: {
        type: String,
        enum: ['Warehouse', 'Cold Storage'],
      },

      location: {
        type: String,
        required: function () {
          return this.commercialDetails?.subType === "Storage";
        },
      },

      // ✅ NEW - Neighborhood Area (critical field)
      neighborhoodArea: {
        type: String,
      },

      storageArea: {
        value: {
          type: Number,
          required: function () {
            return this.commercialDetails?.subType === "Storage";
          },
        },
        unit: {
          type: String,
          enum: ["sqft", "sqm", "acre"],
          default: "sqft",
        },
      },

      dimensions: {
        length: Number,
        breadth: Number,
      },

      // ✅ NEW - Additional Storage Specifications
      ceilingHeight: {
        type: Number,
      },

      flooring: {
        type: String,
        enum: ['Concrete', 'Tiles', 'Epoxy', 'Other'],
      },

      ventilation: {
        type: String,
        enum: ['Natural', 'Mechanical', 'Both'],
      },

      covered: {
        type: Boolean,
        default: false,
      },

      temperatureControl: {
        type: Boolean,
        default: false,
      },

      security: {
        type: [String],
        default: [],
      },

      accessibility: {
        type: String,
        enum: ['Dock Level', 'Ground Level', 'Ramp Access'],
      },

      washroomType: {
        type: String,
      },

      availability: {
        type: String,
        enum: ['Ready', 'UnderConstruction'],
      },

      ageOfProperty: {
        type: String,
      },

      possession: {
        expectedBy: String,
      },

      // ✅ Pricing Details (from StorageNext.jsx)
      ownership: {
        type: String,
      },

      expectedPrice: {
        type: Number,
        required: function () {
          return this.commercialDetails?.subType === "Storage";
        },
      },

      priceDetails: {
        allInclusive: { type: Boolean, default: false },
        negotiable: { type: Boolean, default: false },
        taxExcluded: { type: Boolean, default: false },
      },

      authority: {
        type: String,
      },

      approvedIndustryType: {
        type: String,
      },

      preLeased: {
        type: String,
      },

      leaseDuration: {
        type: String,
      },

      monthlyRent: {
        type: Number,
      },

      // ✅ NEW - Approvals
      nocCertified: String,
      occupancyCertified: String,

      description: {
        type: String,
      },

      amenities: {
        type: [String],
        default: [],
      },

      locationAdvantages: {
        type: [String],
        default: [],
      },

      // ✅ Vastu Details (from StorageVaastu.jsx)
      vastuDetails: {
        buildingFacing: String,
        entrance: String,
        storageArea: String,
        lightGoods: String,
        loading: String,
        office: String,
        electrical: String,
        water: String,
        washroom: String,
        height: String,
      },
    },


    // Hospitality specific
    hospitalityDetails: {
      // ✅ Location & Area

      hospitalityType: {
  type: String,
  enum: ['Hotel/Resorts', 'Guest House'], // ✅ Matches frontend exactly
  required: function () {
    return this.commercialDetails?.subType === 'Hospitality';
  }
},
      location: {
        type: String,
        required: function () {
          return this.commercialDetails?.subType === 'Hospitality';
        },
      },

      neighborhoodArea: String, // ✅ NEW - Area/Neighborhood

      area: {
        value: {
          type: Number,
          required: function () {
            return this.commercialDetails?.subType === 'Hospitality';
          },
        },
        unit: {
          type: String,
          enum: ["sqft", "sqm", "acre"],
          default: "sqft",
        },
      },

      // ✅ NEW - Total Floors
      totalFloors: String,

      // ✅ Room Details
      rooms: Number,
      washroomType: String, // ✅ NEW - "None", "Shared", "1", "2", etc.
      balconies: String, // ✅ NEW - "0", "1", "2", "3", "More than 3"
      otherRooms: [String], // ✅ NEW - ["Pooja Room", "Study Room", etc.]

      // ✅ Furnishing
      furnishingType: {
        type: String,
        enum: ['Unfurnished', 'Semi-furnished', 'Furnished'],
        default: 'Unfurnished'
      },
      furnishingDetails: [String], // ✅ NEW - List of furnishing items

      // ✅ Availability
      availability: String, // "Ready" or "UnderConstruction"
      ageOfProperty: String, // ✅ For Ready properties
      possessionBy: String, // ✅ For Under Construction
      expectedMonth: String, // ✅ NEW - Month for possession

      // ✅ Ownership & Pricing
      ownership: String, // ✅ MOVED from pricing
      IndustryApprovedBy: String, // ✅ NEW
      approvedIndustryType: String, // ✅ NEW

      expectedPrice: {
        type: Number,
        required: function () {
          return this.commercialDetails?.subType === 'Hospitality';
        },
      },

      priceDetails: { // ✅ FLATTENED
        allInclusive: { type: Boolean, default: false },
        negotiable: { type: Boolean, default: false },
        taxExcluded: { type: Boolean, default: false },
      },

      // ✅ Pre-Leased Details
      preLeased: String, // "Yes" or "No"
      leaseDuration: String, // ✅ NEW
      monthlyRent: Number, // ✅ NEW

      // ✅ Description & Features
      description: String, // ✅ MOVED from pricing
      amenities: {
        type: [String],
        default: [],
      },
      locationAdvantages: {
        type: [String],
        default: [],
      },
      wheelchairFriendly: { // ✅ NEW
        type: Boolean,
        default: false
      },
      flooringType: String, // ✅ NEW

      // ✅ Vastu Details
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
    resortType: String,
    landArea: Number,
    buildArea: Number,
    rooms: { type: Number, default: 0 },
    floors: { type: Number, default: 0 },

    locationAdvantages: {
      type: [String],
      default: [],
    },

    vaasthuDetails: {
      propertyFacing: String,
      entranceDirection: String,
      receptionAreaFacing: String,
      mainLobbyDirection: String,
      masterSuitroom: String,
      guestRoom: String,
      restaurantDirection: String,
      vipSuite: String,
      conferenceDirection: String,
      spaRoom: String,
      swimmingPool: String,
      yoga: String,
      kitchenRoom: String,
      poojaRoom: String,
      office: String,
      recreation: String,
      balcony: String,
      garden: String,
    },
  },
},




  {
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