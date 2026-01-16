import React from 'react'
import CheckboxGroup from '../fields/CheckboxGroup';
import SelectField from '../fields/SelectField';

import ToggleButtons from '../fields/ToggleButtons';
import { 
  AGE_OF_PROPERTY,
  POSSESSION_MONTHS,
  
} from '../../../constants/propertyConstants';
const AvailabilityStatus = ({ formData, updateField }) => {
  const isReadyToMove = formData.availabilityStatus === 'Ready to move';
  const isUnderConstruction = formData.availabilityStatus === 'Under construction';

  return (
   
      <div className="border-t pt-6">
        <ToggleButtons
          label="Availability Status"
          name="availabilityStatus"
          value={formData.availabilityStatus || 'Ready to move'}
          onChange={(value) => {
            updateField('availabilityStatus', value);
            // Clear conditional fields when switching
            if (value === 'Ready to move') {
              updateField('possessionYear', '');
              updateField('possessionMonth', '');
            } else {
              updateField('ageOfProperty', []);
            }
          }}
          options={['Ready to move', 'Under construction']}
        />

        {/* Show Age of Property only for Ready to Move */}
        {isReadyToMove && (
          <div className="mt-6">
            <CheckboxGroup
              label="Age of Property"
              name="ageOfProperty"
              selected={formData.ageOfProperty || []}
              onChange={(value) => updateField('ageOfProperty', value)}
              options={AGE_OF_PROPERTY}
            />
          </div>
        )}

        {/* Show Possession By only for Under Construction */}
        {isUnderConstruction && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">Possession By</h4>
            <div className="grid grid-cols-2 gap-4">
              <SelectField
                name="possessionYear"
                value={formData.possessionYear}
                onChange={(value) => updateField('possessionYear', value)}
                options={['2024', '2025', '2026', '2027', '2028', '2029', '2030']}
                placeholder="2032"
              />
              <SelectField
                name="possessionMonth"
                value={formData.possessionMonth}
                onChange={(value) => updateField('possessionMonth', value)}
                options={POSSESSION_MONTHS}
                placeholder="Month"
              />
            </div>
          </div>
        )}
      </div>
  )
}

export default AvailabilityStatus
