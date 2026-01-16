import { useState } from 'react';

const usePropertyForm = () => {
  const [formData, setFormData] = useState({
    // ================= BASIC =================
    photos: [],
    propertyTitle: '',
    propertyType: '',

    // ================= HOUSE / FLAT =================
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

    // ================= VAASHTU =================
    plotFacing: '',
    mainDoorDirection: '',
    masterBedroom: '',
    childrenBedroom: '',
    livingRoom: '',
    kitchenRoom: '',
    poojaRoom: '',
    balconyDirection: '',

    // ================= SITE / PLOT =================
    pricePerCent: '',
    pricePerAcre: '',
    length: '',
    breadth: '',
    floorsAllowed: '',
    boundaryWall: '',
    openSides: '',
    construction: '',
    locationAdvantages: [],

    // ================= COMMON =================
    possessionBy: 'Immediate',
    allInclusivePrice: false,
    priceNegotiable: false,
    taxCharges: false,
    location: '',
    description: '',
    ownershipDocs: [],
    saleConveyance: [],
    ownerIdentity: [],

    // ================= OWNER =================
    ownerName: '',
    mobileNumber: '',

    // ================= COMMERCIAL =================
    commercialSubType: '',
    officeType: '',

    // Office Setup
    noCabins: '',
    noMeetingRooms: '',
    noSeats: '',
    maxSeats: '',
    hasConferenceRoom: false,
    conferenceRoomCount: '',
    hasWashRoom: false,
    washRoomCount: '',
    washRoomType: '',
    hasReceptionArea: false,
    hasPantry: false,
    pantryType: '',

    // Furnishing
    furnishingItems: [],
    fireSafety: [],

    // Floor Details
    floorNumber: '',
    yourFloorNo: '',
    noStairCases: '',
    liftsAvailable: '',
    passengerLifts: 0,
    serviceLifts: 0,

    // Parking
    parkingAvailable: '',
    parkingLocations: [],
    noParking: '',

    // Pricing
    expectedPrice: '',
    preLeased: '',
    currentRent: '',
    leaseTenure: '',
    fireNOC: '',
    occupancyCertificate: '',
    previouslyUsedFor: '',

    // Office Vaasthu
    officeFacing: '',
    mainEntranceDirection: '',
    ownerCabinDirection: '',
    workstationsDirection: '',
    meetingRoomDirection: '',
    receptionDirection: '',
    accountsDirection: '',
    pantryDirection: '',
    serverRoomDirection: '',
    washroomDirection: '',
    staircaseDirection: '',
    storageDirection: '',
    cashLockerDirection: '',

    // Location
    locatedInside: '',
    zoneType: '',
    carpetArea: '',
    ownershipType: '',

   
  
  // Industry specific fields
  industryType: '',
  noOfWashrooms: '',
  plotArea: '',
  possessionYear: '',
  possessionMonth: '',
  approvedBy: '',
  approvedIndustryType: '',
  preLeased: '',
  currentRent: '',
  leaseTenure: '',
  wheelchairFriendly: false,

  // Hospitality specific fields
  hospitalityType: '',
  noOfRooms: '',
  otherRooms: [],
  furnishing: '',
  flooringType: '',
  
  
  
  });

  const updateField = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateMultipleFields = (fields) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const resetForm = () => {
    setFormData(prev => ({
      ...prev,
      photos: [],
      propertyTitle: '',
      propertyType: '',
      availabilityStatus: 'Ready to Move',
      possessionBy: 'Immediate'
    }));
  };

  return { formData, updateField, updateMultipleFields, resetForm };
};


export default usePropertyForm;


