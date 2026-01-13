import React from 'react';
import TextAreaField from '../fields/TextAreaField';

const DescriptionSection = ({ formData, updateField }) => (
  <TextAreaField
    label="Description"
    name="description"
    value={formData.description}
    onChange={(value) => updateField('description', value)}
    placeholder="Describe your property"
    rows={4}
  />
);

export default DescriptionSection;