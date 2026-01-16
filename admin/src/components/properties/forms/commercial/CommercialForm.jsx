  import React from 'react';
import CommercialBasicDetails from '../../sections/CommercialBasicDetails';
import OfficeForm from './OfficeForm';
import StorageForm from './StorageForm';
import HospitalityForm from './HospitalityForm';
import OtherCommercialForm from './OtherCommercialForm';
import RetailForm from './RetailForm';
import IndustryForm from './IndustryForm';
import PlotForm from './PlotForm';

const CommercialForm = ({ formData, updateField }) => {
  const commercialSubType = formData.commercialSubType;

  const renderCommercialSubForm = () => {
    switch (commercialSubType) {
      case 'Office':
        return <OfficeForm formData={formData} updateField={updateField} />;
      case 'Storage':
        return <StorageForm formData={formData} updateField={updateField} />;
      case 'Hospitality':
        return <HospitalityForm formData={formData} updateField={updateField} />;  
      case 'Other':
        return <OtherCommercialForm formData={formData} updateField={updateField} />;
      case 'Retail' :
        return <RetailForm formData={formData} updateField={updateField} />;
      
        
      
      case 'Plot/Land':
        return <PlotForm formData={formData} updateField={updateField} />;
      case 'Industry':
        return <IndustryForm formData={formData} updateField={updateField} />;
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