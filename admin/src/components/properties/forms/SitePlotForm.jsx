import React from 'react';
import NumberField from '../fields/NumberField';
import TextField from '../fields/TextField';
import RadioButtons from '../fields/RadioButtons';
import NumberButtonGroup from '../fields/NumberButtonGroup';
import CheckboxGroup from '../fields/CheckboxGroup';
import SelectField from '../fields/SelectField';
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
const SitePlotForm = ({ formData, updateField }) => (
  <div className="space-y-6 border-t pt-6">
    <h3 className="text-lg font-semibold text-left">Basic Details</h3>
    <LocationSection formData={formData} updateField={updateField} />
    

   

    {/* Price and Area Grid */}
    <div className="grid grid-cols-2 gap-4">
     
      <NumberField
        label="Area (sqft)"
        name="area"
        value={formData.area}
        onChange={(value) => updateField('area', value)}
      />
     
      <TextField
        label="Length (optional)"
        name="length"
        value={formData.length}
        onChange={(value) => updateField('length', value)}
        placeholder="in ft."
      />
      <TextField
        label="Breadth (optional)"
        name="breadth"
        value={formData.breadth}
        onChange={(value) => updateField('breadth', value)}
        placeholder="in ft."
      />
      <TextField
        label="Floors Allowed for Construction"
        name="floorsAllowed"
        value={formData.floorsAllowed}
        onChange={(value) => updateField('floorsAllowed', value)}
        placeholder="No of floors"
      />
    </div>

    {/* Questions */}
    <RadioButtons
      label="Is there a boundary wall around the property?"
      name="boundaryWall"
      value={formData.boundaryWall}
      onChange={(value) => updateField('boundaryWall', value)}
      options={['Yes', 'No']}
    />

    <NumberButtonGroup
      label="No. of open sides"
      name="openSides"
      value={formData.openSides}
      onChange={(value) => updateField('openSides', value)}
      options={['1', '2', '3', '3+']}
    />

    <RadioButtons
      label="Any construction done on this property?"
      name="construction"
      value={formData.construction}
      onChange={(value) => updateField('construction', value)}
      options={['Yes', 'No']}
    />

    {/* If construction is done, show this */}
{formData.construction === 'Yes' && (
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
            const currentTypes = formData.constructionTypes || [];
            if (currentTypes.includes(type)) {
              updateField('constructionTypes', currentTypes.filter(t => t !== type));
            } else {
              updateField('constructionTypes', [...currentTypes, type]);
            }
          }}
          className={`px-5 py-2 rounded-full border text-sm transition-colors ${
            (formData.constructionTypes || []).includes(type)
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

     {/* ==================== OWNERSHIP ==================== */}
         <div className="border-t pt-6">
           <h3 className="text-lg font-semibold text-left mb-3">Ownership</h3>
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

          {/* ==================== AUTHORITY APPROVAL (OPTIONAL) ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Which authority the property is approved by?(optional)</h3>
        
        <div className="flex flex-wrap gap-3">
          {['Gram Panchayat', 'Local Authority'].map((authority) => (
            <button
              key={authority}
              type="button"
              onClick={() => updateField('authorityApproval', authority)}
              className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                formData.authorityApproval === authority
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {authority}
            </button>
          ))}
        </div>
      </div>
     {/* ==================== PRICING DETAILS ==================== */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Price Details</h3>
        
        <NumberField
          label=""
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
     <DescriptionSection formData={formData} updateField={updateField} />
    {/* Amenities */}
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold text-left mb-4">Amenities</h3>
      <CheckboxGroup
        name="amenities"
        selected={formData.amenities || []}
        onChange={(value) => updateField('amenities', value)}
        options={AMENITIES}
      />
    </div>

   {/* ==================== OVERLOOKING ==================== */}
<div className="border-t pt-6">
  <h3 className="text-base font-medium text-gray-600 text-left mb-4">
    Overlooking
  </h3>
  
  <div className="flex flex-wrap gap-3">
    {['Pool', 'Park/Garden', 'Club', 'Main Road', 'Others'].map((option) => (
      <button
        key={option}
        type="button"
        onClick={() => {
          const currentOverlooking = formData.overlooking || [];
          if (currentOverlooking.includes(option)) {
            updateField('overlooking', currentOverlooking.filter(o => o !== option));
          } else {
            updateField('overlooking', [...currentOverlooking, option]);
          }
        }}
        className={`px-5 py-2 rounded-full border text-sm transition-colors ${
          (formData.overlooking || []).includes(option)
            ? 'bg-green-500 text-white border-green-500'
            : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
        }`}
      >
        + {option}
      </button>
    ))}
  </div>
</div>

{/* ==================== OVERLOOKING CHECKBOXES ==================== */}
<div className="border-t pt-6">
  <h3 className="text-base font-medium text-gray-600 text-left mb-4">
    Overlooking
  </h3>
  
  <div className="space-y-3">
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={(formData.overlookingOptions || []).includes('In a gated society')}
        onChange={(e) => {
          const current = formData.overlookingOptions || [];
          if (e.target.checked) {
            updateField('overlookingOptions', [...current, 'In a gated society']);
          } else {
            updateField('overlookingOptions', current.filter(o => o !== 'In a gated society'));
          }
        }}
        className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500"
      />
      <span className="text-gray-600">In a gated society</span>
    </label>
    
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={(formData.overlookingOptions || []).includes('Corner Property')}
        onChange={(e) => {
          const current = formData.overlookingOptions || [];
          if (e.target.checked) {
            updateField('overlookingOptions', [...current, 'Corner Property']);
          } else {
            updateField('overlookingOptions', current.filter(o => o !== 'Corner Property'));
          }
        }}
        className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500"
      />
      <span className="text-gray-600">Corner Property</span>
    </label>
  </div>
</div>

{/* ==================== PROPERTY FACING ==================== */}
<div className="border-t pt-6">
  <h3 className="text-base font-medium text-gray-600 text-left mb-4">
    Property Facing
  </h3>
  
  <div className="flex flex-wrap gap-3">
    {['North', 'South', 'East', 'West', 'North-West', 'South-East', 'South-West'].map((direction) => (
      <button
        key={direction}
        type="button"
        onClick={() => updateField('propertyFacing', direction)}
        className={`px-5 py-2 rounded-full border text-sm transition-colors ${
          formData.propertyFacing === direction
            ? 'bg-green-500 text-white border-green-500'
            : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
        }`}
      >
        {direction}
      </button>
    ))}
  </div>
</div>

{/* ==================== WIDTH OF FACING ROAD ==================== */}
<div className="border-t pt-6">
  <h3 className="text-base font-medium text-gray-600 text-left mb-4">
    Width of facing road
  </h3>
  
  <div className="relative">
    <input
      type="text"
      name="widthOfFacingRoad"
      value={formData.widthOfFacingRoad || ''}
      onChange={(e) => updateField('widthOfFacingRoad', e.target.value)}
      placeholder="Enter the width"
      className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
    />
    <div className="absolute right-3 top-1/2 -translate-y-1/2">
      <select
        value={formData.widthUnit || 'sqft'}
        onChange={(e) => updateField('widthUnit', e.target.value)}
        className="border-none bg-transparent text-gray-400 text-sm focus:outline-none cursor-pointer pr-6"
      >
        <option value="sqft">sqft</option>
        <option value="feet">Feet</option>
        <option value="meter">Meter</option>
        <option value="yard">Yard</option>
      </select>
      <svg className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</div>

    


    {/* Location Advantages */}
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold text-left mb-4">Location Advantages</h3>
      <CheckboxGroup
        name="locationAdvantages"
        selected={formData.locationAdvantages || []}
        onChange={(value) => updateField('locationAdvantages', value)}
        options={LOCATION_ADVANTAGES}
      />
    </div>

   

    {/* Vaasthu Details - Now using the component with sitePlotVaasthuFields */}
    <VaasthuDetails 
      formData={formData} 
      updateField={updateField} 
      fields={sitePlotVaasthuFields}
    />
  </div>
);

export default SitePlotForm;