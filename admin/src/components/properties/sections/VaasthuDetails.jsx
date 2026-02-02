
// // admin/src/components/properties/sections/VaasthuDetails.jsx
// import React from 'react';
// import SelectField from '../fields/SelectField';
// import { DIRECTIONS } from '../../../constants/propertyConstants';


// const VaasthuDetails = ({ formData, updateField, fields }) => {
//   return (
//     <div className="border-t pt-6">
//       <h3 className="text-lg font-semibold text-left mb-4">Vaasthu Details (Optional)</h3>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {fields.map((field, index) => {
//           // ✅ Get the correct value from nested structure
//          const currentValue = formData.vaasthuDetails?.[field.name] || 
//                      formData.vastuDetails?.[field.name] || 
//                      formData.vaastuDetails?.[field.name] || // ✅ ADD THIS LINE
//                      '';
          
//           return (
//             <SelectField
//               key={`vaastu-${field.name}-${index}`} // ✅ Unique key with index
//               label={field.label}
//               name={`vaastu-${field.name}`} // ✅ Unique name to prevent syncing
//               value={currentValue}
//               onChange={(value) => updateField(field.name, value)}
//               options={DIRECTIONS}
//               placeholder="Select direction"
//             />
//           );
//         })}
//       </div>
//     </div>
//   );
// };
// export default VaasthuDetails;



// admin/src/components/properties/sections/VaasthuDetails.jsx
// REPLACE the entire file:

import React from 'react';
import SelectField from '../fields/SelectField';
import { DIRECTIONS } from '../../../constants/propertyConstants';

const VaasthuDetails = ({ formData, updateField, fields, isNested = true }) => {
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold text-left mb-4">Vaasthu Details (Optional)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field, index) => {
          // ✅ Check all possible spellings
         const currentValue = formData.vaasthuDetails?.[field.name] ||  // ✅ Primary (with 'h')
                   formData.vastuDetails?.[field.name] ||   // ✅ Fallback
                   '';
          
          console.log(`🔍 Vaastu field ${field.name}:`, currentValue); // ✅ DEBUG
          
          return (
            <SelectField
              key={`vaastu-${field.name}-${index}`}
              label={field.label}
              name={`vaastu-${field.name}`}
              value={currentValue}
              onChange={(value) => {
                console.log(`✍️ Updating ${field.name} to ${value}`); // ✅ DEBUG
                updateField(field.name, value);
              }}
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