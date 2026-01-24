import React from 'react';
import LocationSection from '../../sections/LocationSection';
import NumberField from '../../fields/NumberField';
import TextField from '../../fields/TextField';
import SelectField from '../../fields/SelectField';
import TextAreaField from '../../fields/TextAreaField';
import ToggleButtons from '../../fields/ToggleButtons';
import RadioButtons from '../../fields/RadioButtons';
import CheckboxGroup from '../../fields/CheckboxGroup';
import NumberButtonGroup from '../../fields/NumberButtonGroup';
import PricingSection from '../../sections/PricingSection';
import {
  ROOM_TYPES,
  AGE_OF_PROPERTY,
  POSSESSION_MONTHS,
  OWNERSHIP_TYPES,
  INDUSTRY_TYPES_APPROVED,
  INDUSTRY_AMENITIES,
  LOCATION_ADVANTAGES
} from '../../../../constants/propertyConstants';
import AvailabilityStatus from '../../sections/AvailabilityStatus';
import { industrialVaasthuFields } from '../../../../constants/vastuFields';
import VaasthuDetails from '../../sections/VaasthuDetails';
import ImageUpload from '../../fields/ImageUpload';
const IndustryForm = ({ formData, updateField, images, setImages }) => {
  const industry = formData.commercialDetails?.industryDetails || {};
const setIndustry = (key, value) =>
  updateField(`commercialDetails.industryDetails.${key}`, value);
  const isReadyToMove = industry.availabilityStatus === 'Ready to move';
const isUnderConstruction = industry.availabilityStatus === 'Under construction';
const isPreLeased = industry.preLeased === 'Yes';
 

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
      {/* ==================== ROOM DETAILS ==================== */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Add Room Details</h3>
        <NumberButtonGroup
          label="No.of Washrooms"
          name="noOfWashrooms"
          value={industry.noOfWashrooms || ''}
          onChange={(value) => setIndustry('noOfWashrooms', value)}
          options={ROOM_TYPES}
        />
      </div>

      {/* ==================== AREA DETAILS ==================== */}

      <div className="border-t pt-6">
  <label className="block text-sm font-medium mb-2">Carpet Area *</label>

        <div className="flex gap-2">
          <input
            type="number"
            value={industry.plotArea || ''}
            onChange={(e) => setIndustry('plotArea', e.target.value)}
           placeholder="Carpet Area"
  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
required
          />
          <select
            value={industry.carpetAreaUnit || 'sqft'}
            onChange={(e) => setIndustry('carpetAreaUnit', e.target.value)}
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="sqft">sqft</option>
            <option value="sqm">sqm</option>
            <option value="sqyd">sqyd</option>
          </select>
        </div>
      </div>
      {/* ==================== AVAILABILITY STATUS ==================== */}
     <AvailabilityStatus formData={industry} updateField={setIndustry} />

      {/* ==================== OWNERSHIP ==================== */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-3">Ownership</h3>
        <div className="flex flex-wrap gap-2">
          {OWNERSHIP_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setIndustry('ownershipType', type)}
              className={`px-4 py-2 rounded-full border text-sm transition-colors ${industry.ownershipType === type
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
        name="approvedBy"
        value={industry.approvedBy || ''}
        onChange={(value) => setIndustry('approvedBy', value)}
        placeholder="+ Local Authority"
      />

      {/* ==================== INDUSTRY TYPE APPROVED ==================== */}
      <SelectField
        label="Approved for Industry Type(optional)"
        name="approvedIndustryType"
        value={industry.approvedIndustryType || ''}
        onChange={(value) => setIndustry('approvedIndustryType', value)}
        options={INDUSTRY_TYPES_APPROVED}
        placeholder="Select Industry Type"
      />

      {/* ==================== PRICING DETAILS ==================== */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Expected Price Details</h3>

        <NumberField
          label="Expected Price"
          name="expectedPrice"
          value={industry.expectedPrice || ''}
          onChange={(value) => setIndustry('expectedPrice', value)}
          placeholder="₹ Expected Price"
        />

        <div className="mt-3">
          <PricingSection formData={formData} updateField={setIndustry} />
        </div>

        <button type="button" className="text-green-600 text-sm mt-2">
          + Add more pricing details
        </button>
      </div>

      {/* ==================== PRE-LEASED ==================== */}
      <RadioButtons
        label="Is it Pre-leased/ Pre-Reneted?"
        name="preLeased"
        value={industry.preLeased || ''}
        onChange={(value) => {
          setIndustry('preLeased', value);
          // Clear fields when switching to No
          if (value === 'No') {
            setIndustry('currentRent', '');
            setIndustry('leaseTenure', '');
          }
        }}
        options={['Yes', 'No']}
      />

      {/* Show only if Pre-leased is Yes */}
      {isPreLeased && (
        <div className="space-y-4">
          <NumberField
            label="Current rent per month"
            name="currentRent"
            value={industry.currentRent}
            onChange={(value) => setIndustry('currentRent', value)}
            placeholder="₹ Current rent per month"
          />

          <NumberField
            label="Lease tenure in years"
            name="leaseTenure"
            value={industry.leaseTenure}
            onChange={(value) => setIndustry('leaseTenure', value)}
            placeholder="Lease tenure in years"
          />
        </div>
      )}

      {/* ==================== DESCRIPTION ==================== */}
      <TextAreaField
        label="Description"
        name="description"
        value={industry.description || ''}
        onChange={(value) => setIndustry('description', value)}
        placeholder="Write here what makes your property unique"
        rows={4}
      />

      {/* ==================== AMENITIES ==================== */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Amenities</h3>
        <CheckboxGroup
          name="amenities"
          selected={industry.amenities || []}
          onChange={(value) => setIndustry('amenities', value)}
          options={INDUSTRY_AMENITIES}
        />
      </div>

      {/* ==================== OTHER FEATURES ==================== */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Other Features</h3>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={industry.wheelchairFriendly || false}
            onChange={(e) => setIndustry('wheelchairFriendly', e.target.checked)}
            className="w-4 h-4 text-green-600 rounded"
          />
          <span className="text-sm">Wheelchair friendly</span>
        </label>
      </div>

      {/* ==================== LOCATION ADVANTAGES ==================== */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Location Advantages</h3>
        <CheckboxGroup
          name="locationAdvantages"
          selected={industry.locationAdvantages || []}
          onChange={(value) => setIndustry('locationAdvantages', value)}
          options={LOCATION_ADVANTAGES}
        />
      </div>

      <VaasthuDetails
        formData={formData}
        updateField={updateField}
        fields={industrialVaasthuFields}
      />


    </div>
  );
};

export default IndustryForm;

