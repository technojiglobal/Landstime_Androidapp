import React, { useState } from "react";
import { X } from "lucide-react";
import BasicDetailsSection from "./forms/BasicDetailsSection";
import CommonFields from "./forms/CommonFields";
import HouseForm from "./forms/HouseForm";
import SitePlotForm from './forms/SitePlotForm';
import usePropertyForm from "../../hooks/usePropertyForm";
import ResortForm from "./forms/ResortForm";
import CommercialForm from "./forms/commercial/CommercialForm";
const PropertyUploadModal = ({ isOpen, onClose, onSubmit }) => {
  const [propertyType, setPropertyType] = useState("");
  const { formData, updateField, resetForm } = usePropertyForm();
  const handleClose = () => {
    resetForm();
    setPropertyType("");
    onClose();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      propertyType,
      ...formData,
    };
    console.log("Submitting:", payload);
    onSubmit(payload);
    handleClose();
  };
  if (!isOpen) return null;
  const renderPropertyForm = () => {
    switch (propertyType) {
      case "House/Flat":
        return <HouseForm formData={formData} updateField={updateField} />;
      case "Site/Plot(Land)":
        return <SitePlotForm formData={formData} updateField={updateField} />;
      case "Commercial":
        return <CommercialForm formData={formData} updateField={updateField} />;
      case "Resort":
        return (
          <div className="py-8 text-gray-500">
           <ResortForm formData={formData} updateField={updateField} />
          </div>
        );
      default:
        return null;
    }
  };
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
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Basic Details */}
            <BasicDetailsSection
              propertyType={propertyType}
              setPropertyType={setPropertyType}
              formData={formData}
              updateField={updateField}
            />

            {/* Property Specific Form */}
            {propertyType && renderPropertyForm()}

            {/* Common Fields */}
            {propertyType && (
              <CommonFields formData={formData} updateField={updateField} />
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!propertyType}
              className="px-6 py-2 bg-[#22C55E] text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Upload Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default PropertyUploadModal;
