// admin/src/components/properties/fields/DocumentUpload.jsx
import React, { useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';

const DocumentUpload = ({ 
  label, 
  documents = [], 
  onChange, 
  maxDocuments = 10, 
  required = false,
  description 
}) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (documents.length + files.length > maxDocuments) {
      alert(`Maximum ${maxDocuments} documents allowed`);
      return;
    }

    // Add new files to existing documents
    onChange([...documents, ...files]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index) => {
    const newDocuments = documents.filter((_, i) => i !== index);
    onChange(newDocuments);
  };

  const getFileName = (file) => {
    if (typeof file === 'string') {
      return file.split('/').pop();
    }
    return file.name;
  };

  return (
    <div className="space-y-3">
      {label && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      )}

      {/* Upload Button */}
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/jpg,image/webp,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={documents.length >= maxDocuments}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Upload size={18} />
          Add Documents
        </button>
        <span className="text-sm text-gray-500">
          {documents.length}/{maxDocuments} documents
        </span>
      </div>

      {/* Document List */}
      {documents.length > 0 && (
        <div className="space-y-2 mt-4">
          {documents.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {getFileName(file)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {typeof file === 'string' ? 'Uploaded' : `${(file.size / 1024).toFixed(2)} KB`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="p-1 text-red-500 hover:bg-red-50 rounded transition"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {required && documents.length === 0 && (
        <p className="text-sm text-red-500">At least one document is required</p>
      )}
    </div>
  );
};

export default DocumentUpload;