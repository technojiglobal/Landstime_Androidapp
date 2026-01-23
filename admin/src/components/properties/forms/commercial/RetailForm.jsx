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
import LocationSection from '../../sections/LocationSection';
import AvailabilityStatus from '../../sections/AvailabilityStatus';
import ImageUpload from '../../fields/ImageUpload';
import PricingSection from '../../sections/PricingSection';

const RetailForm = ({ formData, updateField,images, setImages }) => {
  const retail = formData.commercialDetails?.retailDetails || {};

const setRetail = (key, value) =>
  updateField(`commercialDetails.retailDetails.${key}`, value);

  return (
    <div className="space-y-6 border-t pt-6">
      
     {/* ==================== LOCATION SECTION ==================== */}
      <LocationSection formData={formData} updateField={updateField} />
         <ImageUpload
        label="Property Images"
        images={images}
        onChange={setImages}
        maxImages={20}
        required={true}
      />   
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
  value={retail.carpetArea}
  onChange={(value) => setRetail('carpetArea', value)}
/>

          
          
        </div>
      </div>

      {/* ==================== SHOP FACADE ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Shop facade (optional)</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <TextField
  value={retail.entranceWidth}
  onChange={(value) => setRetail('entranceWidth', value)}
/>

          
          <TextField
            label="Ceiling Height"
            name="ceilingHeight"
            value={retail.ceilingHeight}
  onChange={(value) => setRetail('ceilingHeight', value)}

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
              const current = retail.washroomTypes || [];
              if (current.includes('Private')) {
                updateField('washroomTypes', current.filter(t => t !== 'Private'));
              } else {
                setRetail('washroomTypes', [...current, 'Private']);
              }
            }}
            className={`px-4 py-2 rounded-full border text-sm transition-colors ${
              (retail.washroomTypes || []).includes('Private')
                ? 'bg-white text-gray-700 border-gray-300'
                : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
            }`}
          >
            + Private washrooms
          </button>
          
          <button
            type="button"
            onClick={() => {
              const current = retail.washroomTypes || [];
              if (current.includes('Public')) {
                updateField('washroomTypes', current.filter(t => t !== 'Public'));
              } else {
                updateField('washroomTypes', [...current, 'Public']);
              }
            }}
            className={`px-4 py-2 rounded-full border text-sm transition-colors ${
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
            className={`px-4 py-2 rounded-full border text-sm transition-colors ${
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
        <h3 className="text-lg font-semibold text-left mb-4">Floor Details(Optional)</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label="Total Floors"
            name="totalFloors"
value={retail.totalFloors}
  onChange={(value) => setRetail('totalFloors', value)}
            placeholder="0"
          />
          
         
        </div>
      </div>

      {/* ==================== LICENSED RECOGNITION ====================
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
      </div> */}

    {/* ==================== PARKING TYPE ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Parking Type</h3>
        
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              const current = retail.parkingType || [];
              if (current.includes('Private Parking')) {
                updateField('parkingType', current.filter(t => t !== 'Private Parking'));
              } else {
                updateField('parkingType', [...current, 'Private Parking']);
              }
            }}
            className={`px-4 py-2 rounded-full border text-sm transition-colors ${
              (retail.parkingType || []).includes('Private Parking')
                ? 'bg-white text-gray-700 border-gray-300'
                : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
            }`}
          >
            + Private Parking
          </button>
          
          <button
            type="button"
            onClick={() => {
              const current = retail.parkingType || [];
              if (current.includes('Public Parking')) {
                updateField('parkingType', current.filter(t => t !== 'Public Parking'));
              } else {
               setRetail('parkingType', [...current, 'Public Parking']);

              }
            }}
            className={`px-4 py-2 rounded-full border text-sm transition-colors ${
              (retail.parkingType || []).includes('Public Parking')
                ? 'bg-white text-gray-700 border-gray-300'
                : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
            }`}
          >
            + Public Parking
          </button>
          
          <button
            type="button"
            onClick={() => {
              const current = retail.parkingType || [];
              if (current.includes('Multilevel Parking')) {
                updateField('parkingType', current.filter(t => t !== 'Multilevel Parking'));
              } else {
                updateField('parkingType', [...current, 'Multilevel Parking']);
              }
            }}
            className={`px-4 py-2 rounded-full border text-sm transition-colors ${
              (retail.parkingType || []).includes('Multilevel Parking')
                ? 'bg-white text-gray-700 border-gray-300'
                : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
            }`}
          >
            + Multilevel Parking
          </button>
          
          <button
            type="button"
            onClick={() => updateField('parkingType', [])}
            className={`px-4 py-2 rounded-full border text-sm transition-colors ${
              (retail.parkingType || []).length === 0
                ? 'bg-white text-gray-700 border-gray-300'
                : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
            }`}
          >
            Not Available
          </button>
        </div>
      </div>

     
      {/* ==================== AVAILABILITY STATUS ==================== */}
      <AvailabilityStatus
  formData={retail}
  updateField={(key, value) =>
    updateField(`commercialDetails.retailDetails.${key}`, value)
  }
/>


      {/* ==================== SUITABLE FOR BUSINESS TYPE ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Suitable for business type</h3>
        
        <SelectField
          label="Select business type"
          name="businessType"
          value={retail.businessType}
  onChange={(value) => setRetail('businessType', value)}
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
        {retail.businessType === 'Other' && (
          <div className="mt-4">
            <TextField
              label="Other Business Type"
              name="otherBusinessType"
              value={retail.otherBusinessType}
    onChange={(value) => setRetail('otherBusinessType', value)}

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
              onClick={() => setRetail('ownershipType', type)}
              className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                retail.ownershipType === type
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
        

    <NumberField
      label="Expected Price"
      name="expectedPrice"
       value={retail.expectedPrice}
  onChange={(value) => setRetail('expectedPrice', value)}
      placeholder="₹ Expected Price"
    />
        <PricingSection formData={formData} updateField={updateField} />
        
        <div className="space-y-4">
         
         
          
          
          
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
            value={retail.description}
  onChange={(value) => setRetail('description', value)}

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
          selected={retail.amenities || []}
  onChange={(value) => setRetail('amenities', value)}
          options={RETAIL_AMENITIES}
        />
      </div>
      {/* ==================== LOCATION ADVANTAGES ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Location Advantages</h3>
        <CheckboxGroup
          name="locationAdvantages"
selected={retail.locationAdvantages || []}
  onChange={(value) => setRetail('locationAdvantages', value)}

          options={LOCATION_ADVANTAGES}
        />
      </div>
      {/* ==================== VAASTHU DETAILS ==================== */}
   <VaasthuDetails 
  formData={retail}
  updateField={(key, value) => 
    updateField(`commercialDetails.retailDetails.vaasthuDetails.${key}`, value)
  }
  fields={retailVaasthuFields}  // ✅ Add this
/>

    </div>
  );
};

export default RetailForm;