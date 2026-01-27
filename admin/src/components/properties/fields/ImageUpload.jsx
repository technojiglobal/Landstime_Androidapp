

// import React, { useRef } from 'react';
// import { Upload, X } from 'lucide-react';

// const ImageUpload = ({ images = [], onChange, maxImages = 10, label }) => {
//   const fileInputRef = useRef(null);

//   const handleFileSelect = (e) => {
//     const files = Array.from(e.target.files);
//     const newImages = files.map(file => ({
//       file,
//       preview: URL.createObjectURL(file)
//     }));
//     onChange([...images, ...newImages].slice(0, maxImages));
//   };

//   const removeImage = (index) => {
//     const newImages = images.filter((_, i) => i !== index);
//     onChange(newImages);
//   };

//   return (
//     <div>
//       {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      
//       {images.length > 0 && (
//         <div className="grid grid-cols-4 gap-3 mb-3">
//           {images.map((img, index) => (
//             <div key={index} className="relative group">
//               <img
//                 src={img.preview || img}
//                 alt={`Upload ${index + 1}`}
//                 className="w-full h-24 object-cover rounded-lg border"
//               />
//               <button
//                 type="button"
//                 onClick={() => removeImage(index)}
//                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       <div
//         onClick={() => fileInputRef.current?.click()}
//         className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
//       >
//         <Upload className="mx-auto text-gray-400 mb-2" size={40} />
//         <p className="text-gray-600 mb-1">Add Photos or Videos</p>
//         <p className="text-xs text-gray-500">
//           {images.length > 0 
//             ? `${images.length} of ${maxImages} photos uploaded`
//             : `No minimum or maximum of ${maxImages} photos`
//           }
//         </p>
//       </div>
      
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*,video/*"
//         multiple
//         onChange={handleFileSelect}
//         className="hidden"
//       />
//     </div>
//   );
// };

// export default ImageUpload;
// admin/src/components/properties/fields/ImageUpload.jsx
import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { toast } from "react-toastify";

const ImageUpload = ({ label, images = [], onChange, maxImages = 20, required = false }) => {
  const fileInputRef = useRef(null);
   
const [showGuidelines, setShowGuidelines] = useState(false); // Add this
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Add new files to existing images
    onChange([...images, ...files]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const getImagePreview = (file) => {
    if (typeof file === 'string') {
      return file; // Already a URL
    }
    return URL.createObjectURL(file);
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Upload Button */}
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/jpg,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={images.length >= maxImages}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Upload size={18} />
          Add Photos
        </button>
        <span className="text-sm text-gray-500">
          {images.length}/{maxImages} images
        </span>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mt-4">
          {images.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={getImagePreview(file)}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {required && images.length === 0 && (
        <p className="text-sm text-red-500">At least one image is required</p>
      )}
    </div>
  );
};

export default ImageUpload;