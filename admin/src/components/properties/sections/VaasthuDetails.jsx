import React from 'react';
import SelectField from '../fields/SelectField';
import { DIRECTIONS } from '../../../constants/propertyConstants';
<<<<<<< HEAD

const VaasthuDetails = ({ formData, updateField }) => (
  <div className="border-t pt-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold">Vaasthu Details</h3>
      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm">
        😊
=======
import Vaastu from '../../../assets/vastu.png';

const VaasthuDetails = ({ formData, updateField, fields }) => (
  <div className="border-t pt-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold">Vaasthu Details</h3>
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm">
        <img
          src={Vaastu}
          alt="Vastu"
          className="w-5 h-5 object-contain"
        />
>>>>>>> 6e81891b8b8443d7e853f6202f31b63c22d10d8a
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
<<<<<<< HEAD
      <SelectField
        label="Plot Facing"
        name="plotFacing"
        value={formData.plotFacing}
        onChange={(value) => updateField('plotFacing', value)}
        options={DIRECTIONS}
      />
      
      <SelectField
        label="Main Door/Step Direction"
        name="mainDoorDirection"
        value={formData.mainDoorDirection}
        onChange={(value) => updateField('mainDoorDirection', value)}
        options={DIRECTIONS}
      />
      
      <SelectField
        label="Master Bedroom"
        name="masterBedroom"
        value={formData.masterBedroom}
        onChange={(value) => updateField('masterBedroom', value)}
        options={DIRECTIONS}
      />
      
      <SelectField
        label="Children Bedroom"
        name="childrenBedroom"
        value={formData.childrenBedroom}
        onChange={(value) => updateField('childrenBedroom', value)}
        options={DIRECTIONS}
      />
      
      <SelectField
        label="Living Room"
        name="livingRoom"
        value={formData.livingRoom}
        onChange={(value) => updateField('livingRoom', value)}
        options={DIRECTIONS}
      />
      
      <SelectField
        label="Kitchen Room"
        name="kitchenRoom"
        value={formData.kitchenRoom}
        onChange={(value) => updateField('kitchenRoom', value)}
        options={DIRECTIONS}
      />
      
      <SelectField
        label="Pooja Room"
        name="poojaRoom"
        value={formData.poojaRoom}
        onChange={(value) => updateField('poojaRoom', value)}
        options={DIRECTIONS}
      />
      
      <SelectField
        label="Balcony"
        name="balconyDirection"
        value={formData.balconyDirection}
        onChange={(value) => updateField('balconyDirection', value)}
        options={DIRECTIONS}
      />
=======
      {fields.map((field) => (
        <SelectField
          key={field.name}
          label={field.label}
          name={field.name}
          value={formData[field.name]}
          onChange={(value) => updateField(field.name, value)}
          options={DIRECTIONS}
        />
      ))}
>>>>>>> 6e81891b8b8443d7e853f6202f31b63c22d10d8a
    </div>
  </div>
);

<<<<<<< HEAD
export default VaasthuDetails;
=======
export default VaasthuDetails;
>>>>>>> 6e81891b8b8443d7e853f6202f31b63c22d10d8a
