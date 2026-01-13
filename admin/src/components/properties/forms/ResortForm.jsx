import React from 'react';
import NumberField from '../fields/NumberField';
import TextAreaField from '../fields/TextAreaField';
import ToggleButtons from '../fields/ToggleButtons';
import CheckboxGroup from '../fields/CheckboxGroup';
import RadioButtons from '../fields/RadioButtons';
import VaasthuDetails from '../sections/VaasthuDetails';
import FacilitiesSection from '../sections/FacilitiesSection';
import ParkingSection from '../sections/ParkingSection';
import {
  OTHER_ROOMS,
  AGE_OF_PROPERTY,
  FURNISHING_OPTIONS
} from '../../../constants/propertyConstants';
import SelectField from '../fields/SelectField';
import { RESORT_TYPES } from '../../../constants/propertyConstants';
import { resortVaasthuFields } from '../../../constants/vastuFields';

const ResortForm = ({ propertyType, setPropertyType, formData, updateField }) => (
  <>
    <SelectField
      label="Resort Type"
      name="resortType"
      value={propertyType}
      onChange={setPropertyType}
      options={RESORT_TYPES}
      placeholder="Select Resort Type"
      required
    />
  <div className="space-y-6 border-t pt-3">
   
    
    <h3 className="font-semibold">Basic Details</h3>

    <div className="grid grid-cols-2 gap-4">
      <NumberField
        label="Rooms"
        name="rooms"
        value={formData.rooms}
        onChange={(value) => updateField('rooms', value)}
      />

      <NumberField
        label="Land Area (in sqft)"
        name="landArea"
        value={formData.landArea}
        onChange={(value) => updateField('landArea', value)}
      />

      <NumberField
        label="Floors"
        name="floors"
        value={formData.floors}
        onChange={(value) => updateField('floors', value)}
      />

      <NumberField
        label="Build Area (in sqft)"
        name="buildArea"
        value={formData.buildArea}
        onChange={(value) => updateField('buildArea', value)}
      />
    </div>
    
    <NumberField
      label="Price (₹)"
      name="price"
      value={formData.price}
      onChange={(value) => updateField('price', value)}
    />
    
    <VaasthuDetails 
      formData={formData} 
      updateField={updateField}
      fields={resortVaasthuFields}
    />
  </div>
  </>
);

export default ResortForm;