// Backend/config/subscriptionConfig.js

export const SUBSCRIPTION_LIMITS = {
  gold: 10,
  platinum: 30,
  diamond: 50
};

export const PLAN_FEATURES = {
  gold: {
    contactViews: 10,
    name: 'Gold',
    upgradeTo: 'Platinum'
  },
  platinum: {
    contactViews: 30,
    name: 'Platinum',
    upgradeTo: 'Diamond'
  },
  diamond: {
    contactViews: 50,
    name: 'Diamond',
    upgradeTo: null
  }
};

export const getPlanLimit = (planId) => {
  return SUBSCRIPTION_LIMITS[planId] || 0;
};

export const getPlanFeatures = (planId) => {
  return PLAN_FEATURES[planId] || null;
};