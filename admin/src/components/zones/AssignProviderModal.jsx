import React, { useEffect, useState } from "react";
import { assignProviderToZone } from "../../api/deliveryZoneApi";
import { getAllProviders } from "../../api/providerApi";

export default function AssignProviderModal({ zone, close, refresh }) {
  const [providers, setProviders] = useState([]);
  const [selected, setSelected] = useState(null);

  const fetchProviders = async () => {
    try {
      const res = await getAllProviders();
      setProviders(res.data);
    } catch (err) {
      console.error("Failed to load providers", err);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleAssign = async () => {
    await assignProviderToZone(zone.id, selected);
    refresh();
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">

        <h2 className="text-lg font-semibold mb-4">
          Assign Provider to Zone
        </h2>

        <p className="text-sm text-slate-600 mb-3">
          Zone: <span className="font-medium">{zone.zoneName}</span>
        </p>

        <select
          onChange={(e) => setSelected(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        >
          <option value="">Select Provider</option>
          {providers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.businessName}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={close}
            className="px-4 py-2 text-sm border rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={handleAssign}
            disabled={!selected}
            className="px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 disabled:bg-slate-300"
          >
            Assign
          </button>
        </div>

      </div>
    </div>
  );
}
