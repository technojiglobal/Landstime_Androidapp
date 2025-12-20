import { useState } from "react";
import BannerFormModal from "../components/Banner/BannerFormModal";
import DeleteModal from "../components/UserManagement/DeleteModal";
import Toast from "../components/UserManagement/Toast";
import {
  Plus,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  GripVertical,
} from "lucide-react";

/* ---------------- DATA ---------------- */
const INITIAL_BANNERS = [
  {
    id: 1,
    heading: "Find Your Dream Home",
    description:
      "Discover over 10,000 premium properties across the nation with our AI-powered search",
    ctaText: "Start Exploring",
    ctaLink: "/properties",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    active: true,
  },
  {
    id: 2,
    heading: "Luxury Living Awaits",
    description:
      "Exclusive access to off-market luxury homes and private listings",
    ctaText: "View Luxury Homes",
    ctaLink: "/luxury",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
    active: true,
  },
  {
    id: 3,
    heading: "Smart Investment Opportunities",
    description:
      "High-return real estate investments vetted by our expert analysts",
    ctaText: "Explore Investments",
    ctaLink: "/invest",
    image:
      "https://images.unsplash.com/photo-1600585154207-1f0b9f47a7c4",
    active: true,
  },
  {
    id: 4,
    heading: "New Developments Launch",
    description:
      "Be the first to explore brand new luxury developments with exclusive pricing",
    ctaText: "See New Projects",
    ctaLink: "/new-developments",
    image:
      "https://images.unsplash.com/photo-1600585154084-4e5c8f9c2a54",
    active: false,
  },
];

/* ---------------- COMPONENT ---------------- */
export default function Banners() {
  const [banners, setBanners] = useState(INITIAL_BANNERS);
  const [formBanner, setFormBanner] = useState(null);
  const [deleteBanner, setDeleteBanner] = useState(null);
  const [toast, setToast] = useState("");

  /* ---------- ACTIONS ---------- */
  const toggleStatus = (id) => {
    setBanners((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, active: !b.active } : b
      )
    );
    setToast("Banner status updated");
  };

  const saveBanner = (data) => {
  if (data.id) {
    // EDIT
    setBanners((prev) =>
      prev.map((b) => (b.id === data.id ? data : b))
    );
    setToast("Banner updated");
  } else {
    // CREATE
    setBanners((prev) => [
      ...prev,
      {
        ...data,
        id: Date.now(),
        active: true,
      },
    ]);
    setToast("Banner created");
  }
  setFormBanner(null);
};


  const confirmDelete = () => {
    setBanners((prev) =>
      prev.filter((b) => b.id !== deleteBanner.id)
    );
    setDeleteBanner(null);
    setToast("Banner deleted");
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-end">
        <button
          onClick={() => setFormBanner({})}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={16} /> Add Banner
        </button>
      </div>

      {/* Banner List */}
      <div className="space-y-4">
        {banners.map((b, idx) => (
          <div
            key={b.id}
            className="bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row gap-4 md:items-center"
          >
            {/* Drag + Index */}
            <div className="flex items-center gap-4">
              <GripVertical className="text-gray-400" />
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                {idx + 1}
              </div>
            </div>

            {/* Image */}
            <img
              src={b.image}
              alt=""
              className="w-28 h-20 rounded-lg object-cover"
            />

            {/* Content */}
            <div className="flex-1">
              <h3 className="font-semibold">{b.heading}</h3>
              <p className="text-sm text-gray-500">{b.description}</p>
              <p className="text-sm text-blue-600 mt-1">
                CTA: {b.ctaText} → {b.ctaLink}
              </p>
            </div>

            {/* Status */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                b.active
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {b.active ? "Active" : "Inactive"}
            </span>

            {/* Actions */}
            <div className="flex gap-4">
              <button onClick={() => toggleStatus(b.id)}>
                {b.active ? (
                  <Eye className="hover:text-black" size={18} />
                ) : (
                  <EyeOff className="hover:text-black" size={18} />
                )}
              </button>

              <button onClick={() => setFormBanner(b)}>
                <Edit className="hover:text-black" size={18} />
              </button>

              <button onClick={() => setDeleteBanner(b)}>
                <Trash2 className="text-red-500 hover:text-black" size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {formBanner && (
        <BannerFormModal
          banner={formBanner}
          onClose={() => setFormBanner(null)}
          onSave={saveBanner}
        />
      )}

      {deleteBanner && (
        <DeleteModal
          onCancel={() => setDeleteBanner(null)}
          onDelete={confirmDelete}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}
