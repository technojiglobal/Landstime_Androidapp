// Landstime_Androidapp/admin/src/components/properties/PropertyModal.jsx
import { X, FileText, Download, Edit2, Upload, Trash2 } from "lucide-react";
import { useState } from "react";
import { translateText } from "../../services/translationService";
import { toast } from "react-toastify";

import {
  uploadPropertyImages,
  deletePropertyImage,
  uploadPropertyDocuments,
  deletePropertyDocument
} from "../../services/propertyService";

// Helper to get English text from multilingual object
const getEnglishText = (field, fallback = 'N/A') => {
  if (!field) return fallback;
  if (typeof field === 'string') return field;
  if (typeof field === 'object') {
    return field.en || field.te || field.hi || fallback;
  }
  return fallback;
};

export default function PropertyModal({ property, onClose, onUpdate }) {
  const safeDescription =
    typeof property.description === "string"
      ? property.description
      : property.description?.en || "";
  const [showImages, setShowImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    propertyTitle: typeof property.raw.propertyTitle === 'string' 
      ? property.raw.propertyTitle 
      : property.raw.propertyTitle?.en || '',
    description: typeof property.raw.description === 'string'
      ? property.raw.description
      : property.raw.description?.en || '',
    expectedPrice:
      typeof property.price === "string"
        ? property.price.replace("₹", "")
        : property.price || "",
   location: getEnglishText(property.raw.location, ''),
    area: getEnglishText(property.raw.area, ''),
    // Owner details
    'ownerDetails.name': property.raw.ownerDetails?.name || '',
    'ownerDetails.email': property.raw.ownerDetails?.email || '',
    'ownerDetails.phone': property.raw.ownerDetails?.phone || '',
    // House details
   ...(property.raw.houseDetails && {
      'houseDetails.floors': property.raw.houseDetails.floors || '',
      'houseDetails.area': property.raw.houseDetails.area || '',
      'houseDetails.bedrooms': property.raw.houseDetails.bedrooms || '',
      'houseDetails.bathrooms': property.raw.houseDetails.bathrooms || '',
      'houseDetails.balconies': property.raw.houseDetails.balconies || '',
      'houseDetails.ageOfProperty': property.raw.houseDetails.ageOfProperty || '',
      'houseDetails.ownership': property.raw.houseDetails.ownership || '',
      'houseDetails.furnishing': property.raw.houseDetails.furnishing || '',
      'houseDetails.availabilityStatus': property.raw.houseDetails.availabilityStatus || '',
      'houseDetails.floorDetails': property.raw.houseDetails.floorDetails || '',
      'houseDetails.possessionBy': property.raw.houseDetails.possessionBy || '',
      'houseDetails.parking.covered': property.raw.houseDetails.parking?.covered || 0,
      'houseDetails.parking.open': property.raw.houseDetails.parking?.open || 0,
      // ADD VASTU DETAILS
      ...(property.raw.houseDetails.vaasthuDetails && 
        Object.keys(property.raw.houseDetails.vaasthuDetails).reduce((acc, key) => {
          acc[`houseDetails.vaasthuDetails.${key}`] = property.raw.houseDetails.vaasthuDetails[key] || '';
          return acc;
        }, {})
      ),
    }),
    // Site details
 
...(property.raw.siteDetails && {
  'siteDetails.area': property.raw.siteDetails.area || '',
  'siteDetails.length': property.raw.siteDetails.length || '',
  'siteDetails.breadth': property.raw.siteDetails.breadth || '',
  'siteDetails.floorsAllowed': property.raw.siteDetails.floorsAllowed || '',
  'siteDetails.boundaryWall': property.raw.siteDetails.boundaryWall ? 'Yes' : 'No',
  'siteDetails.openSides': property.raw.siteDetails.openSides || '',
  'siteDetails.roadWidth': property.raw.siteDetails.roadWidth || '',
  'siteDetails.propertyFacing': property.raw.siteDetails.propertyFacing || '',
  'siteDetails.constructionDone': property.raw.siteDetails.constructionDone ? 'Yes' : 'No',
  'siteDetails.constructionType': property.raw.siteDetails.constructionType?.join(', ') || '',
  'siteDetails.possessionBy': property.raw.siteDetails.possessionBy || '',
  'siteDetails.ownership': property.raw.siteDetails.ownership || '',
  'siteDetails.approvedBy': property.raw.siteDetails.approvedBy?.join(', ') || '',
  'siteDetails.inGatedSociety': property.raw.siteDetails.inGatedSociety ? 'Yes' : 'No',
  'siteDetails.cornerProperty': property.raw.siteDetails.cornerProperty ? 'Yes' : 'No',
  'siteDetails.amenities': property.raw.siteDetails.amenities?.join(', ') || '',
  'siteDetails.overlooking': property.raw.siteDetails.overlooking?.join(', ') || '',
  'siteDetails.locationAdvantages': property.raw.siteDetails.locationAdvantages?.join(', ') || '',
  // ADD VASTU DETAILS
  ...(property.raw.siteDetails.vaasthuDetails && 
    Object.keys(property.raw.siteDetails.vaasthuDetails).reduce((acc, key) => {
      acc[`siteDetails.vaasthuDetails.${key}`] = property.raw.siteDetails.vaasthuDetails[key] || '';
      return acc;
    }, {})
  ),
}),
   // Commercial Office details
    ...(property.raw.commercialDetails?.officeDetails && {
      'commercialDetails.officeDetails.officeKind': property.raw.commercialDetails.officeDetails.officeKind || '',
      'commercialDetails.officeDetails.location': property.raw.commercialDetails.officeDetails.location || '',
      'commercialDetails.officeDetails.locatedInside': property.raw.commercialDetails.officeDetails.locatedInside || '',
      'commercialDetails.officeDetails.zoneType': property.raw.commercialDetails.officeDetails.zoneType || '',
      'commercialDetails.officeDetails.neighborhoodArea': property.raw.commercialDetails.officeDetails.neighborhoodArea || '',
      'commercialDetails.officeDetails.carpetArea': property.raw.commercialDetails.officeDetails.carpetArea || '',
      'commercialDetails.officeDetails.carpetAreaUnit': property.raw.commercialDetails.officeDetails.carpetAreaUnit || 'sqft',
      'commercialDetails.officeDetails.cabins': property.raw.commercialDetails.officeDetails.cabins || '',
      'commercialDetails.officeDetails.meetingRooms': property.raw.commercialDetails.officeDetails.meetingRooms || '',
      'commercialDetails.officeDetails.seats': property.raw.commercialDetails.officeDetails.seats || '',
      'commercialDetails.officeDetails.maxSeats': property.raw.commercialDetails.officeDetails.maxSeats || '',
      'commercialDetails.officeDetails.conferenceRooms': property.raw.commercialDetails.officeDetails.conferenceRooms || '',
      'commercialDetails.officeDetails.washrooms.public': property.raw.commercialDetails.officeDetails.washrooms?.public || '',
      'commercialDetails.officeDetails.washrooms.private': property.raw.commercialDetails.officeDetails.washrooms?.private || '',
      'commercialDetails.officeDetails.receptionArea': property.raw.commercialDetails.officeDetails.receptionArea || false,
      'commercialDetails.officeDetails.furnishing': property.raw.commercialDetails.officeDetails.furnishing || false,
      'commercialDetails.officeDetails.pantry': property.raw.commercialDetails.officeDetails.pantry || false,
      'commercialDetails.officeDetails.pantryType': property.raw.commercialDetails.officeDetails.pantryType || '',
      'commercialDetails.officeDetails.pantrySize': property.raw.commercialDetails.officeDetails.pantrySize || '',
      'commercialDetails.officeDetails.additionalFeatures': property.raw.commercialDetails.officeDetails.additionalFeatures?.join(', ') || '',
      'commercialDetails.officeDetails.fireSafetyMeasures': property.raw.commercialDetails.officeDetails.fireSafetyMeasures?.join(', ') || '',
      'commercialDetails.officeDetails.totalFloors': property.raw.commercialDetails.officeDetails.totalFloors || '',
      'commercialDetails.officeDetails.floorNo': property.raw.commercialDetails.officeDetails.floorNo || '',
      'commercialDetails.officeDetails.staircases': property.raw.commercialDetails.officeDetails.staircases || '',
      'commercialDetails.officeDetails.lift': property.raw.commercialDetails.officeDetails.lift || '',
      'commercialDetails.officeDetails.passengerLifts': property.raw.commercialDetails.officeDetails.passengerLifts || 0,
      'commercialDetails.officeDetails.serviceLifts': property.raw.commercialDetails.officeDetails.serviceLifts || 0,
      'commercialDetails.officeDetails.parking.type': property.raw.commercialDetails.officeDetails.parking?.type || '',
      'commercialDetails.officeDetails.parking.count': property.raw.commercialDetails.officeDetails.parking?.count || '',
      'commercialDetails.officeDetails.parking.options.basement': property.raw.commercialDetails.officeDetails.parking?.options?.basement || false,
      'commercialDetails.officeDetails.parking.options.outside': property.raw.commercialDetails.officeDetails.parking?.options?.outside || false,
      'commercialDetails.officeDetails.parking.options.private': property.raw.commercialDetails.officeDetails.parking?.options?.private || false,
      'commercialDetails.officeDetails.availability': property.raw.commercialDetails.officeDetails.availability || '',
      'commercialDetails.officeDetails.ageOfProperty': property.raw.commercialDetails.officeDetails.ageOfProperty || '',
      'commercialDetails.officeDetails.possessionBy': property.raw.commercialDetails.officeDetails.possessionBy || '',
      'commercialDetails.officeDetails.ownership': property.raw.commercialDetails.officeDetails.ownership || '',
      'commercialDetails.officeDetails.expectedPrice': property.raw.commercialDetails.officeDetails.expectedPrice || '',
      'commercialDetails.officeDetails.priceDetails.allInclusive': property.raw.commercialDetails.officeDetails.priceDetails?.allInclusive || false,
      'commercialDetails.officeDetails.priceDetails.negotiable': property.raw.commercialDetails.officeDetails.priceDetails?.negotiable || false,
      'commercialDetails.officeDetails.priceDetails.taxExcluded': property.raw.commercialDetails.officeDetails.priceDetails?.taxExcluded || false,
      'commercialDetails.officeDetails.preLeased': property.raw.commercialDetails.officeDetails.preLeased || '',
      'commercialDetails.officeDetails.leaseDuration': property.raw.commercialDetails.officeDetails.leaseDuration || '',
      'commercialDetails.officeDetails.monthlyRent': property.raw.commercialDetails.officeDetails.monthlyRent || '',
      'commercialDetails.officeDetails.nocCertified': property.raw.commercialDetails.officeDetails.nocCertified || '',
      'commercialDetails.officeDetails.occupancyCertified': property.raw.commercialDetails.officeDetails.occupancyCertified || '',
      'commercialDetails.officeDetails.previouslyUsedFor': property.raw.commercialDetails.officeDetails.previouslyUsedFor || '',
      'commercialDetails.officeDetails.description': property.raw.commercialDetails.officeDetails.description || '',
      'commercialDetails.officeDetails.amenities': property.raw.commercialDetails.officeDetails.amenities?.join(', ') || '',
      'commercialDetails.officeDetails.locationAdvantages': property.raw.commercialDetails.officeDetails.locationAdvantages?.join(', ') || '',
      // ADD VASTU DETAILS
      ...(property.raw.commercialDetails.officeDetails.vaasthuDetails && 
        Object.keys(property.raw.commercialDetails.officeDetails.vaasthuDetails).reduce((acc, key) => {
          acc[`commercialDetails.officeDetails.vaasthuDetails.${key}`] = property.raw.commercialDetails.officeDetails.vaasthuDetails[key] || '';
          return acc;
        }, {})
      ),
    }),

   // Resort details
    ...(property.raw.resortDetails && {
      'resortDetails.resortType': property.raw.resortDetails.resortType || '',
      'resortDetails.landArea': property.raw.resortDetails.landArea || '',
      'resortDetails.buildArea': property.raw.resortDetails.buildArea || '',
      'resortDetails.rooms': property.raw.resortDetails.rooms || '',
      'resortDetails.floors': property.raw.resortDetails.floors || '',
      'resortDetails.locationAdvantages': property.raw.resortDetails.locationAdvantages?.join(', ') || '',
      // ADD VASTU DETAILS
      ...(property.raw.resortDetails.vaasthuDetails && 
        Object.keys(property.raw.resortDetails.vaasthuDetails).reduce((acc, key) => {
          acc[`resortDetails.vaasthuDetails.${key}`] = property.raw.resortDetails.vaasthuDetails[key] || '';
          return acc;
        }, {})
      ),
    }),


// Commercial Plot/Land details - FIXED: Load from plotDetails directly
...(property.raw.commercialDetails?.plotDetails && {
  // Plot Kind
  'commercialDetails.plotDetails.plotKind': property.raw.commercialDetails.plotDetails.plotKind || '',
  
  // Location Details
  'commercialDetails.plotDetails.location': property.raw.commercialDetails.plotDetails.location || '',
  'commercialDetails.plotDetails.locality': property.raw.commercialDetails.plotDetails.locality || '',
  'commercialDetails.plotDetails.neighborhoodArea': property.raw.commercialDetails.plotDetails.neighborhoodArea || '',
  
  // Area & Dimensions
  'commercialDetails.plotDetails.area': property.raw.commercialDetails.plotDetails.area || '',
  'commercialDetails.plotDetails.dimensions.length': property.raw.commercialDetails.plotDetails.dimensions?.length || '',
  'commercialDetails.plotDetails.dimensions.breadth': property.raw.commercialDetails.plotDetails.dimensions?.breadth || '',
  
  // Road & Construction
  'commercialDetails.plotDetails.roadWidth': property.raw.commercialDetails.plotDetails.roadWidth || '',
  'commercialDetails.plotDetails.openSides': property.raw.commercialDetails.plotDetails.openSides || '',
  'commercialDetails.plotDetails.floorsAllowed': property.raw.commercialDetails.plotDetails.floorsAllowed || 0,
  'commercialDetails.plotDetails.constructionDone': property.raw.commercialDetails.plotDetails.constructionDone || '',
  'commercialDetails.plotDetails.constructionTypes': property.raw.commercialDetails.plotDetails.constructionTypes?.join(', ') || '',
  
  // Possession
  'commercialDetails.plotDetails.possession.month': property.raw.commercialDetails.plotDetails.possession?.month || '',
  'commercialDetails.plotDetails.possession.year': property.raw.commercialDetails.plotDetails.possession?.year || '',
  
  // Ownership & Approvals - DIRECTLY from plotDetails (like your DB)
  'commercialDetails.plotDetails.ownership': property.raw.commercialDetails.plotDetails.ownership || '',
  'commercialDetails.plotDetails.approvedBy': property.raw.commercialDetails.plotDetails.approvedBy || '',
  'commercialDetails.plotDetails.industryType': property.raw.commercialDetails.plotDetails.industryType || '',
  
  // Pre-Leased Details
  'commercialDetails.plotDetails.preLeased': property.raw.commercialDetails.plotDetails.preLeased || '',
  'commercialDetails.plotDetails.leaseDuration': property.raw.commercialDetails.plotDetails.leaseDuration || '',
  'commercialDetails.plotDetails.monthlyRent': property.raw.commercialDetails.plotDetails.monthlyRent || '',
  
  // Property Features
  'commercialDetails.plotDetails.cornerProperty': property.raw.commercialDetails.plotDetails.cornerProperty || false,
  'commercialDetails.plotDetails.amenities': property.raw.commercialDetails.plotDetails.amenities?.join(', ') || '',
  'commercialDetails.plotDetails.locationAdvantages': property.raw.commercialDetails.plotDetails.locationAdvantages?.join(', ') || '',
  
  // Vastu Details - at commercialDetails level (matching your DB)
  ...(property.raw.commercialDetails.vastuDetails && 
    Object.keys(property.raw.commercialDetails.vastuDetails).reduce((acc, key) => {
      acc[`commercialDetails.vastuDetails.${key}`] = property.raw.commercialDetails.vastuDetails[key] || '';
      return acc;
    }, {})
  ),
}),
// Hospitality details - FIXED: Remove pricing nesting
...(property.raw.commercialDetails?.hospitalityDetails && {
  'commercialDetails.hospitalityDetails.location': property.raw.commercialDetails.hospitalityDetails.location || '',
  'commercialDetails.hospitalityDetails.neighborhoodArea': property.raw.commercialDetails.hospitalityDetails.neighborhoodArea || '',
  'commercialDetails.hospitalityDetails.rooms': property.raw.commercialDetails.hospitalityDetails.rooms || '',
  'commercialDetails.hospitalityDetails.washroomType': property.raw.commercialDetails.hospitalityDetails.washroomType || '',
  'commercialDetails.hospitalityDetails.balconies': property.raw.commercialDetails.hospitalityDetails.balconies || '',
  'commercialDetails.hospitalityDetails.otherRooms': property.raw.commercialDetails.hospitalityDetails.otherRooms?.join(', ') || '',
  'commercialDetails.hospitalityDetails.area.value': property.raw.commercialDetails.hospitalityDetails.area?.value || '',
  'commercialDetails.hospitalityDetails.furnishingType': property.raw.commercialDetails.hospitalityDetails.furnishingType || '',
  'commercialDetails.hospitalityDetails.furnishingDetails': property.raw.commercialDetails.hospitalityDetails.furnishingDetails?.join(', ') || '',
  'commercialDetails.hospitalityDetails.availability': property.raw.commercialDetails.hospitalityDetails.availability || '',
  'commercialDetails.hospitalityDetails.ageOfProperty': property.raw.commercialDetails.hospitalityDetails.ageOfProperty || '',
  'commercialDetails.hospitalityDetails.possessionBy': property.raw.commercialDetails.hospitalityDetails.possessionBy || '',
  'commercialDetails.hospitalityDetails.expectedMonth': property.raw.commercialDetails.hospitalityDetails.expectedMonth || '',
  // Pricing fields - FLAT structure (no pricing object)
  'commercialDetails.hospitalityDetails.ownership': property.raw.commercialDetails.hospitalityDetails.ownership || '',
  'commercialDetails.hospitalityDetails.IndustryApprovedBy': property.raw.commercialDetails.hospitalityDetails.IndustryApprovedBy || '',
  'commercialDetails.hospitalityDetails.approvedIndustryType': property.raw.commercialDetails.hospitalityDetails.approvedIndustryType || '',
  'commercialDetails.hospitalityDetails.expectedPrice': property.raw.commercialDetails.hospitalityDetails.expectedPrice || '',
  'commercialDetails.hospitalityDetails.priceDetails.allInclusive': property.raw.commercialDetails.hospitalityDetails.priceDetails?.allInclusive || false,
  'commercialDetails.hospitalityDetails.priceDetails.negotiable': property.raw.commercialDetails.hospitalityDetails.priceDetails?.negotiable || false,
  'commercialDetails.hospitalityDetails.priceDetails.taxExcluded': property.raw.commercialDetails.hospitalityDetails.priceDetails?.taxExcluded || false,
  'commercialDetails.hospitalityDetails.preLeased': property.raw.commercialDetails.hospitalityDetails.preLeased || '',
  'commercialDetails.hospitalityDetails.leaseDuration': property.raw.commercialDetails.hospitalityDetails.leaseDuration || '',
  'commercialDetails.hospitalityDetails.monthlyRent': property.raw.commercialDetails.hospitalityDetails.monthlyRent || '',
  'commercialDetails.hospitalityDetails.description': property.raw.commercialDetails.hospitalityDetails.description || '',
  'commercialDetails.hospitalityDetails.amenities': property.raw.commercialDetails.hospitalityDetails.amenities?.join(', ') || '',
  'commercialDetails.hospitalityDetails.locationAdvantages': property.raw.commercialDetails.hospitalityDetails.locationAdvantages?.join(', ') || '',
  'commercialDetails.hospitalityDetails.wheelchairFriendly': property.raw.commercialDetails.hospitalityDetails.wheelchairFriendly || false,
  'commercialDetails.hospitalityDetails.flooringType': property.raw.commercialDetails.hospitalityDetails.flooringType || '',
  // Vastu details
  ...(property.raw.commercialDetails.hospitalityDetails.vastuDetails && 
    Object.keys(property.raw.commercialDetails.hospitalityDetails.vastuDetails).reduce((acc, key) => {
      acc[`commercialDetails.hospitalityDetails.vastuDetails.${key}`] = property.raw.commercialDetails.hospitalityDetails.vastuDetails[key] || '';
      return acc;
    }, {})
  ),
}),

// Industry details
    ...(property.raw.commercialDetails?.industryDetails && {
      'commercialDetails.industryDetails.location': property.raw.commercialDetails.industryDetails.location || '',
      'commercialDetails.industryDetails.neighborhoodArea': property.raw.commercialDetails.industryDetails.neighborhoodArea || '',
      'commercialDetails.industryDetails.area.value': property.raw.commercialDetails.industryDetails.area?.value || '',
      'commercialDetails.industryDetails.dimensions.length': property.raw.commercialDetails.industryDetails.dimensions?.length || '',
      'commercialDetails.industryDetails.dimensions.breadth': property.raw.commercialDetails.industryDetails.dimensions?.breadth || '',
      'commercialDetails.industryDetails.washroomType': property.raw.commercialDetails.industryDetails.washroomType || '',
      'commercialDetails.industryDetails.availability': property.raw.commercialDetails.industryDetails.availability || '',
      'commercialDetails.industryDetails.ageOfProperty': property.raw.commercialDetails.industryDetails.ageOfProperty || '',
      'commercialDetails.industryDetails.possessionBy': property.raw.commercialDetails.industryDetails.possessionBy || '',
      // Pricing details
      'commercialDetails.industryDetails.pricing.ownership': property.raw.commercialDetails.industryDetails.pricing?.ownership || '',
      'commercialDetails.industryDetails.pricing.expectedPrice': property.raw.commercialDetails.industryDetails.pricing?.expectedPrice || '',
      'commercialDetails.industryDetails.pricing.approvedBy': property.raw.commercialDetails.industryDetails.pricing?.approvedBy || '',
      'commercialDetails.industryDetails.pricing.approvedIndustryType': property.raw.commercialDetails.industryDetails.pricing?.approvedIndustryType || '',
      'commercialDetails.industryDetails.pricing.preLeased': property.raw.commercialDetails.industryDetails.pricing?.preLeased || '',
      'commercialDetails.industryDetails.pricing.leaseDuration': property.raw.commercialDetails.industryDetails.pricing?.leaseDuration || '',
      'commercialDetails.industryDetails.pricing.monthlyRent': property.raw.commercialDetails.industryDetails.pricing?.monthlyRent || '',
      // Inside the Industry editData spread
      'commercialDetails.industryDetails.pricing.description': property.raw.commercialDetails.industryDetails.pricing?.description || '',
      'commercialDetails.industryDetails.pricing.amenities': property.raw.commercialDetails.industryDetails.pricing?.amenities?.join(', ') || '',
      'commercialDetails.industryDetails.pricing.locationAdvantages': property.raw.commercialDetails.industryDetails.pricing?.locationAdvantages?.join(', ') || '',
      'commercialDetails.industryDetails.pricing.wheelchairFriendly': property.raw.commercialDetails.industryDetails.pricing?.wheelchairFriendly || false,
    }),



  });
  const handleSave = async () => {
    try {
      // Convert flat editData to nested structure for backend
      const formattedData = {
        propertyTitle: editData.propertyTitle,
        description: editData.description,
        location: editData.location,
        area: editData.area,
        expectedPrice: parseFloat(editData.expectedPrice) || 0,
        ownerDetails: {
          name: editData['ownerDetails.name'],
          email: editData['ownerDetails.email'],
          phone: editData['ownerDetails.phone'],
        },
      };
      // Add nested structures based on property type
      if (property.type === 'House' || property.raw.propertyType === 'House') {
  formattedData.houseDetails = {
    floors: parseInt(editData['houseDetails.floors']) || 0,
    area: parseFloat(editData['houseDetails.area']) || 0,
    bedrooms: parseInt(editData['houseDetails.bedrooms']) || 0,
    bathrooms: parseInt(editData['houseDetails.bathrooms']) || 0,
    balconies: parseInt(editData['houseDetails.balconies']) || 0,
    ageOfProperty: editData['houseDetails.ageOfProperty'] || '',
    ownership: editData['houseDetails.ownership'] || '',
    furnishing: editData['houseDetails.furnishing'] || '',
    availabilityStatus: editData['houseDetails.availabilityStatus'] || '',
    floorDetails: editData['houseDetails.floorDetails'] || '',
    possessionBy: editData['houseDetails.possessionBy'] || '',
    parking: {
      covered: parseInt(editData['houseDetails.parking.covered']) || 0,
      open: parseInt(editData['houseDetails.parking.open']) || 0,
    },
    // ✅ FIX: Properly parse furnishingItems if it's a string
    furnishingItems: (() => {
      const items = property.raw.houseDetails?.furnishingItems;
      if (!items) return [];
      if (typeof items === 'string') {
        try {
          return JSON.parse(items);
        } catch {
          return [];
        }
      }
      return Array.isArray(items) ? items : [];
    })(),
    vaasthuDetails: {
      houseFacing: editData['houseDetails.vaasthuDetails.houseFacing'] || '',
      masterBedroom: editData['houseDetails.vaasthuDetails.masterBedroom'] || '',
      childrenBedroom: editData['houseDetails.vaasthuDetails.childrenBedroom'] || '',
      livingRoom: editData['houseDetails.vaasthuDetails.livingRoom'] || '',
      kitchenRoom: editData['houseDetails.vaasthuDetails.kitchenRoom'] || '',
      poojaRoom: editData['houseDetails.vaasthuDetails.poojaRoom'] || '',
      balcony: editData['houseDetails.vaasthuDetails.balcony'] || '',
    }
  };
}

 else if (property.type === 'Site/Plot/Land' || property.raw.propertyType === 'Site/Plot/Land') {
  formattedData.siteDetails = {
    area: parseFloat(editData['siteDetails.area']) || 0,
    length: parseFloat(editData['siteDetails.length']) || 0,
    breadth: parseFloat(editData['siteDetails.breadth']) || 0,
    floorsAllowed: parseInt(editData['siteDetails.floorsAllowed']) || 0,
    boundaryWall: editData['siteDetails.boundaryWall'] === 'Yes',
    openSides: parseInt(editData['siteDetails.openSides']) || 0,
    roadWidth: parseFloat(editData['siteDetails.roadWidth']) || 0,
    propertyFacing: editData['siteDetails.propertyFacing'] || '',
    constructionDone: editData['siteDetails.constructionDone'] === 'Yes',
    constructionType: editData['siteDetails.constructionType']?.split(',').map(s => s.trim()).filter(Boolean) || [],
    possessionBy: editData['siteDetails.possessionBy'] || '',
    ownership: editData['siteDetails.ownership'] || '',
    approvedBy: editData['siteDetails.approvedBy']?.split(',').map(s => s.trim()).filter(Boolean) || [],
    inGatedSociety: editData['siteDetails.inGatedSociety'] === 'Yes',
    cornerProperty: editData['siteDetails.cornerProperty'] === 'Yes',
    amenities: editData['siteDetails.amenities']?.split(',').map(s => s.trim()).filter(Boolean) || [],
    overlooking: editData['siteDetails.overlooking']?.split(',').map(s => s.trim()).filter(Boolean) || [],
    locationAdvantages: editData['siteDetails.locationAdvantages']?.split(',').map(s => s.trim()).filter(Boolean) || [],
    // ADD VASTU DETAILS
    vaasthuDetails: {
      plotFacing: editData['siteDetails.vaasthuDetails.plotFacing'] || '',
      mainEntryDirection: editData['siteDetails.vaasthuDetails.mainEntryDirection'] || '',
      plotSlope: editData['siteDetails.vaasthuDetails.plotSlope'] || '',
      openSpace: editData['siteDetails.vaasthuDetails.openSpace'] || '',
      plotShape: editData['siteDetails.vaasthuDetails.plotShape'] || '',
      roadPosition: editData['siteDetails.vaasthuDetails.roadPosition'] || '',
      waterSource: editData['siteDetails.vaasthuDetails.waterSource'] || '',
      drainageDirection: editData['siteDetails.vaasthuDetails.drainageDirection'] || '',
      compoundWallHeight: editData['siteDetails.vaasthuDetails.compoundWallHeight'] || '',
      existingStructures: editData['siteDetails.vaasthuDetails.existingStructures'] || '',
    }
  };
}

    else if (property.type === 'Commercial' || property.raw.propertyType === 'Commercial') {
        formattedData.commercialDetails = {
          subType: property.raw.commercialDetails.subType,
          officeDetails: {
            officeKind: editData['commercialDetails.officeDetails.officeKind'] || '',
            location: editData['commercialDetails.officeDetails.location'] || '',
            locatedInside: editData['commercialDetails.officeDetails.locatedInside'] || '',
            zoneType: editData['commercialDetails.officeDetails.zoneType'] || '',
            neighborhoodArea: editData['commercialDetails.officeDetails.neighborhoodArea'] || '',
            carpetArea: parseFloat(editData['commercialDetails.officeDetails.carpetArea']) || 0,
            carpetAreaUnit: editData['commercialDetails.officeDetails.carpetAreaUnit'] || 'sqft',
            cabins: parseInt(editData['commercialDetails.officeDetails.cabins']) || 0,
            meetingRooms: parseInt(editData['commercialDetails.officeDetails.meetingRooms']) || 0,
            seats: parseInt(editData['commercialDetails.officeDetails.seats']) || 0,
            maxSeats: parseInt(editData['commercialDetails.officeDetails.maxSeats']) || 0,
            conferenceRooms: editData['commercialDetails.officeDetails.conferenceRooms'] || '',
            washrooms: {
              public: parseInt(editData['commercialDetails.officeDetails.washrooms.public']) || 0,
              private: parseInt(editData['commercialDetails.officeDetails.washrooms.private']) || 0,
            },
            receptionArea: editData['commercialDetails.officeDetails.receptionArea'] || false,
            furnishing: editData['commercialDetails.officeDetails.furnishing'] || false,
            pantry: editData['commercialDetails.officeDetails.pantry'] || false,
            pantryType: editData['commercialDetails.officeDetails.pantryType'] || '',
            pantrySize: parseInt(editData['commercialDetails.officeDetails.pantrySize']) || 0,
            additionalFeatures: editData['commercialDetails.officeDetails.additionalFeatures']?.split(',').map(s => s.trim()).filter(Boolean) || [],
            fireSafetyMeasures: editData['commercialDetails.officeDetails.fireSafetyMeasures']?.split(',').map(s => s.trim()).filter(Boolean) || [],
            totalFloors: parseInt(editData['commercialDetails.officeDetails.totalFloors']) || 0,
            floorNo: parseInt(editData['commercialDetails.officeDetails.floorNo']) || 0,
            staircases: editData['commercialDetails.officeDetails.staircases'] || '',
            lift: editData['commercialDetails.officeDetails.lift'] || '',
            passengerLifts: parseInt(editData['commercialDetails.officeDetails.passengerLifts']) || 0,
            serviceLifts: parseInt(editData['commercialDetails.officeDetails.serviceLifts']) || 0,
            parking: {
              type: editData['commercialDetails.officeDetails.parking.type'] || '',
              count: parseInt(editData['commercialDetails.officeDetails.parking.count']) || 0,
              options: {
                basement: editData['commercialDetails.officeDetails.parking.options.basement'] || false,
                outside: editData['commercialDetails.officeDetails.parking.options.outside'] || false,
                private: editData['commercialDetails.officeDetails.parking.options.private'] || false,
              }
            },
            availability: editData['commercialDetails.officeDetails.availability'] || '',
            ageOfProperty: editData['commercialDetails.officeDetails.ageOfProperty'] || '',
            possessionBy: editData['commercialDetails.officeDetails.possessionBy'] || '',
            ownership: editData['commercialDetails.officeDetails.ownership'] || '',
            expectedPrice: parseFloat(editData['commercialDetails.officeDetails.expectedPrice']) || 0,
            priceDetails: {
              allInclusive: editData['commercialDetails.officeDetails.priceDetails.allInclusive'] || false,
              negotiable: editData['commercialDetails.officeDetails.priceDetails.negotiable'] || false,
              taxExcluded: editData['commercialDetails.officeDetails.priceDetails.taxExcluded'] || false,
            },
            preLeased: editData['commercialDetails.officeDetails.preLeased'] || '',
            leaseDuration: editData['commercialDetails.officeDetails.leaseDuration'] || '',
            monthlyRent: parseFloat(editData['commercialDetails.officeDetails.monthlyRent']) || 0,
            nocCertified: editData['commercialDetails.officeDetails.nocCertified'] || '',
            occupancyCertified: editData['commercialDetails.officeDetails.occupancyCertified'] || '',
            previouslyUsedFor: editData['commercialDetails.officeDetails.previouslyUsedFor'] || '',
            description: editData['commercialDetails.officeDetails.description'] || '',
            amenities: editData['commercialDetails.officeDetails.amenities']?.split(',').map(s => s.trim()).filter(Boolean) || [],
            locationAdvantages: editData['commercialDetails.officeDetails.locationAdvantages']?.split(',').map(s => s.trim()).filter(Boolean) || [],
            vaasthuDetails: {
              officeFacing: editData['commercialDetails.officeDetails.vaasthuDetails.officeFacing'] || '',
              entrance: editData['commercialDetails.officeDetails.vaasthuDetails.entrance'] || '',
              cabin: editData['commercialDetails.officeDetails.vaasthuDetails.cabin'] || '',
              workstations: editData['commercialDetails.officeDetails.vaasthuDetails.workstations'] || '',
              conference: editData['commercialDetails.officeDetails.vaasthuDetails.conference'] || '',
              reception: editData['commercialDetails.officeDetails.vaasthuDetails.reception'] || '',
              accounts: editData['commercialDetails.officeDetails.vaasthuDetails.accounts'] || '',
              pantry: editData['commercialDetails.officeDetails.vaasthuDetails.pantry'] || '',
              server: editData['commercialDetails.officeDetails.vaasthuDetails.server'] || '',
              washrooms: editData['commercialDetails.officeDetails.vaasthuDetails.washrooms'] || '',
              staircase: editData['commercialDetails.officeDetails.vaasthuDetails.staircase'] || '',
              storage: editData['commercialDetails.officeDetails.vaasthuDetails.storage'] || '',
              cashLocker: editData['commercialDetails.officeDetails.vaasthuDetails.cashLocker'] || '',
            }
          }
        };
      }

      else if (property.type === 'Resort' || property.raw.propertyType === 'Resort') {
        formattedData.resortDetails = {
          resortType: editData['resortDetails.resortType'] || '',
          landArea: parseFloat(editData['resortDetails.landArea']) || 0,
          buildArea: parseFloat(editData['resortDetails.buildArea']) || 0,
          rooms: parseInt(editData['resortDetails.rooms']) || 0,
          floors: parseInt(editData['resortDetails.floors']) || 0,
          locationAdvantages: editData['resortDetails.locationAdvantages']?.split(',').map(s => s.trim()).filter(Boolean) || [],
          // ADD COMPLETE VASTU DETAILS
          vaasthuDetails: {
            propertyFacing: editData['resortDetails.vaasthuDetails.propertyFacing'] || '',
            entranceDirection: editData['resortDetails.vaasthuDetails.entranceDirection'] || '',
            receptionAreaFacing: editData['resortDetails.vaasthuDetails.receptionAreaFacing'] || '',
            mainLobbyDirection: editData['resortDetails.vaasthuDetails.mainLobbyDirection'] || '',
            masterSuitroom: editData['resortDetails.vaasthuDetails.masterSuitroom'] || '',
            guestRoom: editData['resortDetails.vaasthuDetails.guestRoom'] || '',
            restaurantDirection: editData['resortDetails.vaasthuDetails.restaurantDirection'] || '',
            vipSuite: editData['resortDetails.vaasthuDetails.vipSuite'] || '',
            conferenceDirection: editData['resortDetails.vaasthuDetails.conferenceDirection'] || '',
            spaRoom: editData['resortDetails.vaasthuDetails.spaRoom'] || '',
            swimmingPool: editData['resortDetails.vaasthuDetails.swimmingPool'] || '',
            yoga: editData['resortDetails.vaasthuDetails.yoga'] || '',
            kitchenRoom: editData['resortDetails.vaasthuDetails.kitchenRoom'] || '',
            poojaRoom: editData['resortDetails.vaasthuDetails.poojaRoom'] || '',
            office: editData['resortDetails.vaasthuDetails.office'] || '',
            recreation: editData['resortDetails.vaasthuDetails.recreation'] || '',
            balcony: editData['resortDetails.vaasthuDetails.balcony'] || '',
            garden: editData['resortDetails.vaasthuDetails.garden'] || '',
          }
        };
      }


else if (property.type === 'Commercial' && property.raw.commercialDetails?.subType === 'Hospitality') {
  formattedData.commercialDetails = {
    subType: 'Hospitality',
    hospitalityDetails: {
      // Basic Info
      location: editData['commercialDetails.hospitalityDetails.location'] || '',
      neighborhoodArea: editData['commercialDetails.hospitalityDetails.neighborhoodArea'] || '',
      
      // Room Details
      rooms: parseInt(editData['commercialDetails.hospitalityDetails.rooms']) || 0,
      washroomType: editData['commercialDetails.hospitalityDetails.washroomType'] || '',
      balconies: editData['commercialDetails.hospitalityDetails.balconies'] || '',
      otherRooms: editData['commercialDetails.hospitalityDetails.otherRooms']?.split(',').map(s => s.trim()).filter(Boolean) || [],
      
      // Area
      area: {
        value: parseFloat(editData['commercialDetails.hospitalityDetails.area.value']) || 0,
        unit: 'sqft',
      },
      
      // Furnishing
      furnishingType: editData['commercialDetails.hospitalityDetails.furnishingType'] || 'Unfurnished',
      furnishingDetails: editData['commercialDetails.hospitalityDetails.furnishingDetails']?.split(',').map(s => s.trim()).filter(Boolean) || [],
      
      // Availability
      availability: editData['commercialDetails.hospitalityDetails.availability'] || '',
      ageOfProperty: editData['commercialDetails.hospitalityDetails.ageOfProperty'] || '',
      possessionBy: editData['commercialDetails.hospitalityDetails.possessionBy'] || '',
      expectedMonth: editData['commercialDetails.hospitalityDetails.expectedMonth'] || '',
      
      // Pricing - FLAT structure (no pricing object)
      ownership: editData['commercialDetails.hospitalityDetails.ownership'] || '',
      IndustryApprovedBy: editData['commercialDetails.hospitalityDetails.IndustryApprovedBy'] || '',
      approvedIndustryType: editData['commercialDetails.hospitalityDetails.approvedIndustryType'] || '',
      expectedPrice: parseFloat(editData['commercialDetails.hospitalityDetails.expectedPrice']) || 0,
      priceDetails: {
        allInclusive: editData['commercialDetails.hospitalityDetails.priceDetails.allInclusive'] || false,
        negotiable: editData['commercialDetails.hospitalityDetails.priceDetails.negotiable'] || false,
        taxExcluded: editData['commercialDetails.hospitalityDetails.priceDetails.taxExcluded'] || false,
      },
      
      // Pre-Leased
      preLeased: editData['commercialDetails.hospitalityDetails.preLeased'] || '',
      leaseDuration: editData['commercialDetails.hospitalityDetails.leaseDuration'] || '',
      monthlyRent: parseFloat(editData['commercialDetails.hospitalityDetails.monthlyRent']) || 0,
      
      // Description & Features
      description: editData['commercialDetails.hospitalityDetails.description'] || '',
      amenities: editData['commercialDetails.hospitalityDetails.amenities']?.split(',').map(s => s.trim()).filter(Boolean) || [],
      locationAdvantages: editData['commercialDetails.hospitalityDetails.locationAdvantages']?.split(',').map(s => s.trim()).filter(Boolean) || [],
      wheelchairFriendly: editData['commercialDetails.hospitalityDetails.wheelchairFriendly'] || false,
      flooringType: editData['commercialDetails.hospitalityDetails.flooringType'] || '',
      
      // Vastu Details
      vastuDetails: {
        buildingFacing: editData['commercialDetails.hospitalityDetails.vastuDetails.buildingFacing'] || '',
        entrance: editData['commercialDetails.hospitalityDetails.vastuDetails.entrance'] || '',
        reception: editData['commercialDetails.hospitalityDetails.vastuDetails.reception'] || '',
        adminOffice: editData['commercialDetails.hospitalityDetails.vastuDetails.adminOffice'] || '',
        guestRooms: editData['commercialDetails.hospitalityDetails.vastuDetails.guestRooms'] || '',
        banquet: editData['commercialDetails.hospitalityDetails.vastuDetails.banquet'] || '',
        kitchen: editData['commercialDetails.hospitalityDetails.vastuDetails.kitchen'] || '',
        dining: editData['commercialDetails.hospitalityDetails.vastuDetails.dining'] || '',
        cashCounter: editData['commercialDetails.hospitalityDetails.vastuDetails.cashCounter'] || '',
        electrical: editData['commercialDetails.hospitalityDetails.vastuDetails.electrical'] || '',
        waterStructure: editData['commercialDetails.hospitalityDetails.vastuDetails.waterStructure'] || '',
        washroom: editData['commercialDetails.hospitalityDetails.vastuDetails.washroom'] || '',
        storage: editData['commercialDetails.hospitalityDetails.vastuDetails.storage'] || '',
      }
    }
  };
}

else if (property.type === 'Commercial' && property.raw.commercialDetails?.subType === 'Industry') {
        formattedData.commercialDetails = {
          subType: 'Industry',
          industryDetails: {
            location: editData['commercialDetails.industryDetails.location'] || '',
            neighborhoodArea: editData['commercialDetails.industryDetails.neighborhoodArea'] || '',
            area: {
              value: parseFloat(editData['commercialDetails.industryDetails.area.value']) || 0,
              unit: 'sqft',
            },
            dimensions: {
              length: parseFloat(editData['commercialDetails.industryDetails.dimensions.length']) || 0,
              breadth: parseFloat(editData['commercialDetails.industryDetails.dimensions.breadth']) || 0,
            },
            washroomType: editData['commercialDetails.industryDetails.washroomType'] || '',
            availability: editData['commercialDetails.industryDetails.availability'] || '',
            ageOfProperty: editData['commercialDetails.industryDetails.ageOfProperty'] || '',
            possessionBy: editData['commercialDetails.industryDetails.possessionBy'] || '',
            pricing: {
              ownership: editData['commercialDetails.industryDetails.pricing.ownership'] || '',
              expectedPrice: parseFloat(editData['commercialDetails.industryDetails.pricing.expectedPrice']) || 0,
              priceDetails: {
                allInclusive: editData['commercialDetails.industryDetails.pricing.priceDetails.allInclusive'] || false,
                negotiable: editData['commercialDetails.industryDetails.pricing.priceDetails.negotiable'] || false,
                taxExcluded: editData['commercialDetails.industryDetails.pricing.priceDetails.taxExcluded'] || false,
              },
              approvedBy: editData['commercialDetails.industryDetails.pricing.approvedBy'] || '',
              approvedIndustryType: editData['commercialDetails.industryDetails.pricing.approvedIndustryType'] || '',
              preLeased: editData['commercialDetails.industryDetails.pricing.preLeased'] || '',
              leaseDuration: editData['commercialDetails.industryDetails.pricing.leaseDuration'] || '',
              monthlyRent: parseFloat(editData['commercialDetails.industryDetails.pricing.monthlyRent']) || 0,
              description: editData['commercialDetails.industryDetails.pricing.description'] || '',
              amenities: editData['commercialDetails.industryDetails.pricing.amenities']?.split(',').map(s => s.trim()).filter(Boolean) || [],
              locationAdvantages: editData['commercialDetails.industryDetails.pricing.locationAdvantages']?.split(',').map(s => s.trim()).filter(Boolean) || [],
              wheelchairFriendly: editData['commercialDetails.industryDetails.pricing.wheelchairFriendly'] || false,
            },
            vastuDetails: {
              buildingFacing: editData['commercialDetails.industryDetails.vastuDetails.buildingFacing'] || '',
              entrance: editData['commercialDetails.industryDetails.vastuDetails.entrance'] || '',
              machinery: editData['commercialDetails.industryDetails.vastuDetails.machinery'] || '',
              production: editData['commercialDetails.industryDetails.vastuDetails.production'] || '',
              rawMaterial: editData['commercialDetails.industryDetails.vastuDetails.rawMaterial'] || '',
              finishedGoods: editData['commercialDetails.industryDetails.vastuDetails.finishedGoods'] || '',
              office: editData['commercialDetails.industryDetails.vastuDetails.office'] || '',
              electrical: editData['commercialDetails.industryDetails.vastuDetails.electrical'] || '',
              water: editData['commercialDetails.industryDetails.vastuDetails.water'] || '',
              waste: editData['commercialDetails.industryDetails.vastuDetails.waste'] || '',
              washroom: editData['commercialDetails.industryDetails.vastuDetails.washroom'] || '',
            }
          }
        };
      }

       // Commercial Plot/Land
     // Commercial Plot/Land - FIXED: Correct structure
else if (property.type === 'Commercial' && property.raw.commercialDetails?.subType === 'Plot/Land') {
  formattedData.commercialDetails = {
    subType: 'Plot/Land',
    
    plotDetails: {
      // Plot Kind - ADD THIS
      plotKind: editData['commercialDetails.plotDetails.plotKind'] || property.raw.commercialDetails.plotDetails.plotKind,
      
      location: editData['commercialDetails.plotDetails.location'] || '',
      locality: editData['commercialDetails.plotDetails.locality'] || '',
      neighborhoodArea: editData['commercialDetails.plotDetails.neighborhoodArea'] || '',
      
      // Area & Dimensions
      area: parseFloat(editData['commercialDetails.plotDetails.area']) || 0,
      dimensions: {
        length: parseFloat(editData['commercialDetails.plotDetails.dimensions.length']) || 0,
        breadth: parseFloat(editData['commercialDetails.plotDetails.dimensions.breadth']) || 0,
      },
      
      roadWidth: parseFloat(editData['commercialDetails.plotDetails.roadWidth']) || 0,
      openSides: editData['commercialDetails.plotDetails.openSides'] || '',
      constructionDone: editData['commercialDetails.plotDetails.constructionDone'] || '',
      constructionTypes: editData['commercialDetails.plotDetails.constructionTypes']?.split(',').map(s => s.trim()).filter(Boolean) || [],
      
      possession: {
        month: editData['commercialDetails.plotDetails.possession.month'] || '',
        year: editData['commercialDetails.plotDetails.possession.year'] || '',
      },
      
      // ✅ FIXED: Save these at plotDetails level (matching your DB structure)
      ownership: editData['commercialDetails.plotDetails.ownership'] || '',
      approvedBy: editData['commercialDetails.plotDetails.approvedBy'] || '',
      industryType: editData['commercialDetails.plotDetails.industryType'] || '',
      preLeased: editData['commercialDetails.plotDetails.preLeased'] || '',
      leaseDuration: editData['commercialDetails.plotDetails.leaseDuration'] || '',
      monthlyRent: parseFloat(editData['commercialDetails.plotDetails.monthlyRent']) || 0,
      cornerProperty: editData['commercialDetails.plotDetails.cornerProperty'] || false,
      amenities: editData['commercialDetails.plotDetails.amenities']?.split(',').map(s => s.trim()).filter(Boolean) || [],
      locationAdvantages: editData['commercialDetails.plotDetails.locationAdvantages']?.split(',').map(s => s.trim()).filter(Boolean) || [],
    },
    
// ✅ Save vastuDetails at commercialDetails level (matching DB)
  vastuDetails: {
  plotFacing: editData['commercialDetails.vastuDetails.plotFacing'] || editData['commercialDetails.vaastuDetails.plotFacing'] || '',
  mainEntry: editData['commercialDetails.vastuDetails.mainEntry'] || editData['commercialDetails.vaastuDetails.mainEntry'] || '',
  plotSlope: editData['commercialDetails.vastuDetails.plotSlope'] || editData['commercialDetails.vaastuDetails.plotSlope'] || '',
  openSpace: editData['commercialDetails.vastuDetails.openSpace'] || editData['commercialDetails.vaastuDetails.openSpace'] || '',
  shape: editData['commercialDetails.vastuDetails.shape'] || editData['commercialDetails.vaastuDetails.shape'] || '',
  roadPosition: editData['commercialDetails.vastuDetails.roadPosition'] || editData['commercialDetails.vaastuDetails.roadPosition'] || '',
  waterSource: editData['commercialDetails.vastuDetails.waterSource'] || editData['commercialDetails.vaastuDetails.waterSource'] || '',
  drainage: editData['commercialDetails.vastuDetails.drainage'] || editData['commercialDetails.vaastuDetails.drainage'] || '',
  compoundWall: editData['commercialDetails.vastuDetails.compoundWall'] || editData['commercialDetails.vaastuDetails.compoundWall'] || '',
  structures: editData['commercialDetails.vastuDetails.structures'] || editData['commercialDetails.vaastuDetails.structures'] || '',
}
  };
}



       console.log('💾 Sending update data:', formattedData);
      await onUpdate(property.id, formattedData);
      setIsEditing(false);
      
      // ✅ Show success message
      toast.success('Property updated successfully');
    } catch (error) {
      console.error('❌ Save error:', error);
      toast.error(error.response?.data?.message || 'Failed to update property');
    }
  };
  // Helper to get property type specific details
  const getPropertyDetails = () => {
    const raw = property.raw;
    const details = [];
    if (raw.propertyType === 'House' && raw.houseDetails) {
      const h = raw.houseDetails;
      
      // Area & Rooms
      if (h.area) details.push({
        label: 'Carpet Area',
        value: `${h.area} ${h.areaUnit || 'sqft'}`,
        editKey: 'houseDetails.area',
        showInEdit: true
      });
      if (h.bedrooms) details.push({
        label: 'Bedrooms',
        value: h.bedrooms,
        editKey: 'houseDetails.bedrooms',
        showInEdit: true
      });
      if (h.bathrooms) details.push({
        label: 'Bathrooms',
        value: h.bathrooms,
        editKey: 'houseDetails.bathrooms',
        showInEdit: true
      });
      if (h.balconies) details.push({
        label: 'Balconies',
        value: h.balconies,
        editKey: 'houseDetails.balconies',
        showInEdit: true
      });
      
      // Floors
      if (h.floors) details.push({
        label: 'Total Floors',
        value: h.floors,
        editKey: 'houseDetails.floors',
        showInEdit: true
      });
      if (h.floorDetails) details.push({
        label: 'Floor No',
        value: h.floorDetails,
        editKey: 'houseDetails.floorDetails',
        showInEdit: true
      });
      
      // Status & Availability
      if (h.availabilityStatus) details.push({
        label: 'Availability',
        value: h.availabilityStatus,
        editKey: 'houseDetails.availabilityStatus',
        showInEdit: true
      });
      if (h.ageOfProperty) details.push({
        label: 'Property Age',
        value: h.ageOfProperty,
        editKey: 'houseDetails.ageOfProperty',
        showInEdit: true
      });
      if (h.ownership) details.push({
        label: 'Ownership',
        value: h.ownership,
        editKey: 'houseDetails.ownership',
        showInEdit: true
      });
      if (h.possessionBy) details.push({
        label: 'Possession By',
        value: h.possessionBy,
        editKey: 'houseDetails.possessionBy',
        showInEdit: true
      });
      
      // Parking
      if (h.parking && (h.parking.covered > 0 || h.parking.open > 0)) {
        details.push({
          label: 'Parking',
          value: `Covered: ${h.parking?.covered || 0}, Open: ${h.parking?.open || 0}`,
          customRender: true,
          showInEdit: true
        });
      }
    }

   if (raw.propertyType === 'Site/Plot/Land' && raw.siteDetails) {
  const s = raw.siteDetails;
  
  // Area & Dimensions
  if (s.area) details.push({
    label: 'Plot Area',
    value: `${s.area} ${s.areaUnit || 'sqft'}`,
    editKey: 'siteDetails.area',
    showInEdit: true
  });
  if (s.length) details.push({
    label: 'Length',
    value: `${s.length} ft`,
    editKey: 'siteDetails.length',
    showInEdit: true
  });
  if (s.breadth) details.push({
    label: 'Breadth',
    value: `${s.breadth} ft`,
    editKey: 'siteDetails.breadth',
    showInEdit: true
  });
  if (s.floorsAllowed) details.push({
    label: 'Floors Allowed',
    value: s.floorsAllowed,
    editKey: 'siteDetails.floorsAllowed',
    showInEdit: true
  });
  
  // Property Features
  if (s.boundaryWall !== undefined) details.push({
    label: 'Boundary Wall',
    value: s.boundaryWall ? 'Yes' : 'No',
    editKey: 'siteDetails.boundaryWall',
    showInEdit: true,
    fieldType: 'select',
    options: ['Yes', 'No']
  });
  if (s.openSides) details.push({
    label: 'Open Sides',
    value: s.openSides,
    editKey: 'siteDetails.openSides',
    showInEdit: true
  });
  if (s.roadWidth) details.push({
    label: 'Road Width',
    value: `${s.roadWidth} ${s.roadWidthUnit || 'ft'}`,
    editKey: 'siteDetails.roadWidth',
    showInEdit: true
  });
  if (s.propertyFacing) details.push({
    label: 'Property Facing',
    value: s.propertyFacing,
    editKey: 'siteDetails.propertyFacing',
    showInEdit: true,
    fieldType: 'select',
    options: ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West']
  });
  
  // Construction Details
  if (s.constructionDone !== undefined) details.push({
    label: 'Construction Done',
    value: s.constructionDone ? 'Yes' : 'No',
    editKey: 'siteDetails.constructionDone',
    showInEdit: true,
    fieldType: 'select',
    options: ['Yes', 'No']
  });
  if (s.constructionType && s.constructionType.length > 0) details.push({
    label: 'Construction Type',
    value: s.constructionType.join(', '),
    editKey: 'siteDetails.constructionType',
    showInEdit: true
  });
  
  // Legal & Ownership
  if (s.possessionBy) details.push({
    label: 'Possession By',
    value: s.possessionBy,
    editKey: 'siteDetails.possessionBy',
    showInEdit: true
  });
  if (s.ownership) details.push({
    label: 'Ownership',
    value: s.ownership,
    editKey: 'siteDetails.ownership',
    showInEdit: true,
    fieldType: 'select',
    options: ['Freehold', 'Leasehold', 'Co-operative Society', 'Power of Attorney']
  });
  if (s.approvedBy && s.approvedBy.length > 0) details.push({
    label: 'Approved By',
    value: s.approvedBy.join(', '),
    editKey: 'siteDetails.approvedBy',
    showInEdit: true
  });
  
  // Additional Features
  if (s.inGatedSociety !== undefined) details.push({
    label: 'In Gated Society',
    value: s.inGatedSociety ? 'Yes' : 'No',
    editKey: 'siteDetails.inGatedSociety',
    showInEdit: true,
    fieldType: 'select',
    options: ['Yes', 'No']
  });
  if (s.cornerProperty !== undefined) details.push({
    label: 'Corner Property',
    value: s.cornerProperty ? 'Yes' : 'No',
    editKey: 'siteDetails.cornerProperty',
    showInEdit: true,
    fieldType: 'select',
    options: ['Yes', 'No']
  });
  
  // Amenities & Advantages
  if (s.amenities && s.amenities.length > 0) details.push({
    label: 'Amenities',
    value: s.amenities.join(', '),
    editKey: 'siteDetails.amenities',
    showInEdit: true
  });
  if (s.overlooking && s.overlooking.length > 0) details.push({
    label: 'Overlooking',
    value: s.overlooking.join(', '),
    editKey: 'siteDetails.overlooking',
    showInEdit: true
  });
  if (s.locationAdvantages && s.locationAdvantages.length > 0) details.push({
    label: 'Location Advantages',
    value: s.locationAdvantages.join(', '),
    editKey: 'siteDetails.locationAdvantages',
    showInEdit: true
  });
}

// Hospitality details - FIXED: Flat structure
if (property.raw.commercialDetails?.hospitalityDetails) {
  const h = property.raw.commercialDetails.hospitalityDetails;
  
  // Location
  if (h.location) details.push({
    label: 'Hospitality Location',
    value: h.location,
    editKey: 'commercialDetails.hospitalityDetails.location',
    showInEdit: true
  });
  
  if (h.neighborhoodArea) details.push({
    label: 'Area/Neighborhood',
    value: h.neighborhoodArea,
    editKey: 'commercialDetails.hospitalityDetails.neighborhoodArea',
    showInEdit: true
  });
  
  // Room Details
  if (h.rooms) details.push({
    label: 'Number of Rooms',
    value: h.rooms,
    editKey: 'commercialDetails.hospitalityDetails.rooms',
    showInEdit: true
  });
  
  if (h.washroomType) details.push({
    label: 'Washroom Type',
    value: h.washroomType,
    editKey: 'commercialDetails.hospitalityDetails.washroomType',
    showInEdit: true
  });
  
  if (h.balconies) details.push({
    label: 'Balconies',
    value: h.balconies,
    editKey: 'commercialDetails.hospitalityDetails.balconies',
    showInEdit: true
  });
  
  if (h.otherRooms && h.otherRooms.length > 0) details.push({
    label: 'Other Rooms',
    value: h.otherRooms.join(', '),
    editKey: 'commercialDetails.hospitalityDetails.otherRooms',
    showInEdit: true
  });
  
  // Area
  if (h.area?.value) details.push({
    label: 'Total Area',
    value: `${h.area.value} ${h.area.unit || 'sqft'}`,
    editKey: 'commercialDetails.hospitalityDetails.area.value',
    showInEdit: true
  });
  
  // Furnishing
  if (h.furnishingType) details.push({
    label: 'Furnishing Type',
    value: h.furnishingType,
    editKey: 'commercialDetails.hospitalityDetails.furnishingType',
    showInEdit: true,
    fieldType: 'select',
    options: ['Unfurnished', 'Semi-furnished', 'Furnished']
  });
  
  if (h.furnishingDetails && h.furnishingDetails.length > 0) details.push({
    label: 'Furnishing Details',
    value: h.furnishingDetails.join(', '),
    editKey: 'commercialDetails.hospitalityDetails.furnishingDetails',
    showInEdit: true
  });
  
  // Availability
  if (h.availability) details.push({
    label: 'Availability',
    value: h.availability === 'Ready' ? 'Ready to Move' : 'Under Construction',
    editKey: 'commercialDetails.hospitalityDetails.availability',
    showInEdit: true
  });
  
  if (h.ageOfProperty) details.push({
    label: 'Property Age',
    value: h.ageOfProperty,
    editKey: 'commercialDetails.hospitalityDetails.ageOfProperty',
    showInEdit: true
  });
  
  if (h.possessionBy) details.push({
    label: 'Possession By',
    value: h.possessionBy,
    editKey: 'commercialDetails.hospitalityDetails.possessionBy',
    showInEdit: true
  });
  
  if (h.expectedMonth) details.push({
    label: 'Expected Month',
    value: h.expectedMonth,
    editKey: 'commercialDetails.hospitalityDetails.expectedMonth',
    showInEdit: true
  });
  
  // Pricing - FLAT structure
  if (h.ownership) details.push({
    label: 'Ownership',
    value: h.ownership,
    editKey: 'commercialDetails.hospitalityDetails.ownership',
    showInEdit: true,
    fieldType: 'select',
    options: ['Freehold', 'Leasehold', 'Company Owned', 'Other']
  });
  
  if (h.IndustryApprovedBy) details.push({
    label: 'Approved By',
    value: h.IndustryApprovedBy,
    editKey: 'commercialDetails.hospitalityDetails.IndustryApprovedBy',
    showInEdit: true
  });
  
  if (h.approvedIndustryType) details.push({
    label: 'Approved Industry Type',
    value: h.approvedIndustryType,
    editKey: 'commercialDetails.hospitalityDetails.approvedIndustryType',
    showInEdit: true
  });
  
  if (h.expectedPrice) details.push({
    label: 'Expected Price',
    value: `₹${h.expectedPrice}`,
    editKey: 'commercialDetails.hospitalityDetails.expectedPrice',
    showInEdit: true
  });
  
  if (h.priceDetails) {
    if (h.priceDetails.allInclusive) details.push({
      label: 'All Inclusive',
      value: 'Yes',
      editKey: 'commercialDetails.hospitalityDetails.priceDetails.allInclusive',
      showInEdit: true,
      fieldType: 'checkbox'
    });
    
    if (h.priceDetails.negotiable) details.push({
      label: 'Price Negotiable',
      value: 'Yes',
      editKey: 'commercialDetails.hospitalityDetails.priceDetails.negotiable',
      showInEdit: true,
      fieldType: 'checkbox'
    });
    
    if (h.priceDetails.taxExcluded) details.push({
      label: 'Tax Excluded',
      value: 'Yes',
      editKey: 'commercialDetails.hospitalityDetails.priceDetails.taxExcluded',
      showInEdit: true,
      fieldType: 'checkbox'
    });
  }
  
  if (h.preLeased) details.push({
    label: 'Pre-Leased',
    value: h.preLeased,
    editKey: 'commercialDetails.hospitalityDetails.preLeased',
    showInEdit: true
  });
  
  if (h.leaseDuration) details.push({
    label: 'Lease Duration',
    value: h.leaseDuration,
    editKey: 'commercialDetails.hospitalityDetails.leaseDuration',
    showInEdit: true
  });
  
  if (h.monthlyRent) details.push({
    label: 'Monthly Rent',
    value: `₹${h.monthlyRent}`,
    editKey: 'commercialDetails.hospitalityDetails.monthlyRent',
    showInEdit: true
  });
  
  // Description
  if (h.description) details.push({
    label: 'Description',
    value: h.description,
    editKey: 'commercialDetails.hospitalityDetails.description',
    showInEdit: true,
    isTextarea: true
  });
  
  // Features
  if (h.amenities && h.amenities.length > 0) details.push({
    label: 'Amenities',
    value: h.amenities.join(', '),
    editKey: 'commercialDetails.hospitalityDetails.amenities',
    showInEdit: true
  });
  
  if (h.locationAdvantages && h.locationAdvantages.length > 0) details.push({
    label: 'Location Advantages',
    value: h.locationAdvantages.join(', '),
    editKey: 'commercialDetails.hospitalityDetails.locationAdvantages',
    showInEdit: true
  });
  
  if (h.wheelchairFriendly !== undefined) details.push({
    label: 'Wheelchair Friendly',
    value: h.wheelchairFriendly ? 'Yes' : 'No',
    editKey: 'commercialDetails.hospitalityDetails.wheelchairFriendly',
    showInEdit: true,
    fieldType: 'checkbox'
  });
  
  if (h.flooringType) details.push({
    label: 'Flooring Type',
    value: h.flooringType,
    editKey: 'commercialDetails.hospitalityDetails.flooringType',
    showInEdit: true
  });
}


// Industry details
if (property.raw.commercialDetails?.industryDetails) {
  const ind = property.raw.commercialDetails.industryDetails;
  
  // Basic Info
  if (ind.location) details.push({
    label: 'Industry Location',
    value: ind.location,
    editKey: 'commercialDetails.industryDetails.location',
    showInEdit: true
  });
  
  if (ind.neighborhoodArea) details.push({
    label: 'Area/Neighborhood',
    value: ind.neighborhoodArea,
    editKey: 'commercialDetails.industryDetails.neighborhoodArea',
    showInEdit: true
  });
  
  // Area & Dimensions
  if (ind.area?.value) details.push({
    label: 'Total Area',
    value: `${ind.area.value} ${ind.area.unit || 'sqft'}`,
    editKey: 'commercialDetails.industryDetails.area.value',
    showInEdit: true
  });
  
  if (ind.dimensions?.length) details.push({
    label: 'Length',
    value: `${ind.dimensions.length} ft`,
    editKey: 'commercialDetails.industryDetails.dimensions.length',
    showInEdit: true
  });
  
  if (ind.dimensions?.breadth) details.push({
    label: 'Breadth',
    value: `${ind.dimensions.breadth} ft`,
    editKey: 'commercialDetails.industryDetails.dimensions.breadth',
    showInEdit: true
  });
  
  // Facilities
  if (ind.washroomType) details.push({
    label: 'Washroom Type',
    value: ind.washroomType,
    editKey: 'commercialDetails.industryDetails.washroomType',
    showInEdit: true
  });
  
  // Availability
  if (ind.availability) details.push({
    label: 'Availability',
    value: ind.availability === 'Ready' ? 'Ready to Move' : 'Under Construction',
    editKey: 'commercialDetails.industryDetails.availability',
    showInEdit: true
  });
  
  if (ind.ageOfProperty) details.push({
    label: 'Property Age',
    value: ind.ageOfProperty,
    editKey: 'commercialDetails.industryDetails.ageOfProperty',
    showInEdit: true
  });
  
  if (ind.possessionBy) details.push({
    label: 'Possession By',
    value: ind.possessionBy,
    editKey: 'commercialDetails.industryDetails.possessionBy',
    showInEdit: true
  });
  
  // Pricing (from nested pricing object)
  if (ind.pricing) {
    if (ind.pricing.ownership) details.push({
      label: 'Ownership',
      value: ind.pricing.ownership,
      editKey: 'commercialDetails.industryDetails.pricing.ownership',
      showInEdit: true
    });
    
    if (ind.pricing.expectedPrice) details.push({
      label: 'Expected Price',
      value: `₹${ind.pricing.expectedPrice}`,
      editKey: 'commercialDetails.industryDetails.pricing.expectedPrice',
      showInEdit: true
    });
    
    if (ind.pricing.approvedBy) details.push({
      label: 'Approved By',
      value: ind.pricing.approvedBy,
      editKey: 'commercialDetails.industryDetails.pricing.approvedBy',
      showInEdit: true
    });
    
    if (ind.pricing.approvedIndustryType) details.push({
      label: 'Approved Industry Type',
      value: ind.pricing.approvedIndustryType,
      editKey: 'commercialDetails.industryDetails.pricing.approvedIndustryType',
      showInEdit: true
    });
    
    if (ind.pricing.preLeased) details.push({
      label: 'Pre-Leased',
      value: ind.pricing.preLeased,
      editKey: 'commercialDetails.industryDetails.pricing.preLeased',
      showInEdit: true
    });
    
    if (ind.pricing.leaseDuration) details.push({
      label: 'Lease Duration',
      value: ind.pricing.leaseDuration,
      editKey: 'commercialDetails.industryDetails.pricing.leaseDuration',
      showInEdit: true
    });
    
    if (ind.pricing.monthlyRent) details.push({
      label: 'Monthly Rent',
      value: `₹${ind.pricing.monthlyRent}`,
      editKey: 'commercialDetails.industryDetails.pricing.monthlyRent',
      showInEdit: true
    });

    // Inside the if (property.raw.commercialDetails?.industryDetails) block
// After pricing fields, before amenities

if (ind.pricing?.description) details.push({
  label: 'Description',
  value: ind.pricing.description,
  editKey: 'commercialDetails.industryDetails.pricing.description',
  showInEdit: true,
  isTextarea: true // Add this flag for textarea rendering
});
    
    if (ind.pricing.amenities && ind.pricing.amenities.length > 0) details.push({
      label: 'Amenities',
      value: ind.pricing.amenities.join(', '),
      editKey: 'commercialDetails.industryDetails.pricing.amenities',
      showInEdit: true
    });
    
    if (ind.pricing.locationAdvantages && ind.pricing.locationAdvantages.length > 0) details.push({
      label: 'Location Advantages',
      value: ind.pricing.locationAdvantages.join(', '),
      editKey: 'commercialDetails.industryDetails.pricing.locationAdvantages',
      showInEdit: true
    });
    
    if (ind.pricing.wheelchairFriendly !== undefined) details.push({
      label: 'Wheelchair Friendly',
      value: ind.pricing.wheelchairFriendly ? 'Yes' : 'No',
      editKey: 'commercialDetails.industryDetails.pricing.wheelchairFriendly',
      showInEdit: true,
      fieldType: 'checkbox'
    });
  }
}





// Commercial Plot/Land details
// Commercial Plot/Land details - FIXED: Correct paths
// Commercial Plot/Land details - FIXED: Read directly from plotDetails
if (raw.commercialDetails?.subType === 'Plot/Land' && raw.commercialDetails?.plotDetails) {
  const plot = raw.commercialDetails.plotDetails;
  
  // Plot Kind
  if (plot.plotKind) details.push({
    label: 'Plot Kind',
    value: plot.plotKind,
    editKey: 'commercialDetails.plotDetails.plotKind',
    showInEdit: true,
    fieldType: 'select',
    options: ['Residential Plot', 'Commercial Plot', 'Industrial Plot', 'Agricultural Land', 'commercial Land/Inst.Land']
  });
  
  // Location
  if (plot.location) details.push({
    label: 'Plot Location',
    value: plot.location,
    editKey: 'commercialDetails.plotDetails.location',
    showInEdit: true
  });
  
  if (plot.locality) details.push({
    label: 'Locality',
    value: plot.locality,
    editKey: 'commercialDetails.plotDetails.locality',
    showInEdit: true
  });
  
  if (plot.neighborhoodArea) details.push({
    label: 'Area/Neighborhood',
    value: plot.neighborhoodArea,
    editKey: 'commercialDetails.plotDetails.neighborhoodArea',
    showInEdit: true
  });
  
  // Area & Dimensions
  if (plot.area) details.push({
    label: 'Plot Area',
    value: `${plot.area} sqft`,
    editKey: 'commercialDetails.plotDetails.area',
    showInEdit: true
  });
  
  if (plot.dimensions?.length) details.push({
    label: 'Length',
    value: `${plot.dimensions.length} ft`,
    editKey: 'commercialDetails.plotDetails.dimensions.length',
    showInEdit: true
  });
  
  if (plot.dimensions?.breadth) details.push({
    label: 'Breadth',
    value: `${plot.dimensions.breadth} ft`,
    editKey: 'commercialDetails.plotDetails.dimensions.breadth',
    showInEdit: true
  });
  
  if (plot.roadWidth) details.push({
    label: 'Road Width',
    value: `${plot.roadWidth} ft`,
    editKey: 'commercialDetails.plotDetails.roadWidth',
    showInEdit: true
  });
  
  if (plot.openSides) details.push({
    label: 'Open Sides',
    value: plot.openSides,
    editKey: 'commercialDetails.plotDetails.openSides',
    showInEdit: true
  });
  
  // Construction
  if (plot.constructionDone) details.push({
    label: 'Construction Done',
    value: plot.constructionDone,
    editKey: 'commercialDetails.plotDetails.constructionDone',
    showInEdit: true,
    fieldType: 'select',
    options: ['Yes', 'No']
  });
  
  if (plot.constructionTypes?.length > 0) details.push({
    label: 'Construction Types',
    value: plot.constructionTypes.join(', '),
    editKey: 'commercialDetails.plotDetails.constructionTypes',
    showInEdit: true
  });
  
  // Possession
  if (plot.possession) details.push({
    label: 'Possession By',
    value: `${plot.possession.month} ${plot.possession.year}`,
    customRender: true,
    showInEdit: true
  });
  
  // Ownership & Legal - DIRECTLY from plotDetails
  if (plot.ownership) details.push({
    label: 'Ownership',
    value: plot.ownership,
    editKey: 'commercialDetails.plotDetails.ownership',
    showInEdit: true,
    fieldType: 'select',
    options: ['Freehold', 'Leasehold', 'Co-operative Society', 'Power of Attorney']
  });
  
  if (plot.approvedBy) details.push({
    label: 'Approved By',
    value: plot.approvedBy,
    editKey: 'commercialDetails.plotDetails.approvedBy',
    showInEdit: true
  });
  
  if (plot.industryType) details.push({
    label: 'Industry Type',
    value: plot.industryType,
    editKey: 'commercialDetails.plotDetails.industryType',
    showInEdit: true
  });
  
  // Pre-Leased
  if (plot.preLeased) details.push({
    label: 'Pre-Leased',
    value: plot.preLeased,
    editKey: 'commercialDetails.plotDetails.preLeased',
    showInEdit: true
  });
  
  if (plot.leaseDuration) details.push({
    label: 'Lease Duration',
    value: plot.leaseDuration,
    editKey: 'commercialDetails.plotDetails.leaseDuration',
    showInEdit: true
  });
  
  if (plot.monthlyRent) details.push({
    label: 'Monthly Rent',
    value: `₹${plot.monthlyRent}`,
    editKey: 'commercialDetails.plotDetails.monthlyRent',
    showInEdit: true
  });
  
  // Features
  if (plot.cornerProperty !== undefined) details.push({
    label: 'Corner Property',
    value: plot.cornerProperty ? 'Yes' : 'No',
    editKey: 'commercialDetails.plotDetails.cornerProperty',
    showInEdit: true,
    fieldType: 'checkbox'
  });
  
  if (plot.amenities?.length > 0) details.push({
    label: 'Amenities',
    value: plot.amenities.join(', '),
    editKey: 'commercialDetails.plotDetails.amenities',
    showInEdit: true
  });
  
  if (plot.locationAdvantages?.length > 0) details.push({
    label: 'Location Advantages',
    value: plot.locationAdvantages.join(', '),
    editKey: 'commercialDetails.plotDetails.locationAdvantages',
    showInEdit: true
  });
}




   if (raw.propertyType === 'Commercial' && raw.commercialDetails) {
      const c = raw.commercialDetails;
      
      // Commercial Sub Type
      if (c.subType) details.push({
        label: 'Commercial Type',
        value: c.subType,
        showInEdit: false
      });
      
      if (c.officeDetails) {
        const o = c.officeDetails;
        
        // Basic Office Details
        if (o.officeKind) details.push({
          label: 'Office Type',
          value: o.officeKind,
          editKey: 'commercialDetails.officeDetails.officeKind',
          showInEdit: true
        });
        
        if (o.location) details.push({
          label: 'Office Location',
          value: o.location,
          editKey: 'commercialDetails.officeDetails.location',
          showInEdit: true
        });
        
        if (o.neighborhoodArea) details.push({
          label: 'Area/Neighborhood',
          value: o.neighborhoodArea,
          editKey: 'commercialDetails.officeDetails.neighborhoodArea',
          showInEdit: true
        });
        
        if (o.locatedInside) details.push({
          label: 'Located Inside',
          value: o.locatedInside,
          editKey: 'commercialDetails.officeDetails.locatedInside',
          showInEdit: true,
          fieldType: 'select',
          options: ['IT Park', 'Business Park', 'Other']
        });
        
        if (o.zoneType) details.push({
          label: 'Zone Type',
          value: o.zoneType,
          editKey: 'commercialDetails.officeDetails.zoneType',
          showInEdit: true
        });
        
        // Area & Setup
        if (o.carpetArea) details.push({
          label: 'Carpet Area',
          value: `${o.carpetArea} ${o.carpetAreaUnit || 'sqft'}`,
          editKey: 'commercialDetails.officeDetails.carpetArea',
          showInEdit: true
        });
        
        if (o.cabins) details.push({
          label: 'Cabins',
          value: o.cabins,
          editKey: 'commercialDetails.officeDetails.cabins',
          showInEdit: true
        });
        
        if (o.meetingRooms) details.push({
          label: 'Meeting Rooms',
          value: o.meetingRooms,
          editKey: 'commercialDetails.officeDetails.meetingRooms',
          showInEdit: true
        });
        
        if (o.seats) details.push({
          label: 'Seats (Min)',
          value: o.seats,
          editKey: 'commercialDetails.officeDetails.seats',
          showInEdit: true
        });
        
        if (o.maxSeats) details.push({
          label: 'Max Seats',
          value: o.maxSeats,
          editKey: 'commercialDetails.officeDetails.maxSeats',
          showInEdit: true
        });
        
        if (o.conferenceRooms) details.push({
          label: 'Conference Rooms',
          value: o.conferenceRooms,
          editKey: 'commercialDetails.officeDetails.conferenceRooms',
          showInEdit: true
        });
        
        // Washrooms
        if (o.washrooms && (o.washrooms.public || o.washrooms.private)) {
          details.push({
            label: 'Washrooms',
            value: `Public: ${o.washrooms.public || 0}, Private: ${o.washrooms.private || 0}`,
            customRender: true,
            showInEdit: true
          });
        }
        
        // Features
        if (o.receptionArea !== undefined) details.push({
          label: 'Reception Area',
          value: o.receptionArea ? 'Yes' : 'No',
          editKey: 'commercialDetails.officeDetails.receptionArea',
          showInEdit: true,
          fieldType: 'checkbox'
        });
        
        if (o.furnishing !== undefined) details.push({
          label: 'Furnishing',
          value: o.furnishing ? 'Yes' : 'No',
          editKey: 'commercialDetails.officeDetails.furnishing',
          showInEdit: true,
          fieldType: 'checkbox'
        });
        
        if (o.pantry !== undefined) details.push({
          label: 'Pantry',
          value: o.pantry ? `Yes (${o.pantryType || 'N/A'})` : 'No',
          editKey: 'commercialDetails.officeDetails.pantry',
          showInEdit: true,
          fieldType: 'checkbox'
        });
        
        // Additional Features
        if (o.additionalFeatures && o.additionalFeatures.length > 0) details.push({
          label: 'Additional Features',
          value: o.additionalFeatures.join(', '),
          editKey: 'commercialDetails.officeDetails.additionalFeatures',
          showInEdit: true
        });
        
        if (o.fireSafetyMeasures && o.fireSafetyMeasures.length > 0) details.push({
          label: 'Fire Safety Measures',
          value: o.fireSafetyMeasures.join(', '),
          editKey: 'commercialDetails.officeDetails.fireSafetyMeasures',
          showInEdit: true
        });
        
        // Floor Details
        if (o.totalFloors) details.push({
          label: 'Total Floors',
          value: o.totalFloors,
          editKey: 'commercialDetails.officeDetails.totalFloors',
          showInEdit: true
        });
        
        if (o.floorNo) details.push({
          label: 'Floor Number',
          value: o.floorNo,
          editKey: 'commercialDetails.officeDetails.floorNo',
          showInEdit: true
        });
        
        if (o.staircases) details.push({
          label: 'Staircases',
          value: o.staircases,
          editKey: 'commercialDetails.officeDetails.staircases',
          showInEdit: true
        });
        
        // Lift
        if (o.lift) details.push({
          label: 'Lift',
          value: o.lift === 'Available' ? `Available (Passenger: ${o.passengerLifts || 0}, Service: ${o.serviceLifts || 0})` : 'Not Available',
          editKey: 'commercialDetails.officeDetails.lift',
          showInEdit: true
        });
        
        // Parking
        if (o.parking && o.parking.type) details.push({
          label: 'Parking',
          value: o.parking.type === 'Available' ? `Available (${o.parking.count || 0} spots)` : 'Not Available',
          editKey: 'commercialDetails.officeDetails.parking.type',
          showInEdit: true
        });
        
        // Availability
        if (o.availability) details.push({
          label: 'Availability',
          value: o.availability === 'Ready' ? 'Ready to Move' : 'Under Construction',
          editKey: 'commercialDetails.officeDetails.availability',
          showInEdit: true
        });
        
        if (o.ageOfProperty) details.push({
          label: 'Property Age',
          value: o.ageOfProperty,
          editKey: 'commercialDetails.officeDetails.ageOfProperty',
          showInEdit: true
        });
        
        if (o.possessionBy) details.push({
          label: 'Possession By',
          value: o.possessionBy,
          editKey: 'commercialDetails.officeDetails.possessionBy',
          showInEdit: true
        });
        
        if (o.ownership) details.push({
          label: 'Ownership',
          value: o.ownership,
          editKey: 'commercialDetails.officeDetails.ownership',
          showInEdit: true,
          fieldType: 'select',
          options: ['Freehold', 'Leasehold', 'Company Owned', 'Other']
        });
        
        // Price Details
        if (o.expectedPrice) details.push({
          label: 'Expected Price',
          value: `₹${o.expectedPrice}`,
          editKey: 'commercialDetails.officeDetails.expectedPrice',
          showInEdit: true
        });
        
        if (o.preLeased) details.push({
          label: 'Pre-Leased',
          value: o.preLeased,
          editKey: 'commercialDetails.officeDetails.preLeased',
          showInEdit: true
        });
        
        if (o.leaseDuration) details.push({
          label: 'Lease Duration',
          value: o.leaseDuration,
          editKey: 'commercialDetails.officeDetails.leaseDuration',
          showInEdit: true
        });
        
        if (o.monthlyRent) details.push({
          label: 'Monthly Rent',
          value: `₹${o.monthlyRent}`,
          editKey: 'commercialDetails.officeDetails.monthlyRent',
          showInEdit: true
        });
        
        // Certifications
        if (o.nocCertified) details.push({
          label: 'NOC Certified',
          value: o.nocCertified,
          editKey: 'commercialDetails.officeDetails.nocCertified',
          showInEdit: true
        });
        
        if (o.occupancyCertified) details.push({
          label: 'Occupancy Certified',
          value: o.occupancyCertified,
          editKey: 'commercialDetails.officeDetails.occupancyCertified',
          showInEdit: true
        });
        
        if (o.previouslyUsedFor) details.push({
          label: 'Previously Used For',
          value: o.previouslyUsedFor,
          editKey: 'commercialDetails.officeDetails.previouslyUsedFor',
          showInEdit: true
        });
        
        // Amenities
        if (o.amenities && o.amenities.length > 0) details.push({
          label: 'Amenities',
          value: o.amenities.join(', '),
          editKey: 'commercialDetails.officeDetails.amenities',
          showInEdit: true
        });
        
        if (o.locationAdvantages && o.locationAdvantages.length > 0) details.push({
          label: 'Location Advantages',
          value: o.locationAdvantages.join(', '),
          editKey: 'commercialDetails.officeDetails.locationAdvantages',
          showInEdit: true
        });
      }
    }

   if (raw.propertyType === 'Resort' && raw.resortDetails) {
      const r = raw.resortDetails;
      
      // Basic Details
      if (r.resortType) details.push({
        label: 'Resort Type',
        value: r.resortType,
        editKey: 'resortDetails.resortType',
        showInEdit: true,
        fieldType: 'select',
        options: [
          'Beachfront Resort',
          'Hill Station / Mountain Resort',
          'Forest / Jungle Retreat',
          'Lakefront Resort',
          'Desert Resort',
          'Eco-Resort',
          'Island Resort',
          'Wellness / Spa Resort',
          'Luxury Resort',
          'Boutique Resort',
          'Family Resort',
          'Adventure / Activity Resort',
          'Safari / Wildlife Resort',
          'Water Park Resort',
          'Golf Resort',
          'Riverfront Resort',
          'Farm / Agri-Resort',
          'Theme Resort',
          'Business / Conference Resort',
          'Eco-Lodge / Nature Retreat'
        ]
      });
      
      if (r.landArea) details.push({
        label: 'Land Area',
        value: `${r.landArea} sqft`,
        editKey: 'resortDetails.landArea',
        showInEdit: true
      });
      
      if (r.buildArea) details.push({
        label: 'Build Area',
        value: `${r.buildArea} sqft`,
        editKey: 'resortDetails.buildArea',
        showInEdit: true
      });
      
      if (r.rooms) details.push({
        label: 'Rooms',
        value: r.rooms,
        editKey: 'resortDetails.rooms',
        showInEdit: true
      });
      
      if (r.floors) details.push({
        label: 'Floors',
        value: r.floors,
        editKey: 'resortDetails.floors',
        showInEdit: true
      });
      
      // Location Advantages
      if (r.locationAdvantages && r.locationAdvantages.length > 0) details.push({
        label: 'Location Advantages',
        value: r.locationAdvantages.join(', '),
        editKey: 'resortDetails.locationAdvantages',
        showInEdit: true
      });
    }

    return details.filter(d => d.value !== undefined && d.value !== null && d.value !== '');
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editData.propertyTitle}
                onChange={(e) => setEditData({ ...editData, propertyTitle: e.target.value })}
                className="text-xl font-semibold border-b-2 border-blue-500 focus:outline-none w-full"
              />
            ) : (
              <h2 className="text-xl font-semibold">{property.title}</h2>
            )}
            {isEditing ? (
              <div className="space-y-1 mt-2">
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                  placeholder="Location/City"
                  className="text-sm text-gray-600 border-b border-gray-300 focus:outline-none w-full focus:border-blue-500"
                />
                <input
                  type="text"
                  value={editData.area}
                  onChange={(e) => setEditData({ ...editData, area: e.target.value })}
                  placeholder="Area/Neighborhood"
                  className="text-xs text-gray-500 border-b border-gray-300 focus:outline-none w-full focus:border-blue-500"
                />
              </div>
            ) : (
             <div className="mt-1">
  <p className="text-sm text-gray-600">
    {getEnglishText(property.raw.location || property.location)}
  </p>
  <p className="text-xs text-gray-500 mt-0.5">
    {getEnglishText(property.raw.area || property.area)}
  </p>
</div>
            )}
          </div>


          <div className="flex gap-2 ml-4">
           {isEditing ? (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                title="Save Changes"
              >
                <span className="font-medium">Save</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                title="Edit Property"
              >
                <Edit2 size={18} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Close"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>
        {/* Basic Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
          <div>
            <p className="text-gray-500 text-xs mb-1">Property Type</p>
            <p className="font-medium">{property.type}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Expected Price</p>
            {isEditing ? (
              <input
                type="number"
                value={editData.expectedPrice}
                onChange={(e) => setEditData({ ...editData, expectedPrice: e.target.value })}
                className="font-medium border-b border-gray-300 focus:outline-none w-full focus:border-blue-500"
              />
            ) : (
              <p className="font-medium text-green-700">{property.price}</p>
            )}
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Approval Status</p>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                property.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : property.status === "pending"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {property.status}
            </span>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Property Status</p>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                property.sold
                  ? "bg-gray-800 text-white"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {property.sold ? "Sold" : "Available"}
            </span>
          </div>
        </div>



         {/* Vastu Details Section */}
        {property.raw.houseDetails?.vaasthuDetails && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
              <span>🏠 Vastu Details</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {Object.entries(property.raw.houseDetails.vaasthuDetails).map(([key, value]) => {
                if (!value) return null;
                const label = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase());
                return (
                  <div key={key}>
                    <p className="text-gray-500 text-xs mb-1">{label}</p>
                    {isEditing ? (
                      <select
                        value={editData[`houseDetails.vaasthuDetails.${key}`] || value}
                        onChange={(e) => setEditData({ 
                          ...editData, 
                          [`houseDetails.vaasthuDetails.${key}`]: e.target.value 
                        })}
                        className="w-full font-medium border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                      >
                        <option value="North-East">North-East</option>
                        <option value="South-West">South-West</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
                        <option value="North">North</option>
                        <option value="South">South</option>
                        <option value="North-West">North-West</option>
                        <option value="South-East">South-East</option>
                      </select>
                    ) : (
                      <p className="font-medium text-gray-800">{value}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Resort Vastu Details */}
        {property.raw.resortDetails?.vaasthuDetails && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
              <span>🏨 Resort Vastu Details</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {Object.entries(property.raw.resortDetails.vaasthuDetails).map(([key, value]) => {
                if (!value) return null;
                const label = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase());
                return (
                  <div key={key}>
                    <p className="text-gray-500 text-xs mb-1">{label}</p>
                    {isEditing ? (
                      <select
                        value={editData[`resortDetails.vaasthuDetails.${key}`] || value}
                        onChange={(e) => setEditData({ 
                          ...editData, 
                          [`resortDetails.vaasthuDetails.${key}`]: e.target.value 
                        })}
                        className="w-full font-medium border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                      >
                        <option value="North-East">North-East</option>
                        <option value="South-West">South-West</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
                        <option value="North">North</option>
                        <option value="South">South</option>
                        <option value="North-West">North-West</option>
                        <option value="South-East">South-East</option>
                      </select>
                    ) : (
                      <p className="font-medium text-gray-800">{value}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      {/* Site Vastu Details - Make Editable */}
{property.raw.siteDetails?.vaasthuDetails && (
  <div className="mb-6">
    <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
      <span>📐 Site Vastu Details</span>
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
      {Object.entries(property.raw.siteDetails.vaasthuDetails).map(([key, value]) => {
        if (!value) return null;
        const label = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
        
        // Define dropdown options based on field type
        const getOptionsForField = (fieldKey) => {
          const directionOptions = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
          const slopeOptions = ['Towards North', 'Towards South', 'Towards East', 'Towards West', 'Level/Flat'];
          const spaceOptions = ['Balanced open space', 'More in North-East', 'More in South-West'];
          const shapeOptions = ['Square', 'Rectangle', 'Irregular', 'L-Shaped', 'T-Shaped'];
          const roadOptions = ['North', 'South', 'East', 'West', 'North-East', 'South-West', 'Multiple sides'];
          const waterOptions = ['Water source in North', 'Water source in North-East', 'Bore well in North-East', 'Well in North-East'];
          const drainageOptions = ['North-East', 'North', 'East', 'South-East'];
          const heightOptions = ['Higher in West', 'Higher in South', 'Uniform height', 'Lower in North'];
          const structureOptions = ['No structures', 'Shed/Garage', 'Small room', 'Boundary wall only'];
          
          switch(fieldKey) {
            case 'plotFacing':
            case 'mainEntryDirection':
            case 'roadPosition':
            case 'drainageDirection':
              return directionOptions;
            case 'plotSlope':
              return slopeOptions;
            case 'openSpace':
              return spaceOptions;
            case 'plotShape':
              return shapeOptions;
            case 'waterSource':
              return waterOptions;
            case 'compoundWallHeight':
              return heightOptions;
            case 'existingStructures':
              return structureOptions;
            default:
              return directionOptions;
          }
        };
        
        return (
          <div key={key}>
            <p className="text-gray-500 text-xs mb-1">{label}</p>
            {isEditing ? (
              <select
                value={editData[`siteDetails.vaasthuDetails.${key}`] || value}
                onChange={(e) => setEditData({ 
                  ...editData, 
                  [`siteDetails.vaasthuDetails.${key}`]: e.target.value 
                })}
                className="w-full font-medium border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
              >
                {getOptionsForField(key).map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <p className="font-medium text-gray-800">{value}</p>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}



{/* Hospitality Vastu Details */}
{property.raw.commercialDetails?.hospitalityDetails?.vastuDetails && (
  <div className="mb-6">
    <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
      <span>🏨 Hospitality Vastu Details</span>
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
      {Object.entries(property.raw.commercialDetails.hospitalityDetails.vastuDetails).map(([key, value]) => {
        if (!value) return null;
        const label = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
        return (
          <div key={key}>
            <p className="text-gray-500 text-xs mb-1">{label}</p>
            {isEditing ? (
              <select
                value={editData[`commercialDetails.hospitalityDetails.vastuDetails.${key}`] || value}
                onChange={(e) => setEditData({ 
                  ...editData, 
                  [`commercialDetails.hospitalityDetails.vastuDetails.${key}`]: e.target.value 
                })}
                className="w-full font-medium border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
              >
                <option value="North-East">North-East</option>
                <option value="South-West">South-West</option>
                <option value="East">East</option>
                <option value="West">West</option>
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="North-West">North-West</option>
                <option value="South-East">South-East</option>
              </select>
            ) : (
              <p className="font-medium text-gray-800">{value}</p>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}

{/* Commercial Office Vastu Details */}
        {property.raw.commercialDetails?.officeDetails?.vaasthuDetails && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
              <span>🏢 Office Vastu Details</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {Object.entries(property.raw.commercialDetails.officeDetails.vaasthuDetails).map(([key, value]) => {
                if (!value) return null;
                const label = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase());
                
                // Define dropdown options based on field
                const getVastuOptions = (fieldKey) => {
                  const directionOptions = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
                  
                  switch(fieldKey) {
                    case 'officeFacing':
                      return ['North', 'East', 'North-East', 'West', 'South'];
                    case 'entrance':
                      return ['North', 'East', 'North-East', 'West'];
                    case 'cabin':
                      return ['South-West', 'West', 'South'];
                    case 'workstations':
                      return ['North', 'East', 'North-East'];
                    case 'conference':
                    case 'pantry':
                      return ['North-West', 'West', 'South-East'];
                    case 'reception':
                    case 'accounts':
                      return ['North', 'North-East', 'East'];
                    case 'server':
                      return ['South-East', 'North-West'];
                    case 'washrooms':
                      return ['North-West', 'West', 'South-East'];
                    case 'staircase':
                      return ['South', 'South-West', 'West'];
                    case 'storage':
                    case 'cashLocker':
                      return ['South-West', 'West'];
                    default:
                      return directionOptions;
                  }
                };
                
                return (
                  <div key={key}>
                    <p className="text-gray-500 text-xs mb-1">{label}</p>
                    {isEditing ? (
                      <select
                        value={editData[`commercialDetails.officeDetails.vaasthuDetails.${key}`] || value}
                        onChange={(e) => setEditData({ 
                          ...editData, 
                          [`commercialDetails.officeDetails.vaasthuDetails.${key}`]: e.target.value 
                        })}
                        className="w-full font-medium border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                      >
                        {getVastuOptions(key).map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="font-medium text-gray-800">{value}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}


{/* Industry Vastu Details */}
{property.raw.commercialDetails?.industryDetails?.vastuDetails && (
  <div className="mb-6">
    <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
      <span>🏭 Industry Vastu Details</span>
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
      {Object.entries(property.raw.commercialDetails.industryDetails.vastuDetails).map(([key, value]) => {
        if (!value) return null;
        const label = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
        
        const getVastuOptions = (fieldKey) => {
          const directionOptions = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
          
          switch(fieldKey) {
            case 'buildingFacing':
              return directionOptions;
            case 'entrance':
              return ['North', 'East', 'North-East', 'West'];
            case 'machinery':
              return ['Towards South', 'Towards West', 'South-West', 'North-West'];
            case 'production':
              return ['Balanced open space', 'North', 'East', 'North-East'];
            case 'rawMaterial':
              return ['Square', 'South', 'West', 'South-West'];
            case 'finishedGoods':
              return ['North', 'East', 'North-East'];
            case 'office':
              return ['Water source in North', 'North', 'East', 'North-East'];
            case 'electrical':
              return ['South-East', 'North-West', 'West'];
            case 'water':
              return ['North', 'North-East', 'East', 'Equal height on all sides'];
            case 'waste':
              return ['South', 'West', 'South-West', 'No structures'];
            case 'washroom':
              return ['North-West', 'West', 'No structures'];
            default:
              return directionOptions;
          }
        };
        
        return (
          <div key={key}>
            <p className="text-gray-500 text-xs mb-1">{label}</p>
            {isEditing ? (
              <select
                value={editData[`commercialDetails.industryDetails.vastuDetails.${key}`] || value}
                onChange={(e) => setEditData({ 
                  ...editData, 
                  [`commercialDetails.industryDetails.vastuDetails.${key}`]: e.target.value 
                })}
                className="w-full font-medium border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
              >
                {getVastuOptions(key).map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <p className="font-medium text-gray-800">{value}</p>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}




{/* Commercial Plot/Land Vastu Details */}

{property.raw.commercialDetails?.subType === 'Plot/Land' && 
 (property.raw.commercialDetails?.vastuDetails || property.raw.commercialDetails?.vaastuDetails) && (
  <div className="mb-6">
    <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b flex items-center gap-2">
      <span>📐 Commercial Plot Vastu Details</span>
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
     {Object.entries(property.raw.commercialDetails.vastuDetails || property.raw.commercialDetails.vaastuDetails || {}).map(([key, value]) => {
        if (!value) return null;
        const label = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
        
        const getVastuOptions = (fieldKey) => {
          const directionOptions = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
          
          switch(fieldKey) {
            case 'plotFacing':
              return ['North', 'East', 'North-East', 'West', 'South'];
            case 'mainEntry':
              return ['North', 'East', 'North-East', 'West', 'South-West'];
            case 'plotSlope':
              return ['Towards North', 'Towards East', 'Towards North-East'];
            case 'openSpace':
              return ['Balanced open space', 'More in North & East'];
            case 'shape':
              return ['Square', 'Rectangle'];
            case 'roadPosition':
              return ['North', 'East', 'North-East'];
            case 'waterSource':
              return ['North', 'North-East'];
            case 'drainage':
              return ['North', 'North-East', 'East'];
            case 'compoundWall':
              return ['Equal height', 'Higher in South & West'];
            case 'structures':
              return ['No structures', 'Temporary structures'];
            default:
              return directionOptions;
          }
        };
        
        return (
          <div key={key}>
            <p className="text-gray-500 text-xs mb-1">{label}</p>
            {isEditing ? (
              <select
                value={editData[`commercialDetails.vastuDetails.${key}`] || value}  // ✅ FIXED: single 'a'
                onChange={(e) => setEditData({ 
                  ...editData, 
                  [`commercialDetails.vastuDetails.${key}`]: e.target.value  // ✅ FIXED: single 'a'
                })}
                className="w-full font-medium border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
              >
                {getVastuOptions(key).map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <p className="font-medium text-gray-800">{value}</p>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}

    


        {/* Property Type Specific Details */}


    


        {/* Property Type Specific Details */}



        {getPropertyDetails().length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">
              Property Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {getPropertyDetails().map((detail, idx) => {
                const fieldKey = detail.editKey;
                // Custom render for Parking in edit mode
                if (detail.customRender && detail.label === 'Parking') {
                  return (
                    <div key={idx} className="col-span-2 md:col-span-3">
                      <p className="text-gray-500 text-xs mb-2">{detail.label}</p>
                      {isEditing ? (
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="text-xs text-gray-600 block mb-1">Covered</label>
                            <input
                              type="number"
                              value={editData['houseDetails.parking.covered'] || 0}
                              onChange={(e) => setEditData({ ...editData, 'houseDetails.parking.covered': e.target.value })}
                              className="w-full font-medium border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-xs text-gray-600 block mb-1">Open</label>
                            <input
                              type="number"
                              value={editData['houseDetails.parking.open'] || 0}
                              onChange={(e) => setEditData({ ...editData, 'houseDetails.parking.open': e.target.value })}
                              className="w-full font-medium border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="font-medium text-gray-800">{detail.value}</p>
                      )}
                    </div>
                  );
                }

                // ✅ ADD THIS NEW BLOCK - Custom render for Possession in edit mode (for Plot)
  if (detail.customRender && detail.label === 'Possession By') {
    return (
      <div key={idx} className="col-span-2">
        <p className="text-gray-500 text-xs mb-2">{detail.label}</p>
        {isEditing ? (
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-600 block mb-1">Month</label>
              <select
                value={editData['commercialDetails.plotDetails.possession.month'] || ''}
                onChange={(e) => setEditData({ ...editData, 'commercialDetails.plotDetails.possession.month': e.target.value })}
                className="w-full font-medium border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Month</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-600 block mb-1">Year</label>
              <input
                type="text"
                value={editData['commercialDetails.plotDetails.possession.year'] || ''}
                onChange={(e) => setEditData({ ...editData, 'commercialDetails.plotDetails.possession.year': e.target.value })}
                placeholder="2025"
                maxLength="4"
                className="w-full font-medium border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        ) : (
          <p className="font-medium text-gray-800">{detail.value}</p>
        )}
      </div>
    );
  }


               return (
  <div key={idx}>
    <p className="text-gray-500 text-xs mb-1">{detail.label}</p>
    {isEditing && fieldKey ? (
      detail.fieldType === 'select' ? (
        <select
          value={editData[fieldKey] || ''}
          onChange={(e) => setEditData({ ...editData, [fieldKey]: e.target.value })}
          className="font-medium border border-gray-300 rounded px-2 py-1 focus:outline-none w-full focus:border-blue-500"
        >
          {detail.options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          value={editData[fieldKey] || ''}
          onChange={(e) => setEditData({ ...editData, [fieldKey]: e.target.value })}
          className="font-medium border-b border-gray-300 focus:outline-none w-full focus:border-blue-500 py-1"
        />
      )
    ) : (
      <p className="font-medium text-gray-800">{detail.value}</p>
    )}
  </div>
);
              })}
            </div>
          </div>
        )}
        {/* Description */}
        <div className="mb-6 text-sm">
          <p className="text-gray-500 mb-2 font-semibold text-xs pb-2 border-b">Description</p>
          {isEditing ? (
            <textarea
              value={editData.description || ""}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-blue-500"
              rows="4"
              placeholder="Enter property description..."
            />
          ) : (
            <p className="text-gray-700 leading-relaxed">
              {safeDescription || "No description provided"}
            </p>
          )}
        </div>

        {property.raw.houseDetails && (
          <>
            {property.raw.houseDetails.otherRooms && property.raw.houseDetails.otherRooms.length > 0 && (
              <div className="mb-6 text-sm">
                <p className="text-gray-500 mb-3 font-semibold text-xs pb-2 border-b">Other Rooms</p>
                <div className="flex flex-wrap gap-2">
                  {property.raw.houseDetails.otherRooms.map((room, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium"
                    >
                      {room}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {property.raw.houseDetails.furnishing && (
              <div className="mb-6 text-sm">
                <p className="text-gray-500 mb-3 font-semibold text-xs pb-2 border-b">Furnishing Status</p>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                  {property.raw.houseDetails.furnishing}
                </span>
              </div>
            )}
          </>
        )}



        {/* Owner Details */}
        <div className="mb-6 text-sm">
          <p className="text-gray-500 mb-3 font-semibold text-xs pb-2 border-b">Owner Details</p>
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Name</label>
                <input
                  type="text"
                  value={editData['ownerDetails.name'] || ''}
                  onChange={(e) => setEditData({ ...editData, 'ownerDetails.name': e.target.value })}
                  className="w-full font-medium border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Email</label>
                <input
                  type="email"
                  value={editData['ownerDetails.email'] || ''}
                  onChange={(e) => setEditData({ ...editData, 'ownerDetails.email': e.target.value })}
                  className="w-full font-medium border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Phone</label>
                <input
                  type="text"
                  value={editData['ownerDetails.phone'] || ''}
                  onChange={(e) => setEditData({ ...editData, 'ownerDetails.phone': e.target.value })}
                  className="w-full font-medium border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 font-medium">{property.owner}</p>
              <p className="text-gray-600 text-xs mt-1">{property.email}</p>
              <p className="text-gray-600 text-xs">{property.phone}</p>
            </div>
          )}
        </div>
        {/* Furnishing Items */}
        {property.raw?.houseDetails?.furnishingItems && property.raw.houseDetails.furnishingItems.length > 0 && (
          <div className="mb-6 text-sm">
            <p className="text-gray-500 mb-3 font-semibold text-xs pb-2 border-b">Furnishing Items</p>
            <div className="flex flex-wrap gap-2">
              {property.raw.houseDetails.furnishingItems.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
        {/* Photos Section */}
        {property.images && property.images.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <p className="text-gray-500 font-semibold text-xs pb-2 border-b flex-1">
                Photos ({property.images.length})
              </p>
              {isEditing && (
                <label className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 text-xs transition ml-4">
                  <Upload size={14} />
                  Add Photos
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files);
                      if (files.length > 0) {
                        try {
                          const result = await uploadPropertyImages(property.id, files);
                          if (result.success) {
                            toast.success('Images uploaded successfully');
                            onUpdate(property.id, {}); // Trigger refresh
                          } else {
                            toast.error(result.message || 'Failed to upload images');
                          }
                        } catch (error) {
                          toast.error('Error uploading images');
                        }
                      }
                    }}
                  />
                </label>
              )}
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {property.images.map((img, idx) => {
                // Handle base64 images correctly
               const imageUrl = img.startsWith('data:image')
                  ? img // Base64 image
                  : img.startsWith('http')
                    ? img // Full URL
                    : `${import.meta.env.VITE_API_URL}/${img.replace(/\\/g, '/')}`; // Fix backslashes
                
                console.log('🖼️ Image URL:', imageUrl.substring(0, 50) + '...');
                return (
                  <div key={idx} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Property ${idx + 1}`}
                      className="w-full h-28 object-cover rounded-lg cursor-pointer hover:opacity-90 border border-gray-200 transition"
                      onClick={() => {
                        if (!isEditing) {
                          setSelectedImage(imageUrl);
                          setShowImages(true);
                        }
                      }}
                      onError={(e) => {
                        console.error('Image load error:', img);
                        console.error('Full URL attempted:', imageUrl);
                        e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                      }}
                    />
                    {isEditing && (
                      <button
                       onClick={async () => {
                        if (window.confirm('Delete this image?')) {
                          try {
                            const result = await deletePropertyImage(property.id, idx);  // ✅ FIXED: Pass index directly
                              if (result.success) {
                                toast.success('Image deleted successfully');
                                onUpdate(property.id, {}); // Trigger refresh
                              } else {
                                toast.error(result.message || 'Failed to delete image');
                              }
                            } catch (error) {
                              toast.error('Error deleting image');
                            }
                          }
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                        title="Delete Image"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* Documents Section */}
        {property.documents && (property.documents.ownership?.length > 0 || property.documents.identity?.length > 0) && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <p className="text-gray-500 font-semibold text-xs pb-2 border-b flex-1">Documents</p>
              {isEditing && (
                <label className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 text-xs transition ml-4">
                  <Upload size={14} />
                  Add Documents
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      console.log('New documents selected:', files);
                      toast.info('Document upload feature will be available soon');
                    }}
                  />
                </label>
              )}
            </div>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              {property.documents.ownership?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    Ownership Documents:
                  </p>
                  <div className="space-y-2">

                {property.documents.ownership.map((doc, idx) => {
  const docUrl = doc.startsWith('data:') 
    ? doc  // Base64 document
    : doc.startsWith('http') 
    ? doc 
    : `${import.meta.env.VITE_API_URL}/${doc.replace(/\\/g, '/')}`;
  
  const isPDF = doc.startsWith('data:application/pdf') || doc.endsWith('.pdf');
  const isImage = doc.startsWith('data:image/') || /\.(jpg|jpeg|png)$/i.test(doc);
  
  const handleDocumentClick = () => {
    if (doc.startsWith('data:')) {
      // Handle base64 documents properly
      const newWindow = window.open();
      if (newWindow) {
        if (isPDF) {
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Ownership Document ${idx + 1}</title>
                <style>
                  body { margin: 0; padding: 0; }
                  iframe { width: 100vw; height: 100vh; border: none; }
                </style>
              </head>
              <body>
                <iframe src="${docUrl}"></iframe>
              </body>
            </html>
          `);
        } else if (isImage) {
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Ownership Document ${idx + 1}</title>
                <style>
                  body { margin: 0; display: flex; justify-content: center; align-items: center; background: #000; }
                  img { max-width: 100%; max-height: 100vh; }
                </style>
              </head>
              <body>
                <img src="${docUrl}" alt="Document ${idx + 1}" />
              </body>
            </html>
          `);
        }
        newWindow.document.close();
      }
    } else {
      // Regular URL - open directly
      window.open(docUrl, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <div key={idx} className="flex items-center justify-between group bg-white p-2 rounded border border-gray-200">
      <button
        onClick={handleDocumentClick}
        className="flex items-center gap-2 text-sm text-blue-600 hover:underline flex-1 text-left"
      >
        <FileText size={16} />
        <span>Ownership Document {idx + 1}</span>
      </button>
                          {isEditing && (
  <button
    onClick={async () => {
      if (window.confirm('Delete this document?')) {
        try {
          const result = await deletePropertyDocument(property.id, idx, 'ownership');
          if (result.success) {
            toast.success('Document deleted successfully');
            onUpdate(property.id, {});
          } else {
            toast.error(result.message || 'Failed to delete document');
          }
        } catch (error) {
          toast.error('Error deleting document');
        }
      }
    }}
                              className="text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1"
                              title="Delete Document"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

             {property.documents.identity?.length > 0 && (
  <div>
    <p className="text-xs font-semibold text-gray-700 mb-2">
      Identity Documents:
    </p>
    <div className="space-y-2">
      {property.documents.identity.map((doc, idx) => {
        const docUrl = doc.startsWith('data:') 
          ? doc 
          : doc.startsWith('http') 
            ? doc 
            : `${import.meta.env.VITE_API_URL}/${doc.replace(/\\/g, '/')}`;
        
        return (
          <div key={idx} className="flex items-center justify-between group bg-white p-2 rounded border border-gray-200">
          <button
  onClick={() => {
    const docUrl = doc.startsWith('data:') 
      ? doc 
      : doc.startsWith('http') 
        ? doc 
        : `${import.meta.env.VITE_API_URL}/${doc.replace(/\\/g, '/')}`;
    
    const isPDF = doc.startsWith('data:application/pdf') || doc.endsWith('.pdf');
    const isImage = doc.startsWith('data:image/') || /\.(jpg|jpeg|png)$/i.test(doc);
    
    if (doc.startsWith('data:')) {
      const newWindow = window.open();
      if (newWindow) {
        if (isPDF) {
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Identity Document ${idx + 1}</title>
                <style>
                  body { margin: 0; padding: 0; }
                  iframe { width: 100vw; height: 100vh; border: none; }
                </style>
              </head>
              <body>
                <iframe src="${docUrl}"></iframe>
              </body>
            </html>
          `);
        } else if (isImage) {
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Identity Document ${idx + 1}</title>
                <style>
                  body { margin: 0; display: flex; justify-content: center; align-items: center; background: #000; }
                  img { max-width: 100%; max-height: 100vh; }
                </style>
              </head>
              <body>
                <img src="${docUrl}" alt="Document ${idx + 1}" />
              </body>
            </html>
          `);
        }
        newWindow.document.close();
      }
    } else {
      window.open(docUrl, '_blank', 'noopener,noreferrer');
    }
  }}
  className="flex items-center gap-2 text-sm text-blue-600 hover:underline flex-1 text-left"
>
  <FileText size={16} />
  <span>Identity Document {idx + 1}</span>
</button>
            {isEditing && (
              <button
                onClick={async () => {
                  if (window.confirm('Delete this document?')) {
                    try {
                      const result = await deletePropertyDocument(property.id, idx, 'identity');
                      if (result.success) {
                         toast.success('Document deleted successfully');
                        onUpdate(property.id, {});
                      } else {
                         toast.error(result.message || 'Failed to delete document');
                      }
                    } catch (error) {
                      toast.error('Error deleting document');
                    }
                  }
                }}
                className="text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1"
                title="Delete Document"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}

            </div>
          </div>
        )}

        
        {/* Timestamps */}
        {property.raw && (
          <div className="text-xs text-gray-400 pt-4 border-t flex justify-between">
            <p>Created: {new Date(property.raw.createdAt).toLocaleString()}</p>
            <p>Updated: {new Date(property.raw.updatedAt).toLocaleString()}</p>
          </div>
        )}
      </div>
      {/* Image Lightbox */}
      {showImages && selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]"
          onClick={() => setShowImages(false)}
        >
          <X
            className="absolute right-4 top-4 cursor-pointer text-white hover:text-gray-300"
            size={32}
            onClick={() => setShowImages(false)}
          />
          <img
            src={selectedImage}
            alt="Full view"
            className="max-w-[90%] max-h-[90%] object-contain"
          />
        </div>
      )}
    </div>
  );
}