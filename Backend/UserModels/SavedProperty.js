// Backend/models/SavedProperty.js
import mongoose from 'mongoose';

const savedPropertySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'entityType'
  },
  entityType: {
    type: String,
    required: true,
    enum: ['Property', 'InteriorDesign']
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate saves
savedPropertySchema.index({ user: 1, entityId: 1, entityType: 1 }, { unique: true });

const SavedProperty = mongoose.model('SavedProperty', savedPropertySchema);

export default SavedProperty;