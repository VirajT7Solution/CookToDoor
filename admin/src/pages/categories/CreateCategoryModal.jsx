// import React, { useState } from "react";
// import { createCategory } from "../../api/categoriesApi";

// export default function CreateCategoryModal({ close, refresh }) {
//   const [form, setForm] = useState({
//     categoryName: "",
//     description: "",
//   });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await createCategory(form);
//     refresh();
//     close();
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/40">
//       <div className="bg-white p-6 w-full max-w-md rounded-xl shadow-lg">
//         <h3 className="text-lg font-semibold mb-4">Create Category</h3>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             name="categoryName"
//             placeholder="Category Name"
//             className="w-full p-2 border rounded"
//             value={form.categoryName}
//             onChange={handleChange}
//             required
//           />

//           <textarea
//             name="description"
//             placeholder="Description"
//             className="w-full p-2 border rounded"
//             rows="3"
//             value={form.description}
//             onChange={handleChange}
//           />

//           <div className="flex justify-end space-x-3">
//             <button
//               type="button"
//               onClick={close}
//               className="px-4 py-2 bg-slate-200 rounded"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-primary-600 text-white rounded"
//             >
//               Create
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { createCategory } from "../../api/categoriesApi";

export default function CreateCategoryModal({ close, refresh }) {
  const [form, setForm] = useState({
    categoryName: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCategory(form, imageFile);
      refresh();
      close();
    } catch (err) {
      console.error("Failed to create category:", err);
      alert("Failed to create category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 w-full max-w-md rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Create Category</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              name="categoryName"
              placeholder="Enter category name"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={form.categoryName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter description (optional)"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="3"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Category Image <span className="text-slate-400 text-xs">(Optional)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {imagePreview && (
              <div className="mt-3 relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            )}
            <p className="text-xs text-slate-500 mt-1">
              Supported: JPG, PNG, GIF (Max 5MB)
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300 disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}