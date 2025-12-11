// src/pages/Users/CreateUserModal.jsx
import React, { useState } from "react";
import { createUser } from "../../api/usersApi";

export default function CreateUserModal({ onClose }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "ROLE_CUSTOMER",
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
      await createUser(form);
      onClose(); // Close & refresh parent
    } catch (err) {
      setErrorMsg("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg border">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Create User</h2>
          <button
            className="text-slate-500 hover:text-slate-700 text-xl"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label className="text-sm font-medium text-slate-700">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:ring-primary-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:ring-primary-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:ring-primary-500"
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-medium text-slate-700">Role</label>
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

          {/* Error Message */}
          {errorMsg && (
            <p className="text-sm text-red-600">{errorMsg}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}
