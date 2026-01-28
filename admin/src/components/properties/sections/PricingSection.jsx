import React from 'react';

const PricingSection = ({ formData, updateField }) => {
  // Helper to update nested priceDetails fields
  const updatePriceDetail = (key, value) => {
    const currentPriceDetails = formData.priceDetails || {};
    updateField('priceDetails', {
      ...currentPriceDetails,
      [key]: value
    });
  };

  const priceDetails = formData.priceDetails || {};

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={priceDetails.allInclusive || false}
          onChange={(e) => updatePriceDetail('allInclusive', e.target.checked)}
          className="w-4 h-4 text-green-600 rounded"
        />
        <span className="text-sm">All inclusive price</span>
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={priceDetails.negotiable || false}
          onChange={(e) => updatePriceDetail('negotiable', e.target.checked)}
          className="w-4 h-4 text-green-600 rounded"
        />
        <span className="text-sm">Price Negotiable</span>
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={priceDetails.taxExcluded || false}
          onChange={(e) => updatePriceDetail('taxExcluded', e.target.checked)}
          className="w-4 h-4 text-green-600 rounded"
        />
        <span className="text-sm">Tax and Govt charges excluded</span>
      </label>
    </div>
  );
};

export default PricingSection;