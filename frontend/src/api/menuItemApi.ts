import axiosClient from './axiosClient';
import type {
  MenuItem,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
} from '../types/menuItem.types';

export const menuItemApi = {
  /**
   * Get all menu items for the current provider
   */
  getMenuItems: async (): Promise<MenuItem[]> => {
    const response = await axiosClient.get<MenuItem[]>('/api/providers/menu-items');
    return response.data;
  },

  /**
   * Get menu item by ID
   */
  getMenuItem: async (id: number): Promise<MenuItem> => {
    const response = await axiosClient.get<MenuItem>(`/api/providers/menu-items/${id}`);
    return response.data;
  },

  /**
   * Create menu item (multipart/form-data)
   */
  createMenuItem: async (
    data: CreateMenuItemRequest,
    image?: File
  ): Promise<MenuItem> => {
    const formData = new FormData();
    formData.append(
      'data',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );
    if (image) {
      formData.append('image', image);
    }

    const response = await axiosClient.post<MenuItem>(
      '/api/providers/menu-items',
      formData
      // Note: Don't set Content-Type header - let browser set it with boundary
    );
    return response.data;
  },

  /**
   * Update menu item (multipart/form-data)
   */
  updateMenuItem: async (
    id: number,
    data: UpdateMenuItemRequest,
    image?: File
  ): Promise<MenuItem> => {
    const formData = new FormData();
    formData.append(
      'data',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );
    if (image) {
      formData.append('image', image);
    }

    const response = await axiosClient.put<MenuItem>(
      `/api/providers/menu-items/${id}`,
      formData
      // Note: Don't set Content-Type header - let browser set it with boundary
    );
    return response.data;
  },

  /**
   * Toggle menu item availability
   */
  toggleAvailability: async (
    id: number,
    available: boolean
  ): Promise<MenuItem> => {
    const response = await axiosClient.patch<MenuItem>(
      `/api/providers/menu-items/${id}/availability`,
      { available }
    );
    return response.data;
  },

  /**
   * Delete menu item (soft delete)
   */
  deleteMenuItem: async (id: number): Promise<void> => {
    await axiosClient.delete(`/api/providers/menu-items/${id}`);
  },
};
