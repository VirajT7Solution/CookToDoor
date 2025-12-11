// src/pages/Users/EditUserModal.jsx
import React, { useState } from "react";
import { updateUser } from "../../api/usersApi";

export default function EditUserModal({ user, onClose }) {
  const [form, setForm] = useState({
    username: user.username,
    email: user.email,
    role: user.role,
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const dataToSend = {
        username: form.username,
        email: form.email,
        role: form.role,
      };

      // Only include password if changed
      if (form.password.trim() !== "") {
        dataToSend.password = form.password;
      }

      await updateUser(user.id, dataToSend);
      onClose();
    } catch (err) {
      setErrorMsg("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg border">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Edit User</h2>
          <button
            className="text-slate-500 hover:text-slate-700 text-xl"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username */}
          <div>
            <label className="text-sm font-medium">Username</label>
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-medium">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-lg text-sm"
            >
              <option value="ROLE_ADMIN">Admin</option>
              <option value="ROLE_CUSTOMER">Customer</option>
              <option value="ROLE_PROVIDER">Provider</option>
              <option value="DELIVERY_PARTNER">Delivery Partner</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">
              Password <span className="text-slate-400">(leave empty to keep same)</span>
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          {/* Error */}
          {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </form>
      </div>
    </div>
  );
}
