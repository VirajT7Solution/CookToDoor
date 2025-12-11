// src/pages/Login.jsx
import React, { useState } from "react";
import { loginApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import logoImage from "../assets/images/1.png";

export default function Login() {
  const { login } = useAuthStore();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await loginApi(form);
      const data = res.data;

      login({
        token: data.token,
        refreshToken: data.refreshToken,
        username: data.username,
        role: data.role,
      });
    } catch (err) {
      console.error(err);
      setErrorMsg("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white w-full max-w-sm p-8 rounded-2xl shadow-md border border-slate-200">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logoImage}
            alt="PlateMate Logo"
            className="h-16 w-auto object-contain mb-4"
          />
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">
            PlateMate Admin
          </h1>
          <p className="text-sm text-slate-500">
            Sign in to manage users, providers, orders & payouts.
          </p>
        </div>

        {!showForgotPassword ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-medium text-slate-600">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-xs text-sky-600 hover:text-sky-700"
              >
                Forgot Password?
              </button>
            </div>

            {errorMsg && <p className="text-xs text-red-600 mt-1">{errorMsg}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium mt-2"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        ) : (
          <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
        )}
      </div>
    </div>
  );
}
