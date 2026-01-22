// pages/superadmin/CreateAccount.jsx

import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  UserPlus,
} from "lucide-react";

import StatMiniCard from "../../components/superadmin/createAccount/StatMiniCard";
import AdminSearchBar from "../../components/superadmin/createAccount/AdminSearchBar";
import AdminCard from "../../components/superadmin/createAccount/AdminCard";
import CreateAdminModal from "../../components/superadmin/createAccount/CreateAdminModal";
import { useState, useEffect } from "react";
import { createAdmin, fetchAllAdmins } from "../../services/adminApi";
const CreateAccount = () => {
  const [showModal, setShowModal] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch admins on mount
  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetchAllAdmins();
      setAdmins(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Failed to load admins:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle admin creation
  const handleCreateAdmin = async (newAdmin) => {
    try {
      const response = await createAdmin(newAdmin);

      // Refresh the admin list
      await loadAdmins();

      setShowModal(false);

      // Optional: Show success message
      alert("Admin created successfully!");
    } catch (err) {
      alert(err.message || "Failed to create admin");
      console.error("Create admin error:", err);
    }
  };

  // Calculate stats from fetched data
  const totalAdmins = admins.length;
  const activeAdmins = admins.filter(a => a.status === "Active").length;
  const inactiveAdmins = admins.filter(a => a.status === "Inactive").length;
  const pendingAdmins = admins.filter(a => a.status === "Pending").length;

  // ADD loading and error states in the return before the main content:
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-white text-xl">Loading admins...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-xl">Error: {error}</p>
      </div>
    );
  }


  return (
    <>
      {/* MAIN CONTENT */}
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <UserPlus size={28} />
              Create Account
            </h1>
            <p className="text-gray-400 mt-1">
              Manage admin accounts and permissions
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-yellow-500 hover:bg-yellow-600 transition px-5 py-3 rounded-xl font-semibold text-black"
          >
            Create New Admin
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <StatMiniCard
            title="Total Admins"
            value={totalAdmins}
            icon={Users}
            color="#3B82F6"
          />
          <StatMiniCard
            title="Active"
            value={activeAdmins}
            icon={CheckCircle}
            color="#10B981"
          />
          <StatMiniCard
            title="Inactive"
            value={inactiveAdmins}
            icon={XCircle}
            color="#EF4444"
          />
          <StatMiniCard
            title="Pending"
            value={pendingAdmins}
            icon={Clock}
            color="#F59E0B"
          />
        </div>

        {/* Search */}
        <AdminSearchBar />

        {/* Admin List */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-white">
            Admin Accounts
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Manage all admin accounts, roles, and permissions
          </p>

          <div className="space-y-6 mt-6">
            {admins.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No admin accounts found</p>
            ) : (
              admins.map((admin) => (
                <AdminCard
                  key={admin._id}
                  name={admin.name}
                  role={admin.role}
                  status={admin.status}
                  email={admin.email}
                  phone={admin.phone}
                  lastLogin={admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : "Never"}
                  actions={admin.actionCount || 0}
                  permissions={admin.permissions || []}
                  assignedTo={admin.assignedTo}
                  password={admin.plainPassword}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <CreateAdminModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateAdmin}
        />
      )}
    </>
  );
};

export default CreateAccount;
