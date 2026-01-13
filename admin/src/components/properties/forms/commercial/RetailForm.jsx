import React from 'react';
import NumberField from '../../fields/NumberField';
import SelectField from '../../fields/SelectField';
import TextField from '../../fields/TextField';
import TextAreaField from '../../fields/TextAreaField';
import CheckboxGroup from '../../fields/CheckboxGroup';
import ToggleButtons from '../../fields/ToggleButtons';
import RadioButtons from '../../fields/RadioButtons';
import VaasthuDetails from '../../sections/VaasthuDetails';

import {
  LOCATION_ADVANTAGES,
  OWNERSHIP_TYPES,
  POSSESSION_OPTIONS,
  RETAIL_AMENITIES,
} from '../../../../constants/propertyConstants';
import { retailVaasthuFields } from '../../../../constants/vastuFields';

const RetailForm = ({ formData, updateField }) => {
  return (
    <div className="space-y-6 border-t pt-6">
      
     

      {/* ==================== LOCATION ==================== */}
      <div className="pt-3">
        <h3 className="text-lg font-semibold text-left mb-4">Location</h3>
        
        <TextField
          label="Enter Property Location"
          name="location"
          value={formData.location}
          onChange={(value) => updateField('location', value)}
          placeholder="Enter location"
          required
        />
      </div>
      {/* ==================== LOCATION DETAILS ==================== */}
      <div className="grid grid-cols-1 gap-4">
        <SelectField
          label="Located Inside"
          name="locatedInside"
          value={formData.locatedInside}
          onChange={(value) => updateField('locatedInside', value)}
          options={[
            '', 
            'Business Park', 
            'IT Park', 
            'Mall', 
            'Standalone Building',
            'Commercial Complex',
            'Office Building'
          ]}
          placeholder="Select location type"
        />

       
      </div>
      

      {/* ==================== AREA ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Area (sqft)</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label="Carpet Area"
            name="carpetArea"
            value={formData.carpetArea}
            onChange={(value) => updateField('carpetArea', value)}
            placeholder="sqft"
            required
          />
          
          
        </div>
      </div>

      {/* ==================== SHOP FACADE ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Shop facade (optional)</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Entrance width"
            name="entranceWidth"
            value={formData.entranceWidth}
            onChange={(value) => updateField('entranceWidth', value)}
            placeholder="ft"
          />
          
          <TextField
            label="Ceiling Height"
            name="ceilingHeight"
            value={formData.ceilingHeight}
            onChange={(value) => updateField('ceilingHeight', value)}
            placeholder="ft"
          />
        </div>
      </div>

      {/* ==================== WASHROOM DETAILS ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Washroom details</h3>
        
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              const current = formData.washroomTypes || [];
              if (current.includes('Private')) {
                updateField('washroomTypes', current.filter(t => t !== 'Private'));
              } else {
                updateField('washroomTypes', [...current, 'Private']);
              }
            }}
            className={`px-6 py-3 rounded-full border text-sm transition-colors ${
              (formData.washroomTypes || []).includes('Private')
                ? 'bg-white text-gray-700 border-gray-300'
                : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
            }`}
          >
            + Private washrooms
          </button>
          
          <button
            type="button"
            onClick={() => {
              const current = formData.washroomTypes || [];
              if (current.includes('Public')) {
                updateField('washroomTypes', current.filter(t => t !== 'Public'));
              } else {
                updateField('washroomTypes', [...current, 'Public']);
              }
            }}
            className={`px-6 py-3 rounded-full border text-sm transition-colors ${
              (formData.washroomTypes || []).includes('Public')
                ? 'bg-white text-gray-700 border-gray-300'
                : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
            }`}
          >
            + Public washrooms
          </button>
          
          <button
            type="button"
            onClick={() => updateField('washroomTypes', [])}
            className={`px-6 py-3 rounded-full border text-sm transition-colors ${
              (formData.washroomTypes || []).length === 0
                ? 'bg-white text-gray-700 border-gray-300'
                : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
            }`}
          >
            Not Available
          </button>
        </div>
      </div>

      {/* ==================== FLOOR DETAILS ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Floor Details(Retail)</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label="Total Floors"
            name="totalFloors"
            value={formData.totalFloors}
            onChange={(value) => updateField('totalFloors', value)}
            placeholder="0"
          />
          
          <NumberField
            label="Floor No(where it is located)"
            name="floorNumber"
            value={formData.floorNumber}
            onChange={(value) => updateField('floorNumber', value)}
            placeholder="0"
          />
        </div>
      </div>

      {/* ==================== LICENSED RECOGNITION ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Licensed Recognition(s)</h3>
        
        <div className="grid grid-cols-3 gap-3">
          {['RERA', 'BDA', 'Panchayat', '+Add'].map((license) => (
            <button
              key={license}
              type="button"
              onClick={() => {
                const current = formData.licenses || [];
                if (current.includes(license)) {
                  updateField('licenses', current.filter(l => l !== license));
                } else {
                  updateField('licenses', [...current, license]);
                }
              }}
              className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                (formData.licenses || []).includes(license)
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {license}
            </button>
          ))}
        </div>
      </div>

      {/* ==================== PARKING TYPE ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Parking Type</h3>
        
        <div className="grid grid-cols-2 gap-3">
          {['Car Parking', 'Bike Parking'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => updateField('parkingType', type)}
              className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                formData.parkingType === type
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* ==================== LOCATION ADVANTAGES ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Location Advantages</h3>
        <CheckboxGroup
          name="locationAdvantages"
          selected={formData.locationAdvantages || []}
          onChange={(value) => updateField('locationAdvantages', value)}
          options={LOCATION_ADVANTAGES}
        />
      </div>

      {/* ==================== AVAILABILITY STATUS ==================== */}
      <div className="border-t pt-6">
        <ToggleButtons
          label="Availability Status"
          name="availabilityStatus"
          value={formData.availabilityStatus || ''}
          onChange={(value) => updateField('availabilityStatus', value)}
          options={['Ready to move', 'Under Construction']}
        />
      </div>

      {/* ==================== AGE OF PROPERTY (Only shown when Ready to move) ==================== */}
      {formData.availabilityStatus === 'Ready to move' && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-left mb-4">Age of property</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {['Less than a year', '1-3 years', '3-5 years', '5-10 years', '10+ years'].map((age) => (
              <button
                key={age}
                type="button"
                onClick={() => updateField('ageOfProperty', age)}
                className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                  formData.ageOfProperty === age
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ==================== POSSESSION BY (Only shown when Under Construction) ==================== */}
      {formData.availabilityStatus === 'Under Construction' && (
        <>
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-left mb-4">Possession By</h3>
            
            <TextField
  label="Year"
  name="possessionYear"
  value={formData.possessionYear}
  onChange={(value) => updateField('possessionYear', value)}
  placeholder="Enter year (e.g., 2025)"
/>
          </div>

          {/* Show month field only when year is selected */}
          {formData.possessionYear && (
           
            
  <TextField
    label="Month"
    name="possessionMonth"
    value={formData.possessionMonth}
    onChange={(value) => updateField('possessionMonth', value)}
    placeholder="Enter month (e.g., March)"
  />

           
          )}
        </>
      )}

      {/* ==================== SUITABLE FOR BUSINESS TYPE ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Suitable for business type</h3>
        
        <SelectField
          label="Select business type"
          name="businessType"
          value={formData.businessType}
          onChange={(value) => updateField('businessType', value)}
          options={[
            '',
            'ATM',
            'Bakery',
            'Boutique',
            'Clinic',
            'Clothes',
            'Cloud Kitchen',
            'Coffee',
            'Dental Clinic',
            'Fast Food',
            'Footwear',
            'Grocery',
            'Gym',
            'Jewellery',
            'Juice',
            'Meat',
            'Medical',
            'Mobile',
            'Pub/Bar',
            'Restaurants',
            'Salon/Spa',
            'Stationery',
            'Sweet',
            'Tea Stall',
            'Other'
          ]}
          placeholder="-- Select --"
        />

        {/* Show custom business type field when "Other" is selected */}
        {formData.businessType === 'Other' && (
          <div className="mt-4">
            <TextField
              label="Other Business Type"
              name="otherBusinessType"
              value={formData.otherBusinessType}
              onChange={(value) => updateField('otherBusinessType', value)}
              placeholder="Enter business type"
            />
          </div>
        )}
      </div>

      {/* ==================== OWNERSHIP ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Ownership</h3>
        
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

      {/* ==================== EXPECTED PRICE DETAILS ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Expected Price Details</h3>
        
        <div className="space-y-4">
          <NumberField
            label="₹ (Rent per month)"
            name="rentPerMonth"
            value={formData.rentPerMonth}
            onChange={(value) => updateField('rentPerMonth', value)}
            placeholder="Enter amount"
          />
          
          <NumberField
            label="Price Negotiable"
            name="priceNegotiable"
            value={formData.priceNegotiable}
            onChange={(value) => updateField('priceNegotiable', value)}
            placeholder="Enter amount"
          />
          
          <NumberField
            label="Advance Deposit(optional)"
            name="advanceDeposit"
            value={formData.advanceDeposit}
            onChange={(value) => updateField('advanceDeposit', value)}
            placeholder="Enter amount"
          />
          
          <RadioButtons
            label="Is it Pre leased? (Pre leased?)"
            name="preLeased"
            value={formData.preLeased}
            onChange={(value) => updateField('preLeased', value)}
            options={['Yes', 'No']}
          />
          
          {formData.preLeased === 'Yes' && (
            <NumberField
              label="Is it Pre leased? (Pre leased?)"
              name="preLeasedAmount"
              value={formData.preLeasedAmount}
              onChange={(value) => updateField('preLeasedAmount', value)}
              placeholder="Enter amount"
            />
          )}
          
          <TextAreaField
            label="Description"
            name="description"
            value={formData.description}
            onChange={(value) => updateField('description', value)}
            placeholder="Describe your property"
            rows={4}
          />
        </div>
      </div>

      {/* ==================== AMENITIES ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Amenities</h3>
        <CheckboxGroup
          name="amenities"
          selected={formData.amenities || []}
          onChange={(value) => updateField('amenities', value)}
          options={RETAIL_AMENITIES}
        />
      </div>

      {/* ==================== VAASTHU DETAILS ==================== */}
      <VaasthuDetails 
        formData={formData} 
        updateField={updateField} 
        fields={retailVaasthuFields}
      />

    </div>
  );
};

export default RetailForm;