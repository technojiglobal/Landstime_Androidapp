// Landstime_Androidapp/admin/src/components/properties/PropertyModal.jsx

import { X, FileText, Download, Edit2, Save,Upload, Trash2 } from "lucide-react";
import { useState } from "react";
//import { uploadPropertyImages, deletePropertyImage, uploadPropertyDocuments, deletePropertyDocument } from "../services/propertyService";
import {
  uploadPropertyImages,
  deletePropertyImage,
  uploadPropertyDocuments,
  deletePropertyDocument
} from "../../services/propertyService";


export default function PropertyModal({ property, onClose, onUpdate }) {
  const [showImages, setShowImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
 const [editData, setEditData] = useState({
  propertyTitle: property.title,
  description: property.description,
  expectedPrice: property.price.replace('₹', ''),
  location: property.location,

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
    'houseDetails.parking.covered': property.raw.houseDetails.parking?.covered || 0,
    'houseDetails.parking.open': property.raw.houseDetails.parking?.open || 0,
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
    'commercialDetails.officeDetails.area': property.raw.commercialDetails.officeDetails.area || '',
    'commercialDetails.officeDetails.cabins': property.raw.commercialDetails.officeDetails.cabins || '',
    'commercialDetails.officeDetails.meetingRooms': property.raw.commercialDetails.officeDetails.meetingRooms || '',
  }),
  // Resort details
  ...(property.raw.resortDetails && {
    'resortDetails.area': property.raw.resortDetails.area || '',
    'resortDetails.rooms': property.raw.resortDetails.rooms || '',
  }),
});

const handleSave = async () => {
  // Convert flat editData to nested structure for backend
  const formattedData = {
    propertyTitle: editData.propertyTitle,
    description: editData.description,
    expectedPrice: parseFloat(editData.expectedPrice),
    location: editData.location,
    ownerDetails: {
      name: editData['ownerDetails.name'],
      email: editData['ownerDetails.email'],
      phone: editData['ownerDetails.phone'],
    },
  };

  // Add nested structures based on property type
if (property.type === 'House') {
  formattedData.houseDetails = {
    floors: parseInt(editData['houseDetails.floors']) || 0,
    area: parseFloat(editData['houseDetails.area']) || 0,
    bedrooms: parseInt(editData['houseDetails.bedrooms']) || 0,
    bathrooms: parseInt(editData['houseDetails.bathrooms']) || 0,
    balconies: parseInt(editData['houseDetails.balconies']) || 0,
    ageOfProperty: editData['houseDetails.ageOfProperty'],
    ownership: editData['houseDetails.ownership'],
    furnishing: editData['houseDetails.furnishing'],
    availabilityStatus: editData['houseDetails.availabilityStatus'],
    parking: {
      covered: parseInt(editData['houseDetails.parking.covered']) || 0,
      open: parseInt(editData['houseDetails.parking.open']) || 0,
    }
  };
}
  else if (property.type === 'Site/Plot/Land') {
    formattedData.siteDetails = {
      area: parseFloat(editData['siteDetails.area']) || 0,
      length: parseFloat(editData['siteDetails.length']) || 0,
      breadth: parseFloat(editData['siteDetails.breadth']) || 0,
      floorsAllowed: parseInt(editData['siteDetails.floorsAllowed']) || 0,
    };
  } else if (property.type === 'Commercial') {
    formattedData.commercialDetails = {
      officeDetails: {
        area: parseFloat(editData['commercialDetails.officeDetails.area']) || 0,
        cabins: parseInt(editData['commercialDetails.officeDetails.cabins']) || 0,
        meetingRooms: parseInt(editData['commercialDetails.officeDetails.meetingRooms']) || 0,
      }
    };
  } else if (property.type === 'Resort') {
    formattedData.resortDetails = {
      area: parseFloat(editData['resortDetails.area']) || 0,
      rooms: parseInt(editData['resortDetails.rooms']) || 0,
    };
  }

  await onUpdate(property.id, formattedData);
  setIsEditing(false);
};

  // Helper to get property type specific details
