//FILE 2: src/admin/components/properties/sections/DescriptionSection.jsx
// Description + Amenities + Location Advantages
// ============================================

import React from 'react';
import TextAreaField from '../fields/TextAreaField';
import CheckboxGroup from '../fields/CheckboxGroup';
import { 
  OFFICE_AMENITIES, 
  LOCATION_ADVANTAGES, 
} from '../../../constants/propertyConstants';

const DescriptionSection = ({ formData, updateField }) => (
  <div className="space-y-6 border-t pt-6">
    <TextAreaField
      label="Description"
      name="description"
      value={formData.description}
      onChange={(value) => updateField('description', value)}
      placeholder="Describe your property"
      rows={4}
    />

  
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
  </div>
);

export default DescriptionSection;

