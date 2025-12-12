import axiosClient from './axiosClient';
import type { Category } from '../types/menuItem.types';

export const categoryApi = {
  /**
   * Get all categories
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosClient.get<Category[]>('/api/categories');
    return response.data;
  },
};
