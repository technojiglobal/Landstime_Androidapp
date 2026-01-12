//admin/src/components/InteriorDesign/UploadDesignModal.jsx

import { useState } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import Toast from "../UserManagement/Toast";

export default function UploadDesignModal({ onClose, onUpload }) {
  const onlyLetters = /^[A-Za-z\s]+$/;
  const onlyNumbers = /^[0-9]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    designName: "",
    designerName: "",
    designerPhone: "",
    area: "",
    priceFrom: "",
    priceTo: "",
    duration: "",
    location: "",
    description: "",
    category: "",
    images: [],
  });

  /* ---------- IMAGE UPLOAD ---------- */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...previews],
    }));
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = () => {
    if (!form.designName.trim()) {
      setToast({ message: "Design name is required", type: "error" });
      return;
    }

    if (!onlyLetters.test(form.designName)) {
      setToast({ message: "Design name must contain only letters", type: "error" });
      return;
    }

    if (!form.designerName.trim()) {
      setToast({ message: "Designer name is required", type: "error" });
      return;
    }

    if (!onlyLetters.test(form.designerName)) {
      setToast({ message: "Designer name must contain only letters", type: "error" });
      return;
    }

    if (!phoneRegex.test(form.designerPhone)) {
      setToast({ message: "Phone number must be exactly 10 digits", type: "error" });
      return;
    }

    if (!onlyNumbers.test(form.area)) {
      setToast({ message: "Area must contain only numbers", type: "error" });
      return;
    }

    if (!form.category) {
      setToast({ message: "Please select a category", type: "error" });
      return;
    }

    if (
      !onlyNumbers.test(form.priceFrom) ||
      !onlyNumbers.test(form.priceTo)
    ) {
      setToast({ message: "Price must contain only numbers", type: "error" });
      return;
    }

    if (Number(form.priceFrom) > Number(form.priceTo)) {
      setToast({ message: "Price From cannot be greater than Price To", type: "error" });
      return;
    }

    if (!form.duration.trim()) {
      setToast({ message: "Duration is required", type: "error" });
      return;
    }

    if (!form.location.trim()) {
      setToast({ message: "Location is required", type: "error" });
      return;
    }

    onUpload({
      name: form.designName.trim(),
      designer: form.designerName.trim(),
      phone: form.designerPhone,
      area: form.area,
      category: form.category,
      price: `${form.priceFrom} - ${form.priceTo}`,
      duration: form.duration,
      location: form.location,
      description: form.description,
      images: form.images,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
      <div className="bg-white w-full max-w-3xl rounded-xl p-6 relative max-h-[95vh] overflow-y-auto">

        {/* CLOSE */}
        <X
          className="absolute right-4 top-4 cursor-pointer text-gray-500"
          onClick={onClose}
        />

        {/* HEADER */}
        <h2 className="text-lg font-semibold mb-1">Upload Design</h2>
        <p className="text-sm text-gray-500 mb-6">
          Add a new interior design with details and images
        </p>

        {/* FORM */}
        <div className="space-y-5">

          {/* ROW 1 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Design Name</label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2"
                placeholder="Enter design name"
                value={form.designName}
                onChange={(e) =>
                  setForm({ ...form, designName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Designer Name</label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2"
                placeholder="Designer name"
                value={form.designerName}
                onChange={(e) =>
                  setForm({ ...form, designerName: e.target.value })
                }
              />
            </div>
          </div>

          {/* ROW 2 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Designer Phone</label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2"
                placeholder="Phone number"
                value={form.designerPhone}
                onChange={(e) =>
                  setForm({ ...form, designerPhone: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Area (Length/Sqft)
              </label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2"
                placeholder="e.g. 1500 sqft"
                value={form.area}
                onChange={(e) =>
                  setForm({ ...form, area: e.target.value })
                }
              />
            </div>
          </div>
          {/* CATEGORY */}
          <div>
            <label className="text-sm font-medium">Category / Room Type</label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 bg-white"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              <option value="">Select room type</option>
              <option value="Living Area">Living Area</option>
              <option value="Bedroom">Bedroom</option>
              <option value="Bathroom">Bathroom</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Workspace">Workspace</option>
              <option value="Storage">Storage</option>
            </select>
          </div>


          {/* ROW 3 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Price From ($)</label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2"
                placeholder="Minimum price"
                value={form.priceFrom}
                onChange={(e) =>
                  setForm({ ...form, priceFrom: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Price To ($)</label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2"
                placeholder="Maximum price"
                value={form.priceTo}
                onChange={(e) =>
                  setForm({ ...form, priceTo: e.target.value })
                }
              />
            </div>
          </div>

          {/* ROW 4 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Duration</label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2"
                placeholder="e.g. 4–6 weeks"
                value={form.duration}
                onChange={(e) =>
                  setForm({ ...form, duration: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Location</label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2"
                placeholder="City/Area"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="mt-1 w-full border rounded-lg px-3 py-2 min-h-[90px]"
              placeholder="Design description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="text-sm font-medium">Design Images</label>

            <label className="mt-2 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 cursor-pointer">
              <ImageIcon className="mb-2" />
              <span>Click to upload images</span>
              <span className="text-xs">PNG, JPG up to 5MB each</span>

              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleImageUpload}
              />
            </label>

            {/* IMAGE PREVIEW */}
            {form.images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                {form.images.map((img, i) => (
                  <img
                    key={i}
                    src={img.preview}
                    alt="preview"
                    className="h-20 w-full object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Upload Design
          </button>
        </div>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}



      </div>
    </div>
  );
}
