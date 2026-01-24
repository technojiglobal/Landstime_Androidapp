// import React from 'react';

// const CheckboxGroup = ({ label, name, selected = [], onChange, options, required = false }) => {
//   const handleToggle = (option) => {
//     const newSelected = selected.includes(option)
//       ? selected.filter(item => item !== option)
//       : [...selected, option];
//     onChange(newSelected);
//   };

//   return (
//     <div>
//       <label className="block text-sm font-medium mb-2">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       <div className="flex flex-wrap gap-2">
//         {options.map((option) => (
//           <button
//             key={option}
//             type="button"
//             onClick={() => handleToggle(option)}
//             className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
//               selected.includes(option)
//                 ? 'bg-[#22C55E] text-white border-green-500'
//                 : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
//             }`}
//           >
//             {option}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CheckboxGroup;
import React from 'react';

const CheckboxGroup = ({ 
  label, 
  name, 
  selected = [], 
  onChange, 
  options, 
  required = false,
  disabled = false,
  error = null,
  helperText = null,
  columns = 'auto' // 'auto', '1', '2', '3', '4'
}) => {
  // Ensure selected is always an array
  const selectedArray = Array.isArray(selected) ? selected : [];

  const handleToggle = (option) => {
    if (disabled) return;
    
    const newSelected = selectedArray.includes(option)
      ? selectedArray.filter(item => item !== option)
      : [...selectedArray, option];
    onChange(newSelected);
  };

  // Grid columns class based on columns prop
  const getGridClass = () => {
    switch(columns) {
      case '1': return 'grid-cols-1';
      case '2': return 'grid-cols-2';
      case '3': return 'grid-cols-3';
      case '4': return 'grid-cols-4';
      default: return ''; // flex wrap for auto
    }
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} 
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Helper Text */}
      {helperText && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}

      {/* Options */}
      <div className={columns === 'auto' ? 'flex flex-wrap gap-2' : `grid ${getGridClass()} gap-2`}>
        {options.map((option) => {
          const isSelected = selectedArray.includes(option);
          
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleToggle(option)}
              disabled={disabled}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-[#22C55E] text-white border-green-500 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              } ${
                disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer active:scale-95'
              }`}
            >
              {/* Optional: Add checkmark icon for selected items */}
              {isSelected && (
                <span className="mr-1">✓</span>
              )}
              {option}
            </button>
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}

      {/* Selected Count (optional) */}
      {selectedArray.length > 0 && (
        <p className="text-xs text-gray-500 mt-1">
          {selectedArray.length} selected
        </p>
      )}
    </div>
  );
};

export default CheckboxGroup;