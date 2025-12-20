const statusStyles = {
  verified: "bg-green-100 text-green-700",
  pending: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
};

const PropertyItem = ({ name, location, status }) => {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-gray-500">{location}</p>
      </div>
      <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusStyles[status]}`}>
        {status}
      </span>
    </div>
  );
};

export default PropertyItem;
