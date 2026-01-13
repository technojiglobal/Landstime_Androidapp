
import React from 'react';
import SelectField from '../fields/SelectField';
import PricingSection from '../sections/PricingSection';
import LocationSection from '../sections/LocationSection';
import DescriptionSection from '../sections/DescriptionSection';
import OwnershipDocuments from '../sections/OwnershipDocuments';
import TextField from '../fields/TextField';
import { POSSESSION_OPTIONS } from '../../../constants/propertyConstants';

const CommonFields = ({ formData, updateField }) => (
  <div className="space-y-6">
    {/* Possession By */}
    <div>
      <SelectField
        label="Possession By"
        name="possessionBy"
        value={formData.possessionBy}
        onChange={(value) => updateField('possessionBy', value)}
        options={POSSESSION_OPTIONS}
      />
      
      <div className="mt-3">
        <PricingSection formData={formData} updateField={updateField} />
      </div>
      
      <button type="button" className="text-green-600 text-sm mt-2 hover:text-green-700">
        + Add more pricing details
      </button>
    </div>

    {/* Location */}
    <LocationSection formData={formData} updateField={updateField} />

    {/* Description */}
    <DescriptionSection formData={formData} updateField={updateField} />

    {/* Ownership Documents */}
    <OwnershipDocuments formData={formData} updateField={updateField} />

    {/* Owner Details */}
    <div className="border-t pt-6">
      <h3 className="font-semibold mb-4">Owner Details</h3>
      <div className="space-y-4">
        <TextField
          label="Owner Name"
          name="ownerName"
          value={formData.ownerName}
          onChange={(value) => updateField('ownerName', value)}
          placeholder="Enter owner name"
        />
        
        <TextField
          label="Mobile Number"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={(value) => updateField('mobileNumber', value)}
          placeholder="Enter mobile number"
          type="tel"
        />
      </div>
    </div>
  </div>
);

export default CommonFields;