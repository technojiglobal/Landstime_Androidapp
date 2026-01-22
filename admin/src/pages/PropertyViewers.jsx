// admin/src/pages/PropertyViewers.jsx

import { useEffect, useState, useMemo } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, Download, Filter, TrendingUp } from 'lucide-react';
import ViewersModal from '../components/propertyViewers/ViewersModal';
import Loading from '../components/Loading';
import Toast from '../components/UserManagement/Toast';
import { fetchAllPropertyViews, exportPropertyViews } from '../services/propertyViewerService';

export default function PropertyViewers() {
  const [propertyViews, setPropertyViews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [sortBy, setSortBy] = useState('mostViewed'); // mostViewed, recent, alphabetical

  useEffect(() => {
    loadPropertyViews();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize, sortBy]);

  const loadPropertyViews = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllPropertyViews();
      setPropertyViews(data);
    } catch (error) {
      console.error('Failed to fetch property views:', error);
      setToast(error.response?.data?.message || 'Failed to fetch property views');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportPropertyViews();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `property-viewers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setToast('Export successful!');
    } catch (error) {
      console.error('Export failed:', error);
      setToast('Failed to export data');
    }
  };

  // Filter and sort
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    
    let result = propertyViews.filter((pv) => {
      return (
        pv.propertyTitle?.toLowerCase().includes(q) ||
        pv.propertyOwnerName?.toLowerCase().includes(q) ||
        pv.ownerPhone?.toLowerCase().includes(q) ||
        pv.ownerEmail?.toLowerCase().includes(q)
      );
    });

    // Sort
    if (sortBy === 'mostViewed') {
      result.sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0));
    } else if (sortBy === 'recent') {
      result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } else if (sortBy === 'alphabetical') {
      result.sort((a, b) => (a.propertyTitle || '').localeCompare(b.propertyTitle || ''));
    }

    return result;
  }, [propertyViews, search, sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const start = filtered.length ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(page * pageSize, filtered.length);

  // Stats
  const stats = useMemo(() => {
    const totalProperties = propertyViews.length;
    const totalViewers = propertyViews.reduce((sum, pv) => sum + (pv.totalViews || 0), 0);
    const propertiesWithViews = propertyViews.filter(pv => (pv.totalViews || 0) > 0).length;
    const avgViewsPerProperty = totalProperties > 0 ? (totalViewers / totalProperties).toFixed(1) : 0;

    return { totalProperties, totalViewers, propertiesWithViews, avgViewsPerProperty };
  }, [propertyViews]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Loading message="Loading property viewers..." size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalProperties}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Eye className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Viewers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalViewers}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Properties with Views</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.propertiesWithViews}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <Eye className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Views/Property</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgViewsPerProperty}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <TrendingUp className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            className="pl-10 pr-4 py-2 border rounded-lg w-full"
            placeholder="Search by property, owner, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-600" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="mostViewed">Most Viewed</option>
            <option value="recent">Recently Updated</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>

        {/* Page Size */}
        <select
          value={pageSize}
          onChange={(e) => setPageSize(+e.target.value)}
          className="border rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:border-blue-500"
        >
          {[10, 20, 30, 50].map((n) => (
            <option key={n} value={n}>
              {n} per page
            </option>
          ))}
        </select>

        {/* Export */}
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
         <thead className="bg-gray-50">
  <tr>
    {['Property Title', 'Property Type', 'Owner Name', 'Phone', 'Email', 'Status', 'Total Views', 'Last Updated', 'Actions'].map((h) => (
      <th key={h} className="px-4 py-3 text-left text-gray-500 font-medium">
        {h}
      </th>
    ))}
  </tr>
</thead>

         <tbody>
  {paginated.map((pv) => (
    <tr key={pv._id} className="border-t hover:bg-gray-50">
      <td className="px-4 py-3">
        <p className="font-medium text-gray-900">{pv.propertyTitle || 'N/A'}</p>
      </td>
      {/* ✅ NEW COLUMN - Property Type */}
      <td className="px-4 py-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          pv.propertyType === 'House' 
            ? 'bg-blue-100 text-blue-700' 
            : pv.propertyType === 'Site/Plot/Land'
            ? 'bg-green-100 text-green-700'
            : pv.propertyType === 'Commercial'
            ? 'bg-purple-100 text-purple-700'
            : pv.propertyType === 'Resort'
            ? 'bg-orange-100 text-orange-700'
            : 'bg-gray-100 text-gray-700'
        }`}>
          {pv.propertyType || 'N/A'}
        </span>
      </td>
      <td className="px-4 py-3">{pv.propertyOwnerName || 'N/A'}</td>
                <td className="px-4 py-3">
                  <a href={`tel:${pv.ownerPhone}`} className="text-blue-600 hover:underline">
                    {pv.ownerPhone || 'N/A'}
                  </a>
                </td>
                <td className="px-4 py-3">
  <a href={`mailto:${pv.ownerEmail}`} className="text-blue-600 hover:underline">
    {pv.ownerEmail || 'N/A'}
  </a>
</td>
<td className="px-4 py-3">
  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
    pv.propertyStatus === 'Sold' 
      ? 'bg-red-100 text-red-700' 
      : 'bg-green-100 text-green-700'
  }`}>
    {pv.propertyStatus || 'Available'}
  </span>
</td>
<td className="px-4 py-3">
  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    (pv.totalViews || 0) > 10 
                      ? 'bg-green-100 text-green-700' 
                      : (pv.totalViews || 0) > 5 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {pv.totalViews || 0} {(pv.totalViews || 0) === 1 ? 'view' : 'views'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(pv.updatedAt).toLocaleDateString('en-IN')}
                </td>
                <td className="px-4 py-3">
                <button
  onClick={() => setSelectedProperty(pv)}  // ✅ Pass entire object
  disabled={!pv.totalViews || pv.totalViews === 0}
  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
    !pv.totalViews || pv.totalViews === 0
      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
  }`}
  title={!pv.totalViews || pv.totalViews === 0 ? 'No viewers yet' : 'View viewers'}
>
  <Eye size={16} />
  View Viewers
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginated.length === 0 && (
          <div className="text-center py-12">
            <Eye size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No property views found</p>
            <p className="text-gray-400 text-sm mt-2">
              {search ? 'Try adjusting your search' : 'Property views will appear here once users view properties'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {paginated.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <span>
            Showing {start} to {end} of {filtered.length} entries
          </span>

          <div className="flex items-center gap-4">
            <ChevronLeft
              className={page === 1 ? 'opacity-40' : 'cursor-pointer hover:text-gray-700'}
              onClick={() => page > 1 && setPage(page - 1)}
            />
            <span className="font-medium text-gray-800">
              Page {page} of {totalPages}
            </span>
            <ChevronRight
              className={page === totalPages ? 'opacity-40' : 'cursor-pointer hover:text-gray-700'}
              onClick={() => page < totalPages && setPage(page + 1)}
            />
          </div>
        </div>
      )}

      {/* Modals */}
     {selectedProperty && (
  <ViewersModal
    propertyId={selectedProperty.propertyId?._id || selectedProperty.propertyId}
    propertyTitle={selectedProperty.propertyTitle}
    onClose={() => setSelectedProperty(null)}
  />
)}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}