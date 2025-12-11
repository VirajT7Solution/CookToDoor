import React, { useState } from "react";
import {
  createZone,
  updateZone,
} from "../../api/deliveryZoneApi";

export default function DeliveryZoneModal({
  close,
  editData,
  refresh,
}) {
  const [form, setForm] = useState({
    zoneName: editData?.zoneName || "",
  });

  const isEdit = Boolean(editData);

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);

    try {
      if (isEdit) {
        await updateZone(editData.id, form);
      } else {
        await createZone(form);
      }

      refresh();
      close();
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center p-4 z-50">
      <div className="bg-white p-6 w-full max-w-md rounded-xl shadow-xl">
        <h2 className="text-lg font-semibold mb-4">
          {isEdit ? "Edit Delivery Zone" : "Add Delivery Zone"}
        </h2>

        <div>
          <label className="text-sm text-slate-600">Zone Name</label>
          <input
            type="text"
            name="zoneName"
            value={form.zoneName}
            onChange={(e) =>
              setForm({ ...form, zoneName: e.target.value })
            }
            className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
          />
        </div>

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
