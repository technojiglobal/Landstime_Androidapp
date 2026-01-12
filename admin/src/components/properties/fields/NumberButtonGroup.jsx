
import React from 'react';

const NumberButtonGroup = ({ label, name, value, onChange, options, required = false }) => (
  <div>
    <label className="block text-sm font-medium mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`w-12 h-12 rounded-lg border font-medium transition-colors ${
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

export default NumberButtonGroup;