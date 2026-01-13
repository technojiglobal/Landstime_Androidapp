  import React from 'react';
import CheckboxGroup from '../fields/CheckboxGroup';
import NumberField from '../fields/NumberField';

const OfficeParkingSection = ({ formData, updateField }) => {
  const parkingLocations = [
    'Private Parking in Basement',
    'Private Parking Outside',
    'Public Parking'
  ];

  return (
    <div className="space-y-6 border-t pt-6">
      <h3 className="font-semibold">Parking</h3>

      <div className="flex gap-2">
        {['Available', 'Not Available'].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => updateField('parkingAvailable', option)}
            className={`flex-1 px-4 py-2 rounded-lg border ${
              formData.parkingAvailable === option
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {formData.parkingAvailable === 'Available' && (
        <>
          <CheckboxGroup
            name="parkingLocations"
            selected={formData.parkingLocations || []}
            onChange={(value) => updateField('parkingLocations', value)}
            options={parkingLocations}
          />

          <NumberField
            label="No of Parking(Optional)"
            name="noParking"
            value={formData.noParking}
            onChange={(value) => updateField('noParking', value)}
          />
        </>
      )}
    </div>
  );
};

export default OfficeParkingSection;