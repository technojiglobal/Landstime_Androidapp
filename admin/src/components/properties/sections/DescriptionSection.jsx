import React from 'react';
import TextAreaField from '../fields/TextAreaField';
import CheckboxGroup from '../fields/CheckboxGroup';
import { 
  OFFICE_AMENITIES, 
  LOCATION_ADVANTAGES, 
} from '../../../constants/propertyConstants';

const DescriptionSection = ({ formData, updateField, setIsDescriptionValid }) => {
  const getWordCount = (text = '') =>
    text.trim().split(/\s+/).filter(Boolean).length;

  const handleDescriptionChange = (value) => {
    updateField('description', value);

    const count = getWordCount(value);
    setIsDescriptionValid(count >= 50);
  };

  const wordCount = getWordCount(formData.description);

  return (
    <div className="space-y-6 border-t pt-6">
      <div>
        <TextAreaField
          label={
            <span>
              Description <span className="text-red-500">*</span>
            </span>
          }
          name="description"
          value={formData.description}
          onChange={handleDescriptionChange}
          placeholder="Describe your property (min 50 words)"
          rows={4}
        />

        {formData.description && wordCount < 50 && (
          <p className="text-red-500 text-sm mt-1">
            Description must contain at least 50 words. ({wordCount}/50)
          </p>
        )}
      </div>

      
    </div>
  );
};


export default DescriptionSection;
