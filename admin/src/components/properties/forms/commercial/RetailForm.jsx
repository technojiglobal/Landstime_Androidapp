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
import DescriptionSection from '../../sections/DescriptionSection';

const RetailForm = ({ formData, updateField,images, setImages }) => {
  const retail = formData.commercialDetails?.retailDetails || {};

const setRetail = (key, value) => {
  // Ensure retailDetails exists first
  if (!formData.commercialDetails?.retailDetails) {
    updateField('commercialDetails.retailDetails', {});
  }

  // Handle nested paths (e.g., "vaasthuDetails.mainFacing")
  if (key.includes('.')) {
    const parts = key.split('.');
    const mainKey = parts[0];
    const subKey = parts.slice(1).join('.');
    
    // Ensure the parent object exists
    const currentValue = formData.commercialDetails?.retailDetails?.[mainKey] || {};
    
    // Create updated nested object
    const updatedNested = { ...currentValue };
    let current = updatedNested;
    const pathParts = subKey.split('.');
    
    for (let i = 0; i < pathParts.length - 1; i++) {
      current[pathParts[i]] = current[pathParts[i]] || {};
      current = current[pathParts[i]];
    }
    current[pathParts[pathParts.length - 1]] = value;
    
    // Update the main key with the nested structure
    updateField(`commercialDetails.retailDetails.${mainKey}`, updatedNested);
  } else {
    // Simple key update
    updateField(`commercialDetails.retailDetails.${key}`, value);
  }
};



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
        <h3 className="text-lg font-semibold text-left mb-4">Area (sqft)<span className="text-red-500 ml-1">*</span>
</h3>
        
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
           label="Entrance Width"
  name="entranceWidth"
  value={retail.entranceWidth}
  onChange={(value) => setRetail('entranceWidth', value)}
  placeholder="ft"
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
          setRetail('washroomTypes', current.filter(t => t !== 'Private'));
        } else {
          setRetail('washroomTypes', [...current, 'Private']);
        }
      }}
      className={`px-4 py-2 rounded-full border text-sm transition-colors ${
        (retail.washroomTypes || []).includes('Private')
          ? 'bg-green-500 text-white border-green-500'
          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
      }`}
    >
      Private washrooms
    </button>
    
    <button
      type="button"
      onClick={() => {
        const current = retail.washroomTypes || [];
        if (current.includes('Public')) {
          setRetail('washroomTypes', current.filter(t => t !== 'Public'));
        } else {
          setRetail('washroomTypes', [...current, 'Public']);
        }
      }}
      className={`px-4 py-2 rounded-full border text-sm transition-colors ${
        (retail.washroomTypes || []).includes('Public')
          ? 'bg-green-500 text-white border-green-500'
          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
      }`}
    >
      Public washrooms
    </button>
    
    <button
      type="button"
      onClick={() => setRetail('washroomTypes', [])}
      className={`px-4 py-2 rounded-full border text-sm transition-colors ${
        (retail.washroomTypes || []).length === 0
          ? 'bg-green-500 text-white border-green-500'
          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
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
          setRetail('parkingType', current.filter(t => t !== 'Private Parking'));
        } else {
          setRetail('parkingType', [...current, 'Private Parking']);
        }
      }}
      className={`px-4 py-2 rounded-full border text-sm transition-colors ${
        (retail.parkingType || []).includes('Private Parking')
          ? 'bg-green-500 text-white border-green-500'
          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
      }`}
    >
      Private Parking
    </button>
    
    <button
      type="button"
      onClick={() => {
        const current = retail.parkingType || [];
        if (current.includes('Public Parking')) {
          setRetail('parkingType', current.filter(t => t !== 'Public Parking'));
        } else {
          setRetail('parkingType', [...current, 'Public Parking']);
        }
      }}
      className={`px-4 py-2 rounded-full border text-sm transition-colors ${
        (retail.parkingType || []).includes('Public Parking')
          ? 'bg-green-500 text-white border-green-500'
          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
      }`}
    >
      Public Parking
    </button>
    
    <button
      type="button"
      onClick={() => {
        const current = retail.parkingType || [];
        if (current.includes('Multilevel Parking')) {
          setRetail('parkingType', current.filter(t => t !== 'Multilevel Parking'));
        } else {
          setRetail('parkingType', [...current, 'Multilevel Parking']);
        }
      }}
      className={`px-4 py-2 rounded-full border text-sm transition-colors ${
        (retail.parkingType || []).includes('Multilevel Parking')
          ? 'bg-green-500 text-white border-green-500'
          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
      }`}
    >
      Multilevel Parking
    </button>
    
    <button
      type="button"
      onClick={() => setRetail('parkingType', [])}
      className={`px-4 py-2 rounded-full border text-sm transition-colors ${
        (retail.parkingType || []).length === 0
          ? 'bg-green-500 text-white border-green-500'
          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
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
  label={
    <>
      Expected Price
      <span className="text-red-500 ml-1">*</span>
    </>
  }
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
            value={retail.preLeased}
            onChange={(value) => setRetail('preLeased', value)}
            options={['Yes', 'No']}
          />
          
          {retail.preLeased === 'Yes' && (
            <NumberField
              label="Is it Pre leased? (Pre leased?)"
              name="preLeasedAmount"
              value={retail.preLeasedAmount}
              onChange={(value) => setRetail('preLeasedAmount', value)}
              placeholder="Enter amount"
            />
          )}
          
        
              <DescriptionSection formData={formData} updateField={updateField} />
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
      
      {/* ==================== VAASTHU DETAILS ==================== */}
 <VaasthuDetails 
  formData={retail.vaasthuDetails || {}}
  updateField={(key, value) => 
    setRetail(`vaasthuDetails.${key}`, value)
  }
  fields={retailVaasthuFields}
/>

    </div>
  );
};

export default RetailForm;