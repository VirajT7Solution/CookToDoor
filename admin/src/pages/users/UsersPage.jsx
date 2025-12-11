// // src/pages/users/UsersPage.jsx
// import React, { useEffect, useState } from "react";
// import {
//   getUsers,
//   deleteUser,
//   getUserById,
// } from "../../api/usersApi";

// import CreateUserModal from "./CreateUserModal";
// import EditUserModal from "./EditUserModal";
// import DeleteConfirmModal from "./DeleteConfirmModal";

// export default function UsersPage() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Modal Controls
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [editUserId, setEditUserId] = useState(null);
//   const [deleteUserId, setDeleteUserId] = useState(null);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const res = await getUsers();
//       setUsers(res.data);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   return (
//     <div className="p-6">
//       {/* HEADER */}
//       <div className="flex justify-between mb-6">
//         <div>
//           <h2 className="text-xl font-semibold">Users</h2>
//           <p className="text-sm text-slate-500">
//             Manage all registered users.
//           </p>
//         </div>

//         <button
//           onClick={() => setShowCreateModal(true)}
//           className="px-4 py-2 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700"
//         >
//           + Add User
//         </button>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white border rounded-lg shadow">
//         <table className="min-w-full">
//           <thead className="bg-slate-100">
//             <tr>
//               <th className="p-3 text-left text-sm font-semibold">ID</th>
//               <th className="p-3 text-left text-sm font-semibold">Username</th>
//               <th className="p-3 text-left text-sm font-semibold">Email</th>
//               <th className="p-3 text-left text-sm font-semibold">Role</th>
//               <th className="p-3 text-right text-sm font-semibold">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={5} className="p-5 text-center text-slate-500">
//                   Loading...
//                 </td>
//               </tr>
//             ) : users.length === 0 ? (
//               <tr>
//                 <td colSpan={5} className="p-5 text-center text-slate-500">
//                   No users found.
//                 </td>
//               </tr>
//             ) : (
//               users.map((user) => (
//                 <tr key={user.id} className="border-b hover:bg-slate-50">
//                   <td className="p-3 text-sm">{user.id}</td>
//                   <td className="p-3 text-sm">{user.username}</td>
//                   <td className="p-3 text-sm">{user.email}</td>
//                   <td className="p-3 text-sm font-medium">{user.role}</td>

//                   <td className="p-3 text-right">
//                     <button
//                       onClick={() => setEditUserId(user.id)}
//                       className="px-3 py-1 text-primary-600 hover:text-primary-800 text-sm"
//                     >
//                       Edit
//                     </button>

//                     <button
//                       onClick={() => setDeleteUserId(user.id)}
//                       className="px-3 py-1 text-red-600 hover:text-red-800 text-sm"
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

//       {/* MODALS */}
//       {showCreateModal && (
//         <CreateUserModal
//           close={() => setShowCreateModal(false)}
//           refresh={fetchUsers}
//         />
//       )}

//       {editUserId && (
//         <EditUserModal
//           id={editUserId}
//           close={() => setEditUserId(null)}
//           refresh={fetchUsers}
//         />
//       )}

//       {deleteUserId && (
//         <DeleteConfirmModal
//           id={deleteUserId}
//           close={() => setDeleteUserId(null)}
//           refresh={fetchUsers}
//         />
//       )}
//     </div>
//   );
// }

// src/pages/users/UsersPage.jsx
import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, getUserById } from "../../api/usersApi";

import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import UserDetailsModal from "../../components/users/UserDetailsModal";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Controls
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [viewDetailsUserId, setViewDetailsUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Users</h2>
          <p className="text-sm text-slate-600">
            Manage all registered users in your system.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700 transition-all active:scale-95"
        >
          + Add User
        </button>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden transition-all">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-100">
              <tr className="text-left">
                <th className="p-3 text-sm font-semibold">ID</th>
                <th className="p-3 text-sm font-semibold">Username</th>
                <th className="p-3 text-sm font-semibold">Email</th>
                <th className="p-3 text-sm font-semibold">Role</th>
                <th className="p-3 text-right text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="animate-fadeIn">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-5 text-center text-slate-500">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-5 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-slate-50 transition-all"
                  >
                    <td className="p-3 text-sm">{user.id}</td>
                    <td className="p-3 text-sm">{user.username}</td>
                    <td className="p-3 text-sm">{user.email}</td>
                    <td className="p-3 text-sm">{user.role}</td>

                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => setViewDetailsUserId(user.id)}
                        className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm transition"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => setEditUserId(user.id)}
                        className="px-3 py-1 text-sky-600 hover:text-sky-800 text-sm transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteUserId(user.id)}
                        className="px-3 py-1 text-red-600 hover:text-red-800 text-sm transition"
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

        {/* Mobile Card Layout */}
        <div className="md:hidden space-y-4 p-3 animate-fadeIn">
          {loading ? (
            <p className="text-center text-slate-500">Loading...</p>
          ) : users.length === 0 ? (
            <p className="text-center text-slate-500">No users found.</p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-slate-900">
                    {user.username}
                  </p>
                  <span className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded">
                    {user.role}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mt-1">{user.email}</p>

                <div className="flex justify-end gap-3 mt-3">
                  <button
                    onClick={() => setViewDetailsUserId(user.id)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => setEditUserId(user.id)}
                    className="text-sky-600 text-sm hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteUserId(user.id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODALS */}
      {showCreateModal && (
        <CreateUserModal
          close={() => setShowCreateModal(false)}
          refresh={fetchUsers}
        />
      )}

      {editUserId && (
        <EditUserModal
          id={editUserId}
          close={() => setEditUserId(null)}
          refresh={fetchUsers}
        />
      )}

      {deleteUserId && (
        <DeleteConfirmModal
          id={deleteUserId}
          close={() => setDeleteUserId(null)}
          refresh={fetchUsers}
        />
      )}

      {viewDetailsUserId && (
        <UserDetailsModal
          userId={viewDetailsUserId}
          close={() => setViewDetailsUserId(null)}
        />
      )}
    </div>
  );
}
