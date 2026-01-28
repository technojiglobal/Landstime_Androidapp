// import React from 'react';
// import NumberField from '../fields/NumberField';
// import TextAreaField from '../fields/TextAreaField';
// import ToggleButtons from '../fields/ToggleButtons';
// import CheckboxGroup from '../fields/CheckboxGroup';
// import RadioButtons from '../fields/RadioButtons';
// import ImageUpload from '../fields/ImageUpload';
// import VaasthuDetails from '../sections/VaasthuDetails';
// import FacilitiesSection from '../sections/FacilitiesSection';
// import ParkingSection from '../sections/ParkingSection';
// import SelectField from '../fields/SelectField';
// import { RESORT_TYPES } from '../../../constants/propertyConstants';
// import { resortVaasthuFields } from '../../../constants/vastuFields';
// import LocationSection from '../sections/LocationSection';
// import DescriptionSection from '../sections/DescriptionSection';

// const ResortForm = ({
//   propertyType,
//   setPropertyType,
//   formData,
//   updateField,
//   images,
//   setImages
// }) => (
//   <>
//     <SelectField
//       label="Resort Type"
//       name="resortType"
//       value={propertyType}
//       onChange={setPropertyType}
//       options={RESORT_TYPES}
//       placeholder="Beachfront"
//       required
//     />

//     <div className="space-y-6 border-t pt-3">
//       <h3 className="font-semibold">Basic Details</h3>

//       {/* Property Images */}
//       <ImageUpload
//         label="Property Images"
//         images={images}
//         onChange={setImages}
//         maxImages={20}
//         required={true}
//       />

//       <div className="grid grid-cols-2 gap-4">
//         <NumberField
//           label="Rooms"
//           name="rooms"
//           value={formData.rooms}
//           onChange={(value) => updateField('rooms', value)}
//         />

//         <NumberField
//           label="Land Area (in sqft)"
//           name="landArea"
//           value={formData.landArea}
//           onChange={(value) => updateField('landArea', value)}
//         />

//         <NumberField
//           label="Floors"
//           name="floors"
//           value={formData.floors}
//           onChange={(value) => updateField('floors', value)}
//         />

//         <NumberField
//           label="Build Area (in sqft)"
//           name="buildArea"
//           value={formData.buildArea}
//           onChange={(value) => updateField('buildArea', value)}
//         />
//       </div>

//       <NumberField
//         label="Price (₹)"
//         name="price"
//         value={formData.price}
//         onChange={(value) => updateField('price', value)}
//       />

//       <LocationSection formData={formData} updateField={updateField} />
//       <DescriptionSection formData={formData} updateField={updateField} />

//       <VaasthuDetails
//         formData={formData}
//         updateField={updateField}
//         fields={resortVaasthuFields}
//       />
//     </div>
//   </>
// );

// export default ResortForm;
import React from 'react';
import NumberField from '../fields/NumberField';
import TextAreaField from '../fields/TextAreaField';
import ToggleButtons from '../fields/ToggleButtons';
import CheckboxGroup from '../fields/CheckboxGroup';
import RadioButtons from '../fields/RadioButtons';
import ImageUpload from '../fields/ImageUpload';
import VaasthuDetails from '../sections/VaasthuDetails';
import FacilitiesSection from '../sections/FacilitiesSection';
import ParkingSection from '../sections/ParkingSection';
import SelectField from '../fields/SelectField';
import { RESORT_TYPES } from '../../../constants/propertyConstants';
import { resortVaasthuFields } from '../../../constants/vastuFields';
import LocationSection from '../sections/LocationSection';
import DescriptionSection from '../sections/DescriptionSection';
import PricingSection from '../sections/PricingSection';

const ResortForm = ({
  propertyType,
  setPropertyType,
  formData,
  updateField,
  images,
  setImages
}) => {
  // Helper function to update nested resortDetails fields
 // ResortForm.jsx
const updateResortField = (field, value) => {
  updateField('resortDetails', {
    ...(formData.resortDetails || {}),
    [field]: value,
  });
};

const updateVaasthuField = (field, value) => {
  updateField('resortDetails', {
    ...(formData.resortDetails || {}),
    vaasthuDetails: {
      ...(formData.resortDetails?.vaasthuDetails || {}),
      [field]: value,
    },
  });
};



  return (
    <>
      <SelectField
        label="Resort Type"
        name="resortType"
        value={propertyType}
        onChange={setPropertyType}
        options={RESORT_TYPES}
        placeholder="Beachfront"
        required
      />

      <div className="space-y-6 border-t pt-3">
        <h3 className="font-semibold">Basic Details</h3>

        {/* Property Images */}
        <ImageUpload
          label="Property Images"
          images={images}
          onChange={setImages}
          maxImages={20}
          required={true}
        />

        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label="Rooms"
            name="rooms"
            value={formData.resortDetails?.rooms || ''}
            onChange={(value) => updateResortField('rooms', value)}
          />

          <NumberField
  label={
    <span>
      Land Area (in sqft) <span className="text-red-500">*</span>
    </span>
  }
  name="landArea"
  value={formData.resortDetails?.landArea || ''}
  onChange={(value) => updateResortField('landArea', value)}
/>


          <NumberField
            label="Floors"
            name="floors"
            value={formData.resortDetails?.floors || ''}
            onChange={(value) => updateResortField('floors', value)}
          />
<NumberField
  label={
    <span>
      Build Area (in sqft) <span className="text-red-500">*</span>
    </span>
  }
  name="buildArea"
  value={formData.resortDetails?.buildArea || ''}
  onChange={(value) => updateResortField('buildArea', value)}
/>
        </div>

        <div className="border-t pt-6">
  <h3 className="font-semibold mb-4">Price Details</h3>

  <NumberField
    label=""
    name="expectedPrice"
    value={formData.expectedPrice || ''}
    onChange={(value) => updateField('expectedPrice', value)}
    placeholder="₹ Expected Price"
  />

  <div className="mt-3">
    <PricingSection
      formData={formData}
      updateField={updateField}
    />
  </div>
</div>


        <LocationSection formData={formData} updateField={updateField} />
        <DescriptionSection formData={formData} updateField={updateField} />

        {/* Vaastu Details - Pass nested data and update function */}
        <VaasthuDetails
          formData={formData.resortDetails || {}}
          updateField={updateVaasthuField}
          fields={resortVaasthuFields}
        />
      </div>
    </>
  );
};

export default ResortForm;