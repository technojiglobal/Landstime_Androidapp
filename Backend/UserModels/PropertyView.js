//Backend//UserModels//PropertyView.js

import mongoose from 'mongoose';

// ✅ NEW: Viewer subdocument schema
const viewerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userPhone: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  subscriptionPlan: {
    type: String,
    enum: ['gold', 'platinum', 'diamond'],
    required: true
  },
  viewedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// ✅ NEW: Property view schema with viewers array
const propertyViewSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
    unique: true,
    index: true
  },
  propertyTitle: {
    type: String,
    required: true
  },
  propertyOwnerName: {
    type: String,
    required: true
  },
  propertyStatus: {
    type: String,
    enum: ['Available', 'Sold'],
    default: 'Available'
  },
  ownerPhone: {
    type: String,
    required: true
  },
  ownerEmail: {
    type: String,
    required: true
  },
  viewers: [viewerSchema],
  totalViews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
propertyViewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const PropertyView = mongoose.model('PropertyView', propertyViewSchema);

export default PropertyView;