// admin/src/components/properties/fields/SelectField.jsx
import React from 'react';
import { ChevronDown } from 'lucide-react';

const SelectField = ({ label, name, value, onChange, options, placeholder, required = false }) => (
  <div>
    <label className="block text-sm font-medium mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 outline-none border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
      >
        <option value="">{placeholder || 'Select...'}</option>
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
    </div>
  </div>
);

export default SelectField;