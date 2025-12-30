

//admin/src/components/UserManagement/Toast.jsx

import { Check } from "lucide-react";
import { useEffect } from "react";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 bg-white shadow-lg rounded-lg px-4 py-3 flex items-center gap-3">
      <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
        <Check size={14} className="text-white" />
      </div>
      <span className="text-sm text-black font-medium">{message}</span>
    </div>
  );
}
