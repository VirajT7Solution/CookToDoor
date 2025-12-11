// src/components/users/UserDetailsModal.jsx
import React, { useEffect, useState } from "react";
import { getUserById } from "../../api/usersApi";

export default function UserDetailsModal({ userId, close }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const res = await getUserById(userId);
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
        <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6">
          <div className="text-center text-slate-500">Loading user details...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
        <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6">
          <div className="text-center text-red-500">User not found</div>
          <button
            onClick={close}
            className="mt-4 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50" onClick={close}>
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-900">User Details</h2>
          <button
            onClick={close}
            className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* User Information */}
        <div className="space-y-4">
          {/* Basic Information */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-slate-900 mb-3">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 uppercase">User ID</label>
                <p className="text-sm font-medium text-slate-900 mt-1">{user.id}</p>
              </div>

              <div>
                <label className="text-xs text-slate-500 uppercase">Username</label>
                <p className="text-sm font-medium text-slate-900 mt-1">{user.username || "N/A"}</p>
              </div>

              <div>
                <label className="text-xs text-slate-500 uppercase">Email</label>
                <p className="text-sm font-medium text-slate-900 mt-1">{user.email || "N/A"}</p>
              </div>

              <div>
                <label className="text-xs text-slate-500 uppercase">Phone Number</label>
                <p className="text-sm font-medium text-slate-900 mt-1">{user.phoneNumber || "N/A"}</p>
              </div>

              <div>
                <label className="text-xs text-slate-500 uppercase">Role</label>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  <span className="inline-block px-2 py-1 bg-sky-100 text-sky-700 rounded text-xs">
                    {user.role || "N/A"}
                  </span>
                </p>
              </div>

              {user.fullName && (
                <div>
                  <label className="text-xs text-slate-500 uppercase">Full Name</label>
                  <p className="text-sm font-medium text-slate-900 mt-1">{user.fullName}</p>
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          {user.address && (
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-slate-900 mb-3">Address Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.address.street && (
                  <div className="md:col-span-2">
                    <label className="text-xs text-slate-500 uppercase">Street</label>
                    <p className="text-sm font-medium text-slate-900 mt-1">{user.address.street}</p>
                  </div>
                )}

                {user.address.city && (
                  <div>
                    <label className="text-xs text-slate-500 uppercase">City</label>
                    <p className="text-sm font-medium text-slate-900 mt-1">{user.address.city}</p>
                  </div>
                )}

                {user.address.state && (
                  <div>
                    <label className="text-xs text-slate-500 uppercase">State</label>
                    <p className="text-sm font-medium text-slate-900 mt-1">{user.address.state}</p>
                  </div>
                )}

                {user.address.pincode && (
                  <div>
                    <label className="text-xs text-slate-500 uppercase">Pincode</label>
                    <p className="text-sm font-medium text-slate-900 mt-1">{user.address.pincode}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Account Status */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Account Status</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Status:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                user.isActive !== false 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}>
                {user.isActive !== false ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={close}
            className="px-5 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

