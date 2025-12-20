import { X, Image, FileText } from "lucide-react";

export default function PropertyModal({ property, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[600px] p-6 relative">
        <X
          className="absolute right-4 top-4 cursor-pointer"
          onClick={onClose}
        />

        <h2 className="text-xl font-semibold">{property.title}</h2>
        <p className="text-sm text-gray-500">{property.location}</p>

        <div className="grid grid-cols-2 gap-6 mt-6 text-sm">
          <div>
            <p className="text-gray-500">Type</p>
            <p className="font-medium">{property.type}</p>
          </div>
          <div>
            <p className="text-gray-500">Price</p>
            <p className="font-medium">{property.price}</p>
          </div>
          <div>
            <p className="text-gray-500">Area</p>
            <p className="font-medium">{property.area}</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
              {property.status}
            </span>
          </div>
        </div>

        <div className="mt-6 text-sm">
          <p className="text-gray-500">Description</p>
          <p>{property.description}</p>
        </div>

        <div className="mt-6 text-sm">
          <p className="text-gray-500">Owner Details</p>
          <p>
            {property.owner} • {property.email} • {property.phone}
          </p>
        </div>

        <div className="flex gap-4 mt-6">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg">
            <Image size={16} /> Photos (2)
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg">
            <FileText size={16} /> Documents (1)
          </button>
        </div>
      </div>
    </div>
  );
}
