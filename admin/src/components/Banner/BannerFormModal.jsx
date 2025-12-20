import { useState } from "react";
import { X, Image as ImageIcon } from "lucide-react";

export default function BannerFormModal({ banner, onClose, onSave }) {
  const [form, setForm] = useState({
    id: banner?.id,
    heading: banner?.heading || "",
    description: banner?.description || "",
    ctaText: banner?.ctaText || "",
    ctaLink: banner?.ctaLink || "",
    image: banner?.image || "",
    active: banner?.active ?? true,
  });

  /* ---------- IMAGE HANDLER ---------- */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setForm({ ...form, image: previewUrl });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[95%] md:w-[600px] rounded-xl p-6 relative">
        <X
          className="absolute right-4 top-4 cursor-pointer"
          onClick={onClose}
        />

        <h2 className="text-lg font-semibold">
          {form.id ? "Edit Banner" : "Add New Banner"}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Create a new homepage banner
        </p>

        {/* IMAGE UPLOAD */}
        <label className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 cursor-pointer mb-4">
          {form.image ? (
            <img
              src={form.image}
              alt="preview"
              className="h-32 rounded-lg object-cover"
            />
          ) : (
            <>
              <ImageIcon className="mb-2" />
              <span>Click to upload image or video</span>
              <span className="text-xs">
                PNG, JPG, GIF, MP4 up to 10MB
              </span>
            </>
          )}

          <input
            type="file"
            accept="image/*,video/*"
            hidden
            onChange={handleImageChange}
          />
        </label>

        {/* FORM FIELDS */}
        <input
          className="w-full border rounded-lg px-3 py-2 mb-3"
          placeholder="Enter banner heading"
          value={form.heading}
          onChange={(e) =>
            setForm({ ...form, heading: e.target.value })
          }
        />

        <textarea
          className="w-full border rounded-lg px-3 py-2 mb-3"
          placeholder="Enter banner description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="CTA Button Text"
            value={form.ctaText}
            onChange={(e) =>
              setForm({ ...form, ctaText: e.target.value })
            }
          />
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="CTA Link"
            value={form.ctaLink}
            onChange={(e) =>
              setForm({ ...form, ctaLink: e.target.value })
            }
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            {form.id ? "Update Banner" : "Create Banner"}
          </button>
        </div>
      </div>
    </div>
  );
}
