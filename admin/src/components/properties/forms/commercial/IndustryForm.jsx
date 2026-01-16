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
import { industrialVaasthuFields } from '../../../../constants/vastuFields';
import VaasthuDetails from '../../sections/VaasthuDetails';
const IndustryForm = ({ formData, updateField }) => {
  const isReadyToMove = formData.availabilityStatus === 'Ready to move';
  const isUnderConstruction = formData.availabilityStatus === 'Under construction';
  const isPreLeased = formData.preLeased === 'Yes';

  return (
    <div className="space-y-6 border-t pt-6">
      
      {/* ==================== LOCATION ==================== */}
      <LocationSection formData={formData} updateField={updateField} />

      {/* ==================== ROOM DETAILS ==================== */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Add Room Details</h3>
        <NumberButtonGroup
          label="No.of Washrooms"
          name="noOfWashrooms"
          value={formData.noOfWashrooms}
          onChange={(value) => updateField('noOfWashrooms', value)}
          options={ROOM_TYPES}
        />
      </div>

      {/* ==================== AREA DETAILS ==================== */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Add Area Details</h3>
        <div className="relative">
          <NumberField
            label="Plot Area"
            name="plotArea"
            value={formData.plotArea}
            onChange={(value) => updateField('plotArea', value)}
            placeholder="Plot Area"
          />
          <span className="absolute right-3 top-9 text-gray-400 text-sm">sqft</span>
        </div>
      </div>

      {/* ==================== AVAILABILITY STATUS ==================== */}
      <div className="border-t pt-6">
        <ToggleButtons
          label="Availability Status"
          name="availabilityStatus"
          value={formData.availabilityStatus || 'Ready to move'}
          onChange={(value) => {
            updateField('availabilityStatus', value);
            // Clear conditional fields when switching
            if (value === 'Ready to move') {
              updateField('possessionYear', '');
              updateField('possessionMonth', '');
            } else {
              updateField('ageOfProperty', []);
            }
          }}
          options={['Ready to move', 'Under construction']}
        />

        {/* Show Age of Property only for Ready to Move */}
        {isReadyToMove && (
          <div className="mt-6">
            <CheckboxGroup
              label="Age of Property"
              name="ageOfProperty"
              selected={formData.ageOfProperty || []}
              onChange={(value) => updateField('ageOfProperty', value)}
              options={AGE_OF_PROPERTY}
            />
          </div>
        )}

        {/* Show Possession By only for Under Construction */}
        {isUnderConstruction && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">Possession By</h4>
            <div className="grid grid-cols-2 gap-4">
              <SelectField
                name="possessionYear"
                value={formData.possessionYear}
                onChange={(value) => updateField('possessionYear', value)}
                options={['2024', '2025', '2026', '2027', '2028', '2029', '2030']}
                placeholder="2032"
              />
              <SelectField
                name="possessionMonth"
                value={formData.possessionMonth}
                onChange={(value) => updateField('possessionMonth', value)}
                options={POSSESSION_MONTHS}
                placeholder="Month"
              />
            </div>
          </div>
        )}
      </div>

      {/* ==================== OWNERSHIP ==================== */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-3">Ownership</h3>
        <div className="flex flex-wrap gap-2">
          {OWNERSHIP_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => updateField('ownershipType', type)}
              className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                formData.ownershipType === type
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
        value={formData.approvedBy}
        onChange={(value) => updateField('approvedBy', value)}
        placeholder="+ Local Authority"
      />

      {/* ==================== INDUSTRY TYPE APPROVED ==================== */}
      <SelectField
        label="Approved for Industry Type(optional)"
        name="approvedIndustryType"
        value={formData.approvedIndustryType}
        onChange={(value) => updateField('approvedIndustryType', value)}
        options={INDUSTRY_TYPES_APPROVED}
        placeholder="Select Industry Type"
      />

      {/* ==================== PRICING DETAILS ==================== */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Expected Price Details</h3>
        
        <NumberField
          label="Expected Price"
          name="expectedPrice"
          value={formData.expectedPrice}
          onChange={(value) => updateField('expectedPrice', value)}
          placeholder="₹ Expected Price"
        />

        <div className="mt-3">
          <PricingSection formData={formData} updateField={updateField} />
        </div>

        <button type="button" className="text-green-600 text-sm mt-2">
          + Add more pricing details
        </button>
      </div>

      {/* ==================== PRE-LEASED ==================== */}
      <RadioButtons
        label="Is it Pre-leased/ Pre-Reneted?"
        name="preLeased"
        value={formData.preLeased}
        onChange={(value) => {
          updateField('preLeased', value);
          // Clear fields when switching to No
          if (value === 'No') {
            updateField('currentRent', '');
            updateField('leaseTenure', '');
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
            value={formData.currentRent}
            onChange={(value) => updateField('currentRent', value)}
            placeholder="₹ Current rent per month"
          />

          <NumberField
            label="Lease tenure in years"
            name="leaseTenure"
            value={formData.leaseTenure}
            onChange={(value) => updateField('leaseTenure', value)}
            placeholder="Lease tenure in years"
          />
        </div>
      )}

      {/* ==================== DESCRIPTION ==================== */}
      <TextAreaField
        label="Description"
        name="description"
        value={formData.description}
        onChange={(value) => updateField('description', value)}
        placeholder="Write here what makes your property unique"
        rows={4}
      />

      {/* ==================== AMENITIES ==================== */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Amenities</h3>
        <CheckboxGroup
          name="amenities"
          selected={formData.amenities || []}
          onChange={(value) => updateField('amenities', value)}
          options={INDUSTRY_AMENITIES}
        />
      </div>

      {/* ==================== OTHER FEATURES ==================== */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Other Features</h3>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.wheelchairFriendly || false}
            onChange={(e) => updateField('wheelchairFriendly', e.target.checked)}
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
          selected={formData.locationAdvantages || []}
          onChange={(value) => updateField('locationAdvantages', value)}
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

