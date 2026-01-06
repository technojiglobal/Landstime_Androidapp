// components/superadmin/createAccount/PermissionChip.jsx
const PermissionChip = ({ label }) => {
  return (
    <span className="px-3 py-1 rounded-full border border-white/20 text-xs text-gray-300">
      {label}
    </span>
  );
};

export default PermissionChip;
