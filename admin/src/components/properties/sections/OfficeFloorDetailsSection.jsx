  import React from 'react';
import NumberField from '../fields/NumberField';
import TextField from '../fields/TextField';
import CounterField from '../fields/CounterField';

const OfficeFloorDetailsSection = ({ formData, updateField }) => (
  <div className="space-y-6 border-t pt-6">
    <h3 className="font-semibold">Floor Details</h3>

    <NumberField
      label="Floor Number"
      name="floorNumber"
      value={formData.floorNumber}
      onChange={(value) => updateField('floorNumber', value)}
      placeholder="2"
    />

    <TextField
      label="Your Floor No (optional)"
      name="yourFloorNo"
      value={formData.yourFloorNo}
      onChange={(value) => updateField('yourFloorNo', value)}
    />

    <div>
      <label className="block text-sm font-medium mb-2">No of stair cases (optional)</label>
      <div className="flex gap-2">
        {['1', '2', '3', '4+'].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => updateField('noStairCases', num)}
            className={`w-12 h-12 rounded-lg border ${
              formData.noStairCases === num
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>

    {/* Lifts */}
    <div className="border-t pt-4">
      <h4 className="font-medium mb-3">Lifts</h4>
      
      <div className="flex gap-2 mb-4">
        {['Available', 'Not Available'].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => updateField('liftsAvailable', option)}
            className={`flex-1 px-4 py-2 rounded-lg border ${
              formData.liftsAvailable === option
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {formData.liftsAvailable === 'Available' && (
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <CounterField
              label="Passenger Lifts"
              value={formData.passengerLifts || 0}
              onChange={(value) => updateField('passengerLifts', value)}
            />
          </div>
          <div className="border rounded-lg p-4">
            <CounterField
              label="Service Lifts"
              value={formData.serviceLifts || 0}
              onChange={(value) => updateField('serviceLifts', value)}
            />
          </div>
        </div>
      )}
    </div>
  </div>
);

export default OfficeFloorDetailsSection;