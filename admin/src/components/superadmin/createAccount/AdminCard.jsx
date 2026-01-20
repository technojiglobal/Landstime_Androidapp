// components/superadmin/createAccount/AdminCard.jsx
import {
  Mail,
  Phone,
  MoreVertical,
} from "lucide-react";
import PermissionChip from "./PermissionChip";

const AdminCard = ({
  name,
  role,
  status,
  email,
  phone,
  lastLogin,
  actions,
  permissions,
  assignedTo,
  password,
}) => {
  return (
    <div className="bg-[#0B1220] border border-white/5 rounded-2xl p-6 flex justify-between items-center">
      {/* LEFT */}
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/30 to-yellow-500/10 flex items-center justify-center text-yellow-400 font-bold">
          {name[0]}
        </div>

        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-white font-semibold">{name}</h3>

            <span className="px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">
              {role}
            </span>

            <span
              className={`px-3 py-1 text-xs rounded-full ${status === "Active"
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-red-500/20 text-red-400"
                }`}
            >
              {status}
            </span>
          </div>

          <div className="flex gap-4 text-sm text-gray-400 mt-2">
            <span className="flex items-center gap-1">
              <Mail size={14} /> {email}
            </span>
            <span className="flex items-center gap-1">
              <Phone size={14} /> {phone}
            </span>
          </div>
          {assignedTo && (
            <div className="text-xs text-gray-400 mt-1">
              Assigned to: <span className="text-yellow-400">{assignedTo}</span>
            </div>
          )}
          {password && (
            <div className="text-xs text-gray-400 mt-1">
              Password: <span className="text-red-400">{password}</span>
            </div>
          )}

          <div className="text-xs text-gray-500 mt-2">
            Last login: {lastLogin} &nbsp; • &nbsp; {actions} actions this month
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {permissions.map((p, i) => (
          <PermissionChip key={i} label={p} />
        ))}
        <MoreVertical className="text-gray-400 cursor-pointer" />
      </div>
    </div>
  );
};

export default AdminCard;
