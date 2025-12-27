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
    type: String,
    required: true
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
      officeKind: String,
      location: String,
      locatedInside: String,
      zoneType: String,
      area: Number,
      areaUnit: String,
      cabins: Number,
      meetingRooms: Number,
      seats: Number,
      conferenceRooms: Number,
      washrooms: {
        public: Number,
        private: Number
      },
      receptionArea: Boolean,
      privacy: Boolean,
      washroomType: String,
      carpetArea: Number,
      carpetAreaUnit: String,
      additionalFeatures: [String],
      fireSafetyMeasures: [String],
      totalFloors: Number,
      staircases: Number,
      lift: String,
      parking: String,
      availability: String,
      ownership: String,
      preLeased: String,
      nocCertified: String,
      occupancyCertified: String,
      previouslyUsedFor: String,
      amenities: [String],
      locationAdvantages: [String]
    },
    
    // Retail specific
    retailDetails: {
      retailType: String,
      // Add retail specific fields
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