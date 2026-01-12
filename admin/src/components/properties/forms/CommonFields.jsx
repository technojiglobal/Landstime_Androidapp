
import React from 'react';
import { MapPin } from 'lucide-react';
import SelectField from '../fields/SelectField';
import TextAreaField from '../fields/TextAreaField';
import TextField from '../fields/TextField';
import OwnershipDocuments from '../sections/OwnershipDocuments';
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
      
      <div className="mt-3 space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.allInclusivePrice || false}
            onChange={(e) => updateField('allInclusivePrice', e.target.checked)}
            className="w-4 h-4 text-green-600 rounded"
          />
          <span className="text-sm">All inclusive price</span>
        </label>
        
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.priceNegotiable || false}
            onChange={(e) => updateField('priceNegotiable', e.target.checked)}
            className="w-4 h-4 text-green-600 rounded"
          />
          <span className="text-sm">Price Negotiable</span>
        </label>
        
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.taxCharges || false}
            onChange={(e) => updateField('taxCharges', e.target.checked)}
            className="w-4 h-4 text-green-600 rounded"
          />
          <span className="text-sm">Tax and Govt charges excluded</span>
        </label>
      </div>
      
      <button type="button" className="text-green-600 text-sm mt-2 hover:text-green-700">
        + Add more pricing details
      </button>
    </div>

    {/* Location */}
    <div>
      <label className="block text-sm font-medium mb-2">Location</label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Enter Property Location"
          value={formData.location || ''}
          onChange={(e) => updateField('location', e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
    </div>

    {/* Description */}
    <TextAreaField
      label="Description"
      name="description"
      value={formData.description}
      onChange={(value) => updateField('description', value)}
      placeholder="Describe your property"
      rows={4}
    />

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