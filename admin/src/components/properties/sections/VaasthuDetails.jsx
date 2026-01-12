import React from 'react';
import SelectField from '../fields/SelectField';
import { DIRECTIONS } from '../../../constants/propertyConstants';

const VaasthuDetails = ({ formData, updateField }) => (
  <div className="border-t pt-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold">Vaasthu Details</h3>
      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm">
        😊
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
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
    </div>
  </div>
);

export default VaasthuDetails;
