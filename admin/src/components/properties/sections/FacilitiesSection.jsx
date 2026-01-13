<<<<<<< HEAD
  import React from 'react';
=======
import React from 'react';
>>>>>>> 6e81891b8b8443d7e853f6202f31b63c22d10d8a
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