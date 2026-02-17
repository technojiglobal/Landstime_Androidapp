// admin/src/components/UserManagement/Toast.jsx

import { Check, XCircle } from "lucide-react";
import { useEffect } from "react";

export default function Toast({ message, onClose, type = "success" }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  const isError = type === "error";

  return (
    <div
      className={`fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-[100] shadow-lg rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 max-w-[calc(100vw-24px)] sm:max-w-sm animate-fade-in ${
        isError ? "bg-red-50 border border-red-100" : "bg-white border border-gray-100"
      }`}
    >
      {/* ICON */}
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
          isError ? "bg-red-600" : "bg-black"
        }`}
      >
        {isError ? (
          <XCircle size={13} className="text-white" />
        ) : (
          <Check size={13} className="text-white" />
        )}
      </div>

      {/* MESSAGE */}
      <span
        className={`text-xs sm:text-sm font-medium leading-snug ${
          isError ? "text-red-700" : "text-black"
        }`}
      >
        {message}
      </span>

      {/* CLOSE BUTTON */}
      <button
        onClick={onClose}
        className="ml-auto pl-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer flex-shrink-0"
        aria-label="Close"
      >
        <XCircle size={14} />
      </button>
    </div>
  );
}