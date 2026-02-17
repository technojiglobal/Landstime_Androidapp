//admin/src/components/properties/fields/TextField.jsx

import React from 'react';

const TextField = ({ label, name, value, onChange, placeholder, type = 'text', required = false }) => (
  <div>
    <label className="block text-sm font-medium mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2 outline-none border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
    />
  </div>
);

export default TextField;