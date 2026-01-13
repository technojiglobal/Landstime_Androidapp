
import React from 'react';
import SelectField from '../fields/SelectField';
import { DIRECTIONS, OFFICE_VAASTHU_FIELDS } from '../../../constants/propertyConstants';

const OfficeVaasthuSection = ({ formData, updateField }) => (
  <div className="border-t pt-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold">Vaasthu Details</h3>
      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm">
        😊
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4">
      {OFFICE_VAASTHU_FIELDS.map((field) => (
        <SelectField
          key={field.name}
          label={field.label}
          name={field.name}
          value={formData[field.name]}
          onChange={(value) => updateField(field.name, value)}
          options={DIRECTIONS}
        />
      ))}
    </div>
  </div>
);

export default OfficeVaasthuSection;