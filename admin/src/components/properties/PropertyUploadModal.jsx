
// admin/src/components/properties/PropertyUploadModal.jsx
import React, { useState } from "react";
import { X } from "lucide-react";
import BasicDetailsSection from "./forms/BasicDetailsSection";
import CommonFields from "./forms/CommonFields";
import HouseForm from "./forms/HouseForm";
import SitePlotForm from './forms/SitePlotForm';
import ResortForm from "./forms/ResortForm";
import CommercialForm from "./forms/commercial/CommercialForm";
import usePropertyForm from "../../hooks/usePropertyForm";
import usePropertyUpload from "../../hooks/usePropertyUpload";
import { toast } from 'react-toastify';

const PropertyUploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [propertyType, setPropertyType] = useState("");
  const [isDescriptionValid, setIsDescriptionValid] = useState(false);

  const { formData, updateField, resetForm } = usePropertyForm();
  const { uploadProperty, loading, error } = usePropertyUpload();
  
  // File states
// File states
const [basicImages, setBasicImages] = useState([]);
const [houseImages, setHouseImages] = useState([]);
const [sitePlotImages, setSitePlotImages] = useState([]);
const [resortImages, setResortImages] = useState([]);
// Commercial subtypes
const [officeImages, setOfficeImages] = useState([]);
const [storageImages, setStorageImages] = useState([]);
const [hospitalityImages, setHospitalityImages] = useState([]);
const [retailImages, setRetailImages] = useState([]);
const [plotCommercialImages, setPlotCommercialImages] = useState([]);
const [industryImages, setIndustryImages] = useState([]);
const [otherCommercialImages, setOtherCommercialImages] = useState([]);
// Documents
const [ownershipDocs, setOwnershipDocs] = useState([]);
const [identityDocs, setIdentityDocs] = useState([]);

  const handleClose = () => {
    resetForm();
  setPropertyType("");
  setBasicImages([]);
  setHouseImages([]);
  setSitePlotImages([]);
  setResortImages([]);
  setOfficeImages([]);
  setStorageImages([]);
  setHospitalityImages([]);
  setRetailImages([]);
  setPlotCommercialImages([]);
  setIndustryImages([]);
  setOtherCommercialImages([]);
  setOwnershipDocs([]);
  setIdentityDocs([]);
  onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validation
    if (!propertyType) {
  toast.error('Please select property type');
  return;
}

const allPropertyImages = [
  ...basicImages,
  ...houseImages,
  ...sitePlotImages,
  ...resortImages,
  ...officeImages,
  ...storageImages,
  ...hospitalityImages,
  ...retailImages,
  ...plotCommercialImages,
  ...industryImages,
  ...otherCommercialImages
];

if (allPropertyImages.length === 0) {
  toast.error('Please add at least one property image');
  return;
}

if (ownershipDocs.length === 0) {
  toast.error('Please add ownership documents');
  return;
}

if (identityDocs.length === 0) {
  toast.error('Please add identity documents');
  return;
}


      // Prepare form data
      const propertyData = {
        propertyType,
        ownerDetails: {
          name: formData.ownerName,
          phone: formData.mobileNumber,
          email: formData.email,
        },
        expectedPrice: formData.expectedPrice
          ? Number(formData.expectedPrice)
          : 0,
        ...formData,
        ownerName: undefined,
        mobileNumber: undefined,
        email: undefined,
        originalLanguage: 'en',
      };

      if (propertyType === 'Commercial') {
        propertyData.commercialDetails = {
          ...propertyData.commercialDetails,
          subType: formData.commercialSubType,
        };
        // Remove redundant commercialSubType from top level
        delete propertyData.commercialSubType;
      } else {
        // Ensure commercialSubType is not sent for non-commercial properties
        delete propertyData.commercialSubType;
      }


      // Prepare files
      
const files = {
  images: [
    ...basicImages,
    ...houseImages,
    ...sitePlotImages,
    ...resortImages,
    ...officeImages,
    ...storageImages,
    ...hospitalityImages,
    ...retailImages,
    ...plotCommercialImages,
    ...industryImages,
    ...otherCommercialImages
  ],
  ownershipDocs,
  identityDocs
};

      console.log('📤 Uploading property...', propertyData);

      // Upload property
      const result = await uploadProperty(propertyData, files);

      console.log('✅ Property uploaded successfully', result);
      toast.success('Property uploaded successfully! It will be reviewed by admin.');

      
      if (onSuccess) {
        onSuccess(result);
      }
      
      handleClose();

    } catch (err) {
      console.error('❌ Upload failed:', err);
      toast.error(err.message || 'Failed to upload property');

    }
  };

  const renderPropertyForm = () => {
    switch (propertyType) {
      case "House/Flat":
        return (
          <HouseForm 
            formData={formData} 
            updateField={updateField}
            images={houseImages}        // ✅ CORRECT
      setImages={setHouseImages}
            setIsDescriptionValid={setIsDescriptionValid}
          />
        );
      case "Site/Plot(Land)":
        return (
          <SitePlotForm 
            formData={formData} 
            updateField={updateField}
              images={sitePlotImages}        // ✅ Change from 'houseImages' to 'sitePlotImages'
      setImages={setSitePlotImages}
          />
        );
      case "Commercial":
        return (
              <CommercialForm 
      formData={formData} 
      updateField={updateField}
      officeImages={officeImages}
      setOfficeImages={setOfficeImages}
      storageImages={storageImages}
      setStorageImages={setStorageImages}
      hospitalityImages={hospitalityImages}
      setHospitalityImages={setHospitalityImages}
      retailImages={retailImages}
      setRetailImages={setRetailImages}
      plotCommercialImages={plotCommercialImages}
      setPlotCommercialImages={setPlotCommercialImages}
      industryImages={industryImages}
      setIndustryImages={setIndustryImages}
      otherCommercialImages={otherCommercialImages}
      setOtherCommercialImages={setOtherCommercialImages}
    />
        );
      case "Resort":
        return (
          <ResortForm 
            formData={formData} 
            updateField={updateField}
           images={resortImages}        // ✅ Change from 'images' to 'resortImages'
      setImages={setResortImages}
          />
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-semibold">Upload Your Property</h2>
            <p className="text-sm text-gray-500">Add your property details</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Basic Details */}
            <BasicDetailsSection
              propertyType={propertyType}
              setPropertyType={setPropertyType}
              formData={formData}
              updateField={updateField}
              images={basicImages}
             setImages={setBasicImages}     
            />

            {/* Property Specific Form */}
            {propertyType && renderPropertyForm()}

            {/* Common Fields (Owner details & Documents) */}
            {propertyType && (
              <CommonFields 
                formData={formData} 
                updateField={updateField}
                ownershipDocs={ownershipDocs}
                setOwnershipDocs={setOwnershipDocs}
                identityDocs={identityDocs}
                setIdentityDocs={setIdentityDocs}
              />
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!propertyType || loading}
              className="px-6 py-2 bg-[#22C55E] text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Uploading...
                </>
              ) : (
                'Upload Property'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyUploadModal;