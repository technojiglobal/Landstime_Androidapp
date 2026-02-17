
// //admin/src/components/InteriorDesign/UploadDesignModal.jsx
// import { useState } from "react";
// import { X, Image as ImageIcon } from "lucide-react";
// import Toast from "../UserManagement/Toast";

// export default function UploadDesignModal({ onClose, onUpload }) {
//   const onlyLetters = /^[A-Za-z\s]+$/;
//   const onlyNumbers = /^[0-9]+$/;
//   const phoneRegex = /^[0-9]{10}$/;

//   const [toast, setToast] = useState(null);
//   const [errors, setErrors] = useState({});

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

//   // ✅ REAL-TIME VALIDATION
//   const validateField = (name, value) => {
//     let error = "";

//     switch (name) {
//       case "designName":
//         if (!value.trim()) {
//           error = "Design name is required";
//         } else if (!onlyLetters.test(value)) {
//           error = "Only letters and spaces allowed";
//         }
//         break;

//       case "designerName":
//         if (!value.trim()) {
//           error = "Designer name is required";
//         } else if (!onlyLetters.test(value)) {
//           error = "Only letters and spaces allowed";
//         }
//         break;

//       case "designerPhone":
//         if (!value) {
//           error = "Phone number is required";
//         } else if (!phoneRegex.test(value)) {
//           error = "Must be exactly 10 digits";
//         }
//         break;

//       case "area":
//         if (!value) {
//           error = "Area is required";
//         } else if (!onlyNumbers.test(value)) {
//           error = "Only numbers allowed";
//         }
//         break;

//       case "priceFrom":
//       case "priceTo":
//         if (!value) {
//           error = "Price is required";
//         } else if (!onlyNumbers.test(value)) {
//           error = "Only numbers allowed";
//         }
//         break;

//       case "duration":
//         if (!value.trim()) {
//           error = "Duration is required";
//         } else if (value.trim().length < 3) {
//           error = "At least 3 characters required";
//         }
//         break;

//       case "location":
//         if (!value.trim()) {
//           error = "Location is required";
//         } else if (value.trim().length < 2) {
//           error = "At least 2 characters required";
//         }
//         break;

//       case "description":
//         if (value.trim() && value.trim().length < 50) {
//           error = "Minimum 50 characters required";
//         } else if (value.trim().length > 500) {
//           error = "Maximum 500 characters allowed";
//         }
//         break;

//       case "category":
//         if (!value) {
//           error = "Please select a category";
//         }
//         break;
//     }

//     setErrors((prev) => ({ ...prev, [name]: error }));
//     return error === "";
//   };

//   // ✅ HANDLE INPUT CHANGE WITH VALIDATION
//   const handleChange = (name, value) => {
//     setForm((prev) => ({ ...prev, [name]: value }));
//     validateField(name, value);
//   };

//   // ✅ IMAGE UPLOAD
//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
    
//     // Validate file size (5MB max)
//     const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);
//     if (invalidFiles.length > 0) {
//       setToast({ message: "Each image must be less than 5MB", type: "error" });
//       return;
//     }

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

//   // ✅ REMOVE IMAGE
//   const removeImage = (index) => {
//     setForm((prev) => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index),
//     }));
//   };

//   // ✅ VALIDATE ALL FIELDS
//   const validateAll = () => {
//     const fields = [
//       "designName",
//       "designerName",
//       "designerPhone",
//       "area",
//       "category",
//       "priceFrom",
//       "priceTo",
//       "duration",
//       "location",
//       "description"
//     ];

//     let isValid = true;
//     fields.forEach((field) => {
//       if (!validateField(field, form[field])) {
//         isValid = false;
//       }
//     });

//     return isValid;
//   };

//   // ✅ SUBMIT WITH VALIDATION
//   const handleSubmit = () => {
//     // Validate all fields
//     if (!validateAll()) {
//       setToast({ message: "Please fix all errors before submitting", type: "error" });
//       return;
//     }

//     // Additional price range validation
//     if (Number(form.priceFrom) >= Number(form.priceTo)) {
//       setToast({ message: "Price From must be less than Price To", type: "error" });
//       setErrors((prev) => ({ ...prev, priceTo: "Must be greater than Price From" }));
//       return;
//     }

//     // Check if at least one image is uploaded
//     if (form.images.length === 0) {
//       setToast({ message: "Please upload at least one image", type: "error" });
//       return;
//     }

//     onUpload({
//       name: form.designName.trim(),
//       designer: form.designerName.trim(),
//       phone: form.designerPhone.trim(),
//       area: form.area.trim(),
//       category: form.category,
//       price: `₹${form.priceFrom} - ₹${form.priceTo}`,
//       duration: form.duration.trim(),
//       location: form.location.trim(),
//       description: form.description.trim(),
//       images: form.images,
//     });
//   };

//   // ✅ GET INPUT CLASS BASED ON ERROR STATE
//   const getInputClass = (fieldName) => {
//     const baseClass = "mt-1 w-full border rounded-lg px-3 py-2 transition-all";
//     if (errors[fieldName]) {
//       return `${baseClass} border-red-500 focus:ring-red-500 focus:border-red-500`;
//     }
//     if (form[fieldName] && !errors[fieldName]) {
//       return `${baseClass} border-green-500 focus:ring-green-500 focus:border-green-500`;
//     }
//     return `${baseClass} focus:ring-2 focus:ring-blue-500 focus:border-transparent`;
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
//       <div className="bg-white w-full max-w-3xl rounded-xl p-6 relative max-h-[95vh] overflow-y-auto">
//         {/* CLOSE */}
//         <X
//           className="absolute right-4 top-4 cursor-pointer text-gray-500 hover:text-gray-700"
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
//               <label className="text-sm font-medium">
//                 Design Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 className={getInputClass("designName")}
//                 placeholder="Enter design name"
//                 value={form.designName}
//                 onChange={(e) => handleChange("designName", e.target.value)}
//               />
//               {errors.designName && (
//                 <p className="text-red-500 text-xs mt-1">{errors.designName}</p>
//               )}
//             </div>

//             <div>
//               <label className="text-sm font-medium">
//                 Designer Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 className={getInputClass("designerName")}
//                 placeholder="Designer name"
//                 value={form.designerName}
//                 onChange={(e) => handleChange("designerName", e.target.value)}
//               />
//               {errors.designerName && (
//                 <p className="text-red-500 text-xs mt-1">{errors.designerName}</p>
//               )}
//             </div>
//           </div>

//           {/* ROW 2 */}
//           <div className="grid md:grid-cols-2 gap-4">
//             <div>
//               <label className="text-sm font-medium">
//                 Designer Phone <span className="text-red-500">*</span>
//               </label>
//               <input
//                 className={getInputClass("designerPhone")}
//                 placeholder="10 digit phone number"
//                 maxLength={10}
//                 value={form.designerPhone}
//                 onChange={(e) => {
//                   const value = e.target.value.replace(/[^0-9]/g, "");
//                   handleChange("designerPhone", value);
//                 }}
//               />
//               {errors.designerPhone && (
//                 <p className="text-red-500 text-xs mt-1">{errors.designerPhone}</p>
//               )}
//               <p className="text-xs text-gray-500 mt-1">
//                 {form.designerPhone.length}/10 digits
//               </p>
//             </div>

//             <div>
//               <label className="text-sm font-medium">
//                 Area (Sqft) <span className="text-red-500">*</span>
//               </label>
//               <input
//                 className={getInputClass("area")}
//                 placeholder="e.g. 1500"
//                 value={form.area}
//                 onChange={(e) => {
//                   const value = e.target.value.replace(/[^0-9]/g, "");
//                   handleChange("area", value);
//                 }}
//               />
//               {errors.area && (
//                 <p className="text-red-500 text-xs mt-1">{errors.area}</p>
//               )}
//             </div>
//           </div>

//           {/* CATEGORY */}
//           <div>
//             <label className="text-sm font-medium">
//               Category / Room Type <span className="text-red-500">*</span>
//             </label>
//             <select
//               className={getInputClass("category")}
//               value={form.category}
//               onChange={(e) => handleChange("category", e.target.value)}
//             >
//               <option value="">Select room type</option>
//               <option value="Living Area">Living Area</option>
//               <option value="Bedroom">Bedroom</option>
//               <option value="Bathroom">Bathroom</option>
//               <option value="Kitchen">Kitchen</option>
//               <option value="Workspace">Workspace</option>
//               <option value="Storage">Storage</option>
//             </select>
//             {errors.category && (
//               <p className="text-red-500 text-xs mt-1">{errors.category}</p>
//             )}
//           </div>

//           {/* ROW 3 - PRICE */}
//           <div className="grid md:grid-cols-2 gap-4">
//             <div>
//               <label className="text-sm font-medium">
//                 Price From (₹) <span className="text-red-500">*</span>
//               </label>
//               <input
//                 className={getInputClass("priceFrom")}
//                 placeholder="Minimum price"
//                 value={form.priceFrom}
//                 onChange={(e) => {
//                   const value = e.target.value.replace(/[^0-9]/g, "");
//                   handleChange("priceFrom", value);
//                 }}
//               />
//               {errors.priceFrom && (
//                 <p className="text-red-500 text-xs mt-1">{errors.priceFrom}</p>
//               )}
//             </div>

//             <div>
//               <label className="text-sm font-medium">
//                 Price To (₹) <span className="text-red-500">*</span>
//               </label>
//               <input
//                 className={getInputClass("priceTo")}
//                 placeholder="Maximum price"
//                 value={form.priceTo}
//                 onChange={(e) => {
//                   const value = e.target.value.replace(/[^0-9]/g, "");
//                   handleChange("priceTo", value);
//                 }}
//               />
//               {errors.priceTo && (
//                 <p className="text-red-500 text-xs mt-1">{errors.priceTo}</p>
//               )}
//             </div>
//           </div>

//           {/* ROW 4 */}
//           <div className="grid md:grid-cols-2 gap-4">
//             <div>
//               <label className="text-sm font-medium">
//                 Duration <span className="text-red-500">*</span>
//               </label>
//               <input
//                 className={getInputClass("duration")}
//                 placeholder="e.g. 4-6 weeks"
//                 value={form.duration}
//                 onChange={(e) => handleChange("duration", e.target.value)}
//               />
//               {errors.duration && (
//                 <p className="text-red-500 text-xs mt-1">{errors.duration}</p>
//               )}
//             </div>

//             <div>
//               <label className="text-sm font-medium">
//                 Location <span className="text-red-500">*</span>
//               </label>
//               <input
//                 className={getInputClass("location")}
//                 placeholder="City/Area"
//                 value={form.location}
//                 onChange={(e) => handleChange("location", e.target.value)}
//               />
//               {errors.location && (
//                 <p className="text-red-500 text-xs mt-1">{errors.location}</p>
//               )}
//             </div>
//           </div>

//           {/* DESCRIPTION */}
//           <div>
//             <label className="text-sm font-medium">
//               Description <span className="text-gray-500">(50-500 characters)</span>
//             </label>
//             <textarea
//               className={getInputClass("description")}
//               placeholder="Design description (minimum 50 characters)"
//               value={form.description}
//               onChange={(e) => handleChange("description", e.target.value)}
//               rows={4}
//             />
//             {errors.description && (
//               <p className="text-red-500 text-xs mt-1">{errors.description}</p>
//             )}
//             <p className="text-xs text-gray-500 mt-1">
//               {form.description.length}/500 characters
//               {form.description.length > 0 && form.description.length < 50 && 
//                 ` (${50 - form.description.length} more needed)`
//               }
//             </p>
//           </div>

//           {/* IMAGE UPLOAD */}
//           <div>
//             <label className="text-sm font-medium">
//               Design Images <span className="text-red-500">*</span>
//             </label>

//             <label className="mt-2 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-blue-500 hover:text-blue-500 transition-all">
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
//         {form.images.length > 0 && (
//           <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
//             {form.images.map((img, i) => (
//               <div key={i} className="relative group">
//                 <img
//                   src={img.preview}
//                   alt={`preview-${i}`}
//                   className="h-20 w-full object-cover rounded-lg"
//                 />
//                 <button
//                   onClick={() => removeImage(i)}
//                   className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                 >
//                   <X size={14} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//         {form.images.length === 0 && (
//           <p className="text-xs text-gray-500 mt-2">No images uploaded yet</p>
//         )}
//       </div>
//     </div>

//     {/* ACTIONS */}
//     <div className="flex justify-end gap-3 mt-8">
//       <button
//         onClick={onClose}
//         className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
//       >
//         Cancel
//       </button>
//       <button
//         onClick={handleSubmit}
//         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//       >
//         Upload Design
//       </button>
//     </div>

//     {toast && (
//       <Toast
//         message={toast.message}
//         type={toast.type}
//         onClose={() => setToast(null)}
//       />
//     )}
//   </div>
// </div>
//   );
// }


// admin/src/components/InteriorDesign/UploadDesignModal.jsx

