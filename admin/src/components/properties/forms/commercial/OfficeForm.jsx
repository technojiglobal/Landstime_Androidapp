// FILE 3: src/admin/components/properties/forms/commercial/OfficeForm.jsx
// UPDATED OFFICE FORM - UI IMPROVEMENTS
// ============================================

import React from 'react';
import NumberField from '../../fields/NumberField';
import SelectField from '../../fields/SelectField';
import LocationSection from '../../sections/LocationSection';
import OfficeDetailsSection from '../../sections/OfficeDetailsSection';
import OfficePricingDetailsSection from '../../sections/OfficePricingDetailsSection';
import DescriptionSection from '../../sections/DescriptionSection';
import VaasthuDetails from '../../sections/VaasthuDetails';
import AvailabilityStatus from '../../sections/AvailabilityStatus';
import CheckboxGroup from '../../fields/CheckboxGroup';
import { 
  OWNERSHIP_TYPES, 
  OFFICE_AMENITIES
} from '../../../../constants/propertyConstants';
import { officeVaasthuFields } from '../../../../constants/vastuFields';

const OfficeForm = ({ formData, updateField }) => {
  return (
    <div className="space-y-6 border-t pt-6">
      
      {/* ==================== LOCATION SECTION ==================== */}
      <LocationSection formData={formData} updateField={updateField} />

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

        <SelectField
          label="Zone Type"
          name="zoneType"
          value={formData.zoneType}
          onChange={(value) => updateField('zoneType', value)}
          options={[
            '', 
            'Industrial', 
            'Commercial', 
            'Residential', 
            'Transport & Communication', 
            'Public Utilities', 
            'Public & Semi Public Use'
          ]}
          placeholder="Select zone type"
        />
      </div>

      {/* ==================== AREA SECTION ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Area</h3>
        <div className="grid grid-cols-1 gap-4">
          {/* Carpet Area with Unit Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-2">Carpet Area</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={formData.carpetArea || ''}
                onChange={(e) => updateField('carpetArea', e.target.value)}
                placeholder="Enter area"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <select
                value={formData.carpetAreaUnit || 'sqft'}
                onChange={(e) => updateField('carpetAreaUnit', e.target.value)}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="sqft">sqft</option>
                <option value="sqm">sqm</option>
                <option value="sqyd">sqyd</option>
              </select>
            </div>
          </div>

          {/* Built Up Area with Unit Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-2">Built Up Area (optional)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={formData.builtUpArea || ''}
                onChange={(e) => updateField('builtUpArea', e.target.value)}
                placeholder="Enter area"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <select
                value={formData.builtUpAreaUnit || 'sqft'}
                onChange={(e) => updateField('builtUpAreaUnit', e.target.value)}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="sqft">sqft</option>
                <option value="sqm">sqm</option>
                <option value="sqyd">sqyd</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== COMBINED OFFICE DETAILS ==================== */}
      <OfficeDetailsSection formData={formData} updateField={updateField} />

      {/* ==================== AVAILABILITY STATUS ==================== */}
      <AvailabilityStatus formData={formData} updateField={updateField} />

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

      {/* ==================== PRICING DETAILS SECTION ==================== */}
      <OfficePricingDetailsSection formData={formData} updateField={updateField} />

      {/* ==================== DESCRIPTION + AMENITIES ==================== */}
      <DescriptionSection formData={formData} updateField={updateField} />
      
      {/* ==================== AMENITIES ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Amenities</h3>
        <CheckboxGroup
          name="amenities"
          selected={formData.amenities || []}
          onChange={(value) => updateField('amenities', value)}
          options={OFFICE_AMENITIES}
        />
      </div>

      {/* ==================== VAASTHU DETAILS SECTION ==================== */}
      <VaasthuDetails 
        formData={formData} 
        updateField={updateField} 
        fields={officeVaasthuFields}
      />

    </div>
  );
};

export default OfficeForm;