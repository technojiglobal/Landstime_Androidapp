


// admin/src/components/properties/forms/HouseForm.jsx
import React, { useState } from 'react';
import NumberField from '../fields/NumberField';
import TextAreaField from '../fields/TextAreaField';
import ToggleButtons from '../fields/ToggleButtons';
import CheckboxGroup from '../fields/CheckboxGroup';
import RadioButtons from '../fields/RadioButtons';
import ImageUpload from '../fields/ImageUpload';
import VaasthuDetails from '../sections/VaasthuDetails';
import FacilitiesSection from '../sections/FacilitiesSection';
import ParkingSection from '../sections/ParkingSection';
import AvailabilityStatus from '../sections/AvailabilityStatus';
import {
  OTHER_ROOMS,
  AGE_OF_PROPERTY,
  FURNISHING_OPTIONS,OWNERSHIP_TYPES
} from '../../../constants/propertyConstants';
import { normalVaasthuFields } from '../../../constants/vastuFields';
import LocationSection from '../sections/LocationSection';
import DescriptionSection from '../sections/DescriptionSection';
import FurnishingModal from '../sections/FurnishingModal';
import PricingSection from '../sections/PricingSection';
import PricingDetailsModal from '../PricingDetailsModal';

const HouseForm = ({ formData, updateField, images, setImages }) => {
  const [showFurnishingModal, setShowFurnishingModal] = useState(false);
  const [furnishingModalType, setFurnishingModalType] = useState('');
  const [isDescriptionValid, setIsDescriptionValid] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [pricingDetails, setPricingDetails] = useState(null);

  


  // Helper function to update nested vaasthuDetails fields
const updateVaasthuField = (field, value) => {
  updateField(`houseDetails.vaasthuDetails.${field}`, value);
};


 const handleFurnishingChange = (value) => {
  updateField('houseDetails.furnishing', value || 'Unfurnished');

  if (value === 'Semi-Furnished' || value === 'Furnished') {
    setShowFurnishingModal(true);
    setFurnishingModalType(value === 'Semi-Furnished' ? 'SemiFurnished' : value);
  }
};

  const handlePricingSubmit = (data) => {
    setPricingDetails(data);
    updateField('houseDetails.additionalPricing', {
      maintenanceCharges: data.maintenance || 0,
      maintenancePeriod: data.maintenanceFrequency || '',
      expectedRental: data.expectedRental || 0,
      bookingAmount: data.bookingAmount || 0,
      annualDuesPayable: data.annualDuesPayable || 0
    });
  };

  return (
    <div className="space-y-6 border-t pt-6">
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
          label="No of Floors"
          name="noOfFloors"
          value={formData.houseDetails?.floors || ''}
          onChange={(value) => updateField('houseDetails.floors', value)}
        />
        <NumberField 
  label={
    <>
      Area (Sqft) <span className="text-red-500">*</span>
    </>
  }
  name="area"
  value={formData.houseDetails?.area || ''}
  onChange={(value) => updateField('houseDetails.area', value)}
/>

        <NumberField
          label="Bedrooms"
          name="bedrooms"
          value={formData.houseDetails?.bedrooms || ''}
          onChange={(value) => updateField('houseDetails.bedrooms', value)}
        />
        <NumberField
          label="Bathrooms"
          name="bathrooms"
          value={formData.houseDetails?.bathrooms || ''}
          onChange={(value) => updateField('houseDetails.bathrooms', value)}
        />
      </div>

      <NumberField
        label="Balconies"
        name="balconies"
        value={formData.houseDetails?.balconies || ''}
        onChange={(value) => updateField('houseDetails.balconies', value)}
      />

      <NumberField
        label="Floor Details"
        name="floorDetails"
        value={formData.houseDetails?.floorDetails || ''}
        onChange={(value) => updateField('houseDetails.floorDetails', value)}
        rows={3}
      />

      {/* ==================== AVAILABILITY STATUS ==================== */}
<AvailabilityStatus
  value={formData.houseDetails?.availabilityStatus || ''}
  ageOfProperty={formData.houseDetails?.ageOfProperty || []}
  possessionYear={formData.houseDetails?.possessionYear || ''}
  possessionMonth={formData.houseDetails?.possessionMonth || ''}
  onChange={(v) => updateField('houseDetails.availabilityStatus', v)}
  updateExtra={(field, v) =>
    updateField(`houseDetails.${field}`, v)
  }
/>

{/* Ownership */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-3">Ownership</h3>
        <div className="flex flex-wrap gap-2">
         {OWNERSHIP_TYPES.map((type) => (
  <button
    key={type}
    type="button"
    onClick={() => updateField('houseDetails.ownership', type)}
    className={`px-4 py-2 rounded-full border text-sm transition-colors ${
      formData.houseDetails?.ownership === type
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
     
      <CheckboxGroup
        label="Other Rooms"
        name="otherRooms"
        selected={formData.houseDetails?.otherRooms || []}
        onChange={(value) => updateField('houseDetails.otherRooms', value)}
        options={OTHER_ROOMS}
      />

      {/* ==================== FURNISHING WITH MODAL ==================== */}
      <RadioButtons
  label="Furnishing"
  name="furnishing"
  value={formData.houseDetails?.furnishing || 'Unfurnished'}
  onChange={handleFurnishingChange}
  options={FURNISHING_OPTIONS}
/>


      {/* Furnishing Modal */}
      <FurnishingModal
        isOpen={showFurnishingModal}
        furnishingType={furnishingModalType}
        selectedItems={formData.houseDetails?.furnishingItems || []}
        onClose={() => setShowFurnishingModal(false)}
        onItemToggle={(items) => updateField('houseDetails.furnishingItems', items)}
      />

     <ParkingSection 
  formData={formData.houseDetails || {}}
  updateField={(field, value) =>
    updateField(`houseDetails.${field}`, value)
  }
/>
      
     <FacilitiesSection 
  formData={formData.houseDetails || {}}
  updateField={(field, value) =>
    updateField(`houseDetails.${field}`, value)
  }
/>

      <LocationSection formData={formData} updateField={updateField} />
      <DescriptionSection formData={formData} updateField={updateField} setIsDescriptionValid={setIsDescriptionValid}/>
      
      <VaasthuDetails
  formData={formData.houseDetails || {}}
  updateField={updateVaasthuField}
  fields={normalVaasthuFields}
/>
    </div>
  );
};

export default HouseForm;