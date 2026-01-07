// components/superadmin/createAccount/CreateAdminModal.jsx
import { Check, X } from "lucide-react";
import { useState } from "react";

const permissionsList = [
  { key: "users", label: "User Management", desc: "Create, edit, and manage users" },
  { key: "properties", label: "Property Management", desc: "Manage property listings" },
  { key: "finance", label: "Financial Access", desc: "View and manage finances" },
  { key: "reports", label: "Reports & Analytics", desc: "Generate and view reports" },
  { key: "notifications", label: "Notifications", desc: "Send push notifications" },
  { key: "banners", label: "Banner Management", desc: "Manage homepage banners" },
  { key: "interior", label: "Interior Design", desc: "Manage interior designs" },
  { key: "settings", label: "System Settings", desc: "Access system settings" },
];

const CreateAdminModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Sub-Admin",
    permissions: [],
  });

  const togglePermission = (key) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(key)
        ? prev.permissions.filter((p) => p !== key)
        : [...prev.permissions, key],
    }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.email) return;
    onCreate(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-[#0B1220] w-full max-w-3xl rounded-2xl p-8 border border-white/10 shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Create New Admin Account
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Add a new administrator to the system with specific permissions
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="text-sm text-gray-300">Full Name</label>
            <input
              className="mt-1 w-full bg-[#1E293B] text-white rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-300">Email Address</label>
            <input
              className="mt-1 w-full bg-[#1E293B] text-white rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-300">Phone Number</label>
            <input
              className="mt-1 w-full bg-[#1E293B] text-white rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+91 XXXXX XXXXX"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-sm text-gray-300">Role</label>
            <select
              className="mt-1 w-full bg-[#1E293B] text-white rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option>Sub-Admin</option>
              <option>Manager</option>
              <option>Admin</option>
            </select>
          </div>
        </div>

        {/* Permissions */}
        <h3 className="text-white font-medium mt-6 mb-2">
          Module Permissions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {permissionsList.map((p) => {
            const active = form.permissions.includes(p.key);
            return (
              <div
                key={p.key}
                onClick={() => togglePermission(p.key)}
                className={`cursor-pointer p-2 rounded-xl border transition flex gap-4
                  ${active
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-white/10 bg-[#1E293B] hover:bg-white/5"
                  }`}
              >
                {/* Checkbox */}
                <div
                  className={`w-4 h-4 rounded-md flex items-center justify-center border
                    ${active ? "bg-blue-500 border-blue-500" : "border-blue-500"}
                  `}
                >
                  {active && <Check size={14} className="text-white" />}
                </div>

                <div>
                  <p className="text-white font-medium">{p.label}</p>
                  <p className="text-sm text-gray-400">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-10">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-white/10 text-gray-300 hover:bg-white/20 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transition"
          >
            Create Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAdminModal;
