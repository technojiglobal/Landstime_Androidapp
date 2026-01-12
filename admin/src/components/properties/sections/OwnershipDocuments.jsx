import React from 'react';
import ImageUpload from '../fields/ImageUpload';

const OwnershipDocuments = ({ formData, updateField }) => (
  <div className="space-y-6">
    <div className="border-t pt-6">
      <h3 className="font-semibold mb-2">Property Ownership</h3>
      <p className="text-sm text-gray-600 mb-4">
        Provide copies of property documents like tax receipts, family tax documents
      </p>
      <ImageUpload
        label="Add Photos"
        images={formData.ownershipDocs || []}
        onChange={(value) => updateField('ownershipDocs', value)}
        maxImages={10}
      />
      <p className="text-xs text-gray-500 mt-2">No minimum or maximum of 10 photos</p>
    </div>

    <div className="border-t pt-6">
      <h3 className="font-semibold mb-2">Sale Deed/Conveyance</h3>
      <p className="text-sm text-gray-600 mb-4">
        Previous sales deed for property transactions that have occurred
      </p>
      <ImageUpload
        label="Add Photos"
        images={formData.saleConveyance || []}
        onChange={(value) => updateField('saleConveyance', value)}
        maxImages={10}
      />
      <p className="text-xs text-gray-500 mt-2">No minimum or maximum of 10 photos (2 optional)</p>
    </div>

    <div className="border-t pt-6">
      <h3 className="font-semibold mb-2">Owner Identity</h3>
      <p className="text-sm text-gray-600 mb-4">
        Owner identity proof such as aadhaar, pan card, voter ID, driver's license, or passport
      </p>
      <ImageUpload
        label="Add Photos"
        images={formData.ownerIdentity || []}
        onChange={(value) => updateField('ownerIdentity', value)}
        maxImages={3}
      />
      <p className="text-xs text-gray-500 mt-2">Upload photos (1 required 2 optional)</p>
    </div>
  </div>
);

export default OwnershipDocuments;
