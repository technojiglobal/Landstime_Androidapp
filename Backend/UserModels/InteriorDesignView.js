// Backend/UserModels/InteriorDesignView.js

import mongoose from 'mongoose';

// Viewer subdocument schema
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
    enum: ['gold', 'platinum', 'diamond', null],
    default: null  // User might not have subscription (free feature)
  },
  viewedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// Interior Design View schema
const interiorDesignViewSchema = new mongoose.Schema({
  designId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InteriorDesign',
    required: true,
    unique: true,
    index: true
  },
  designTitle: {
    type: String,
    required: true
  },
  designerName: {
    type: String,
    required: true
  },
  designerPhone: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Living Area', 'Bedroom', 'Bathroom', 'Kitchen', 'Workspace', 'Storage'],
    required: true
  },
  status: {  // ✅ NEW FIELD
    type: String,
    enum: ['In Progress', 'Work in Progress', 'Settled', 'Rejected'],
    default: 'In Progress'
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
interiorDesignViewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const InteriorDesignView = mongoose.model('InteriorDesignView', interiorDesignViewSchema);

export default InteriorDesignView;