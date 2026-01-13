import React from 'react';
import SelectField from '../fields/SelectField';
import ToggleButtonGroup from '../fields/ToggleButtonGroup';
import { COMMERCIAL_SUB_TYPES, OFFICE_TYPES, RETAIL_TYPES } from '../../../constants/propertyConstants';

const CommercialBasicDetails = ({ formData, updateField }) => {
  const selectedType = formData.commercialSubType;

  return (
    <div className="space-y-6">
      {/* Commercial Sub Type Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Select Property Type</label>
        <div className="flex flex-wrap gap-2">
          {COMMERCIAL_SUB_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => updateField('commercialSubType', type)}
              className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                selectedType === type
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Office Specific - What kind of office */}
      {selectedType === 'Office' && (
        <div>
          <label className="block text-sm font-medium mb-2">What kind of office is it?</label>
          <div className="flex flex-wrap gap-2">
            {OFFICE_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updateField('officeType', type)}
                className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                  formData.officeType === type
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}
        {/* Office Specific - What kind of office */}
      {selectedType === 'Retail' && (
        <div>
          <label className="block text-sm font-medium mb-2">What kind of office is it?</label>
          <div className="flex flex-wrap gap-2">
            {RETAIL_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updateField('officeType', type)}
                className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                  formData.officeType === type
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommercialBasicDetails;