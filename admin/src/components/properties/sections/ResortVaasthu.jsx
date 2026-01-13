import React from 'react';
import SelectField from '../fields/SelectField';
import { DIRECTIONS } from '../../../constants/propertyConstants';
import Vaastu from '../../../assets/vastu.png'
const ResortVaasthu = ({ formData, updateField }) => (
  <div className="border-t pt-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold">Vaasthu Details</h3>
      <div className="w-8 h-8  rounded-full flex items-center justify-center text-sm">
         <img
    src={Vaastu}
    alt="Vastu"
    className="w-5 h-5 object-contain"
  />
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <SelectField
        label="Property Facing"
        name="plotFacing"
        value={formData.plotFacing}
        onChange={(value) => updateField('plotFacing', value)}
        options={DIRECTIONS}
      />
      
      <SelectField
        label="Entrance Direction"
        name="mainDoorDirection"
        value={formData.mainDoorDirection}
        onChange={(value) => updateField('mainDoorDirection', value)}
        options={DIRECTIONS}
      />
      
      <SelectField
        label="Reception Area Facing"
        name="masterBedroom"
        value={formData.masterBedroom}
        onChange={(value) => updateField('masterBedroom', value)}
        options={DIRECTIONS}
      />
      
      <SelectField
        label="Main Lobby Direction"
        name="childrenBedroom"
        value={formData.childrenBedroom}
        onChange={(value) => updateField('childrenBedroom', value)}
        options={DIRECTIONS}
      />
      
      <SelectField
        label="Master Suite Room Direction"
        name="livingRoom"
        value={formData.livingRoom}
        onChange={(value) => updateField('livingRoom', value)}
        options={DIRECTIONS}
      />
      
      <SelectField
        label="Guest Room Direction"
        name="kitchenRoom"
        value={formData.kitchenRoom}
        onChange={(value) => updateField('kitchenRoom', value)}
        options={DIRECTIONS}
      />
      
      <SelectField
        label="Restaurant Direction"
        name="poojaRoom"
        value={formData.poojaRoom}
        onChange={(value) => updateField('poojaRoom', value)}
        options={DIRECTIONS}
      />
      
      <SelectField
        label="VIP Suite Direction(if applicable)"
        name="balconyDirection"
        value={formData.balconyDirection}
        onChange={(value) => updateField('balconyDirection', value)}
        options={DIRECTIONS}
      />
       <SelectField
        label="Conference/Banquet Hall Direction"
        name="balconyDirection"
        value={formData.balconyDirection}
        onChange={(value) => updateField('balconyDirection', value)}
        options={DIRECTIONS}
      />
       <SelectField
        label="Spa/Wellness Center Direction"
        name="balconyDirection"
        value={formData.balconyDirection}
        onChange={(value) => updateField('balconyDirection', value)}
        options={DIRECTIONS}
      />
       <SelectField
        label="Swimming Pool Direction"
        name="balconyDirection"
        value={formData.balconyDirection}
        onChange={(value) => updateField('balconyDirection', value)}
        options={DIRECTIONS}
      />
       <SelectField
        label="Yoga/Meditation Area Direction"
        name="balconyDirection"
        value={formData.balconyDirection}
        onChange={(value) => updateField('balconyDirection', value)}
        options={DIRECTIONS}
      />
       <SelectField
        label="Kitchen Direction"
        name="balconyDirection"
        value={formData.balconyDirection}
        onChange={(value) => updateField('balconyDirection', value)}
        options={DIRECTIONS}
      />
       <SelectField
        label="Prayer/Pooja/Meditation Room Direction"
        name="balconyDirection"
        value={formData.balconyDirection}
        onChange={(value) => updateField('balconyDirection', value)}
        options={DIRECTIONS}
      />
       <SelectField
        label="Office/Administration Room Direction"
        name="balconyDirection"
        value={formData.balconyDirection}
        onChange={(value) => updateField('balconyDirection', value)}
        options={DIRECTIONS}
      />
       <SelectField
        label="Recreation/Activity Area Direction"
        name="balconyDirection"
        value={formData.balconyDirection}
        onChange={(value) => updateField('balconyDirection', value)}
        options={DIRECTIONS}
      />
      <SelectField
        label="Balcony/Deck/Veranda"
        name="balconyDirection"
        value={formData.balconyDirection}
        onChange={(value) => updateField('balconyDirection', value)}
        options={DIRECTIONS}
      />
      <SelectField
        label="Garden/Open Space/Lawn"
        name="balconyDirection"
        value={formData.balconyDirection}
        onChange={(value) => updateField('balconyDirection', value)}
        options={DIRECTIONS}
      />
    </div>
  </div>
);

export default ResortVaasthu;