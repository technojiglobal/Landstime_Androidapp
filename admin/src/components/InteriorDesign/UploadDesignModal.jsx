// //admin/src/components/InteriorDesign/UploadDesignModal.jsx

// import { useState } from "react";
// import { X, Image as ImageIcon } from "lucide-react";
// import Toast from "../UserManagement/Toast";

// export default function UploadDesignModal({ onClose, onUpload }) {
//   const onlyLetters = /^[A-Za-z\s]+$/;
//   const onlyNumbers = /^[0-9]+$/;
//   const phoneRegex = /^[0-9]{10}$/;

//   const [toast, setToast] = useState(null);

//   const [form, setForm] = useState({
//     designName: "",
//     designerName: "",
//     designerPhone: "",
//     area: "",
//     priceFrom: "",
//     priceTo: "",
//     duration: "",
//     location: "",
//     description: "",
//     category: "",
//     images: [],
//   });

//   /* ---------- IMAGE UPLOAD ---------- */
//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     const previews = files.map((file) =>
//       Object.assign(file, {
//         preview: URL.createObjectURL(file),
//       })
//     );

//     setForm((prev) => ({
//       ...prev,
//       images: [...prev.images, ...previews],
//     }));
//   };

//   /* ---------- SUBMIT ---------- */
//   const handleSubmit = () => {
//     if (!form.designName.trim()) {
//       setToast({ message: "Design name is required", type: "error" });
//       return;
//     }

//     if (!onlyLetters.test(form.designName)) {
//       setToast({ message: "Design name must contain only letters", type: "error" });
//       return;
//     }

//     if (!form.designerName.trim()) {
//       setToast({ message: "Designer name is required", type: "error" });
//       return;
//     }

//     if (!onlyLetters.test(form.designerName)) {
//       setToast({ message: "Designer name must contain only letters", type: "error" });
//       return;
//     }

//     if (!phoneRegex.test(form.designerPhone)) {
//       setToast({ message: "Phone number must be exactly 10 digits", type: "error" });
//       return;
//     }

//     if (!onlyNumbers.test(form.area)) {
//       setToast({ message: "Area must contain only numbers", type: "error" });
//       return;
//     }

//     if (!form.category) {
//       setToast({ message: "Please select a category", type: "error" });
//       return;
//     }

//     if (
//       !onlyNumbers.test(form.priceFrom) ||
//       !onlyNumbers.test(form.priceTo)
//     ) {
//       setToast({ message: "Price must contain only numbers", type: "error" });
//       return;
//     }

//     if (Number(form.priceFrom) > Number(form.priceTo)) {
//       setToast({ message: "Price From cannot be greater than Price To", type: "error" });
//       return;
//     }

//     if (!form.duration.trim()) {
//       setToast({ message: "Duration is required", type: "error" });
//       return;
//     }

//     if (!form.location.trim()) {
//       setToast({ message: "Location is required", type: "error" });
//       return;
//     }

//     onUpload({
//       name: form.designName.trim(),
//       designer: form.designerName.trim(),
//       phone: form.designerPhone,
//       area: form.area,
//       category: form.category,
//       price: `${form.priceFrom} - ${form.priceTo}`,
//       duration: form.duration,
//       location: form.location,
//       description: form.description,
//       images: form.images,
//     });
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
//       <div className="bg-white w-full max-w-3xl rounded-xl p-6 relative max-h-[95vh] overflow-y-auto">

//         {/* CLOSE */}
//         <X
//           className="absolute right-4 top-4 cursor-pointer text-gray-500"
//           onClick={onClose}
//         />

//         {/* HEADER */}
//         <h2 className="text-lg font-semibold mb-1">Upload Design</h2>
//         <p className="text-sm text-gray-500 mb-6">
//           Add a new interior design with details and images
//         </p>

//         {/* FORM */}
//         <div className="space-y-5">

