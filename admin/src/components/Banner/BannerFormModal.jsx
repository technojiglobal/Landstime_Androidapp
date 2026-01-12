import { useState } from "react";
import { X, Image as ImageIcon, Eye, EyeOff } from "lucide-react";

export default function BannerFormModal({ banner, onClose, onSave }) {
  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState({
    id: banner?._id,
    heading: banner?.title?.en || "",
    description: banner?.subtitle?.en || "",
    ctaText: banner?.ctaText || "",
    ctaLink: banner?.ctaLink || "",
    image: banner?.image || "",
    active: banner?.isActive ?? true, // ✅ Fixed: use isActive from backend
  });

  /* ---------- IMAGE HANDLER ---------- */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setForm({ ...form, image: event.target.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[95%] md:w-[600px] rounded-xl p-6 relative max-h-[90vh] overflow-y-auto">
        <X
          className="absolute right-4 top-4 cursor-pointer hover:text-red-500 transition"
          onClick={onClose}
        />

        <h2 className="text-lg font-semibold">
          {form.id ? "Edit Banner" : "Add New Banner"}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Create a new homepage banner
        </p>

        {/* IMAGE UPLOAD */}
        <label className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 cursor-pointer mb-4 hover:border-blue-400 transition">
          {form.image ? (
            <img
              src={form.image}
              alt="preview"
              className="h-32 rounded-lg object-cover"
            />
          ) : (
            <>
              <ImageIcon className="mb-2" size={32} />
              <span>Click to upload image</span>
              <span className="text-xs">
                PNG, JPG, GIF up to 10MB
              </span>
            </>
          )}

          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </label>

        {/* FORM FIELDS */}
        <input
          className="w-full border rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter banner heading"
          value={form.heading}
          onChange={(e) =>
            setForm({ ...form, heading: e.target.value })
          }
        />

        <textarea
          className="w-full border rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter banner description"
          rows={3}
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {/* CTA FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="CTA Button Text (optional)"
            value={form.ctaText}
            onChange={(e) =>
              setForm({ ...form, ctaText: e.target.value })
            }
          />
          <input
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="CTA Link (optional)"
            value={form.ctaLink}
            onChange={(e) =>
              setForm({ ...form, ctaLink: e.target.value })
            }
          />
        </div>

        {/* ✅ ACTIVE/INACTIVE TOGGLE */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm mb-1">Banner Status</h3>
              <p className="text-xs text-gray-500">
                {form.active ? 'Banner is visible on mobile app' : 'Banner is hidden from mobile app'}
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => setForm({ ...form, active: !form.active })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                form.active
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {form.active ? (
                <>
                  <Eye size={16} />
                  <span>Active</span>
                </>
              ) : (
                <>
                  <EyeOff size={16} />
                  <span>Inactive</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form, imageFile)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {form.id ? "Update Banner" : "Create Banner"}
          </button>
        </div>
      </div>
    </div>
  );
}