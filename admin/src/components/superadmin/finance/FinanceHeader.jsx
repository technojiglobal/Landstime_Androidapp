// components/superadmin/finance/FinanceHeader.jsx
import { Calendar, Download, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const FinanceHeader = () => {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState("Monthly");
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const ranges = ["Daily", "Weekly", "Monthly", "Yearly"];

  return (
    <div className="flex justify-between items-start">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          💳 My Finance
        </h1>
        <p className="text-gray-400 italic mt-1">
          "Every rupee should count here"
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 items-center">
        {/* Date Range Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 bg-[#1E293B] text-white px-4 py-2 rounded-xl border border-white/10 hover:bg-[#263244] transition"
          >
            <Calendar size={16} />
            {range}
            <ChevronDown size={14} className="opacity-70" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-[#0B1220] border border-white/10 rounded-xl shadow-lg z-50 overflow-hidden">
              {ranges.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setRange(item);
                    setOpen(false);
                    // 🔔 Trigger API / filter logic here if needed
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition ${
                    range === item
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Export */}
        <button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-xl font-semibold transition">
          <Download size={16} />
          Export
        </button>
      </div>
    </div>
  );
};

export default FinanceHeader;
