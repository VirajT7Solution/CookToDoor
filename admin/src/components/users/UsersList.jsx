import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  deleteUser
} from "../../api/usersApi";

import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Users fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.username.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">Users Management</h2>

        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm"
        >
          + Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search users..."
          className="px-3 py-2 border rounded-lg text-sm w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-3 py-2 border rounded-lg text-sm"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="ROLE_ADMIN">Admin</option>
          <option value="ROLE_CUSTOMER">Customer</option>
          <option value="ROLE_PROVIDER">Provider</option>
          <option value="DELIVERY_PARTNER">Delivery Partner</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl shadow">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-3 text-left text-sm font-semibold">ID</th>
              <th className="p-3 text-left text-sm font-semibold">Username</th>
              <th className="p-3 text-left text-sm font-semibold">Email</th>
              <th className="p-3 text-left text-sm font-semibold">Role</th>
              <th className="p-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-slate-500">
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-slate-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-3 text-sm">{user.id}</td>
                  <td className="p-3 text-sm">{user.username}</td>
                  <td className="p-3 text-sm">{user.email}</td>
                  <td className="p-3 text-sm">{user.role}</td>

                  <td className="p-3 text-sm flex gap-2">
                    <button
                      className="px-3 py-1 border rounded-md text-xs hover:bg-slate-50"
                      onClick={() => setEditUser(user)}
                    >
                      Edit
                    </button>

                    <button
                      className="px-3 py-1 border rounded-md text-xs text-red-600 hover:bg-red-50"
                      onClick={() => setDeleteUserId(user.id)}
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
      {showCreate && <CreateUserModal onClose={() => { setShowCreate(false); fetchUsers(); }} />}

      {editUser && <EditUserModal user={editUser} onClose={() => { setEditUser(null); fetchUsers(); }} />}

      {deleteUserId && (
        <DeleteConfirmModal
          id={deleteUserId}
          onClose={() => setDeleteUserId(null)}
          onDelete={async () => {
            await deleteUser(deleteUserId);
            setDeleteUserId(null);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}