//           {/* ROW 1 */}
//           <div className="grid md:grid-cols-2 gap-4">
//             <div>
//               <label className="text-sm font-medium">Design Name</label>
//               <input
//                 className="mt-1 w-full border rounded-lg px-3 py-2"
//                 placeholder="Enter design name"
//                 value={form.designName}
//                 onChange={(e) =>
//                   setForm({ ...form, designName: e.target.value })
//                 }
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium">Designer Name</label>
//               <input
//                 className="mt-1 w-full border rounded-lg px-3 py-2"
//                 placeholder="Designer name"
//                 value={form.designerName}
//                 onChange={(e) =>
//                   setForm({ ...form, designerName: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           {/* ROW 2 */}
//           <div className="grid md:grid-cols-2 gap-4">
//             <div>
//               <label className="text-sm font-medium">Designer Phone</label>
//               <input
//                 className="mt-1 w-full border rounded-lg px-3 py-2"
//                 placeholder="Phone number"
//                 value={form.designerPhone}
//                 onChange={(e) =>
//                   setForm({ ...form, designerPhone: e.target.value })
//                 }
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium">
//                 Area (Length/Sqft)
//               </label>
//               <input
//                 className="mt-1 w-full border rounded-lg px-3 py-2"
//                 placeholder="e.g. 1500 sqft"
//                 value={form.area}
//                 onChange={(e) =>
//                   setForm({ ...form, area: e.target.value })
//                 }
//               />
//             </div>
//           </div>
//           {/* CATEGORY */}
//           <div>
//             <label className="text-sm font-medium">Category / Room Type</label>
//             <select
//               className="mt-1 w-full border rounded-lg px-3 py-2 bg-white"
//               value={form.category}
//               onChange={(e) =>
//                 setForm({ ...form, category: e.target.value })
//               }
//             >
//               <option value="">Select room type</option>
//               <option value="Living Area">Living Area</option>
//               <option value="Bedroom">Bedroom</option>
//               <option value="Bathroom">Bathroom</option>
//               <option value="Kitchen">Kitchen</option>
//               <option value="Workspace">Workspace</option>
//               <option value="Storage">Storage</option>
//             </select>
//           </div>


//           {/* ROW 3 */}
//           <div className="grid md:grid-cols-2 gap-4">
//             <div>
//              <label className="text-sm font-medium">Price From (₹)</label>
//               <input
//                 className="mt-1 w-full border rounded-lg px-3 py-2"
//                 placeholder="Minimum price"
//                 value={form.priceFrom}
//                 onChange={(e) =>
//                   setForm({ ...form, priceFrom: e.target.value })
//                 }
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium">Price To (₹)</label>
//               <input
//                 className="mt-1 w-full border rounded-lg px-3 py-2"
//                 placeholder="Maximum price"
//                 value={form.priceTo}
//                 onChange={(e) =>
//                   setForm({ ...form, priceTo: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           {/* ROW 4 */}
//           <div className="grid md:grid-cols-2 gap-4">
//             <div>
//               <label className="text-sm font-medium">Duration</label>
//               <input
//                 className="mt-1 w-full border rounded-lg px-3 py-2"
//                 placeholder="e.g. 4–6 weeks"
//                 value={form.duration}
//                 onChange={(e) =>
//                   setForm({ ...form, duration: e.target.value })
//                 }
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium">Location</label>
//               <input
//                 className="mt-1 w-full border rounded-lg px-3 py-2"
//                 placeholder="City/Area"
//                 value={form.location}
//                 onChange={(e) =>
//                   setForm({ ...form, location: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           {/* DESCRIPTION */}
//           <div>
//             <label className="text-sm font-medium">Description</label>
//             <textarea
//               className="mt-1 w-full border rounded-lg px-3 py-2 min-h-[90px]"
//               placeholder="Design description"
//               value={form.description}
//               onChange={(e) =>
//                 setForm({ ...form, description: e.target.value })
//               }
//             />
//           </div>

//           {/* IMAGE UPLOAD */}
//           <div>
//             <label className="text-sm font-medium">Design Images</label>

//             <label className="mt-2 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 cursor-pointer">
//               <ImageIcon className="mb-2" />
//               <span>Click to upload images</span>
//               <span className="text-xs">PNG, JPG up to 5MB each</span>

//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 hidden
//                 onChange={handleImageUpload}
//               />
//             </label>

//             {/* IMAGE PREVIEW */}
//             {form.images.length > 0 && (
//               <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
//                 {form.images.map((img, i) => (
//                   <img
//                     key={i}
//                     src={img.preview}
//                     alt="preview"
//                     className="h-20 w-full object-cover rounded-lg"
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ACTIONS */}
//         <div className="flex justify-end gap-3 mt-8">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border rounded-lg"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//           >
//             Upload Design
//           </button>
//         </div>
//         {toast && (
//           <Toast
//             message={toast.message}
//             type={toast.type}
//             onClose={() => setToast(null)}
//           />
//         )}



