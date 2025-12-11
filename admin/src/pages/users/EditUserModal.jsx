// src/pages/users/EditUserModal.jsx
import React, { useEffect, useState } from "react";
import { updateUser, getUserById } from "../../api/usersApi";

export default function EditUserModal({ id, close, refresh }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadUser = async () => {
    try {
      const res = await getUserById(id);
      setForm(res.data);
    } catch (err) {
      console.error("Failed to load user", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await updateUser(id, form);
      refresh();
      close();
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Edit User</h2>

        <div className="space-y-3">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="input"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="input"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="input"
          >
            <option value="ROLE_CUSTOMER">Customer</option>
            <option value="ROLE_PROVIDER">Provider</option>
            <option value="ROLE_ADMIN">Admin</option>
          </select>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button className="btn-secondary" onClick={close}>
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={saving}
          >
            {saving ? "Saving..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
