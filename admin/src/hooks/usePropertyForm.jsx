import { useState } from 'react';

const usePropertyForm = () => {
  const [formData, setFormData] = useState({
    // Basic
    photos: [],
    propertyTitle: '',
    propertyType: '',
    
    // House/Flat
    noOfFloors: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    balconies: '',
    floorDetails: '',
    availabilityStatus: 'Ready to Move',
    otherRooms: [],
    ageOfProperty: [],
    furnishing: '',
    parking: [],
    facilities: [],
    
    // Vaasthu
    plotFacing: '',
    mainDoorDirection: '',
    masterBedroom: '',
    childrenBedroom: '',
    livingRoom: '',
    kitchenRoom: '',
    poojaRoom: '',
    balconyDirection: '',
    
    // Site/Plot
    pricePerCent: '',
    pricePerAcre: '',
    length: '',
    breadth: '',
    floorsAllowed: '',
    boundaryWall: '',
    openSides: '',
    construction: '',
    locationAdvantages: [],
    
    // Common
    possessionBy: 'Immediate',
    allInclusivePrice: false,
    priceNegotiable: false,
    taxCharges: false,
    location: '',
    description: '',
    ownershipDocs: [],
    saleConveyance: [],
    ownerIdentity: [],
    
    // Owner Details
    ownerName: '',
    mobileNumber: ''
  });

  const updateField = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateMultipleFields = (fields) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const resetForm = () => {
    setFormData({
      photos: [],
      propertyTitle: '',
      propertyType: '',
      availabilityStatus: 'Ready to Move',
      possessionBy: 'Immediate',
      otherRooms: [],
      ageOfProperty: [],
      parking: [],
      facilities: [],
      locationAdvantages: [],
      allInclusivePrice: false,
      priceNegotiable: false,
      taxCharges: false
    });
  };

  return { formData, updateField, updateMultipleFields, resetForm };
};

export default usePropertyForm;