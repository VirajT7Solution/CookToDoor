// // // src/pages/categories/CategoriesPage.jsx
// // import React, { useEffect, useState } from "react";
// // import {
// //   getCategories,
// //   deleteCategory,
// //   getCategoryById,
// // } from "../../api/categoriesApi";

// // import CreateCategoryModal from "./CreateCategoryModal";
// // import EditCategoryModal from "./EditCategoryModal";

// // export default function CategoriesPage() {
// //   const [categories, setCategories] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const [showCreate, setShowCreate] = useState(false);
// //   const [editData, setEditData] = useState(null);

// //   const fetchData = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await getCategories();
// //       setCategories(res.data);
// //     } catch (err) {
// //       console.error("Failed loading categories:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchData();
// //   }, []);

// //   const handleEdit = async (id) => {
// //     try {
// //       const res = await getCategoryById(id);
// //       setEditData(res.data);
// //       setShowCreate(false);
// //     } catch (err) {
// //       console.log(err);
// //     }
// //   };

// //   const handleDelete = async (id) => {
// //     try {
// //       await deleteCategory(id);
// //       fetchData();
// //     } catch (err) {
// //       console.error("Delete error:", err);
// //     }
// //   };

// //   return (
// //     <div className="p-6">
// //       <div className="flex justify-between items-center mb-6">
// //         <h2 className="text-xl font-semibold">Categories</h2>

// //         <button
// //           onClick={() => setShowCreate(true)}
// //           className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm shadow hover:bg-primary-700"
// //         >
// //           + Add Category
// //         </button>
// //       </div>

// //       <div className="bg-white border rounded-xl shadow overflow-hidden">
// //         <table className="min-w-full">
// //           <thead className="bg-slate-50 border-b">
// //             <tr>
// //               <th className="p-3 text-left text-sm font-semibold">ID</th>
// //               <th className="p-3 text-left text-sm font-semibold">Name</th>
// //               <th className="p-3 text-left text-sm font-semibold">Description</th>
// //               <th className="p-3 text-right text-sm font-semibold">Actions</th>
// //             </tr>
// //           </thead>

// //           <tbody>
// //             {loading ? (
// //               <tr>
// //                 <td colSpan="4" className="p-4 text-center text-slate-500">
// //                   Loading…
// //                 </td>
// //               </tr>
// //             ) : categories.length === 0 ? (
// //               <tr>
// //                 <td colSpan="4" className="p-4 text-center text-slate-500">
// //                   No categories found.
// //                 </td>
// //               </tr>
// //             ) : (
// //               categories.map((c) => (
// //                 <tr key={c.id} className="border-b">
// //                   <td className="p-3 text-sm">{c.id}</td>
// //                   <td className="p-3 text-sm">{c.categoryName}</td>
// //                   <td className="p-3 text-sm">{c.description}</td>

// //                   <td className="p-3 text-right space-x-3">
// //                     <button
// //                       onClick={() => handleEdit(c.id)}
// //                       className="text-primary-600 text-sm hover:text-primary-800"
// //                     >
// //                       Edit
// //                     </button>

// //                     <button
// //                       onClick={() => handleDelete(c.id)}
// //                       className="text-red-600 text-sm hover:text-red-800"
// //                     >
// //                       Delete
// //                     </button>
// //                   </td>
// //                 </tr>
// //               ))
// //             )}
// //           </tbody>
// //         </table>
// //       </div>

// //       {showCreate && (
// //         <CreateCategoryModal
// //           close={() => setShowCreate(false)}
// //           refresh={fetchData}
// //         />
// //       )}

// //       {editData && (
// //         <EditCategoryModal
// //           close={() => setEditData(null)}
// //           data={editData}
// //           refresh={fetchData}
// //         />
// //       )}
// //     </div>
// //   );
// // }

// <div className="bg-white border rounded-xl shadow overflow-hidden">
//   <table className="min-w-full">
//     <thead className="bg-slate-50 border-b">
//       <tr>
//         <th className="p-3 text-left text-sm font-semibold">ID</th>
//         <th className="p-3 text-left text-sm font-semibold">Image</th>
//         <th className="p-3 text-left text-sm font-semibold">Name</th>
//         <th className="p-3 text-left text-sm font-semibold">Description</th>
//         <th className="p-3 text-right text-sm font-semibold">Actions</th>
//       </tr>
//     </thead>

//     <tbody>
//       {loading ? (
//         <tr>
//           <td colSpan="5" className="p-4 text-center text-slate-500">
//             Loading…
//           </td>
//         </tr>
//       ) : categories.length === 0 ? (
//         <tr>
//           <td colSpan="5" className="p-4 text-center text-slate-500">
//             No categories found.
//           </td>
//         </tr>
//       ) : (
//         categories.map((c) => (
//           <tr key={c.id} className="border-b">
//             <td className="p-3 text-sm">{c.id}</td>

//             {/* ⭐ CATEGORY IMAGE */}
//             <td className="p-3 text-sm">
//               {c.imageBase64 ? (
//                 <img
//                   src={`data:${c.imageFileType};base64,${c.imageBase64}`}
//                   alt={c.categoryName}
//                   className="w-12 h-12 object-cover rounded shadow-sm border"
//                 />
//               ) : (
//                 <div className="w-12 h-12 bg-gray-200 border rounded flex items-center justify-center text-xs text-gray-500">
//                   No Img
//                 </div>
//               )}
//             </td>

//             <td className="p-3 text-sm">{c.categoryName}</td>
//             <td className="p-3 text-sm">{c.description}</td>

//             <td className="p-3 text-right space-x-3">
//               <button
//                 onClick={() => handleEdit(c.id)}
//                 className="text-primary-600 text-sm hover:text-primary-800"
//               >
//                 Edit
//               </button>

//               <button
//                 onClick={() => handleDelete(c.id)}
//                 className="text-red-600 text-sm hover:text-red-800"
//               >
//                 Delete
//               </button>
//             </td>
//           </tr>
//         ))
//       )}
//     </tbody>
//   </table>
// </div>

// src/pages/categories/CategoriesPage.jsx
import React, { useEffect, useState } from "react";
import {
  getCategories,
  deleteCategory,
  getCategoryById,
} from "../../api/categoriesApi";

import CreateCategoryModal from "./CreateCategoryModal";
import EditCategoryModal from "./EditCategoryModal";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      console.log("Categories data:", res.data); // Debug: Check if image data is present
      setCategories(res.data);
    } catch (err) {
      console.error("Failed loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = async (id) => {
    try {
      const res = await getCategoryById(id);
      setEditData(res.data);
      setShowCreate(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Helper function to render image
  const renderImage = (category) => {
    if (category.imageBase64) {
      const imageSrc = `data:${category.imageFileType || "image/jpeg"};base64,${
        category.imageBase64
      }`;
      return (
        <img
          src={imageSrc}
          alt={category.categoryName || "Category"}
          className="w-16 h-16 object-cover rounded border"
          onError={(e) => {
            console.error("Image load error:", e);
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      );
    }
    return (
      <div className="w-16 h-16 bg-slate-200 rounded border flex items-center justify-center text-xs text-slate-400">
        No Image
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Categories</h2>

        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm shadow hover:bg-primary-700"
        >
          + Add Category
        </button>
      </div>

      <div className="bg-white border rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-3 text-left text-sm font-semibold">ID</th>
              <th className="p-3 text-left text-sm font-semibold">Image</th>
              <th className="p-3 text-left text-sm font-semibold">Name</th>
              <th className="p-3 text-left text-sm font-semibold">
                Description
              </th>
              <th className="p-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-500">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((c) => (
                <tr key={c.id} className="border-b hover:bg-slate-50">
                  <td className="p-3 text-sm">{c.id}</td>
                  <td className="p-3">{renderImage(c)}</td>
                  <td className="p-3 text-sm font-medium">{c.categoryName}</td>
                  <td className="p-3 text-sm text-slate-600">
                    {c.description || "—"}
                  </td>

                  <td className="p-3 text-right space-x-3">
                    <button
                      onClick={() => handleEdit(c.id)}
                      className="text-primary-600 text-sm hover:text-primary-800"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-600 text-sm hover:text-red-800"
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
        <CreateCategoryModal
          close={() => setShowCreate(false)}
          refresh={fetchData}
        />
      )}

      {editData && (
        <EditCategoryModal
          close={() => setEditData(null)}
          data={editData}
          refresh={fetchData}
        />
      )}
    </div>
  );
}
