// Landstime_Androidapp/admin/src/components/properties/PropertyModal.jsx
import { X, FileText, Download, Edit2, Save, Upload, Trash2 } from "lucide-react";
import { useState } from "react";
import { translateText } from "../../services/translationService"; // Add this line
import {
  uploadPropertyImages,
  deletePropertyImage,
  uploadPropertyDocuments,
  deletePropertyDocument
} from "../../services/propertyService";
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
    location: typeof property.raw.location === 'string'
      ? property.raw.location
      : property.raw.location?.en || '',
    area: typeof property.raw.area === 'string' 
      ? property.raw.area 
      : property.raw.area?.en || '',
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
    }),
    // Commercial details
    ...(property.raw.commercialDetails?.officeDetails && {
      'commercialDetails.officeDetails.area': property.raw.commercialDetails.officeDetails.carpetArea || '',
      'commercialDetails.officeDetails.cabins': property.raw.commercialDetails.officeDetails.cabins || '',
      'commercialDetails.officeDetails.meetingRooms': property.raw.commercialDetails.officeDetails.meetingRooms || '',
    }),
    // Resort details
       ...(property.raw.resortDetails && {
      'resortDetails.resortType': property.raw.resortDetails.resortType || '',
      'resortDetails.landArea': property.raw.resortDetails.landArea || '',
      'resortDetails.buildArea': property.raw.resortDetails.buildArea || '',
      'resortDetails.rooms': property.raw.resortDetails.rooms || '',
      'resortDetails.floors': property.raw.resortDetails.floors || '',
      // ADD VASTU DETAILS
      ...(property.raw.resortDetails.vaasthuDetails && 
        Object.keys(property.raw.resortDetails.vaasthuDetails).reduce((acc, key) => {
          acc[`resortDetails.vaasthuDetails.${key}`] = property.raw.resortDetails.vaasthuDetails[key] || '';
          return acc;
        }, {})
      ),
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
          // ADD VASTU DETAILS
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
        };
      }
      else if (property.type === 'Commercial' || property.raw.propertyType === 'Commercial') {
        formattedData.commercialDetails = {
          officeDetails: {
            carpetArea: parseFloat(editData['commercialDetails.officeDetails.area']) || 0,
            cabins: parseInt(editData['commercialDetails.officeDetails.cabins']) || 0,
            meetingRooms: parseInt(editData['commercialDetails.officeDetails.meetingRooms']) || 0,
          }
        };
      }
      else if (property.type === 'Resort' || property.raw.propertyType === 'Resort') {
        formattedData.resortDetails = {
          landArea: parseFloat(editData['resortDetails.landArea']) || 0,
          buildArea: parseFloat(editData['resortDetails.buildArea']) || 0,
          rooms: parseInt(editData['resortDetails.rooms']) || 0,
          // ADD VASTU DETAILS
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
      console.log('💾 Sending update data:', formattedData);
      await onUpdate(property.id, formattedData);
      setIsEditing(false);
    } catch (error) {
      console.error('❌ Save error:', error);
      alert('Failed to update property: ' + (error.response?.data?.message || error.message));
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
      if (s.area) details.push({
        label: 'Plot Area',
        value: `${s.area} ${s.areaUnit || 'sqft'}`,
        editKey: 'siteDetails.area'
      });
      if (s.length && s.breadth) details.push({
        label: 'Dimensions',
        value: `${s.length} x ${s.breadth}`
      });
      if (s.length) details.push({
        label: 'Length',
        value: s.length,
        editKey: 'siteDetails.length'
      });
      if (s.breadth) details.push({
        label: 'Breadth',
        value: s.breadth,
        editKey: 'siteDetails.breadth'
      });
      if (s.floorsAllowed) details.push({
        label: 'Floors Allowed',
        value: s.floorsAllowed,
        editKey: 'siteDetails.floorsAllowed'
      });
      if (s.boundaryWall !== undefined) details.push({
        label: 'Boundary Wall',
        value: s.boundaryWall ? 'Yes' : 'No'
      });
      if (s.openSides) details.push({
        label: 'Open Sides',
        value: s.openSides
      });
      if (s.roadWidth) details.push({
        label: 'Road Width',
        value: `${s.roadWidth} ${s.roadWidthUnit || 'ft'}`
      });
    }
    if (raw.propertyType === 'Commercial' && raw.commercialDetails) {
      const c = raw.commercialDetails;
      if (c.subType) details.push({
        label: 'Sub Type',
        value: c.subType
      });
      if (c.officeDetails) {
        const o = c.officeDetails;
        if (o.officeKind) details.push({
          label: 'Office Type',
          value: o.officeKind
        });
        if (o.carpetArea) details.push({
          label: 'Carpet Area',
          value: `${o.carpetArea} ${o.carpetAreaUnit || 'sqft'}`,
          editKey: 'commercialDetails.officeDetails.area'
        });
        if (o.cabins) details.push({
          label: 'Cabins',
          value: o.cabins,
          editKey: 'commercialDetails.officeDetails.cabins'
        });
        if (o.meetingRooms) details.push({
          label: 'Meeting Rooms',
          value: o.meetingRooms,
          editKey: 'commercialDetails.officeDetails.meetingRooms'
        });
        if (o.seats) details.push({
          label: 'Seats',
          value: o.seats
        });
      }
    }
    if (raw.propertyType === 'Resort' && raw.resortDetails) {
      const r = raw.resortDetails;
      if (r.resortType) details.push({
        label: 'Resort Type',
        value: r.resortType,
        editKey: 'resortDetails.resortType'
      });
      if (r.landArea) details.push({
        label: 'Land Area',
        value: `${r.landArea} sqft`,
        editKey: 'resortDetails.landArea'
      });
      if (r.buildArea) details.push({
        label: 'Build Area',
        value: `${r.buildArea} sqft`,
        editKey: 'resortDetails.buildArea'
      });
      if (r.rooms) details.push({
        label: 'Rooms',
        value: r.rooms,
        editKey: 'resortDetails.rooms'
      });
      if (r.floors) details.push({
        label: 'Floors',
        value: r.floors,
        editKey: 'resortDetails.floors'
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
                  {typeof property.location === 'string' 
                    ? property.location 
                    : property.raw.location?.en || property.location}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {typeof property.area === 'string'
                    ? property.area
                    : property.raw.area?.en || property.area}
                </p>
              </div>
            )}
          </div>


          <div className="flex gap-2 ml-4">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                title="Save Changes"
              >
                <Save size={18} />
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

        {/* Site Vastu Details */}
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
                return (
                  <div key={key}>
                    <p className="text-gray-500 text-xs mb-1">{label}</p>
                    <p className="font-medium text-gray-800">{value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}


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
                return (
                  <div key={idx}>
                    <p className="text-gray-500 text-xs mb-1">{detail.label}</p>
                    {isEditing && fieldKey ? (
                      <input
                        type="text"
                        value={editData[fieldKey] || ''}
                        onChange={(e) => setEditData({ ...editData, [fieldKey]: e.target.value })}
                        className="font-medium border-b border-gray-300 focus:outline-none w-full focus:border-blue-500 py-1"
                      />
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
                            alert('Images uploaded successfully!');
                            onUpdate(property.id, {}); // Trigger refresh
                          } else {
                            alert('Failed to upload images: ' + result.message);
                          }
                        } catch (error) {
                          alert('Error uploading images');
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
                              const result = await deletePropertyImage(property.id, { imageIndex: idx });
                              if (result.success) {
                                alert('Image deleted successfully!');
                                onUpdate(property.id, {}); // Trigger refresh
                              } else {
                                alert('Failed to delete image: ' + result.message);
                              }
                            } catch (error) {
                              alert('Error deleting image');
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
                      alert('Document upload feature - to be implemented with backend API');
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
                      const docUrl = doc.startsWith('data:') ? doc : doc.startsWith('http') ? doc : `${import.meta.env.VITE_API_URL}/${doc}`;
                      return (
                        <div key={idx} className="flex items-center justify-between group bg-white p-2 rounded border border-gray-200">
                          <a
                            href={docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-600 hover:underline flex-1"
                          >
                            <FileText size={16} />
                            <span>Ownership Document {idx + 1}</span>
                            <Download size={14} className="ml-auto" />
                          </a>
                          {isEditing && (
                            <button
                              onClick={() => {
                                if (window.confirm('Delete this document?')) {
                                  console.log('Delete document:', doc);
                                  alert('Document deletion - to be implemented with backend API');
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
                      const docUrl = doc.startsWith('data:') ? doc : doc.startsWith('http') ? doc : `${import.meta.env.VITE_API_URL}/${doc}`;
                      return (
                        <div key={idx} className="bg-white p-2 rounded border border-gray-200">
                          <a
                            href={docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                          >
                            <FileText size={16} />
                            <span>Identity Document {idx + 1}</span>
                            <Download size={14} className="ml-auto" />
                          </a>
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