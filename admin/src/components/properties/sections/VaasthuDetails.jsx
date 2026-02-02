
// admin/src/components/properties/sections/VaasthuDetails.jsx
import React from 'react';
import SelectField from '../fields/SelectField';
import { DIRECTIONS } from '../../../constants/propertyConstants';


const VaasthuDetails = ({ formData, updateField, fields }) => {
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold text-left mb-4">Vaasthu Details (Optional)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field, index) => {
          // ✅ Get the correct value from nested structure
          const currentValue = formData.vaasthuDetails?.[field.name] || 
                               formData.vastuDetails?.[field.name] || 
                               '';
          
          return (
            <SelectField
              key={`vaastu-${field.name}-${index}`} // ✅ Unique key with index
              label={field.label}
              name={`vaastu-${field.name}`} // ✅ Unique name to prevent syncing
              value={currentValue}
              onChange={(value) => updateField(field.name, value)}
              options={DIRECTIONS}
              placeholder="Select direction"
            />
          );
        })}
      </div>
    </div>
  );
};
export default VaasthuDetails;

