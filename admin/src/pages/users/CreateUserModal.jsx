// src/pages/users/CreateUserModal.jsx
import React, { useState } from "react";
import { createUser } from "../../api/usersApi";

export default function CreateUserModal({ close, refresh }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "ROLE_CUSTOMER",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createUser(form);
      refresh();
      close();
    } catch (err) {
      console.error("Create user failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Add New User</h2>

        <div className="space-y-3">
          <input
            name="username"
            placeholder="Username"
            className="input"
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            className="input"
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="input"
            onChange={handleChange}
          />

          <select
            name="role"
            className="input"
            onChange={handleChange}
          >
            <option value="ROLE_CUSTOMER">Customer</option>
            <option value="ROLE_PROVIDER">Provider</option>
            <option value="ROLE_ADMIN">Admin</option>
          </select>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button onClick={close} className="btn-secondary">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
