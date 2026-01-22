// import React from 'react';
// import SelectField from '../fields/SelectField';
// import { DIRECTIONS } from '../../../constants/propertyConstants';
// import Vaastu from '../../../assets/vastu.png';

// const VaasthuDetails = ({ formData, updateField, fields }) => (
//   <div className="border-t pt-6">
//     <div className="flex items-center justify-between mb-4">
//       <h3 className="font-semibold">Vaasthu Details</h3>
//       <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm">
//         <img
//           src={Vaastu}
//           alt="Vastu"
//           className="w-5 h-5 object-contain"
//         />
//       </div>
//     </div>
    
//     <div className="grid grid-cols-2 gap-4">
//       {fields.map((field) => (
//         <SelectField
//           key={field.name}
//           label={field.label}
//           name={field.name}
//           value={formData[field.name]}
//           onChange={(value) => updateField(field.name, value)}
//           options={DIRECTIONS}
//         />
//       ))}
//     </div>
//   </div>
// );

// export default VaasthuDetails;
// admin/src/components/properties/sections/VaasthuDetails.jsx
import React from 'react';
import SelectField from '../fields/SelectField';
import { DIRECTIONS } from '../../../constants/propertyConstants';


const VaasthuDetails = ({ formData, updateField, fields }) => {
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold text-left mb-4">Vaasthu Details (Optional)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <SelectField
            key={field.name}
            label={field.label}
            name={field.name}
            value={formData.vaasthuDetails?.[field.name] || ''}
            onChange={(value) => updateField(field.name, value)}
            options={DIRECTIONS}
            placeholder="Select direction"
          />
        ))}
      </div>
    </div>
  );
};

export default VaasthuDetails;