import { useState } from "react";
import { X, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import Toast from "../UserManagement/Toast";

export default function UploadDesignModal({ onClose, onUpload }) {
  const onlyLetters = /^[A-Za-z\s]+$/;
  const onlyNumbers = /^[0-9]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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

  // ── REAL-TIME VALIDATION ──
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "designName":
        if (!value.trim()) error = "Design name is required";
        else if (!onlyLetters.test(value)) error = "Only letters and spaces allowed";
        break;
      case "designerName":
        if (!value.trim()) error = "Designer name is required";
        else if (!onlyLetters.test(value)) error = "Only letters and spaces allowed";
        break;
      case "designerPhone":
        if (!value) error = "Phone number is required";
        else if (!phoneRegex.test(value)) error = "Must be exactly 10 digits";
        break;
      case "area":
        if (!value) error = "Area is required";
        else if (!onlyNumbers.test(value)) error = "Only numbers allowed";
        break;
      case "priceFrom":
      case "priceTo":
        if (!value) error = "Price is required";
        else if (!onlyNumbers.test(value)) error = "Only numbers allowed";
        break;
      case "duration":
        if (!value.trim()) error = "Duration is required";
        else if (value.trim().length < 3) error = "At least 3 characters required";
        break;
      case "location":
        if (!value.trim()) error = "Location is required";
        else if (value.trim().length < 2) error = "At least 2 characters required";
        break;
      case "description":
        if (value.trim() && value.trim().length < 50) error = "Minimum 50 characters required";
        else if (value.trim().length > 500) error = "Maximum 500 characters allowed";
        break;
      case "category":
        if (!value) error = "Please select a category";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  // ── HANDLE INPUT CHANGE ──
  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // ── IMAGE UPLOAD ──
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const invalidFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      setToast({ message: "Each image must be less than 5MB", type: "error" });
      return;
    }
    const previews = files.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setForm((prev) => ({ ...prev, images: [...prev.images, ...previews] }));
    // Reset input so same file can be re-selected if removed
    e.target.value = "";
  };

  // ── REMOVE IMAGE ──
  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ── VALIDATE ALL ──
  const validateAll = () => {
    const fields = [
      "designName", "designerName", "designerPhone", "area",
      "category", "priceFrom", "priceTo", "duration", "location", "description",
    ];
    let isValid = true;
    fields.forEach((field) => {
      if (!validateField(field, form[field])) isValid = false;
    });
    return isValid;
  };

  // ── SUBMIT ──
  const handleSubmit = async () => {
    if (!validateAll()) {
      setToast({ message: "Please fix all errors before submitting", type: "error" });
      return;
    }
    if (Number(form.priceFrom) >= Number(form.priceTo)) {
      setToast({ message: "Price From must be less than Price To", type: "error" });
      setErrors((prev) => ({ ...prev, priceTo: "Must be greater than Price From" }));
      return;
    }
    if (form.images.length === 0) {
      setToast({ message: "Please upload at least one image", type: "error" });
      return;
    }

    setSubmitting(true);
    try {
      await onUpload({
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
    } finally {
      setSubmitting(false);
    }
  };

  // ── INPUT CLASSES ──
  const getInputClass = (fieldName) => {
    const base =
      "mt-1 w-full border rounded-xl px-3 py-2.5 text-sm transition-all outline-none focus:ring-2 bg-white";
    if (errors[fieldName])
      return `${base} border-red-400 focus:ring-red-200 focus:border-red-500`;
    if (form[fieldName] && !errors[fieldName])
      return `${base} border-green-400 focus:ring-green-200 focus:border-green-500`;
    return `${base} border-gray-200 focus:ring-blue-200 focus:border-blue-500`;
  };

  // ── FIELD STATUS ICON ──
  const FieldIcon = ({ fieldName }) => {
    if (!form[fieldName]) return null;
    if (errors[fieldName])
      return <AlertCircle size={14} className="text-red-500 mt-1 flex-shrink-0" />;
    return <CheckCircle2 size={14} className="text-green-500 mt-1 flex-shrink-0" />;
  };

  // ── SECTION LABEL ──
  const Label = ({ children, required }) => (
    <label className="block text-sm font-semibold text-gray-700">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  // ── ERROR MESSAGE ──
  const ErrorMsg = ({ field }) =>
    errors[field] ? (
      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
        <AlertCircle size={11} /> {errors[field]}
      </p>
    ) : null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-3xl rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[96vh] sm:max-h-[95vh]">

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Upload Design</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Add a new interior design with details and images
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── SCROLLABLE BODY ── */}
        <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-5 space-y-5">

          {/* ROW 1 — Design Name + Designer Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label required>Design Name</Label>
              <div className="relative">
                <input
                  className={getInputClass("designName")}
                  placeholder="e.g. Modern Living"
                  value={form.designName}
                  onChange={(e) => handleChange("designName", e.target.value)}
                />
              </div>
              <ErrorMsg field="designName" />
            </div>
            <div>
              <Label required>Designer Name</Label>
              <input
                className={getInputClass("designerName")}
                placeholder="Full name"
                value={form.designerName}
                onChange={(e) => handleChange("designerName", e.target.value)}
              />
              <ErrorMsg field="designerName" />
            </div>
          </div>

          {/* ROW 2 — Phone + Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label required>Designer Phone</Label>
              <input
                className={getInputClass("designerPhone")}
                placeholder="10 digit number"
                maxLength={10}
                value={form.designerPhone}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  handleChange("designerPhone", value);
                }}
              />
              <div className="flex items-center justify-between mt-1">
                <ErrorMsg field="designerPhone" />
                <span className="text-xs text-gray-400 ml-auto">{form.designerPhone.length}/10</span>
              </div>
            </div>
            <div>
              <Label required>Area (sq ft)</Label>
              <input
                className={getInputClass("area")}
                placeholder="e.g. 1500"
                value={form.area}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  handleChange("area", value);
                }}
              />
              <ErrorMsg field="area" />
            </div>
          </div>

          {/* CATEGORY */}
          <div>
            <Label required>Category / Room Type</Label>
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
            <ErrorMsg field="category" />
          </div>

          {/* ROW 3 — Price Range */}
          <div>
            <Label required>Price Range (₹)</Label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
                  <input
                    className={`${getInputClass("priceFrom")} pl-7`}
                    placeholder="From"
                    value={form.priceFrom}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      handleChange("priceFrom", value);
                    }}
                  />
                </div>
                <ErrorMsg field="priceFrom" />
              </div>
              <div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
                  <input
                    className={`${getInputClass("priceTo")} pl-7`}
                    placeholder="To"
                    value={form.priceTo}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      handleChange("priceTo", value);
                    }}
                  />
                </div>
                <ErrorMsg field="priceTo" />
              </div>
            </div>
          </div>

          {/* ROW 4 — Duration + Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label required>Duration</Label>
              <input
                className={getInputClass("duration")}
                placeholder="e.g. 4-6 weeks"
                value={form.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
              />
              <ErrorMsg field="duration" />
            </div>
            <div>
              <Label required>Location</Label>
              <input
                className={getInputClass("location")}
                placeholder="City / Area"
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
              <ErrorMsg field="location" />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <div className="flex items-center justify-between">
              <Label>Description <span className="text-gray-400 font-normal text-xs">(50–500 chars)</span></Label>
              <span className={`text-xs font-medium ${form.description.length > 0 && form.description.length < 50 ? "text-orange-500" : form.description.length >= 50 ? "text-green-600" : "text-gray-400"}`}>
                {form.description.length}/500
              </span>
            </div>
            <textarea
              className={`${getInputClass("description")} resize-none mt-1`}
              placeholder="Describe the design (minimum 50 characters)..."
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
            />
            <div className="flex items-center justify-between mt-1">
              <ErrorMsg field="description" />
              {form.description.length > 0 && form.description.length < 50 && (
                <p className="text-orange-500 text-xs ml-auto">{50 - form.description.length} more needed</p>
              )}
            </div>
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <Label required>Design Images</Label>
            <label className="mt-2 border-2 border-dashed border-gray-200 rounded-xl p-5 sm:p-8 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center mb-3 transition-colors">
                <ImageIcon size={22} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <span className="text-sm font-medium">Click to upload images</span>
              <span className="text-xs mt-1 text-gray-400">PNG, JPG up to 5MB each • Multiple allowed</span>
              <input type="file" accept="image/*" multiple hidden onChange={handleImageUpload} />
            </label>

            {/* Image previews */}
            {form.images.length > 0 && (
              <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 mt-3">
                {form.images.map((img, i) => (
                  <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={img.preview}
                      alt={`preview-${i}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {form.images.length === 0 && (
              <p className="text-xs text-gray-400 mt-2 text-center">No images uploaded yet</p>
            )}
            {form.images.length > 0 && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                {form.images.length} image{form.images.length !== 1 ? "s" : ""} selected
              </p>
            )}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex-shrink-0">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 sm:px-5 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 sm:px-6 py-2.5 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-95 transition-all font-medium disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Design"
            )}
          </button>
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}