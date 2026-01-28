//   import React from 'react';
// import CommercialBasicDetails from '../../sections/CommercialBasicDetails';
// import OfficeForm from './OfficeForm';
// import StorageForm from './StorageForm';
// import HospitalityForm from './HospitalityForm';
// import OtherCommercialForm from './OtherCommercialForm';
// import RetailForm from './RetailForm';
// import IndustryForm from './IndustryForm';
// import PlotForm from './PlotForm';

// const CommercialForm = ({ formData, updateField }) => {
//   const commercialSubType = formData.commercialSubType;

//   const renderCommercialSubForm = () => {
//     switch (commercialSubType) {
//       case 'Office':
//         return <OfficeForm formData={formData} updateField={updateField} />;
//       case 'Storage':
//         return <StorageForm formData={formData} updateField={updateField} />;
//       case 'Hospitality':
//         return <HospitalityForm formData={formData} updateField={updateField} />;  
//       case 'Other':
//         return <OtherCommercialForm formData={formData} updateField={updateField} />;
//       case 'Retail' :
//         return <RetailForm formData={formData} updateField={updateField} />;
      
        
      
//       case 'Plot/Land':
//         return <PlotForm formData={formData} updateField={updateField} />;
//       case 'Industry':
//         return <IndustryForm formData={formData} updateField={updateField} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="space-y-6 border-t pt-6">
//       <CommercialBasicDetails formData={formData} updateField={updateField} />
//       {commercialSubType && renderCommercialSubForm()}
//     </div>
//   );
// };

// export default CommercialForm;
// import React from 'react';
// import CommercialBasicDetails from '../../sections/CommercialBasicDetails';
// import OfficeForm from './OfficeForm';
// import StorageForm from './StorageForm';
// import HospitalityForm from './HospitalityForm';
// import OtherCommercialForm from './OtherCommercialForm';
// import RetailForm from './RetailForm';
// import IndustryForm from './IndustryForm';
// import PlotForm from './PlotForm';

// const CommercialForm = ({ formData, updateField, images, setImages }) => {
//   const commercialSubType = formData.commercialSubType;

//   const renderCommercialSubForm = () => {
//     switch (commercialSubType) {
//       case 'Office':
//         return (
//           <OfficeForm
//             formData={formData}
//             updateField={updateField}
//             images={images}
//             setImages={setImages}
//           />
//         );

//       case 'Storage':
//         return (
//           <StorageForm
//             formData={formData}
//             updateField={updateField}
//             images={images}
//             setImages={setImages}
//           />
//         );

//       case 'Hospitality':
//         return (
//           <HospitalityForm
//             formData={formData}
//             updateField={updateField}
//             images={images}
//             setImages={setImages}
//           />
//         );

//       case 'Retail':
//         return (
//           <RetailForm
//             formData={formData}
//             updateField={updateField}
//             images={images}
//             setImages={setImages}
//           />
//         );

//       case 'Plot/Land':
//         return (
//           <PlotForm
//             formData={formData}
//             updateField={updateField}
//             images={images}
//             setImages={setImages}
//           />
//         );

//       case 'Industry':
//         return (
//           <IndustryForm
//             formData={formData}
//             updateField={updateField}
//             images={images}
//             setImages={setImages}
//           />
//         );

//       case 'Other':
//         return (
//           <OtherCommercialForm
//             formData={formData}
//             updateField={updateField}
//             images={images}
//             setImages={setImages}
//           />
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="space-y-6 border-t pt-6">
//       <CommercialBasicDetails formData={formData} updateField={updateField} />
//       {commercialSubType && renderCommercialSubForm()}
//     </div>
//   );
// };

// export default CommercialForm;

import React from 'react';
import CommercialBasicDetails from '../../sections/CommercialBasicDetails';
import OfficeForm from './OfficeForm';
import StorageForm from './StorageForm';
import HospitalityForm from './HospitalityForm';
import OtherCommercialForm from './OtherCommercialForm';
import RetailForm from './RetailForm';
import IndustryForm from './IndustryForm';
import PlotForm from './PlotForm';

const CommercialForm = ({ 
  formData, 
  updateField,
  officeImages,
  setOfficeImages,
  storageImages,
  setStorageImages,
  hospitalityImages,
  setHospitalityImages,
  retailImages,
  setRetailImages,
  plotCommercialImages,
  setPlotCommercialImages,
  industryImages,
  setIndustryImages,
  otherCommercialImages,
  setOtherCommercialImages
}) => {
  const commercialSubType = formData.commercialSubType;

  const renderCommercialSubForm = () => {
    switch (commercialSubType) {
      case 'Office':
        return (
          <OfficeForm
            formData={formData}
            updateField={updateField}
            images={officeImages}
            setImages={setOfficeImages}
          />
        );

      case 'Storage':
        return (
          <StorageForm
            formData={formData}
            updateField={updateField}
            images={storageImages}
            setImages={setStorageImages}
          />
        );

      case 'Hospitality':
        return (
          <HospitalityForm
            formData={formData}
            updateField={updateField}
            images={hospitalityImages}
            setImages={setHospitalityImages}
          />
        );

      case 'Retail':
        return (
          <RetailForm
            formData={formData}
            updateField={updateField}
            images={retailImages}
            setImages={setRetailImages}
          />
        );

      case 'Plot/Land':
        return (
          <PlotForm
            formData={formData}
            updateField={updateField}
            images={plotCommercialImages}
            setImages={setPlotCommercialImages}
          />
        );

      case 'Industry':
        return (
          <IndustryForm
            formData={formData}
            updateField={updateField}
            images={industryImages}
            setImages={setIndustryImages}
          />
        );

      case 'Other':
        return (
          <OtherCommercialForm
            formData={formData}
            updateField={updateField}
            images={otherCommercialImages}
            setImages={setOtherCommercialImages}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 border-t pt-6">
      <CommercialBasicDetails formData={formData} updateField={updateField} />
      {commercialSubType && renderCommercialSubForm()}
    </div>
  );
};

export default CommercialForm;
