// admin/src/components/properties/forms/ResortForm.jsx
import React from 'react';
import NumberField from '../fields/NumberField';
import TextAreaField from '../fields/TextAreaField';
import ToggleButtons from '../fields/ToggleButtons';
import CheckboxGroup from '../fields/CheckboxGroup';
import RadioButtons from '../fields/RadioButtons';
import ImageUpload from '../fields/ImageUpload';
import VaasthuDetails from '../sections/VaasthuDetails';
import FacilitiesSection from '../sections/FacilitiesSection';
import ParkingSection from '../sections/ParkingSection';
import SelectField from '../fields/SelectField';
import { RESORT_TYPES } from '../../../constants/propertyConstants';
import { resortVaasthuFields } from '../../../constants/vastuFields';
import LocationSection from '../sections/LocationSection';
import DescriptionSection from '../sections/DescriptionSection';
import PricingSection from '../sections/PricingSection';
import PricingDetailsModal from '../PricingDetailsModal';
import { useState } from 'react';

const ResortForm = ({
  propertyType,
  setPropertyType,
  formData,
  updateField,
  images,
  setImages
}) => {
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [pricingDetails, setPricingDetails] = useState(null);
  const [isDescriptionValid, setIsDescriptionValid] = useState(false); // ✅ ADD THIS LINE
  // Helper function to update nested resortDetails fields
 // ResortForm.jsx
const updateResortField = (field, value) => {
  updateField('resortDetails', {
    ...(formData.resortDetails || {}),
    [field]: value,
  });
};

const updateVaasthuField = (field, value) => {
  updateField('resortDetails', {
    ...(formData.resortDetails || {}),
    vaasthuDetails: {
      ...(formData.resortDetails?.vaasthuDetails || {}),
      [field]: value,
    },
  });
};

  const handlePricingSubmit = (data) => {
    setPricingDetails(data);
    updateResortField('additionalPricing', {
      maintenanceCharges: data.maintenance || 0,
      maintenancePeriod: data.maintenanceFrequency || '',
      expectedRental: data.expectedRental || 0,
      bookingAmount: data.bookingAmount || 0,
      annualDuesPayable: data.annualDuesPayable || 0
    });
  };

  return (
    <>
      <SelectField
        label="Resort Type"
        name="resortType"
        value={propertyType}
        onChange={setPropertyType}
        options={RESORT_TYPES}
        placeholder="Beachfront"
        required
      />

      <div className="space-y-6 border-t pt-3">
        <h3 className="font-semibold">Basic Details</h3>

        {/* Property Images */}
        <ImageUpload
          label="Property Images"
          images={images}
          onChange={setImages}
          maxImages={20}
          required={true}
        />

        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label="Rooms"
            name="rooms"
            value={formData.resortDetails?.rooms || ''}
            onChange={(value) => updateResortField('rooms', value)}
          />

          <NumberField
  label={
    <span>
      Land Area (in sqft) <span className="text-red-500">*</span>
    </span>
  }
  name="landArea"
  value={formData.resortDetails?.landArea || ''}
  onChange={(value) => updateResortField('landArea', value)}
/>


          <NumberField
            label="Floors"
            name="floors"
            value={formData.resortDetails?.floors || ''}
            onChange={(value) => updateResortField('floors', value)}
          />
<NumberField
  label={
    <span>
      Build Area (in sqft) <span className="text-red-500">*</span>
    </span>
  }
  name="buildArea"
  value={formData.resortDetails?.buildArea || ''}
  onChange={(value) => updateResortField('buildArea', value)}
/>
        </div>

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
    <PricingSection
      formData={formData}
      updateField={updateField}
    />
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


       <LocationSection formData={formData} updateField={updateField} />
<DescriptionSection 
  formData={formData} 
  updateField={updateField}
  setIsDescriptionValid={setIsDescriptionValid} // ✅ ADD THIS PROP
/>

        {/* Vaastu Details - Pass nested data and update function */}
        <VaasthuDetails
          formData={formData.resortDetails || {}}
          updateField={updateVaasthuField}
          fields={resortVaasthuFields}
        />
      </div>
    </>
  );
};

export default ResortForm;