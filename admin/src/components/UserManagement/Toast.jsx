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
      className={`fixed bottom-6 right-6 shadow-lg rounded-lg px-4 py-3 flex items-center gap-3
      ${isError ? "bg-red-50" : "bg-white"}`}
    >
      {/* ICON */}
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center
        ${isError ? "bg-red-600" : "bg-black"}`}
      >
        {isError ? (
          <XCircle size={14} className="text-white" />
        ) : (
          <Check size={14} className="text-white" />
        )}
      </div>

      {/* MESSAGE */}
      <span
        className={`text-sm font-medium
        ${isError ? "text-red-700" : "text-black"}`}
      >
        {message}
      </span>
    </div>
  );
}
