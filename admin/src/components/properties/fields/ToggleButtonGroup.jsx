//admin/src/components/properties/fields/ToggleButtonGroup.jsx
import React from 'react';

const ToggleButtonGroup = ({ label, options, value, onChange, name }) => (
  <div>
    {label && <label className="block text-sm font-medium mb-2">{label}</label>}
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`flex-1 px-4 py-2 rounded-lg border text-sm transition-colors ${
            value === option
              ? 'bg-green-500 text-white border-green-500'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

export default ToggleButtonGroup;