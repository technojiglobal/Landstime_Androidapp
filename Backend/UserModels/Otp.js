// Backend/UserModels/Otp.js
import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    index: true
  },
  countryCode: {
    type: String,
    required: true,
    default: '+91'
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    },
    expires: 0 // TTL index
  },

  isVerified: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0
  }
});

// Index for faster queries
otpSchema.index({ phone: 1, createdAt: -1 });

const Otp = mongoose.model('Otp', otpSchema);

export default Otp;