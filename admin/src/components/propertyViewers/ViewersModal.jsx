// admin/src/components/propertyViewers/ViewersModal.jsx

import { useEffect, useState } from 'react';
import { X, User, Phone, Mail, Crown, Calendar, Eye } from 'lucide-react';
import { fetchPropertyViewers } from '../../services/propertyViewerService';
import Loading from '../Loading';

export default function ViewersModal({ propertyId, propertyTitle, onClose }) {
  const [viewers, setViewers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (propertyId) {
      loadViewers();
    }
  }, [propertyId]);

  const loadViewers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // ✅ Convert propertyId to string if it's an object
      const propId = typeof propertyId === 'string' ? propertyId : String(propertyId);
      console.log('🔍 Fetching viewers for propertyId:', propId);
      
      const data = await fetchPropertyViewers(propId);
      setViewers(data.viewers || []);
    } catch (err) {
      console.error('Failed to fetch viewers:', err);
      setError(err.response?.data?.message || 'Failed to load viewers');
    } finally {
      setIsLoading(false);
    }
  };
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPlanColor = (plan) => {
    const colors = {
      gold: 'bg-yellow-100 text-yellow-700',
      platinum: 'bg-blue-100 text-blue-700',
      diamond: 'bg-purple-100 text-purple-700'
    };
    return colors[plan?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
          <div>
           <h2 className="text-2xl font-bold text-white flex items-center gap-2">
  <Eye size={24} />
  Property Viewers
</h2>
{/* Property title will be loaded from API response */}
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {isLoading ? (
            <div className="py-12">
              <Loading message="Loading viewers..." />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-2">⚠️</div>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : viewers.length === 0 ? (
            <div className="text-center py-12">
              <Eye size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No viewers yet</p>
              <p className="text-gray-400 text-sm mt-2">
                This property hasn't been viewed by any subscribed users
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600">
                  Total Viewers: <span className="font-semibold text-gray-900">{viewers.length}</span>
                </p>
              </div>

              {/* Viewers Grid */}
              <div className="grid gap-4">
                {viewers.map((viewer, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow border border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left Side - User Info */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 rounded-full p-2">
                            <User size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{viewer.userName}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${getPlanColor(viewer.subscriptionPlan)}`}>
                              <Crown size={12} className="inline mr-1" />
                              {viewer.subscriptionPlan?.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={16} className="text-gray-400" />
                          <a href={`tel:${viewer.userPhone}`} className="hover:text-blue-600">
                            {viewer.userPhone}
                          </a>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={16} className="text-gray-400" />
                          <a href={`mailto:${viewer.userEmail}`} className="hover:text-blue-600 truncate">
                            {viewer.userEmail}
                          </a>
                        </div>
                      </div>

                      {/* Right Side - View Info */}
                      <div className="flex items-center justify-between md:justify-end">
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar size={16} />
                            <span>Viewed on</span>
                          </div>
                          <p className="text-sm font-medium text-gray-700 mt-1">
                            {formatDate(viewer.viewedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isLoading && !error && viewers.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}