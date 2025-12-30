//admin/src/components/UserManagement/DeleteModal.jsx

export default function DeleteModal({
  title = "Delete Item",
  subtitle = "Are you sure you want to delete this item?",
  onCancel,
  onDelete,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[340px] text-center">
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{subtitle}</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
