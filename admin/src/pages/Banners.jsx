import { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { Loader2 } from "lucide-react";
import BannerFormModal from "../components/Banner/BannerFormModal";
import DeleteModal from "../components/UserManagement/DeleteModal";
import Toast from "../components/UserManagement/Toast";
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
} from "lucide-react";

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formBanner, setFormBanner] = useState(null);
  const [deleteBanner, setDeleteBanner] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/banners');
      
      if (response.data.success) {
        setBanners(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      setToast(error.response?.data?.message || 'Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  const saveBanner = async (formData) => {
    try {
      const bannerData = {
        title: {
          en: formData.heading,
          te: formData.heading,
          hi: formData.heading,
        },
        subtitle: {
          en: formData.description,
          te: formData.description,
          hi: formData.description,
        },
        isActive: formData.active,
        ctaText: formData.ctaText,
        ctaLink: formData.ctaLink,
      };

      if (formBanner?._id) {
        if (formData.image !== formBanner.image) {
          bannerData.image = formData.image;
        }
      } else {
        bannerData.image = formData.image;
      }

      let response;
      if (formBanner?._id) {
        response = await axios.put(`/banners/${formBanner._id}`, bannerData);
      } else {
        response = await axios.post('/banners', bannerData);
      }

      if (response.data.success) {
        setToast(response.data.message);
        fetchBanners();
        setFormBanner(null);
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      setToast(error.response?.data?.message || 'Failed to save banner');
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`/banners/${deleteBanner._id}`);
      
      if (response.data.success) {
        setBanners((prev) => prev.filter((b) => b._id !== deleteBanner._id));
        setToast(response.data.message);
        setDeleteBanner(null);
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      setToast(error.response?.data?.message || 'Failed to delete banner');
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Banner Management</h1>
            <button
              onClick={() => setFormBanner({})}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
            >
              <Plus size={16} /> Add Banner
            </button>
          </div>

          {/* Empty State */}
          {banners.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-gray-400 mb-4">
                <GripVertical size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Banners Yet</h3>
              <p className="text-gray-500 mb-4">
                Create your first banner to display on the mobile app
              </p>
              <button
                onClick={() => setFormBanner({})}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Create Banner
              </button>
            </div>
          ) : (
            /* Banner List */
            <div className="space-y-4">
              {banners.map((b, idx) => (
                <div
                  key={b._id}
                  className="bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row gap-4 md:items-center hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    <GripVertical className="text-gray-400 cursor-move" />
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold">
                      {idx + 1}
                    </div>
                  </div>

                  <img
                    src={b.image}
                    alt=""
                    className="w-28 h-20 rounded-lg object-cover shadow-sm"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{b.title.en}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{b.subtitle.en}</p>
                    <div className="flex gap-4 mt-2 text-xs">
                      <span className="text-gray-400">TE: {b.title.te}</span>
                      <span className="text-gray-400">HI: {b.title.hi}</span>
                    </div>
                  </div>

                  
                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setFormBanner(b)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition"
                      title="Edit Banner"
                    >
                      <Edit className="text-blue-600" size={18} />
                    </button>

                    <button
                      onClick={() => setDeleteBanner(b)}
                      className="p-2 hover:bg-red-50 rounded-lg transition"
                      title="Delete Banner"
                    >
                      <Trash2 className="text-red-500" size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {formBanner && (
        <BannerFormModal
          banner={formBanner}
          onClose={() => setFormBanner(null)}
          onSave={saveBanner}
        />
      )}

      {deleteBanner && (
        <DeleteModal
          title="Delete Banner"
          message={`Are you sure you want to delete "${deleteBanner.title.en}"?`}
          onCancel={() => setDeleteBanner(null)}
          onDelete={confirmDelete}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}