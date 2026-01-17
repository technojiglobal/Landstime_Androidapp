import React from 'react';
import {
  COMMERCIAL_SUB_TYPES,
  OFFICE_TYPES,
  RETAIL_TYPES,
  INDUSTRY_TYPES,
  HOSPITALITY_TYPES,
  PLOT_TYPES,
  STORAGE_TYPES
} from '../../../constants/propertyConstants';

const CommercialBasicDetails = ({ formData, updateField }) => {
  const selectedType = formData.commercialSubType;

  return (
    <div className="space-y-6">

      {/* Commercial Sub Type */}
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

      {/* Office */}
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

      {/* Retail */}
      {selectedType === 'Retail' && (
        <div>
          <label className="block text-sm font-medium mb-2">What kind of retail is it?</label>
          <div className="flex flex-wrap gap-2">
            {RETAIL_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updateField('retailType', type)}
                className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                  formData.retailType === type
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

      {/* Storage */}
      {selectedType === 'Storage' && (
        <div>
          <label className="block text-sm font-medium mb-2">What kind of Storage is it?</label>
          <div className="flex flex-wrap gap-2">
            {STORAGE_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updateField('plotType', type)}
                className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                  formData.plotType === type
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
        {/* Plot / Land */}
      {selectedType === 'Plot/Land' && (
        <div>
          <label className="block text-sm font-medium mb-2">What kind of plot is it?</label>
          <div className="flex flex-wrap gap-2">
            {PLOT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updateField('plotType', type)}
                className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                  formData.plotType === type
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
      {/* Industry */}
      {selectedType === 'Industry' && (
        <div>
          <label className="block text-sm font-medium mb-2">What kind of industry is it?</label>
          <div className="flex flex-wrap gap-2">
            {INDUSTRY_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updateField('industryType', type)}
                className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                  formData.industryType === type
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

      {/* Hospitality */}
      {selectedType === 'Hospitality' && (
        <div>
          <label className="block text-sm font-medium mb-2">What kind of hospitality is it?</label>
          <div className="flex flex-wrap gap-2">
            {HOSPITALITY_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updateField('hospitalityType', type)}
                className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                  formData.hospitalityType === type
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
