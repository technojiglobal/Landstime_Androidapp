import React from 'react';
import CheckboxGroup from '../fields/CheckboxGroup';
import { PARKING_OPTIONS } from '../../../constants/propertyConstants';

const ParkingSection = ({ formData, updateField }) => (
  <CheckboxGroup
    label="Parking"
    name="parking"
    selected={formData.parking || []}
    onChange={(value) => updateField('parking', value)}
    options={PARKING_OPTIONS}
  />
);

export default ParkingSection;