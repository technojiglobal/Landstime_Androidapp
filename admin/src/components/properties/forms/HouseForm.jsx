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

const HouseForm = ({ formData, updateField }) => (
  <div className="space-y-6 border-t pt-6">
    <h3 className="font-semibold">Basic Details</h3>

    <div className="grid grid-cols-2 gap-4">
      <NumberField
        label="No of Floors"
        name="noOfFloors"
        value={formData.noOfFloors}
        onChange={(value) => updateField('noOfFloors', value)}
      />

      <NumberField
        label="Bedrooms"
        name="bedrooms"
        value={formData.bedrooms}
        onChange={(value) => updateField('bedrooms', value)}
      />

      <NumberField
        label="Bathrooms"
        name="bathrooms"
        value={formData.bathrooms}
        onChange={(value) => updateField('bathrooms', value)}
      />
    </div>

    <NumberField
      label="Balconies"
      name="balconies"
      value={formData.balconies}
      onChange={(value) => updateField('balconies', value)}
    />

    <TextAreaField
      label="Floor Details"
      name="floorDetails"
      value={formData.floorDetails}
      onChange={(value) => updateField('floorDetails', value)}
      rows={3}
    />

    <ToggleButtons
      label="Availability Status"
      name="availabilityStatus"
      value={formData.availabilityStatus}
      onChange={(value) => updateField('availabilityStatus', value)}
      options={['Ready to Move', 'Under Construction']}
    />

    <CheckboxGroup
      label="Other Rooms"
      name="otherRooms"
      selected={formData.otherRooms || []}
      onChange={(value) => updateField('otherRooms', value)}
      options={OTHER_ROOMS}
    />

    <CheckboxGroup
      label="Age of Property"
      name="ageOfProperty"
      selected={formData.ageOfProperty || []}
      onChange={(value) => updateField('ageOfProperty', value)}
      options={AGE_OF_PROPERTY}
    />

    <RadioButtons
      label="Furnishing"
      name="furnishing"
      value={formData.furnishing}
      onChange={(value) => updateField('furnishing', value)}
      options={FURNISHING_OPTIONS}
    />

    <ParkingSection formData={formData} updateField={updateField} />
    <FacilitiesSection formData={formData} updateField={updateField} />
    <VaasthuDetails formData={formData} updateField={updateField} />
  </div>
);

export default HouseForm;