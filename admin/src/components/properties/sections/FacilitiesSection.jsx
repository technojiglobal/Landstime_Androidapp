 // admin/src/components/properties/sections/FacilitiesSection.jsx
 import React from 'react';
import CheckboxGroup from '../fields/CheckboxGroup';
import { FACILITIES } from '../../../constants/propertyConstants';

const FacilitiesSection = ({ formData, updateField }) => (
  <CheckboxGroup
    label="Facilities"
    name="facilities"
    selected={formData.facilities || []}
    onChange={(value) => updateField('facilities', value)}
    options={FACILITIES}
  />
);

export default FacilitiesSection;