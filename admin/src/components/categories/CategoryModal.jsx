// src/components/categories/CategoryModal.jsx
import React, { useState } from "react";
import { createCategory, updateCategory } from "../../api/categoryApi";

export default function CategoryModal({ close, editData, refresh }) {
  const [form, setForm] = useState({
    categoryName: editData?.categoryName || "",
    description: editData?.description || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      if (editData) {
        await updateCategory(editData.id, form);
      } else {
        await createCategory(form);
      }

      refresh();
      close();
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          {editData ? "Edit Category" : "Add New Category"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-600">Category Name</label>
            <input
              type="text"
              name="categoryName"
              value={form.categoryName}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
              rows={3}
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={close}
            className="px-4 py-2 text-sm rounded-md border"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-md"
          >
            {loading ? "Saving..." : editData ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
