import React from 'react';
import { MapPin } from 'lucide-react';

const LocationSection = ({ formData, updateField }) => (
  <div>
    <label className="block text-sm font-medium mb-2">Location</label>
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        placeholder="Enter Property Location"
        value={formData.location || ''}
        onChange={(e) => updateField('location', e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </div>
  </div>
);

export default LocationSection;