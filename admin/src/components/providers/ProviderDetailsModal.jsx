// src/components/providers/ProviderDetailsModal.jsx
import React, { useEffect, useState } from "react";
import { getProviderById } from "../../api/providersApi";
import { getDeliveryPartners } from "../../api/deliveryPartnersApi";

export default function ProviderDetailsModal({ providerId, close }) {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [partnersLoading, setPartnersLoading] = useState(false);

  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        setLoading(true);
        const res = await getProviderById(providerId);
        setProvider(res.data);
      } catch (error) {
        console.error("Error fetching provider details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (providerId) {
      fetchProviderDetails();
    }
  }, [providerId]);

  // Fetch all delivery partners (admin scoped) and filter by this provider
  useEffect(() => {
    const fetchPartners = async () => {
      if (!providerId) return;
      try {
        setPartnersLoading(true);
        const res = await getDeliveryPartners();
        // backend returns providerId in response DTO; filter by current provider
        const list = Array.isArray(res.data)
          ? res.data.filter((p) => p.providerId === providerId)
          : [];
        setDeliveryPartners(list);
      } catch (error) {
        console.error("Error fetching delivery partners for provider:", error);
      } finally {
        setPartnersLoading(false);
      }
    };

    fetchPartners();
  }, [providerId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
        <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-6">
          <div className="text-center text-slate-500">
            Loading provider details...
          </div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
        <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-8 border border-red-100">
          <div className="text-center text-red-500">Provider not found</div>
          <button
            onClick={close}
            className="mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-900 transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50"
      onClick={close}
    >
      <div
        className="bg-gradient-to-br from-slate-50 via-white to-sky-50 w-full max-w-4xl rounded-2xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold mb-2 border border-sky-100">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-500" />
              Provider Profile
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
              {provider.businessName || "Provider Details"}
            </h2>
            {provider.user?.username && (
              <p className="mt-1 text-sm text-slate-500">
                Managed by{" "}
                <span className="font-medium text-slate-800">
                  {provider.user.username}
                </span>
              </p>
            )}
          </div>
          <button
            onClick={close}
            className="text-slate-400 hover:text-slate-600 text-2xl leading-none rounded-full hover:bg-slate-100 w-8 h-8 flex items-center justify-center transition-colors"
          >
            ×
          </button>
        </div>

        {/* Provider Information & Layout */}
        <div className="space-y-5">
          {/* Top summary strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/80 border border-slate-100 rounded-xl p-4 shadow-sm flex items-start gap-3">
              <div className="mt-1">
                <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sky-700">
                  <span className="text-lg font-semibold">#{provider.id}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Provider ID
                </p>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  #{provider.id}
                </p>
              </div>
            </div>

            <div className="bg-white/80 border border-slate-100 rounded-xl p-4 shadow-sm flex items-start gap-3">
              <div className="mt-1">
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <span className="text-lg font-semibold">%</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Commission
                </p>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {provider.commissionRate != null
                    ? `${provider.commissionRate}%`
                    : "Not set"}
                </p>
              </div>
            </div>

            <div className="bg-white/80 border border-slate-100 rounded-xl p-4 shadow-sm flex items-start gap-3">
              <div className="mt-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    provider.isVerified
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  <span className="text-lg font-semibold">
                    {provider.isVerified ? "✓" : "!"}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Verification
                </p>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {provider.isVerified ? "Verified" : "Pending verification"}
                </p>
              </div>
            </div>
          </div>

          {/* Two-column detailed layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left column: basic + contact */}
            <div className="space-y-4 lg:col-span-2">
              {/* Basic Information */}
              <div className="bg-white/80 rounded-xl p-4 border border-slate-100 space-y-3 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <span className="inline-block w-1 h-6 rounded-full bg-sky-400" />
                    Basic Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 uppercase">
                      Business Name
                    </label>
                    <p className="text-sm font-medium text-slate-900 mt-1">
                      {provider.businessName || "N/A"}
                    </p>
                  </div>

                  {provider.description && (
                    <div className="md:col-span-2">
                      <label className="text-xs text-slate-500 uppercase">
                        Description
                      </label>
                      <p className="text-sm text-slate-900 mt-1">
                        {provider.description}
                      </p>
                    </div>
                  )}

                  {provider.user && (
                    <>
                      <div>
                        <label className="text-xs text-slate-500 uppercase">
                          Owner Username
                        </label>
                        <p className="text-sm font-medium text-slate-900 mt-1">
                          {provider.user.username || "N/A"}
                        </p>
                      </div>

                      <div>
                        <label className="text-xs text-slate-500 uppercase">
                          Owner Email
                        </label>
                        <p className="text-sm font-medium text-slate-900 mt-1">
                          {provider.user.email || "N/A"}
                        </p>
                      </div>

                      {provider.user.phoneNumber && (
                        <div>
                          <label className="text-xs text-slate-500 uppercase">
                            Phone Number
                          </label>
                          <p className="text-sm font-medium text-slate-900 mt-1">
                            {provider.user.phoneNumber}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Delivery Partners created/owned by this provider */}
              <div className="bg-white/80 rounded-xl p-4 border border-slate-100 space-y-3 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <span className="inline-block w-1 h-6 rounded-full bg-emerald-400" />
                      Delivery Partners
                    </h3>
                    {provider.providesDelivery && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Provides Delivery
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">
                    {partnersLoading
                      ? "Loading..."
                      : `${deliveryPartners.length} partner${
                          deliveryPartners.length === 1 ? "" : "s"
                        }`}
                  </span>
                </div>

                {partnersLoading ? (
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
                    Loading partners...
                  </p>
                ) : deliveryPartners.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No delivery partners have been added for this provider yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {deliveryPartners.map((dp) => (
                      <div
                        key={dp.id}
                        className="border border-slate-200 rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-slate-50/70 hover:bg-slate-50 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {dp.fullName || "Unnamed Partner"}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            ID: #{dp.id}{" "}
                            {dp.userId && <span>• User ID: {dp.userId}</span>}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {dp.vehicleType && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-100">
                                {dp.vehicleType}
                              </span>
                            )}
                            {dp.commissionRate != null && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                {dp.commissionRate}% commission
                              </span>
                            )}
                            {dp.serviceArea && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-50 text-slate-700 border border-slate-100">
                                {dp.serviceArea}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start md:self-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                              dp.isAvailable
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {dp.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right column: meta cards (delivery zone + address) */}
            <div className="space-y-4">
              {/* Delivery Zone Information */}
              {provider.zone && (
                <div className="bg-white/80 rounded-xl p-4 border border-slate-100 space-y-3 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Delivery Zone
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 uppercase">
                        Zone Name
                      </label>
                      <p className="text-sm font-medium text-slate-900 mt-1">
                        {provider.zone.zoneName || "N/A"}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 uppercase">
                        City
                      </label>
                      <p className="text-sm font-medium text-slate-900 mt-1">
                        {provider.zone.city || "N/A"}
                      </p>
                    </div>

                    {provider.zone.pincodeRanges && (
                      <div>
                        <label className="text-xs text-slate-500 uppercase">
                          Pincode Ranges
                        </label>
                        <p className="text-sm font-medium text-slate-900 mt-1">
                          {provider.zone.pincodeRanges}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Address Information */}
              {provider.user && provider.user.address && (
                <div className="bg-white/80 rounded-xl p-4 border border-slate-100 space-y-3 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Address
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
                    {provider.user.address.street && (
                      <div>
                        <label className="text-xs text-slate-500 uppercase">
                          Street
                        </label>
                        <p className="text-sm font-medium text-slate-900 mt-1">
                          {provider.user.address.street}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      {provider.user.address.city && (
                        <div>
                          <label className="text-xs text-slate-500 uppercase">
                            City
                          </label>
                          <p className="text-sm font-medium text-slate-900 mt-1">
                            {provider.user.address.city}
                          </p>
                        </div>
                      )}

                      {provider.user.address.state && (
                        <div>
                          <label className="text-xs text-slate-500 uppercase">
                            State
                          </label>
                          <p className="text-sm font-medium text-slate-900 mt-1">
                            {provider.user.address.state}
                          </p>
                        </div>
                      )}
                    </div>

                    {provider.user.address.pincode && (
                      <div>
                        <label className="text-xs text-slate-500 uppercase">
                          Pincode
                        </label>
                        <p className="text-sm font-medium text-slate-900 mt-1">
                          {provider.user.address.pincode}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6 border-t border-slate-100 pt-4">
          <button
            onClick={close}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition text-sm font-semibold shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
