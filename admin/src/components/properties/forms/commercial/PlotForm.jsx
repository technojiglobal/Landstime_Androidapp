// admin/src/components/properties/forms/commercial/PlotForm.jsx
import React from 'react';
import NumberField from '../../fields/NumberField';
import SelectField from '../../fields/SelectField';
import TextField from '../../fields/TextField';
import TextAreaField from '../../fields/TextAreaField';
import CheckboxGroup from '../../fields/CheckboxGroup';
import ToggleButtons from '../../fields/ToggleButtons';
import RadioButtons from '../../fields/RadioButtons';
import LocationSection from '../../sections/LocationSection';
import {
  LOCATION_ADVANTAGES,
  OWNERSHIP_TYPES,PLOT_AMENITIES,
} from '../../../../constants/propertyConstants';
import VaasthuDetails from '../../sections/VaasthuDetails';
import { sitePlotVaasthuFields } from '../../../../constants/vastuFields';
import OfficePricingDetailsSection from '../../sections/OfficePricingDetailsSection';
import ImageUpload from '../../fields/ImageUpload';
import DescriptionSection from '../../sections/DescriptionSection';

const PlotForm = ({ formData, updateField, images, setImages }) => {
  // ✅ Helper to access nested plot details
  const plotDetails = formData.commercialDetails?.plotDetails || {};
  
  // ✅ Helper to update nested fields
  const updatePlotField = (field, value) => {
    updateField(`commercialDetails.plotDetails.${field}`, value);
  };

  return (
    <div className="space-y-6 border-t pt-6">
      
      {/* ==================== LOCATION SECTION ==================== */}
      <LocationSection formData={formData} updateField={updateField} />

      {/* ==================== PROPERTY IMAGES ==================== */}
      <ImageUpload
        label="Property Images"
        images={images}
        onChange={setImages}
        maxImages={20}
        required={true}
      />  

      {/* ==================== ADD AREA DETAILS ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Add Area Details</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label="Plot Area"
            name="plotArea"
            value={plotDetails.plotArea || ''}
            onChange={(value) => updatePlotField('plotArea', value)}
            placeholder="sqft"
            required
          />
        </div>
      </div>

      {/* ==================== PROPERTY DIMENSIONS (OPTIONAL) ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Property Dimensions (optional)</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Length of plot(in Ft)"
            name="lengthOfPlot"
            value={plotDetails.lengthOfPlot || ''}
            onChange={(value) => updatePlotField('lengthOfPlot', value)}
            placeholder="Ft"
          />
          
          <TextField
            label="Breadth of plot(in Ft)"
            name="breadthOfPlot"
            value={plotDetails.breadthOfPlot || ''}
            onChange={(value) => updatePlotField('breadthOfPlot', value)}
            placeholder="Ft"
          />
        </div>
      </div>

      {/* ==================== WIDTH OF FACING ROAD ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-base font-medium text-gray-700 text-left mb-3">Width of facing road</h3>
        
        <div className="relative">
          <input
            type="text"
            name="widthOfFacingRoad"
            value={plotDetails.widthOfFacingRoad || ''}
            onChange={(e) => updatePlotField('widthOfFacingRoad', e.target.value)}
            placeholder="Enter the width"
            className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-400">
            <span className="text-sm">Feet</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* ==================== NO OF OPEN SIDES ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">No of open sides</h3>
        
        <div className="flex gap-3">
          {['1', '2', '3', '4'].map((side) => (
            <button
              key={side}
              type="button"
              onClick={() => updatePlotField('noOfOpenSides', side)}
              className={`w-12 h-12 rounded-lg border text-sm font-medium transition-colors ${
                plotDetails.noOfOpenSides === side
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {side}
            </button>
          ))}
        </div>
      </div>

      {/* ==================== ANY CONSTRUCTION DONE ON THE PROPERTY ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Any construction done on the property?</h3>
        
        <div className="flex gap-3">
          {['Yes', 'No'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => updatePlotField('constructionDone', option)}
              className={`px-8 py-2 rounded-full border text-sm transition-colors ${
                plotDetails.constructionDone === option
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* ==================== CONSTRUCTION TYPE (Only shown when Yes is selected) ==================== */}
      {plotDetails.constructionDone === 'Yes' && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-left mb-4">What type of construction has been done ?</h3>
          
          <div className="flex flex-wrap gap-3">
            {['Small', 'Extensive', 'Other'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updatePlotField('constructionType', type)}
                className={`px-6 py-2 rounded-full border text-sm transition-colors ${
                  plotDetails.constructionType === type
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ==================== POSSESSION BY ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Possession By</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Year"
            name="possessionYear"
            value={plotDetails.possessionYear || ''}
            onChange={(value) => updatePlotField('possessionYear', value)}
            placeholder="By 2017"
          />
          
          {plotDetails.possessionYear && (
            <TextField
              label="Month"
              name="possessionMonth"
              value={plotDetails.possessionMonth || ''}
              onChange={(value) => updatePlotField('possessionMonth', value)}
              placeholder="Month"
            />
          )}
        </div>
      </div>

      {/* ==================== OWNERSHIP ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Ownership</h3>
        
        <div className="flex flex-wrap gap-2">
          {OWNERSHIP_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => updatePlotField('ownershipType', type)}
              className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                plotDetails.ownershipType === type
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
              onClick={() => updatePlotField('authorityApproval', authority)}
              className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                plotDetails.authorityApproval === authority
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {authority}
            </button>
          ))}
        </div>
      </div>

      {/* ==================== APPROVED FOR INDUSTRY TYPE (OPTIONAL) ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Approved for Industry Type(optional)</h3>
        
        <SelectField
          label="Industry Type"
          name="industryType"
          value={plotDetails.industryType || ''}
          onChange={(value) => updatePlotField('industryType', value)}
          options={[
            '',
            'Residential',
            'Commercial',
            'Industrial',
            'Agricultural',
            'Mixed Use',
            'Other'
          ]}
          placeholder="-- Select Industry Type --"
        />
      </div>

      {/* ==================== PRICING DETAILS SECTION ==================== */}
      <OfficePricingDetailsSection 
        formData={plotDetails} 
        updateField={(key, value) => updatePlotField(key, value)} 
      />

       <DescriptionSection formData={formData} updateField={updateField} />

      {/* ==================== OTHER FEATURES ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Other Features</h3>
        
        <CheckboxGroup
          name="otherFeatures"
          selected={plotDetails.otherFeatures || []}
          onChange={(value) => updatePlotField('otherFeatures', value)}
          options={[
            'Corner Property',
            'Surrounded by Development'
          ]}
        />
      </div>

      {/* ==================== AMENITIES ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Amenities</h3>
        <CheckboxGroup
          name="amenities"
          selected={plotDetails.amenities || []}
          onChange={(value) => updatePlotField('amenities', value)}
          options={PLOT_AMENITIES}
        />
      </div>

      {/* ==================== LOCATION ADVANTAGES ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Location Advantages</h3>
        
        <CheckboxGroup
          name="locationAdvantages"
          selected={plotDetails.locationAdvantages || []}
          onChange={(value) => updatePlotField('locationAdvantages', value)}
          options={LOCATION_ADVANTAGES}
        />
      </div>

      {/* ==================== VAASTHU DETAILS ==================== */}
 {/* ==================== VAASTHU DETAILS ==================== */}
<VaasthuDetails
  formData={plotDetails}
  updateField={(key, value) => {
    console.log('🔧 Plot Vaastu Update:', key, '=', value);
    updatePlotField(`vastuDetails.${key}`, value);
  }}
  fields={sitePlotVaasthuFields}
  isNested={true}
/>

    </div>
  );
};

export default PlotForm;