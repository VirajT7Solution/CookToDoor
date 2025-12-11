// src/pages/Categories.jsx
import React, { useEffect, useState } from "react";
import {
  getCategories,
  deleteCategory,
} from "../api/categoryApi";

import CategoryModal from "../components/categories/CategoryModal";
import ConfirmDialog from "../components/common/ConfirmDialog";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    id: null,
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditData(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    setConfirmDelete({ show: false, id: null });

    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Categories</h2>
          <p className="text-sm text-slate-500">
            Create, update, and manage tiffin service categories.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium shadow"
        >
          + Add Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-slate-600">
                ID
              </th>
              <th className="p-3 text-left text-sm font-semibold text-slate-600">
                Category Name
              </th>
              <th className="p-3 text-left text-sm font-semibold text-slate-600">
                Description
              </th>
              <th className="p-3 text-right text-sm font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-500">
                  Loading categories...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-500">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition"
                >
                  <td className="p-3 text-sm">{cat.id}</td>
                  <td className="p-3 text-sm">{cat.categoryName}</td>
                  <td className="p-3 text-sm text-slate-500">
                    {cat.description || "-"}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="px-3 py-1 text-sm text-primary-600 hover:text-primary-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        setConfirmDelete({ show: true, id: cat.id })
                      }
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showModal && (
        <CategoryModal
          close={() => setShowModal(false)}
          editData={editData}
          refresh={fetchCategories}
        />
      )}

      {confirmDelete.show && (
        <ConfirmDialog
          message="Are you sure you want to delete this category?"
          onCancel={() => setConfirmDelete({ show: false, id: null })}
          onConfirm={() => handleDelete(confirmDelete.id)}
        />
      )}
    </div>
  );
}
