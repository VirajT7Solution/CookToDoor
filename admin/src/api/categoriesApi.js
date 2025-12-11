// src/api/categoriesApi.js
import api from "./axiosClient";

// GET ALL
export const getCategories = () => api.get("/api/categories");

// GET ONE
export const getCategoryById = (id) =>
  api.get(`/api/categories/${id}`);

// CREATE - Handles image upload via FormData
export const createCategory = (data, imageFile = null) => {
  const formData = new FormData();
  
  // Create JSON string for the data part
  const dataJson = JSON.stringify({
    categoryName: data.categoryName,
    description: data.description || "",
  });
  
  formData.append("data", new Blob([dataJson], { type: "application/json" }));
  
  // Add image if provided
  if (imageFile) {
    formData.append("image", imageFile);
  }
  
  return api.post("/api/categories", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// UPDATE - Handles image update via FormData
// If imageFile is provided, it replaces the existing image
// If imageFile is null/undefined, existing image remains unchanged
export const updateCategory = (id, data, imageFile = null) => {
  const formData = new FormData();
  
  // Create JSON string for the data part
  const dataJson = JSON.stringify({
    categoryName: data.categoryName,
    description: data.description || "",
  });
  
  formData.append("data", new Blob([dataJson], { type: "application/json" }));
  
  // Only append image if a new file is provided
  // If imageFile is null, we don't append it, so backend keeps existing image
  if (imageFile) {
    formData.append("image", imageFile);
  }
  
  return api.put(`/api/categories/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// DELETE
export const deleteCategory = (id) =>
  api.delete(`/api/categories/${id}`);