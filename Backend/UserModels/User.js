// UserModels/User.js - Updated with lastLogin field

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  phone: {
    type: String,
    required: true,
    unique: true,
  },

  countryCode: {
    type: String,
    required: true,
    default: "+91",
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: function () {
      return this.role === "Admin"; // ✅ ONLY admin needs password
    },
  },

  role: {
    type: String,
    enum: ["Buyer", "Owner", "Admin"],
    required: true,
  },

  isPhoneVerified: {
    type: Boolean,
    default: false,
  },

  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  isBlocked: {
    type: Boolean,
    default: false,
  },

  // NEW: Track last login for active/inactive user filtering
  lastLogin: {
    type: Date,
    default: Date.now,
  },

  // Subscription tracking
  currentSubscription: {
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      default: null
    },
    planId: {
      type: String,
      enum: ['gold', 'platinum', 'diamond', null],
      default: null
    },
    planName: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled', 'blocked', null],
      default: null
    },
    startDate: {
      type: Date,
      default: null
    },
    endDate: {
      type: Date,
      default: null
    }
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Method to update last login timestamp
userSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date();
  return this.save();
};

const User = mongoose.model("User", userSchema);
export default User;