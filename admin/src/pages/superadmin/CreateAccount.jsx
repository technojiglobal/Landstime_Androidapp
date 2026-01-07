// pages/superadmin/CreateAccount.jsx
import { useState } from "react";
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

const CreateAccount = () => {
  const [showModal, setShowModal] = useState(false);
  const [admins, setAdmins] = useState([]);

  // Handle admin creation
  const handleCreateAdmin = (newAdmin) => {
    setAdmins((prev) => [
      {
        ...newAdmin,
        status: "Active",
        lastLogin: "Just now",
        actions: 0,
      },
      ...prev,
    ]);
  };

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
            value={admins.length + 3}
            icon={Users}
            color="#3B82F6"
          />
          <StatMiniCard
            title="Active"
            value={admins.length + 2}
            icon={CheckCircle}
            color="#10B981"
          />
          <StatMiniCard
            title="Inactive"
            value="1"
            icon={XCircle}
            color="#EF4444"
          />
          <StatMiniCard
            title="Pending"
            value="1"
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
            {/* Default admins */}
            <AdminCard
              name="Rajesh Kumar"
              role="Admin"
              status="Active"
              email="rajesh.kumar@company.com"
              phone="+91 98765 43210"
              lastLogin="2 hours ago"
              actions={156}
              permissions={["users", "properties", "finance", "+1"]}
            />

            <AdminCard
              name="Priya Sharma"
              role="Sub-Admin"
              status="Active"
              email="priya.sharma@company.com"
              phone="+91 87654 32109"
              lastLogin="5 hours ago"
              actions={89}
              permissions={["users", "properties"]}
            />

            <AdminCard
              name="Amit Patel"
              role="Manager"
              status="Inactive"
              email="amit.patel@company.com"
              phone="+91 76543 21098"
              lastLogin="2 days ago"
              actions={32}
              permissions={["properties", "reports"]}
            />

            {/* Newly created admins */}
            {admins.map((admin, index) => (
              <AdminCard
                key={index}
                name={admin.name}
                role={admin.role}
                status={admin.status}
                email={admin.email}
                phone={admin.phone}
                lastLogin={admin.lastLogin}
                actions={admin.actions}
                permissions={admin.permissions}
              />
            ))}
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
