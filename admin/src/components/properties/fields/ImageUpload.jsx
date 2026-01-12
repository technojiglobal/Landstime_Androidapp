

import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

const ImageUpload = ({ images = [], onChange, maxImages = 10, label }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    onChange([...images, ...newImages].slice(0, maxImages));
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-3">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={img.preview || img}
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
      >
        <Upload className="mx-auto text-gray-400 mb-2" size={40} />
        <p className="text-gray-600 mb-1">Add Photos or Videos</p>
        <p className="text-xs text-gray-500">
          {images.length > 0 
            ? `${images.length} of ${maxImages} photos uploaded`
            : `No minimum or maximum of ${maxImages} photos`
          }
        </p>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;