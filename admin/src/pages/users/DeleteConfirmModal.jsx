// src/pages/users/DeleteConfirmModal.jsx
import React, { useState } from "react";
import { deleteUser } from "../../api/usersApi";

export default function DeleteConfirmModal({ id, close, refresh }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteUser(id);
      refresh();
      close();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4 text-red-600">
          Confirm Delete
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Are you sure you want to delete this user? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button className="btn-secondary" onClick={close}>
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="btn-danger"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
