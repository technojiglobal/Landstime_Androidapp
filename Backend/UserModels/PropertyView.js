// Backend/UserModels/PropertyView.js

import mongoose from 'mongoose';

const propertyViewSchema = new mongoose.Schema({
  // Property Information
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
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
  
  // Viewer Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
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
  
  // Subscription Information
  subscriptionPlan: {
    type: String,
    enum: ['gold', 'platinum', 'diamond'],
    required: true,
    index: true
  },
  
  // Timestamps
  viewedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
propertyViewSchema.index({ propertyId: 1, userId: 1 });
propertyViewSchema.index({ userId: 1, viewedAt: -1 });
propertyViewSchema.index({ propertyId: 1, viewedAt: -1 });

const PropertyView = mongoose.model('PropertyView', propertyViewSchema);

export default PropertyView;