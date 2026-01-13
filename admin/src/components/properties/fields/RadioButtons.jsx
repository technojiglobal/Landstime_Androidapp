import React from 'react';

const RadioButtons = ({ label, name, value, onChange, options, required = false }) => (
  <div>
    <label className="block text-sm font-medium mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="flex gap-3">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`px-6 py-2 rounded-lg border transition-colors ${
            value === option
              ? 'bg-[#22C55E] text-white border-green-500'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

export default RadioButtons;