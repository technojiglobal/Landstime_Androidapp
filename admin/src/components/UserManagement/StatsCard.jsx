export default function StatCard({ title, value, icon: Icon ,trend}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow transition flex justify-between ">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-semibold mt-1">{value}</h2>
        <p className="text-sm text-green-700 font-medium mt-1">{trend} </p>
      </div>
      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
        <Icon className="text-blue-600" />
      </div>
    </div>
  );
}
