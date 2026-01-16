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
    {/* <div>
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
      
      <button type="button" className="text-[#22C55E] text-sm mt-2 hover:text-green-700">
        + Add more pricing details
      </button>
    </div> */}

    {/* Location */}
    {/* <LocationSection formData={formData} updateField={updateField} />

   
    <DescriptionSection formData={formData} updateField={updateField} /> */}

    {/* Ownership Documents */}
    <OwnershipDocuments formData={formData} updateField={updateField} />

    {/* Owner Details */}
    <div className="border-t pt-6">
      <h3 className="font-semibold text-gray-600 mb-4">Owner Details</h3>
      <div className="space-y-4">
        {/* Owner Name */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <input
            type="text"
            value={formData.ownerName || ''}
            onChange={(e) => {
              const value = e.target.value;
              // Only allow alphabets and spaces
              if (/^[a-zA-Z\s]*$/.test(value)) {
                updateField('ownerName', value);
              }
            }}
            placeholder="Name of the Owner"
            className="w-full pl-12 pr-4 py-3 bg-gray-50 outline-none border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22C55E] focus:border-transparent placeholder-gray-400"
          />
        </div>

        {/* Phone Number */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
          </div>
          <input
            type="tel"
            value={formData.mobileNumber || ''}
            onChange={(e) => {
              const value = e.target.value;
              // Only allow digits and limit to 10 characters
              if (/^\d*$/.test(value) && value.length <= 10) {
                updateField('mobileNumber', value);
              }
            }}
            placeholder="Phone Number"
            maxLength={10}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 outline-none border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22C55E] focus:border-transparent placeholder-gray-400"
          />
          {formData.mobileNumber && formData.mobileNumber.length !== 10 && (
            <p className="text-red-500 text-xs mt-1">Phone number must be 10 digits</p>
          )}
        </div>

        {/* Email */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => {
              const value = e.target.value;
              // Allow alphanumeric, @, ., -, _
              if (/^[a-zA-Z0-9@._-]*$/.test(value)) {
                updateField('email', value);
              }
            }}
            placeholder="Enter your Email"
            className="w-full pl-12 pr-4 py-3 bg-gray-50 outline-none border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22C55E] focus:border-transparent placeholder-gray-400"
          />
          {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
            <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default CommonFields;