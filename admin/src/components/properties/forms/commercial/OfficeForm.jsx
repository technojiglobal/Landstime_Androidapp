
import React from 'react';
import NumberField from '../../fields/NumberField';
import SelectField from '../../fields/SelectField';
import LocationSection from '../../sections/LocationSection';
import OfficeDetailsSection from '../../sections/OfficeDetailsSection';
import OfficePricingDetailsSection from '../../sections/OfficePricingDetailsSection';
import DescriptionSection from '../../sections/DescriptionSection';
import VaasthuDetails from '../../sections/VaasthuDetails';
import AvailabilityStatus from '../../sections/AvailabilityStatus';
import CheckboxGroup from '../../fields/CheckboxGroup';
import ImageUpload from '../../fields/ImageUpload';
import { 
  OWNERSHIP_TYPES, 
  OFFICE_AMENITIES
} from '../../../../constants/propertyConstants';
import { officeVaasthuFields } from '../../../../constants/vastuFields';

const OfficeForm = ({ formData, updateField, images, setImages }) => {
  // Extract office details for easier access
  const office = formData.commercialDetails?.officeDetails || {};
  
  return (
    <div className="space-y-6 border-t pt-6">
      
      {/* ==================== PROPERTY IMAGES ==================== */}
      <ImageUpload
        label="Property Images"
        images={images}
        onChange={setImages}
        maxImages={20}
        required={true}
      />

      {/* ==================== LOCATION SECTION ==================== */}
      <LocationSection formData={formData} updateField={updateField} />

      {/* ==================== LOCATION DETAILS ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Location Details</h3>
        <div className="grid grid-cols-1 gap-4">
          <SelectField
            label="Located Inside"
            name="locatedInside"
            value={office.locatedInside || ''}
            onChange={(value) =>
              updateField('commercialDetails.officeDetails.locatedInside', value)
            }
            options={[
              '', 
              'Business Park', 
              'IT Park', 
              'Mall', 
              'Standalone Building',
              'Commercial Complex',
              'Office Building'
            ]}
            placeholder="Select location type"
          />

          <SelectField
            label="Zone Type"
            name="zoneType"
            value={office.zoneType || ''}
            onChange={(value) =>
              updateField('commercialDetails.officeDetails.zoneType', value)
            }
            options={[
              '', 
              'Industrial', 
              'Commercial', 
              'Residential', 
              'Transport & Communication', 
              'Public Utilities', 
              'Public & Semi Public Use'
            ]}
            placeholder="Select zone type"
          />
        </div>
      </div>

      {/* ==================== AREA SECTION ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Area</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Carpet Area *</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={office.carpetArea || ''}
                onChange={(e) =>
                  updateField('commercialDetails.officeDetails.carpetArea', e.target.value)
                }
                placeholder="Enter area"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <select
                value={office.carpetAreaUnit || 'sqft'}
                onChange={(e) =>
                  updateField('commercialDetails.officeDetails.carpetAreaUnit', e.target.value)
                }
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="sqft">sqft</option>
                <option value="sqm">sqm</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== OFFICE DETAILS SECTION ==================== */}
      <OfficeDetailsSection
        formData={office}
        updateField={(key, value) =>
          updateField(`commercialDetails.officeDetails.${key}`, value)
        }
      />

      {/* ==================== AVAILABILITY STATUS ==================== */}
      {/* ✅ CORRECTED - Pass office data directly with proper wrapper */}
      <AvailabilityStatus
        formData={{ ...office }}
        updateField={(key, value) =>
          updateField(`commercialDetails.officeDetails.${key}`, value)
        }
      />

      {/* ==================== OWNERSHIP ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-3">Ownership</h3>
        <div className="flex flex-wrap gap-2">
          {OWNERSHIP_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => 
                updateField('commercialDetails.officeDetails.ownership', type)
              }
              className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                office.ownership === type
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* ==================== PRICING DETAILS SECTION ==================== */}
      <OfficePricingDetailsSection
        formData={office}
        updateField={(key, value) =>
          updateField(`commercialDetails.officeDetails.${key}`, value)
        }
      />

      {/* ==================== DESCRIPTION ==================== */}
      <DescriptionSection formData={formData} updateField={updateField} />
      
      {/* ==================== AMENITIES ==================== */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-left mb-4">Amenities</h3>
        <CheckboxGroup
          name="amenities"
          selected={office.amenities || []}
          onChange={(value) => 
            updateField('commercialDetails.officeDetails.amenities', value)
          }
          options={OFFICE_AMENITIES}
        />
      </div>

   

      {/* ==================== VAASTHU DETAILS SECTION ==================== */}
      <VaasthuDetails 
        formData={office}
        updateField={(key, value) =>
          updateField(`commercialDetails.officeDetails.vaasthuDetails.${key}`, value)
        }
        fields={officeVaasthuFields}
      />

    </div>
  );
};

export default OfficeForm;