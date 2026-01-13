import React from 'react';

const PricingSection = ({ formData, updateField }) => (
  <div className="space-y-3">
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={formData.allInclusivePrice || false}
        onChange={(e) => updateField('allInclusivePrice', e.target.checked)}
        className="w-4 h-4 text-green-600 rounded"
      />
      <span className="text-sm">All inclusive price</span>
    </label>
    
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={formData.priceNegotiable || false}
        onChange={(e) => updateField('priceNegotiable', e.target.checked)}
        className="w-4 h-4 text-green-600 rounded"
      />
      <span className="text-sm">Price Negotiable</span>
    </label>
    
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={formData.taxCharges || false}
        onChange={(e) => updateField('taxCharges', e.target.checked)}
        className="w-4 h-4 text-green-600 rounded"
      />
      <span className="text-sm">Tax and Govt charges excluded</span>
    </label>
  </div>
);

export default PricingSection;