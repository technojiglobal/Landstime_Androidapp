import React from 'react';

const TextAreaField = ({ label, name, value, onChange, placeholder, rows = 4, required = false }) => (
  <div>
    <label className="block text-sm font-medium mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      name={name}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-2 outline-none border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#22C55E] focus:border-transparent resize-none"
    />
  </div>
);

export default TextAreaField;