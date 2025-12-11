// src/pages/Users.jsx
import React, { useEffect, useState } from "react";
import {
  getUsers,
  deleteUser,
  getUserById,
} from "../api/userApi";

import UserModal from "../components/users/UserModal";
import ConfirmDialog from "../components/common/ConfirmDialog";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    id: null,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setShowModal(true);
  };

  const handleEdit = async (id) => {
    try {
      const res = await getUserById(id);
      setEditData(res.data);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to load user", err);
    }
  };

  const handleDelete = async (id) => {
    setConfirmDelete({ show: false, id: null });
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Users
          </h2>
          <p className="text-sm text-slate-500">
            Manage all registered users.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow text-sm font-medium"
        >
          + Add User
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border shadow-sm rounded-xl overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-3 text-left text-sm font-semibold">ID</th>
              <th className="p-3 text-left text-sm font-semibold">Username</th>
              <th className="p-3 text-left text-sm font-semibold">Email</th>
              <th className="p-3 text-left text-sm font-semibold">Role</th>
              <th className="p-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b hover:bg-slate-50 transition"
                >
                  <td className="p-3 text-sm">{u.id}</td>
                  <td className="p-3 text-sm">{u.username}</td>
                  <td className="p-3 text-sm">{u.email}</td>
                  <td className="p-3 text-sm font-medium">{u.role}</td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleEdit(u.id)}
                      className="px-3 py-1 text-sm text-primary-600 hover:text-primary-800"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        setConfirmDelete({ show: true, id: u.id })
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

      {showModal && (
        <UserModal
          close={() => setShowModal(false)}
          editData={editData}
          refresh={fetchUsers}
        />
      )}

      {confirmDelete.show && (
        <ConfirmDialog
          message="Are you sure you want to delete this user?"
          onCancel={() => setConfirmDelete({ show: false, id: null })}
          onConfirm={() => handleDelete(confirmDelete.id)}
        />
      )}
    </div>
  );
}
