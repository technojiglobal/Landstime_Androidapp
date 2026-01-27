import React from 'react';
import { X, Info } from 'lucide-react';

const PhotoUploadGuidelinesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const guidelines = [
    {
      step: 1,
      title: 'Install',
      highlightedText: 'Go Street',
      titleEnd: 'App',
      description: 'Search for "Go Street" in playstore and install the app',
    },
    {
      step: 2,
      title: 'Capture Panorama Photos',
      description: 'Open the app, stand at the center of the room, and follow the on-screen guide to capture around 30 photos while slowly rotating to cover all angles.',
    },
    {
      step: 3,
      title: 'Generate JPEG File',
      description: 'After capturing, the app will automatically stitch the 30 photos and create one panorama JPEG. Save this JPEG to you gallery.',
    },
    {
      step: 4,
      title: 'Upload Here',
      description: 'Return to this screen and upload your panorama JPEG. We\'ll automatically enable the "360°" view.',
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Photo Upload Guidelines
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close modal"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {guidelines.map((item) => (
              <div key={item.step} className="flex gap-4">
                {/* Step Number Circle */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-green-600">
                    {item.step}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 pt-0.5">
                  <h3 className="font-semibold text-gray-900 mb-1.5 text-[15px]">
                    {item.highlightedText ? (
                      <>
                        {item.title}{' '}
                        <span className="text-green-600">{item.highlightedText}</span>
                        {item.titleEnd && ` ${item.titleEnd}`}
                      </>
                    ) : (
                      item.title
                    )}
                  </h3>
                  <p className="text-[13px] text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Pro Tip Box */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Info size={18} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 text-sm mb-1.5">
                    Pro Tip:
                  </h4>
                  <p className="text-[13px] text-blue-800 leading-relaxed">
                    Take photos during daytime with good lighting for best results.
                    Capture 5-8 photos covering all rooms.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Button */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <button
              onClick={onClose}
              className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Got It!
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PhotoUploadGuidelinesModal;