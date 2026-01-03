// Backend/AdminModels/InteriorDesign.js

import mongoose from 'mongoose';

const interiorDesignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  designer: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  area: {
    type: String,
    required: true,
    trim: true
  },
  category: {
  type: String,
  required: true,
  enum: [
    "Living Area",
    "Bedroom",
    "Bathroom",
    "Kitchen",
    "Workspace",
    "Storage"
  ]
},
  price: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 0,
    max: 5
  },
  description: {
    type: String,
    trim: true
  },
  images: [{
    type: String // URLs or base64 strings
  }],
  features: [{
    type: String
  }],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
interiorDesignSchema.index({ name: 'text', designer: 'text', location: 'text' });
interiorDesignSchema.index({ rating: -1 });
interiorDesignSchema.index({ createdAt: -1 });

const InteriorDesign = mongoose.model('InteriorDesign', interiorDesignSchema);

export default InteriorDesign;