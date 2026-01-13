
import React from 'react';
import CheckboxGroup from '../fields/CheckboxGroup';
import { FURNISHING_ITEMS, FIRE_SAFETY } from '../../../constants/propertyConstants';

const OfficeFurnishingSection = ({ formData, updateField }) => (
  <div className="space-y-6 border-t pt-6">
    <CheckboxGroup
      name="furnishingItems"
      selected={formData.furnishingItems || []}
      onChange={(value) => updateField('furnishingItems', value)}
      options={FURNISHING_ITEMS}
    />

    <div>
      <h4 className="font-medium mb-3">Fire safety measures include</h4>
      <CheckboxGroup
        name="fireSafety"
        selected={formData.fireSafety || []}
        onChange={(value) => updateField('fireSafety', value)}
        options={FIRE_SAFETY}
      />
    </div>
  </div>
);

export default OfficeFurnishingSection;