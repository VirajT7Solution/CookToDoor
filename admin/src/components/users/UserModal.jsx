// src/components/users/UserModal.jsx
import React, { useState } from "react";
import { createUser, updateUser } from "../../api/userApi";

export default function UserModal({ close, editData, refresh }) {
  const [form, setForm] = useState({
    username: editData?.username || "",
    email: editData?.email || "",
    password: "",
    role: editData?.role || "ROLE_CUSTOMER",
  });

  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(editData);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      if (isEdit) {
        await updateUser(editData.id, form);
      } else {
        await createUser(form);
      }

      refresh();
      close();
    } catch (err) {
      console.error("User save failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">
        <h2 className="text-lg font-semibold mb-4">
          {isEdit ? "Edit User" : "Add New User"}
        </h2>

        <div className="space-y-4">
          {/* Username */}
          <div>
            <label className="text-sm text-slate-600">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-slate-600">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Password (only in add OR optional in edit) */}
          <div>
            <label className="text-sm text-slate-600">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
              placeholder={isEdit ? "Leave blank to keep unchanged" : ""}
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-sm text-slate-600">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
            >
              <option value="ROLE_ADMIN">Admin</option>
              <option value="ROLE_CUSTOMER">Customer</option>
              <option value="ROLE_PROVIDER">Provider</option>
              <option value="DELIVERY_PARTNER">Delivery Partner</option>
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={close}
            className="px-4 py-2 text-sm border rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700"
          >
            {loading ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
