// admin/src/components/properties/forms/SitePlotForm.jsx

// export default SitePlotForm;
import React from 'react';
import NumberField from '../fields/NumberField';
import TextField from '../fields/TextField';
import RadioButtons from '../fields/RadioButtons';
import NumberButtonGroup from '../fields/NumberButtonGroup';
import CheckboxGroup from '../fields/CheckboxGroup';
import SelectField from '../fields/SelectField';
import ImageUpload from '../fields/ImageUpload';
import { 
  LOCATION_ADVANTAGES,
  AMENITIES,
  OWNERSHIP_TYPES,
  PLOT_RATING,
  LIVING_STRUCTURE
} from '../../../constants/propertyConstants';
import VaasthuDetails from '../sections/VaasthuDetails';
import { sitePlotVaasthuFields } from '../../../constants/vastuFields';
import LocationSection from '../sections/LocationSection';
import PricingSection from '../sections/PricingSection';
import DescriptionSection from '../sections/DescriptionSection';
import AvailabilityStatus from '../sections/AvailabilityStatus';
import { useState } from 'react';
import PricingDetailsModal from '../PricingDetailsModal';

const SitePlotForm = ({ formData, updateField, images, setImages }) => {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [pricingDetails, setPricingDetails] = useState(null);

  // Helper function to update nested siteDetails fields
  const updateSiteField = (field, value) => {
    updateField('siteDetails', {
      ...(formData.siteDetails || {}),
      [field]: value
    });
  };

  // Helper function to update nested vaasthuDetails fields
  const updateVaasthuField = (field, value) => {
    updateField('siteDetails', {
      ...(formData.siteDetails || {}),
      vaasthuDetails: {
        ...(formData.siteDetails?.vaasthuDetails || {}),
        [field]: value
      }
    });
  };

  const handlePricingSubmit = (data) => {
    setPricingDetails(data);
    updateSiteField('additionalPricing', {
      maintenanceCharges: data.maintenance || 0,
      maintenancePeriod: data.maintenanceFrequency || '',
      expectedRental: data.expectedRental || 0,
      bookingAmount: data.bookingAmount || 0,
      annualDuesPayable: data.annualDuesPayable || 0
    });
  };

  return (
    <div className="space-y-6 border-t pt-6">
      <h3 className="text-lg font-semibold text-left">Basic Details</h3>

      {/* Property Images */}
      <ImageUpload
        label="Property Images"
        images={images}
        onChange={setImages}
        maxImages={20}
        required={true}
      />

      <LocationSection formData={formData} updateField={updateField} />

      {/* Price and Area Grid */}
      <div className="grid grid-cols-2 gap-4">
        <NumberField
  label={
    <span>
      Area (sqft) <span className="text-red-500">*</span>
    </span>
  }
  name="area"
  value={formData.siteDetails?.area || ''}
  onChange={(value) => updateSiteField('area', value)}
/>


       <NumberField
  label={
    <span>
      Length <span className="text-red-500">*</span>
    </span>
  }
  name="length"
  value={formData.siteDetails?.length || ''}
  onChange={(value) => updateSiteField('length', value)}
  placeholder="in ft."
/>

<NumberField
  label={
    <span>
      Breadth <span className="text-red-500">*</span>
    </span>
  }
  name="breadth"
  value={formData.siteDetails?.breadth || ''}
  onChange={(value) => updateSiteField('breadth', value)}
  placeholder="in ft."
/>
        <TextField
          label="Floors Allowed for Construction"
          name="floorsAllowed"
          value={formData.siteDetails?.floorsAllowed || ''}
          onChange={(value) => updateSiteField('floorsAllowed', value)}
          placeholder="No of floors"
        />
      </div>

      <RadioButtons
  label="Is there a boundary wall around the property?"
  name="boundaryWall"
  value={formData.siteDetails?.boundaryWall ?? ''}
  onChange={(value) => updateSiteField('boundaryWall', value)}
  options={['Yes', 'No']}
/>

      <NumberButtonGroup
        label="No. of open sides"
        name="openSides"
        value={formData.siteDetails?.openSides || ''}
        onChange={(value) => updateSiteField('openSides', value)}
        options={['1', '2', '3', '3+']}
      />

     <RadioButtons
  label="Any construction done on this property?"
  name="construction"
  value={formData.siteDetails?.constructionDone ?? ''}
  onChange={(value) => updateSiteField('constructionDone', value)}
  options={['Yes', 'No']}
/>

{formData.siteDetails?.constructionDone === 'Yes' && (
        <div className="border-t pt-6">
          <h3 className="text-base font-medium text-gray-600 text-left mb-4">
            What type of construction has been done ?
          </h3>
          
          <div className="flex flex-wrap gap-3">
            {['Shed', 'Room(s)', 'Washroom', 'Other'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  const currentTypes = formData.siteDetails?.constructionType || [];
                  if (currentTypes.includes(type)) {
                    updateSiteField('constructionType', currentTypes.filter(t => t !== type));
                  } else {
                    updateSiteField('constructionType', [...currentTypes, type]);
                  }
                }}
                className={`px-5 py-2 rounded-full border text-sm transition-colors ${
                  (formData.siteDetails?.constructionType || []).includes(type)
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
                }`}
              >
                + {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ownership */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-3">Ownership</h3>
        <div className="flex flex-wrap gap-2">
          {OWNERSHIP_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => updateSiteField('ownership', type)}
              className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                formData.siteDetails?.ownership === type
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    
      {/* Pricing */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Price Details</h3>
        <NumberField
          label=""
          name="expectedPrice"
          value={formData.expectedPrice || ''}
          onChange={(value) => updateField('expectedPrice', value)}
          placeholder="₹ Expected Price"
        />
        <div className="mt-3">
          <PricingSection formData={formData} updateField={updateField} />
        </div>
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
      </div>

      <DescriptionSection formData={formData} updateField={updateField} />


      <VaasthuDetails 
        formData={formData.siteDetails || {}}
        updateField={updateVaasthuField}
        fields={sitePlotVaasthuFields}
      />
    </div>
  );
};

export default SitePlotForm;