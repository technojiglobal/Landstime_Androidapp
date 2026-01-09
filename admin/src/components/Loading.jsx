import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading({ 
  message = "Loading properties...", 
  size = "default",
  fullScreen = false 
}) {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12"
  };

  const textSizeClasses = {
    small: "text-sm",
    default: "text-base",
    large: "text-lg"
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin`} />
          <p className={`${textSizeClasses[size]} text-gray-700 font-medium animate-pulse`}>
            {message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin`} />
      <p className={`${textSizeClasses[size]} text-gray-700 font-medium animate-pulse`}>
        {message}
      </p>
    </div>
  );
}