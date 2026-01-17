import {useState,React} from 'react';
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
const HospitalityForm = ({ formData, updateField }) => {
  const isReadyToMove = formData.availabilityStatus === 'Ready to move';
  const isUnderConstruction = formData.availabilityStatus === 'Under construction';
  const isPreLeased = formData.preLeased === 'Yes';
const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [pricingDetails, setPricingDetails] = useState(null);
  const handlePricingSubmit = (data) => {
    setPricingDetails(data);
    console.log('Pricing details:', data);
    // You can store this in your main form state or send to API
  };
  return (
    <div className="space-y-6 border-t pt-6">
      
      {/* ==================== LOCATION ==================== */}
      <LocationSection formData={formData} updateField={updateField} />

      {/* ==================== ROOM DETAILS ==================== */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Add Room Details</h3>
        
        <NumberField
          label="No.of Rooms"
          name="noOfRooms"
          value={formData.noOfRooms}
          onChange={(value) => updateField('noOfRooms', value)}
          placeholder="Enter the total no.of rooms"
        />

        <div className="mt-4">
          <NumberButtonGroup
            label="No.of Washrooms"
            name="noOfWashrooms"
            value={formData.noOfWashrooms}
            onChange={(value) => updateField('noOfWashrooms', value)}
            options={[ '1', '2', '3', '4', '4+']}
          />
        </div>

        <div className="mt-4">
          <NumberButtonGroup
            label="Balconies"
            name="balconies"
            value={formData.balconies}
            onChange={(value) => updateField('balconies', value)}
            options={['0', '1', '2', '3', '3+']}
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Other rooms (optional)</label>
          <div className="flex flex-wrap gap-2">
            {['Pooja Room', 'Study Room', 'Servant Room', 'Other'].map((room) => (
              <button
                key={room}
                type="button"
                onClick={() => {
                  const current = formData.otherRooms || [];
                  const updated = current.includes(room)
                    ? current.filter(r => r !== room)
                    : [...current, room];
                  updateField('otherRooms', updated);
                }}
                className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                  (formData.otherRooms || []).includes(room)
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                + {room}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== FURNISHING ==================== */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Furnishing</h3>
        <RadioButtons
          name="furnishing"
          value={formData.furnishing}
          onChange={(value) => updateField('furnishing', value)}
          options={FURNISHING_OPTIONS}
        />
      </div>
<AvailabilityStatus formData={formData} updateField={updateField} />
    
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

      {/* ==================== INDUSTRY TYPE (For Hospitality it's optional) ==================== */}
      <SelectField
        label="Approved for Industry Type(optional)"
        name="approvedIndustryType"
        value={formData.approvedIndustryType}
        onChange={(value) => updateField('approvedIndustryType', value)}
        options={['Hospitality', 'Hotel', 'Resort', 'Guest House', 'Restaurant', 'Other']}
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

      {/* ====================  ==================== */}
     
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

      {/* ==================== TYPE OF FLOORING ==================== */}
      <div className="border-t pt-6">
        <SelectField
          label="Type of Flooring"
          name="flooringType"
          value={formData.flooringType}
          onChange={(value) => updateField('flooringType', value)}
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
          selected={formData.amenities || []}
          onChange={(value) => updateField('amenities', value)}
          options={HOSPITALITY_AMENITIES}
        />
      </div>


    </div>
  );
};

export default HospitalityForm;

