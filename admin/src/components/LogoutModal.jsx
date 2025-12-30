import React from "react";
import { LogOut, X } from "lucide-react";

const LogoutModal = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md mx-auto p-5 sm:p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <LogOut className="text-red-600" size={20} />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 leading-tight">
                Confirm Logout
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition flex-shrink-0 -mt-1"
              disabled={loading}
            >
              <X size={22} />
            </button>
          </div>

          {/* Content */}
          <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 leading-relaxed">
            Are you sure you want to logout? You will need to sign in again to access the admin panel.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full sm:flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="w-full sm:flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base order-1 sm:order-2"
            >
              {loading ? "Logging out..." : "Yes, Logout"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutModal;