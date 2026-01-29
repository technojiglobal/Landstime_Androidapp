import React, { useState } from 'react';
import NumberField from '../fields/NumberField';
import SelectField from '../fields/SelectField';
import TextAreaField from '../fields/TextAreaField';
import PricingSection from './PricingSection';
import PricingDetailsModal from '../PricingDetailsModal';

const OfficePricingDetailsSection = ({ formData, updateField }) => {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [pricingDetails, setPricingDetails] = useState(null);

  const handlePricingSubmit = (data) => {
    setPricingDetails(data);
    updateField('additionalPricing', {
      maintenanceCharges: data.maintenance || 0,
      maintenancePeriod: data.maintenanceFrequency || '',
      expectedRental: data.expectedRental || 0,
      bookingAmount: data.bookingAmount || 0,
      annualDuesPayable: data.annualDuesPayable || 0
    });
  };

  return (
  <div className="space-y-6 border-t pt-6">
    <h3 className="font-semibold">Expected Price Details</h3>

    <NumberField
      label="Expected Price"
      name="expectedPrice"
      value={formData.expectedPrice}
      onChange={(value) => updateField('expectedPrice', value)}
      placeholder="₹ Expected Price"
    />

    <PricingSection formData={formData} updateField={updateField} />

    <button 
      type="button" 
      className="text-green-600 text-sm mt-2"
      onClick={() => setIsPricingModalOpen(true)}
    >
      + Add more pricing details
    </button>
    <PricingDetailsModal
      isOpen={isPricingModalOpen}
      onClose={() => setIsPricingModalOpen(false)}
      onSubmit={handlePricingSubmit}
    />

    {/* Pre-leased/Pre-Rented - Pill Style */}
    <div>
      <label className="block text-sm font-medium mb-2">Is it Pre-leased/ Pre-Reneted?</label>
      <div className="flex gap-2">
        {['Yes', 'No'].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => updateField('preLeased', option)}
            className={`px-4 py-2 rounded-full border text-sm ${formData.preLeased === option
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-white text-gray-700 border-gray-300'
              }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>

    {formData.preLeased === 'Yes' && (
      <div className="grid grid-cols-2 gap-4">
        <NumberField
          label="Current rent per month"
          name="monthlyRent"
          value={formData.monthlyRent}
          onChange={(value) => updateField('monthlyRent', value)}
          placeholder="₹ Current rent per month"
        />

        <NumberField
          label="Lease tenure in years"
          name="leaseDuration"
          value={formData.leaseDuration}
          onChange={(value) => updateField('leaseDuration', value)}
        />
      </div>
    )}

    {/* Fire NOC Certified - Pill Style */}
    <div>
      <label className="block text-sm font-medium mb-2">Is your office fire NOC Certified?</label>
      <div className="flex gap-2">
        {['Yes', 'No'].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => updateField('nocCertified', option)}
            className={`px-4 py-2 rounded-full border text-sm ${formData.nocCertified === option
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-white text-gray-700 border-gray-300'
              }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>

    {/* Occupancy Certificate - Pill Style */}
    <div>
      <label className="block text-sm font-medium mb-2">Occupancy Certificate</label>
      <div className="flex gap-2">
        {['Yes', 'No'].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => updateField('occupancyCertified', option)}
            className={`px-4 py-2 rounded-full border text-sm ${formData.occupancyCertified === option
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-white text-gray-700 border-gray-300'
              }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>

    <SelectField
      label="Office previously used for (optional)"
      name="previouslyUsedFor"
      value={formData.previouslyUsedFor}
      onChange={(value) => updateField('previouslyUsedFor', value)}
      options={['', 'Commercial', 'Residential', 'Industrial', 'Educational', 'Healthcare']}
    />

  </div>
  );
};

export default OfficePricingDetailsSection;