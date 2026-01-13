// ============================================
// FILE: src/admin/components/properties/forms/commercial/OfficeForm.jsx
// COMPLETE OFFICE FORM WITH ALL SECTIONS
// ============================================

import React from 'react';
import NumberField from '../../fields/NumberField';
import SelectField from '../../fields/SelectField';
import TextField from '../../fields/TextField';
import CheckboxGroup from '../../fields/CheckboxGroup';
import ToggleButtons from '../../fields/ToggleButtons';
import LocationSection from '../../sections/LocationSection';
import OfficeSetupSection from '../../sections/OfficeSetupSection';
import OfficeFurnishingSection from '../../sections/OfficeFurnishingSection';
import OfficeFloorDetailsSection from '../../sections/OfficeFloorDetailsSection';
import OfficeParkingSection from '../../sections/OfficeParkingSection';
import OfficeVaasthuSection from '../../sections/OfficeVaasthuSection';
import OfficePricingDetailsSection from '../../sections/OfficePricingDetailsSection';
import { 
  OFFICE_AMENITIES, 
  LOCATION_ADVANTAGES, 
  OWNERSHIP_TYPES, 
  POSSESSION_OPTIONS 
} from '../../../../constants/propertyConstants';

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
        <h3 className="font-semibold mb-4">Area (sqft)</h3>
        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label="Carpet Area"
            name="carpetArea"
            value={formData.carpetArea}
            onChange={(value) => updateField('carpetArea', value)}
            placeholder="sqft"
          />
          <NumberField
            label="Built Up Area (optional)"
            name="builtUpArea"
            value={formData.builtUpArea}
            onChange={(value) => updateField('builtUpArea', value)}
            placeholder="sqft"
          />
        </div>
      </div>

      {/* ==================== OFFICE SETUP SECTION ==================== */}
      <OfficeSetupSection formData={formData} updateField={updateField} />

      {/* ==================== FURNISHING SECTION ==================== */}
      <OfficeFurnishingSection formData={formData} updateField={updateField} />

      {/* ==================== FLOOR DETAILS SECTION ==================== */}
      <OfficeFloorDetailsSection formData={formData} updateField={updateField} />

      {/* ==================== PARKING SECTION ==================== */}
      <OfficeParkingSection formData={formData} updateField={updateField} />

      {/* ==================== AVAILABILITY STATUS ==================== */}
      <div className="border-t pt-6">
        <ToggleButtons
          label="Availability Status"
          name="availabilityStatus"
          value={formData.availabilityStatus || 'Ready to move'}
          onChange={(value) => updateField('availabilityStatus', value)}
          options={['Ready to move', 'Under Construction']}
        />
      </div>

      {/* ==================== POSSESSION BY ==================== */}
      <SelectField
        label="Possession By"
        name="possessionBy"
        value={formData.possessionBy}
        onChange={(value) => updateField('possessionBy', value)}
        options={POSSESSION_OPTIONS}
      />

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

      {/* ==================== PRICING DETAILS SECTION ==================== */}
      <OfficePricingDetailsSection formData={formData} updateField={updateField} />

      {/* ==================== AMENITIES ==================== */}
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Amenities</h3>
        <CheckboxGroup
          name="amenities"
          selected={formData.amenities || []}
          onChange={(value) => updateField('amenities', value)}
          options={OFFICE_AMENITIES}
        />
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

      {/* ==================== VAASTHU DETAILS SECTION ==================== */}
      <OfficeVaasthuSection formData={formData} updateField={updateField} />

    </div>
  );
};

export default OfficeForm;