//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import Toast from "../UserManagement/Toast";

export default function UploadDesignModal({ onClose, onUpload }) {
  const onlyLetters = /^[A-Za-z\s]+$/;
  const onlyNumbers = /^[0-9]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

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

  // ✅ REAL-TIME VALIDATION
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "designName":
        if (!value.trim()) {
          error = "Design name is required";
        } else if (!onlyLetters.test(value)) {
          error = "Only letters and spaces allowed";
        }
        break;

      case "designerName":
        if (!value.trim()) {
          error = "Designer name is required";
        } else if (!onlyLetters.test(value)) {
          error = "Only letters and spaces allowed";
        }
        break;

      case "designerPhone":
        if (!value) {
          error = "Phone number is required";
        } else if (!phoneRegex.test(value)) {
          error = "Must be exactly 10 digits";
        }
        break;

      case "area":
        if (!value) {
          error = "Area is required";
        } else if (!onlyNumbers.test(value)) {
          error = "Only numbers allowed";
        }
        break;

      case "priceFrom":
      case "priceTo":
        if (!value) {
          error = "Price is required";
        } else if (!onlyNumbers.test(value)) {
          error = "Only numbers allowed";
        }
        break;

      case "duration":
        if (!value.trim()) {
          error = "Duration is required";
        } else if (value.trim().length < 3) {
          error = "At least 3 characters required";
        }
        break;

      case "location":
        if (!value.trim()) {
          error = "Location is required";
        } else if (value.trim().length < 2) {
          error = "At least 2 characters required";
        }
        break;

      case "description":
        if (value.trim() && value.trim().length < 50) {
          error = "Minimum 50 characters required";
        } else if (value.trim().length > 500) {
          error = "Maximum 500 characters allowed";
        }
        break;

      case "category":
        if (!value) {
          error = "Please select a category";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  // ✅ HANDLE INPUT CHANGE WITH VALIDATION
  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // ✅ IMAGE UPLOAD
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file size (5MB max)
    const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      setToast({ message: "Each image must be less than 5MB", type: "error" });
      return;
    }

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

  // ✅ REMOVE IMAGE
  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ✅ VALIDATE ALL FIELDS
  const validateAll = () => {
    const fields = [
      "designName",
      "designerName",
      "designerPhone",
      "area",
      "category",
      "priceFrom",
      "priceTo",
      "duration",
      "location",
      "description"
    ];

    let isValid = true;
    fields.forEach((field) => {
      if (!validateField(field, form[field])) {
        isValid = false;
      }
    });

    return isValid;
  };

  // ✅ SUBMIT WITH VALIDATION
  const handleSubmit = () => {
    // Validate all fields
    if (!validateAll()) {
      setToast({ message: "Please fix all errors before submitting", type: "error" });
      return;
    }

    // Additional price range validation
    if (Number(form.priceFrom) >= Number(form.priceTo)) {
      setToast({ message: "Price From must be less than Price To", type: "error" });
      setErrors((prev) => ({ ...prev, priceTo: "Must be greater than Price From" }));
      return;
    }

    // Check if at least one image is uploaded
    if (form.images.length === 0) {
      setToast({ message: "Please upload at least one image", type: "error" });
      return;
    }

    onUpload({
      name: form.designName.trim(),
      designer: form.designerName.trim(),
      phone: form.designerPhone.trim(),
      area: form.area.trim(),
      category: form.category,
      price: `₹${form.priceFrom} - ₹${form.priceTo}`,
      duration: form.duration.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      images: form.images,
    });
  };

  // ✅ GET INPUT CLASS BASED ON ERROR STATE
  const getInputClass = (fieldName) => {
    const baseClass = "mt-1 w-full border rounded-lg px-3 py-2 transition-all";
    if (errors[fieldName]) {
      return `${baseClass} border-red-500 focus:ring-red-500 focus:border-red-500`;
    }
    if (form[fieldName] && !errors[fieldName]) {
      return `${baseClass} border-green-500 focus:ring-green-500 focus:border-green-500`;
    }
    return `${baseClass} focus:ring-2 focus:ring-blue-500 focus:border-transparent`;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
      <div className="bg-white w-full max-w-3xl rounded-xl p-6 relative max-h-[95vh] overflow-y-auto">
        {/* CLOSE */}
        <X
          className="absolute right-4 top-4 cursor-pointer text-gray-500 hover:text-gray-700"
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
              <label className="text-sm font-medium">
                Design Name <span className="text-red-500">*</span>
              </label>
              <input
                className={getInputClass("designName")}
                placeholder="Enter design name"
                value={form.designName}
                onChange={(e) => handleChange("designName", e.target.value)}
              />
              {errors.designName && (
                <p className="text-red-500 text-xs mt-1">{errors.designName}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">
                Designer Name <span className="text-red-500">*</span>
              </label>
              <input
                className={getInputClass("designerName")}
                placeholder="Designer name"
                value={form.designerName}
                onChange={(e) => handleChange("designerName", e.target.value)}
              />
              {errors.designerName && (
                <p className="text-red-500 text-xs mt-1">{errors.designerName}</p>
              )}
            </div>
          </div>

          {/* ROW 2 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Designer Phone <span className="text-red-500">*</span>
              </label>
              <input
                className={getInputClass("designerPhone")}
                placeholder="10 digit phone number"
                maxLength={10}
                value={form.designerPhone}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  handleChange("designerPhone", value);
                }}
              />
              {errors.designerPhone && (
                <p className="text-red-500 text-xs mt-1">{errors.designerPhone}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {form.designerPhone.length}/10 digits
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">
                Area (Sqft) <span className="text-red-500">*</span>
              </label>
              <input
                className={getInputClass("area")}
                placeholder="e.g. 1500"
                value={form.area}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  handleChange("area", value);
                }}
              />
              {errors.area && (
                <p className="text-red-500 text-xs mt-1">{errors.area}</p>
              )}
            </div>
          </div>

          {/* CATEGORY */}
          <div>
            <label className="text-sm font-medium">
              Category / Room Type <span className="text-red-500">*</span>
            </label>
            <select
              className={getInputClass("category")}
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              <option value="">Select room type</option>
              <option value="Living Area">Living Area</option>
              <option value="Bedroom">Bedroom</option>
              <option value="Bathroom">Bathroom</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Workspace">Workspace</option>
              <option value="Storage">Storage</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          {/* ROW 3 - PRICE */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Price From (₹) <span className="text-red-500">*</span>
              </label>
              <input
                className={getInputClass("priceFrom")}
                placeholder="Minimum price"
                value={form.priceFrom}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  handleChange("priceFrom", value);
                }}
              />
              {errors.priceFrom && (
                <p className="text-red-500 text-xs mt-1">{errors.priceFrom}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">
                Price To (₹) <span className="text-red-500">*</span>
              </label>
              <input
                className={getInputClass("priceTo")}
                placeholder="Maximum price"
                value={form.priceTo}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  handleChange("priceTo", value);
                }}
              />
              {errors.priceTo && (
                <p className="text-red-500 text-xs mt-1">{errors.priceTo}</p>
              )}
            </div>
          </div>

          {/* ROW 4 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Duration <span className="text-red-500">*</span>
              </label>
              <input
                className={getInputClass("duration")}
                placeholder="e.g. 4-6 weeks"
                value={form.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
              />
              {errors.duration && (
                <p className="text-red-500 text-xs mt-1">{errors.duration}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                className={getInputClass("location")}
                placeholder="City/Area"
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">{errors.location}</p>
              )}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium">
              Description <span className="text-gray-500">(50-500 characters)</span>
            </label>
            <textarea
              className={getInputClass("description")}
              placeholder="Design description (minimum 50 characters)"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {form.description.length}/500 characters
              {form.description.length > 0 && form.description.length < 50 && 
                ` (${50 - form.description.length} more needed)`
              }
            </p>
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="text-sm font-medium">
              Design Images <span className="text-red-500">*</span>
            </label>

            <label className="mt-2 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-blue-500 hover:text-blue-500 transition-all">
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
              <div key={i} className="relative group">
                <img
                  src={img.preview}
                  alt={`preview-${i}`}
                  className="h-20 w-full object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        {form.images.length === 0 && (
          <p className="text-xs text-gray-500 mt-2">No images uploaded yet</p>
        )}
      </div>
    </div>

    {/* ACTIONS */}
    <div className="flex justify-end gap-3 mt-8">
      <button
        onClick={onClose}
        className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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