// src/components/layout/Topbar.jsx
import React from "react";
import { useAuthStore } from "../../store/authStore";
import logoImage from "../../assets/images/1.png";

export default function Topbar({ title }) {
  const { username, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <img
          src={logoImage}
          alt="PlateMate Logo"
          className="h-8 w-auto object-contain hidden md:block"
        />
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-600 hidden sm:block">
          Logged in as{" "}
          <span className="font-medium text-slate-900">{username}</span>
        </span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
