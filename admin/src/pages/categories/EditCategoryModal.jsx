// import React, { useState } from "react";
// import { updateCategory } from "../../api/categoriesApi";

// export default function EditCategoryModal({ close, data, refresh }) {
//   const [form, setForm] = useState({
//     categoryName: data.categoryName,
//     description: data.description,
//   });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const submit = async (e) => {
//     e.preventDefault();
//     await updateCategory(data.id, form);
//     refresh();
//     close();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//       <div className="bg-white p-6 w-full max-w-md rounded-xl">
//         <h3 className="text-lg font-semibold mb-4">Edit Category</h3>

//         <form className="space-y-4" onSubmit={submit}>
//           <input
//             name="categoryName"
//             className="w-full p-2 border rounded"
//             placeholder="Category Name"
//             value={form.categoryName}
//             onChange={handleChange}
//           />

//           <textarea
//             name="description"
//             className="w-full p-2 border rounded"
//             rows="3"
//             value={form.description}
//             onChange={handleChange}
//           />

//           <div className="flex justify-end space-x-3">
//             <button onClick={close} type="button" className="px-4 py-2 bg-slate-200 rounded">
//               Cancel
//             </button>

//             <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded">
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { updateCategory } from "../../api/categoriesApi";

export default function EditCategoryModal({ close, data, refresh }) {
  const [form, setForm] = useState({
    categoryName: data.categoryName,
    description: data.description || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    data.imageBase64
      ? `data:${data.imageFileType || "image/jpeg"};base64,${data.imageBase64}`
      : null
  );
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

  const handleRemoveNewImage = () => {
    setImageFile(null);
    // Reset to original image if exists
    if (data.imageBase64) {
      setImagePreview(
        `data:${data.imageFileType || "image/jpeg"};base64,${data.imageBase64}`
      );
    } else {
      setImagePreview(null);
    }
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // If imageFile is provided, it will replace the existing image
      // If imageFile is null, the existing image will remain unchanged
      await updateCategory(data.id, form, imageFile);
      refresh();
      close();
    } catch (err) {
      console.error("Failed to update category:", err);
      alert("Failed to update category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-full max-w-md rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Edit Category</h3>

        <form className="space-y-4" onSubmit={submit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              name="categoryName"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Category Name"
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
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="3"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Category Image
            </label>
            
            {/* Current/New Image Preview */}
            {imagePreview && (
              <div className="mb-3 relative inline-block">
                <img
                  src={imagePreview}
                  alt={imageFile ? "New Image Preview" : "Current Image"}
                  className="w-32 h-32 object-cover rounded border"
                />
                {imageFile && (
                  <>
                    <button
                      type="button"
                      onClick={handleRemoveNewImage}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      title="Cancel new image"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-green-500/80 text-white text-xs p-1 text-center rounded-b">
                      New Image Selected
                    </div>
                  </>
                )}
                {!imageFile && data.imageBase64 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center rounded-b">
                    Current Image
                  </div>
                )}
              </div>
            )}

            {/* File Input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            
            <p className="text-xs text-slate-500 mt-1">
              {imageFile 
                ? "New image will replace the current one when you save" 
                : imagePreview 
                  ? "Select a new image to replace the current one"
                  : "Select an image to upload (Max 5MB)"}
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={close}
              type="button"
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}