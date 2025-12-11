// src/pages/users/UsersPage.jsx
import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../api/usersApi";

import CreateUserModal from "./components/CreateUserModal";
import EditUserModal from "./components/EditUserModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="p-6">Loading users...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-slate-900">Users</h1>

        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm hover:bg-sky-700"
        >
          + Add User
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="p-3">{u.id}</td>
                <td className="p-3">{u.username}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>

                <td className="p-3 space-x-2">
                  <button
                    onClick={() => setEditUser(u)}
                    className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteUserId(u.id)}
                    className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td className="p-6 text-center text-slate-500" colSpan={5}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onSuccess={fetchUsers}
        />
      )}

      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSuccess={fetchUsers}
        />
      )}

      {deleteUserId && (
        <DeleteConfirmModal
          id={deleteUserId}
          onClose={() => setDeleteUserId(null)}
          onConfirm={async () => {
            await deleteUser(deleteUserId);
            setDeleteUserId(null);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}
