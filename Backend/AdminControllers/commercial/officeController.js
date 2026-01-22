// Backend/AdminControllers/commercial/officeController.js

export const handleOfficeProperty = (propertyData, finalData) => {
  finalData.commercialDetails.officeDetails = {
    locatedInside: propertyData.locatedInside || '',
    zoneType: propertyData.zoneType || '',

    carpetArea: Number(propertyData.carpetArea) || 0,
    carpetAreaUnit: propertyData.carpetAreaUnit || 'sqft',

    noCabins: Number(propertyData.noCabins) || 0,
    noMeetingRooms: Number(propertyData.noMeetingRooms) || 0,
    noSeats: Number(propertyData.noSeats) || 0,

    hasConferenceRoom: !!propertyData.hasConferenceRoom,
    conferenceRoomCount: propertyData.conferenceRoomCount || '',

    hasWashRoom: !!propertyData.hasWashRoom,
    publicWashRoomCount: propertyData.publicWashRoomCount || '',
    privateWashRoomCount: propertyData.privateWashRoomCount || '',

    hasReceptionArea: !!propertyData.hasReceptionArea,

    hasPantry: !!propertyData.hasPantry,
    pantryType: propertyData.pantryType || '',
    pantrySize: propertyData.pantrySize || '',

    fireSafety: propertyData.fireSafety || [],

    floorNumber: propertyData.floorNumber || '',
    yourFloorNo: propertyData.yourFloorNo || '',
    noStairCases: propertyData.noStairCases || '',

    liftsAvailable: propertyData.liftsAvailable || '',
    passengerLifts: Number(propertyData.passengerLifts) || 0,
    serviceLifts: Number(propertyData.serviceLifts) || 0,

    parkingAvailable: propertyData.parkingAvailable || '',
    parkingLocations: propertyData.parkingLocations || [],
    noParking: Number(propertyData.noParking) || 0,

    availabilityStatus: propertyData.availabilityStatus || '',
    ageOfProperty: propertyData.ageOfProperty || [],
    possessionYear: propertyData.possessionYear || '',
    possessionMonth: propertyData.possessionMonth || '',

    expectedPrice: Number(propertyData.expectedPrice) || 0,
    preLeased: propertyData.preLeased || '',
    currentRent: Number(propertyData.currentRent) || 0,
    leaseTenure: Number(propertyData.leaseTenure) || 0,
    fireNOC: propertyData.fireNOC || '',
    occupancyCertificate: propertyData.occupancyCertificate || '',
    previouslyUsedFor: propertyData.previouslyUsedFor || '',
    description: propertyData.description || '',

    amenities: propertyData.amenities || [],

    vaasthuDetails: propertyData.vaasthuDetails || {}
  };
};
