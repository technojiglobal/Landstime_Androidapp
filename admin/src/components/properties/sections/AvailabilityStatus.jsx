import React from 'react';
import CheckboxGroup from '../fields/CheckboxGroup';
import SelectField from '../fields/SelectField';
import ToggleButtons from '../fields/ToggleButtons';
import { 
  AGE_OF_PROPERTY,
  POSSESSION_MONTHS,
} from '../../../constants/propertyConstants';

const AvailabilityStatus = (props) => {
  const {
    value: propValue,
    onChange: propOnChange,
    updateExtra: propUpdateExtra,
    ageOfProperty: propAgeOfProperty,
    possessionYear: propPossessionYear,
    possessionMonth: propPossessionMonth,
    formData,
    updateField,
  } = props;

  // This component is used in different ways across the application.
  // This logic adapts to the props being passed to ensure it works everywhere.
  
  const isUsingFormData = !!formData;
  
  // Determine the correct data object (nested for houseDetails or flat)
  const data = isUsingFormData ? (formData.houseDetails || formData) : props;

  const value = propValue ?? data.availabilityStatus ?? '';

// House uses array, Office uses string
const isHouse = !!formData?.houseDetails;

const rawAge = propAgeOfProperty ?? data.ageOfProperty;
const isArrayAge = isHouse;
const ageOfProperty = rawAge ?? (isArrayAge ? [] : '');


  const possessionYear = propPossessionYear ?? data.possessionYear ?? '';
  const possessionMonth = propPossessionMonth ?? data.possessionMonth ?? '';

  const handleToggleChange = (newStatus) => {
    // For HouseForm and similar, where onChange and updateExtra are provided.
    if (propOnChange && propUpdateExtra) {
      propOnChange(newStatus);
     if (newStatus === 'Ready to Move') {
        propUpdateExtra('possessionYear', '');
        propUpdateExtra('possessionMonth', '');
      } else {
        propUpdateExtra('ageOfProperty', isArrayAge ? [] : '');

      }
    } 
    // For StorageForm and other forms using updateField directly.
 else if (updateField) {
  updateField('availabilityStatus', newStatus);

  if (newStatus === 'Ready to Move') {
    updateField('possessionYear', '');
    updateField('possessionMonth', '');
  } else {
    updateField('possessionYear', '');
    updateField('possessionMonth', '');
  }

  // 🔧 critical fix: array for House, string for Office
  updateField('ageOfProperty', isArrayAge ? [] : '');
}

  };

  const handleExtraChange = (field, fieldValue) => {
    if (propUpdateExtra) {
      propUpdateExtra(field, fieldValue);
    } else if (updateField) {
      updateField(field, fieldValue);
    }
  };
  
  if (!propOnChange && !updateField) {
    return (
      <div className="border-t pt-6 text-red-500 font-medium">
        Error: AvailabilityStatus component is not configured correctly.
      </div>
    );
  }

  const isReadyToMove = value === 'Ready to Move';
  const isUnderConstruction = value === 'Under Construction';

  return (
    <div className="border-t pt-6">
      <ToggleButtons
  label="Availability Status"
  name="availabilityStatus"
  value={value}
  onChange={handleToggleChange}
  options={['Ready to Move', 'Under Construction']}
/>


      {isReadyToMove && (
  <div className="mt-6">
    {isArrayAge ? (
      <CheckboxGroup
        label="Age of Property"
        name="ageOfProperty"
        selected={ageOfProperty}
        onChange={(v) => handleExtraChange('ageOfProperty', v)}
        options={AGE_OF_PROPERTY}
      />
    ) : (
      <ToggleButtons
        label="Age of Property"
        name="ageOfProperty"
        value={ageOfProperty}
        onChange={(v) => handleExtraChange('ageOfProperty', v)}
        options={AGE_OF_PROPERTY}
      />
    )}
  </div>
)}

      {isUnderConstruction && (
        <div className="mt-6">
          <h4 className="font-medium mb-3">Possession By</h4>
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              name="possessionYear"
              value={possessionYear}
              onChange={(v) => handleExtraChange('possessionYear', v)}
              options={['2024','2025','2026','2027','2028','2029','2030']}
              placeholder="Year"
            />
            <SelectField
              name="possessionMonth"
              value={possessionMonth}
              onChange={(v) => handleExtraChange('possessionMonth', v)}
              options={POSSESSION_MONTHS}
              placeholder="Month"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityStatus;
