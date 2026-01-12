import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    te: { type: String, required: true },
    hi: { type: String, required: true }
  },
  subtitle: {
    en: { type: String, required: true },
    te: { type: String, required: true },
    hi: { type: String, required: true }
  },
  image: {
    type: String, // Base64 encoded image
    required: true
  },
  ctaText: {
    type: String
  },
  ctaLink: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
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

// Update the updatedAt timestamp before saving
bannerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;