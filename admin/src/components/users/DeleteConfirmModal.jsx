// src/pages/Users/DeleteConfirmModal.jsx
import React, { useState } from "react";

export default function DeleteConfirmModal({ id, onClose, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await onDelete(); // parent handles API + refresh
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-lg border">

        <h2 className="text-lg font-semibold text-red-600 mb-2">
          Confirm Delete
        </h2>

        <p className="text-sm text-slate-600 mb-6">
          Are you sure you want to delete this user?  
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>

      </div>
    </div>
  );
}
