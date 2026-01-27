import React, { useState } from 'react';
import ImageUpload from '../fields/ImageUpload';
import TextField from '../fields/TextField';
import SelectField from '../fields/SelectField';

import { PROPERTY_TYPES } from '../../../constants/propertyConstants';
import PhotoUploadGuidelinesModal from '../sections/PhotoUploadGuidelinesModal';

const BasicDetailsSection = ({ propertyType, setPropertyType, formData, updateField }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Property Details</h3>
          <button 
            type="button" 
            className="text-green-600 text-sm hover:text-green-700"
            onClick={() => setIsModalOpen(true)}
          >
            View Guidelines
          </button>
        </div>

        <ImageUpload
          images={formData.photos || []}
          onChange={(photos) => updateField('photos', photos)}
          maxImages={10}
        />

        <div className="mt-6 space-y-4">
          <TextField
            label="Property Title"
            name="propertyTitle"
            value={formData.propertyTitle}
            onChange={(value) => updateField('propertyTitle', value)}
            placeholder="Enter property title"
            required
          />

          <SelectField
            label="Property Type"
            name="propertyType"
            value={propertyType}
            onChange={setPropertyType}
            options={PROPERTY_TYPES}
            placeholder="Select Property Type"
            required
          />
        </div>
      </div>

      <PhotoUploadGuidelinesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default BasicDetailsSection;