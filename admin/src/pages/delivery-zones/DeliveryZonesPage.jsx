// import React, { useEffect, useState } from "react";
// import {
//   getZones,
//   deleteZone,
//   getZoneById,
// } from "../../api/deliveryZonesApi";

// // import CreateZoneModal from "./CreateZoneModal";
// import CreateZoneModal from "../../components/zones/CreateZoneModal";

// import EditZoneModal from "../../components/zones/EditZoneModal";
// // import ConfirmDialog from "../../components/zones/ConfirmDialog";

// export default function DeliveryZonesPage() {
//   const [zones, setZones] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [showCreate, setShowCreate] = useState(false);
//   const [editData, setEditData] = useState(null);

//   const [confirmDelete, setConfirmDelete] = useState({
//     show: false,
//     id: null,
//   });

//   const loadZones = async () => {
//     setLoading(true);
//     try {
//       const res = await getZones();
//       setZones(res.data);
//     } catch (err) {
//       console.error("Failed to load zones", err);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadZones();
//   }, []);

//   const handleEdit = async (id) => {
//     try {
//       const res = await getZoneById(id);
//       setEditData(res.data);
//       setShowCreate(false);
//     } catch (err) {
//       console.error("Failed to load zone", err);
//     }
//   };

//   const handleDelete = async (id) => {
//     setConfirmDelete({ show: false, id: null });
//     try {
//       await deleteZone(id);
//       loadZones();
//     } catch (err) {
//       console.error("Delete failed", err);
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold">Delivery Zones</h2>

//         <button
//           onClick={() => setShowCreate(true)}
//           className="px-4 py-2 bg-primary-600 text-white rounded-lg"
//         >
//           + Add Zone
//         </button>
//       </div>

//       <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
//         <table className="min-w-full">
//           <thead className="bg-slate-50 border-b">
//             <tr>
//               <th className="p-3 text-left">ID</th>
//               <th className="p-3 text-left">Zone Name</th>
//               <th className="p-3 text-left">City</th>
//               <th className="p-3 text-left">Pincode Ranges</th>
//               <th className="p-3 text-right">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={5} className="text-center p-6">
//                   Loading...
//                 </td>
//               </tr>
//             ) : zones.length === 0 ? (
//               <tr>
//                 <td colSpan={5} className="text-center p-6">
//                   No zones found.
//                 </td>
//               </tr>
//             ) : (
//               zones.map((z) => (
//                 <tr key={z.id} className="border-b hover:bg-slate-50">
//                   <td className="p-3">{z.id}</td>
//                   <td className="p-3">{z.zoneName}</td>
//                   <td className="p-3">{z.city}</td>
//                   <td className="p-3">{z.pincodeRanges}</td>

//                   <td className="p-3 text-right">
//                     <button
//                       onClick={() => handleEdit(z.id)}
//                       className="px-3 py-1 text-sm text-primary-600"
//                     >
//                       Edit
//                     </button>

//                     <button
//                       onClick={() =>
//                         setConfirmDelete({ show: true, id: z.id })
//                       }
//                       className="ml-2 px-3 py-1 text-sm text-red-600"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {showCreate && (
//         <CreateZoneModal
//           onClose={() => setShowCreate(false)}
//           refresh={loadZones}
//         />
//       )}

//       {editData && (
//         <EditZoneModal
//           onClose={() => setEditData(null)}
//           data={editData}
//           refresh={loadZones}
//         />
//       )}

//       {confirmDelete.show && (
//         <ConfirmDialog
//           message="Delete this zone?"
//           onCancel={() => setConfirmDelete({ show: false, id: null })}
//           onConfirm={() => handleDelete(confirmDelete.id)}
//         />
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import {
  getZones,
  deleteZone,
  getZoneById,
} from "../../api/deliveryZonesApi";

import CreateZoneModal from "../../components/zones/CreateZoneModal";
import EditZoneModal from "../../components/zones/EditZoneModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";

export default function DeliveryZonesPage() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [editData, setEditData] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    id: null,
  });

  // Load all zones
  const loadZones = async () => {
    setLoading(true);
    try {
      const res = await getZones();
      setZones(res.data);
    } catch (err) {
      console.error("Failed to load zones", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadZones();
  }, []);

  // Load zone details for editing
  const handleEdit = async (id) => {
    try {
      const res = await getZoneById(id);
      setEditData(res.data);
      setShowCreate(false);
    } catch (err) {
      console.error("Failed to load zone", err);
    }
  };

  // FIXED DELETE HANDLER
  const handleDelete = async () => {
    const id = confirmDelete.id; // save before clearing state

    try {
      await deleteZone(id);
      await loadZones();
    } catch (err) {
      console.error("Delete failed", err);
    }

    // close dialog after delete
    setConfirmDelete({ show: false, id: null });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Delivery Zones</h2>

        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg"
        >
          + Add Zone
        </button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Zone Name</th>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-left">Pincode Ranges</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-6">
                  Loading...
                </td>
              </tr>
            ) : zones.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-6">
                  No zones found.
                </td>
              </tr>
            ) : (
              zones.map((z) => (
                <tr key={z.id} className="border-b hover:bg-slate-50">
                  <td className="p-3">{z.id}</td>
                  <td className="p-3">{z.zoneName}</td>
                  <td className="p-3">{z.city}</td>
                  <td className="p-3">{z.pincodeRanges}</td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleEdit(z.id)}
                      className="px-3 py-1 text-sm text-primary-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        setConfirmDelete({ show: true, id: z.id })
                      }
                      className="ml-2 px-3 py-1 text-sm text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <CreateZoneModal
          onClose={() => setShowCreate(false)}
          refresh={loadZones}
        />
      )}

      {editData && (
        <EditZoneModal
          onClose={() => setEditData(null)}
          data={editData}
          refresh={loadZones}
        />
      )}

      {confirmDelete.show && (
        <ConfirmDialog
          message="Delete this zone?"
          onCancel={() => setConfirmDelete({ show: false, id: null })}
          onConfirm={handleDelete} // FIXED
        />
      )}
    </div>
  );
}
