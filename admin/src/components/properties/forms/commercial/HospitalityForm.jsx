import React, { useState } from 'react';

import LocationSection from '../../sections/LocationSection';
import NumberField from '../../fields/NumberField';
import TextField from '../../fields/TextField';
import SelectField from '../../fields/SelectField';

import ToggleButtons from '../../fields/ToggleButtons';
import RadioButtons from '../../fields/RadioButtons';
import CheckboxGroup from '../../fields/CheckboxGroup';
import NumberButtonGroup from '../../fields/NumberButtonGroup';
import PricingSection from '../../sections/PricingSection';
import DescriptionSection from '../../sections/DescriptionSection';
import PricingDetailsModal from '../../PricingDetailsModal';
import {

  OWNERSHIP_TYPES,

  FLOORING_TYPES,
  FURNISHING_OPTIONS,
  HOSPITALITY_AMENITIES
} from '../../../../constants/propertyConstants';
import AvailabilityStatus from '../../sections/AvailabilityStatus';
import FurnishingModal from '../../sections/FurnishingModal';
import ImageUpload from '../../fields/ImageUpload';
import VaasthuDetails from '../../sections/VaasthuDetails';
import { hospitalityVaasthuFields } from '../../../../constants/vastuFields';
const HospitalityForm = ({ formData, updateField, images, setImages }) => {
  const hospitalityData = formData.commercialDetails?.hospitalityDetails || {};
  const isReadyToMove = hospitalityData.availability === 'Ready';
  const isUnderConstruction = hospitalityData.availability === 'UnderConstruction';
  const isPreLeased = hospitalityData.preLeased === 'Yes';
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [pricingDetails, setPricingDetails] = useState(null);
  const [showFurnishingModal, setShowFurnishingModal] = useState(false);
  const [furnishingModalType, setFurnishingModalType] = useState('');

  const handleFurnishingChange = (value) => {
    updateField('commercialDetails.hospitalityDetails.furnishingType', value);
    if (value === 'Semi-Furnished' || value === 'Furnished') {
      setShowFurnishingModal(true);
      setFurnishingModalType(value === 'Semi-Furnished' ? 'SemiFurnished' : value);
    }
  };
  const handlePricingSubmit = (data) => {
    setPricingDetails(data);
    updateField('commercialDetails.hospitalityDetails.additionalPricing', {
      maintenanceCharges: data.maintenanceCharges || 0,
      maintenancePeriod: data.maintenancePeriod || '',
      expectedRental: data.expectedRental || 0,
      bookingAmount: data.bookingAmount || 0,
      annualDuesPayable: data.annualDuesPayable || 0
    });
  };
  return (
    <div className="space-y-6 border-t pt-6">

      {/* ==================== LOCATION ==================== */}
      <LocationSection formData={formData} updateField={updateField} />
      <ImageUpload
        label="Property Images"
        images={images}
        onChange={setImages}
        maxImages={20}
        required={true}
      />

      {/* ==================== HOSPITALITY TYPE ==================== */}
      <div className="border-t pt-6">
        <label className="block text-sm font-medium mb-3">Hospitality Type *</label>
        <RadioButtons
          name="hospitalityType"
          value={hospitalityData.hospitalityType}
          onChange={(value) => updateField('commercialDetails.hospitalityDetails.hospitalityType', value)}
          options={['Hotel/Resorts', 'Guest House']}
        />
      </div>

      {/* ==================== PROPERTY DETAILS ==================== */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Property Details</h3>
        <div className="grid grid-cols-2 gap-4">

          {/* Total Floors */}
          <NumberField
            label="No of Floors"
            name="totalFloors"
            value={hospitalityData.totalFloors || ''}
            onChange={(value) => updateField('commercialDetails.hospitalityDetails.totalFloors', value)}
          />

          {/* Area & Unit */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-2">Area <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <input
                type="number"
                value={hospitalityData.area?.value || ''}
                onChange={(e) => updateField('commercialDetails.hospitalityDetails.area', {
                  ...hospitalityData.area,
                  value: e.target.value
                })}
                placeholder="Area"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <select
                value={hospitalityData.area?.unit || 'sqft'}
                onChange={(e) => updateField('commercialDetails.hospitalityDetails.area', {
                  ...hospitalityData.area,
                  unit: e.target.value
                })}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="sqft">sqft</option>
                <option value="sqm">sqm</option>
                <option value="acre">acre</option>
              </select>
            </div>
          </div>

          {/* Rooms */}
          <NumberField
            label="No. of Rooms"
            name="rooms"
            value={hospitalityData.rooms || ''}
            onChange={(value) => updateField('commercialDetails.hospitalityDetails.rooms', value)}
          />

          {/* Washrooms */}
          <SelectField
            label="Washrooms"
            name="washroomType"
            value={hospitalityData.washroomType || ''}
            onChange={(value) => updateField('commercialDetails.hospitalityDetails.washroomType', value)}
            options={['Shared', '1', '2', '3', '4+', 'Attached']}
          />

          {/* Balconies */}
          <SelectField
            label="Balconies"
            name="balconies"
            value={hospitalityData.balconies || ''}
            onChange={(value) => updateField('commercialDetails.hospitalityDetails.balconies', value)}
            options={['0', '1', '2', '3', 'More than 3']}
          />
        </div>
      </div>

      {/* ==================== FURNISHING WITH MODAL ==================== */}
      <RadioButtons
        label="Furnishing"
        name="furnishingType"
        value={hospitalityData.furnishingType}
        onChange={handleFurnishingChange}
        options={FURNISHING_OPTIONS}
      />

      {/* Furnishing Modal */}
      <FurnishingModal
        isOpen={showFurnishingModal}
        furnishingType={furnishingModalType}
        selectedItems={hospitalityData.furnishingDetails || []}
        onClose={() => setShowFurnishingModal(false)}
        onItemToggle={(items) => updateField('commercialDetails.hospitalityDetails.furnishingDetails', items)}
      />
      <AvailabilityStatus
        formData={hospitalityData}
        updateField={(key, value) =>
          updateField(`commercialDetails.hospitalityDetails.${key}`, value)
        }
      />

      {/* ==================== OWNERSHIP ==================== */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-3">Ownership</h3>
        <div className="flex flex-wrap gap-2">
          {OWNERSHIP_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => updateField('commercialDetails.hospitalityDetails.ownership', type)}
              className={`px-4 py-2 rounded-full border text-sm transition-colors ${hospitalityData.ownership === type
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* ==================== AUTHORITY APPROVAL ==================== */}
      <TextField
        label="Which authority the property is approved by?(optional)"
        name="IndustryApprovedBy"
        value={hospitalityData.IndustryApprovedBy}
        onChange={(value) => updateField('commercialDetails.hospitalityDetails.IndustryApprovedBy', value)}
        placeholder="+ Local Authority"
      />

      {/* ==================== INDUSTRY TYPE (For Hospitality it's optional) ==================== */}
      <SelectField
        label="Approved for Industry Type(optional)"
        name="approvedIndustryType"
        value={hospitalityData.approvedIndustryType}
        onChange={(value) => updateField('commercialDetails.hospitalityDetails.approvedIndustryType', value)}
        options={['Hospitality', 'Hotel', 'Resort', 'Guest House', 'Restaurant', 'Other']}
        placeholder="Select Industry Type"
      />

      {/* ==================== PRICING DETAILS ==================== */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Expected Price Details</h3>

        <NumberField
          label="Expected Price"
          name="expectedPrice"
          value={hospitalityData.expectedPrice}
          onChange={(value) => updateField('commercialDetails.hospitalityDetails.expectedPrice', value)}
          placeholder="₹ Expected Price"
        />

        <div className="mt-3">
          <PricingSection
            formData={hospitalityData}
            updateField={(key, value) =>
              updateField(`commercialDetails.hospitalityDetails.${key}`, value)
            }
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

      {/* ==================== PRE-LEASED ==================== */}
      <RadioButtons
        label="Is it Pre-leased/ Pre-Rented?"
        name="preLeased"
        value={hospitalityData.preLeased}
        onChange={(value) => {
          updateField('commercialDetails.hospitalityDetails.preLeased', value);
          if (value === 'No') {
            updateField('commercialDetails.hospitalityDetails.monthlyRent', '');
            updateField('commercialDetails.hospitalityDetails.leaseDuration', '');
          }
        }}
        options={['Yes', 'No']}
      />

      {/* Show only if Pre-leased is Yes */}
      {isPreLeased && (
        <div className="space-y-4">
          <NumberField
            label="Current rent per month"
            name="monthlyRent"
            value={hospitalityData.monthlyRent}
            onChange={(value) => updateField('commercialDetails.hospitalityDetails.monthlyRent', value)}
            placeholder="₹ Current rent per month"
          />

          <NumberField
            label="Lease Duration"
            name="leaseDuration"
            value={hospitalityData.leaseDuration}
            onChange={(value) => updateField('commercialDetails.hospitalityDetails.leaseDuration', value)}
            placeholder="e.g., 3 Years"
          />
        </div>
      )}



      {/* ==================== OTHER FEATURES ==================== */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Other Features</h3>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={hospitalityData.wheelchairFriendly || false}
            onChange={(e) => updateField('commercialDetails.hospitalityDetails.wheelchairFriendly', e.target.checked)}
            className="w-4 h-4 text-green-600 rounded"
          />
          <span className="text-sm">Wheelchair friendly</span>
        </label>
      </div>

      {/* ==================== TYPE OF FLOORING ==================== */}
      <div className="border-t pt-6">
        <SelectField
          label="Type of Flooring"
          name="flooringType"
          value={hospitalityData.flooringType}
          onChange={(value) => updateField('commercialDetails.hospitalityDetails.flooringType', value)}
          options={FLOORING_TYPES}
          placeholder="Marble"
        />
      </div>

      {/* ==================== DESCRIPTION ==================== */}
      <DescriptionSection formData={formData} updateField={updateField} />{/* ==================== AMENITIES ==================== */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Amenities</h3>
        <CheckboxGroup
          name="amenities"
          selected={hospitalityData.amenities || []}
          onChange={(value) => updateField('commercialDetails.hospitalityDetails.amenities', value)}
          options={HOSPITALITY_AMENITIES}
        />
      </div>
      <VaasthuDetails
        formData={hospitalityData}
        updateField={(key, value) =>
          updateField(`commercialDetails.hospitalityDetails.vastuDetails.${key}`, value)
        }
        fields={hospitalityVaasthuFields}
      />

    </div>
  );
};

export default HospitalityForm;