const getPropertyDetails = () => {
  const raw = property.raw;
  const details = [];

  if (raw.propertyType === 'House' && raw.houseDetails) {
    const h = raw.houseDetails;
    details.push(
      { label: 'Area', value: `${h.area} ${h.areaUnit}`, editKey: 'houseDetails.area', showInEdit: true },
      { label: 'Bedrooms', value: h.bedrooms, editKey: 'houseDetails.bedrooms', showInEdit: true },
      { label: 'Bathrooms', value: h.bathrooms, editKey: 'houseDetails.bathrooms', showInEdit: true },
      { label: 'Balconies', value: h.balconies, editKey: 'houseDetails.balconies', showInEdit: true },
      { label: 'Floors', value: h.floors, editKey: 'houseDetails.floors', showInEdit: true },
      { label: 'Furnishing', value: h.furnishing, editKey: 'houseDetails.furnishing', showInEdit: true },
      { label: 'Availability', value: h.availabilityStatus, editKey: 'houseDetails.availabilityStatus', showInEdit: true },
      { label: 'Age', value: h.ageOfProperty, editKey: 'houseDetails.ageOfProperty', showInEdit: true },
      { label: 'Ownership', value: h.ownership, editKey: 'houseDetails.ownership', showInEdit: true },
      { 
        label: 'Parking', 
        value: `Covered: ${h.parking?.covered || 0}, Open: ${h.parking?.open || 0}`,
        customRender: true,
        showInEdit: true
      }
    );
  }

  if (raw.propertyType === 'Site/Plot/Land' && raw.siteDetails) {
    const s = raw.siteDetails;
    details.push(
      { label: 'Area', value: `${s.area} ${s.areaUnit}`, editKey: 'siteDetails.area' },
      { label: 'Dimensions', value: `${s.length} x ${s.breadth}` },
      { label: 'Length', value: s.length, editKey: 'siteDetails.length' },
      { label: 'Breadth', value: s.breadth, editKey: 'siteDetails.breadth' },
      { label: 'Floors Allowed', value: s.floorsAllowed, editKey: 'siteDetails.floorsAllowed' },
      { label: 'Boundary Wall', value: s.boundaryWall },
      { label: 'Open Sides', value: s.openSides },
      { label: 'Road Width', value: `${s.roadWidth} ${s.roadWidthUnit}` }
    );
  }

  if (raw.propertyType === 'Commercial' && raw.commercialDetails) {
    const c = raw.commercialDetails;
    details.push(
      { label: 'Sub Type', value: c.subType }
    );
    
    if (c.officeDetails) {
      const o = c.officeDetails;
      details.push(
        { label: 'Office Kind', value: o.officeKind },
        { label: 'Area', value: `${o.area} ${o.areaUnit}`, editKey: 'commercialDetails.officeDetails.area' },
        { label: 'Cabins', value: o.cabins, editKey: 'commercialDetails.officeDetails.cabins' },
        { label: 'Meeting Rooms', value: o.meetingRooms, editKey: 'commercialDetails.officeDetails.meetingRooms' },
        { label: 'Seats', value: o.seats }
      );
    }
  }

  if (raw.propertyType === 'Resort' && raw.resortDetails) {
    const r = raw.resortDetails;
    details.push(
      { label: 'Area', value: `${r.area} ${r.areaUnit}`, editKey: 'resortDetails.area' },
      { label: 'Rooms', value: r.rooms, editKey: 'resortDetails.rooms' }
    );
  }

  return details.filter(d => d.value);
};

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            {isEditing ? (
              <input
                type="text"
                value={editData.propertyTitle}
                onChange={(e) => setEditData({...editData, propertyTitle: e.target.value})}
                className="text-xl font-semibold border-b-2 border-blue-500 focus:outline-none"
              />
            ) : (
              <h2 className="text-xl font-semibold">{property.title}</h2>
            )}
            
            {isEditing ? (
              <input
                type="text"
                value={editData.location}
                onChange={(e) => setEditData({...editData, location: e.target.value})}
                className="text-sm text-gray-500 border-b border-gray-300 focus:outline-none mt-1"
              />
            ) : (
              <p className="text-sm text-gray-500">{property.location}</p>
            )}
          </div>
          
          <div className="flex gap-2">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Save size={18} />
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit2 size={18} />
              </button>
            )}
            <X
              className="cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={onClose}
              size={24}
            />
          </div>
        </div>

        {/* Basic Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
          <div>
            <p className="text-gray-500">Type</p>
            <p className="font-medium">{property.type}</p>
          </div>
          <div>
            <p className="text-gray-500">Price</p>
            {isEditing ? (
              <input
                type="number"
                value={editData.expectedPrice}
                onChange={(e) => setEditData({...editData, expectedPrice: e.target.value})}
                className="font-medium border-b border-gray-300 focus:outline-none w-full"
              />
            ) : (
              <p className="font-medium">{property.price}</p>
            )}
          </div>
          <div>
            <p className="text-gray-500">Status</p>
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
            <p className="text-gray-500">Property Status</p>
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

{/* Property Type Specific Details */}
{/* Property Type Specific Details */}
{getPropertyDetails().length > 0 && (
  <div className="mb-6">
    <h3 className="text-sm font-semibold text-gray-700 mb-3">Property Details</h3>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
      {getPropertyDetails().map((detail, idx) => {
        const fieldKey = detail.editKey;
        
        // Custom render for Parking in edit mode
        if (detail.customRender && detail.label === 'Parking') {
          return (
            <div key={idx} className="col-span-2">
              <p className="text-gray-500 mb-2">{detail.label}</p>
              {isEditing ? (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-600">Covered</label>
                    <input
                      type="number"
                      value={editData['houseDetails.parking.covered'] || 0}
                      onChange={(e) => setEditData({...editData, 'houseDetails.parking.covered': e.target.value})}
                      className="w-full font-medium border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-600">Open</label>
                    <input
                      type="number"
                      value={editData['houseDetails.parking.open'] || 0}
                      onChange={(e) => setEditData({...editData, 'houseDetails.parking.open': e.target.value})}
                      className="w-full font-medium border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <p className="font-medium">{detail.value}</p>
              )}
            </div>
          );
        }
        
        return (
          <div key={idx}>
            <p className="text-gray-500">{detail.label}</p>
            {isEditing && fieldKey ? (
              <input
                type="text"
                value={editData[fieldKey] || ''}
                onChange={(e) => setEditData({...editData, [fieldKey]: e.target.value})}
                className="font-medium border-b border-gray-300 focus:outline-none w-full"
              />
            ) : (
              <p className="font-medium">{detail.value}</p>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}

        {/* Description */}
        <div className="mb-6 text-sm">
          <p className="text-gray-500 mb-2 font-medium">Description</p>
          {isEditing ? (
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({...editData, description: e.target.value})}
              className="w-full border rounded p-2 focus:outline-none focus:border-blue-500"
              rows="3"
            />
          ) : (
            <p className="text-gray-700">
              {property.description || "No description provided"}
            </p>
          )}
        </div>

       {/* Owner Details */}
<div className="mb-6 text-sm">
  <p className="text-gray-500 mb-2 font-medium">Owner Details</p>
  {isEditing ? (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="text-xs text-gray-600">Name</label>
        <input
          type="text"
          value={editData['ownerDetails.name'] || ''}
          onChange={(e) => setEditData({...editData, 'ownerDetails.name': e.target.value})}
          className="w-full font-medium border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label className="text-xs text-gray-600">Email</label>
        <input
          type="email"
          value={editData['ownerDetails.email'] || ''}
          onChange={(e) => setEditData({...editData, 'ownerDetails.email': e.target.value})}
          className="w-full font-medium border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label className="text-xs text-gray-600">Phone</label>
        <input
          type="text"
          value={editData['ownerDetails.phone'] || ''}
          onChange={(e) => setEditData({...editData, 'ownerDetails.phone': e.target.value})}
          className="w-full font-medium border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
  ) : (
    <p className="text-gray-700">
      {property.owner} • {property.email} • {property.phone}
    </p>
  )}
</div>

      {/* Furnishing Items */}
{property.raw?.houseDetails?.furnishingItems && property.raw.houseDetails.furnishingItems.length > 0 && (
  <div className="mb-6 text-sm">
    <p className="text-gray-500 mb-2 font-medium">Furnishing Items</p>
    <div className="flex flex-wrap gap-2">
      {property.raw.houseDetails.furnishingItems.map((item, idx) => (
        <span 
          key={idx}
          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
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
    <div className="flex justify-between items-center mb-2">
      <p className="text-sm text-gray-500 font-semibold">
        Photos ({property.images.length})
      </p>
      {isEditing && (
        <label className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 text-xs">
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
    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
      {property.images.map((img, idx) => {
        const imageUrl = img.startsWith('http') ? img : `${import.meta.env.VITE_API_URL}/${img}`;
        return (
          <div key={idx} className="relative group">
            <img
              src={imageUrl}
              alt={`Property ${idx + 1}`}
              className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 border"
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
      const result = await deletePropertyImage(property.id, img);
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
                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
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
{property.documents && (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2">
      <p className="text-sm text-gray-500 font-semibold">Documents</p>
      {isEditing && (
        <label className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 text-xs">
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
    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
      {property.documents.ownership?.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">
            Ownership Documents:
          </p>
          <div className="space-y-1">
            {property.documents.ownership.map((doc, idx) => {
              const docUrl = doc.startsWith('http') ? doc : `${import.meta.env.VITE_API_URL}/${doc}`;
              return (
                <div key={idx} className="flex items-center justify-between group">
                  <a
                    href={docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <FileText size={14} />
                    Ownership Document {idx + 1}
                    <Download size={12} />
                  </a>
                  {isEditing && (
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this document?')) {
                          console.log('Delete document:', doc);
                          alert('Document deletion - to be implemented with backend API');
                        }
                      }}
                      className="text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity"
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
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    Identity Documents:
                  </p>
                  <div className="space-y-1">
                    {property.documents.identity.map((doc, idx) => (
                      <a
                        key={idx}
                        href={`${import.meta.env.VITE_API_URL}/${doc}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                      >
                        <FileText size={14} />
                        Identity Document {idx + 1}
                        <Download size={12} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timestamps */}
        {property.raw && (
          <div className="text-xs text-gray-400 pt-4 border-t">
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