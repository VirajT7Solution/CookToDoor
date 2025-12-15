import axiosClient from './axiosClient';
import type { DeliveryPartner, DeliveryPartnerUpdateRequest } from '../types/deliveryPartner.types';

export const deliveryPartnerApi = {
  /**
   * Get delivery partner profile by ID
   */
  getProfile: async (id: number): Promise<DeliveryPartner> => {
    const response = await axiosClient.get<DeliveryPartner>(`/api/delivery-partners/${id}`);
    return response.data;
  },

  /**
   * Get current delivery partner profile (gets first one for the user)
   */
  getCurrentProfile: async (): Promise<DeliveryPartner> => {
    const response = await axiosClient.get<DeliveryPartner[]>('/api/delivery-partners');
    if (response.data.length === 0) {
      throw new Error('Delivery partner profile not found');
    }
    return response.data[0];
  },

  /**
   * Update delivery partner profile
   */
  updateProfile: async (
    id: number,
    data: DeliveryPartnerUpdateRequest
  ): Promise<DeliveryPartner> => {
    const response = await axiosClient.put<DeliveryPartner>(`/api/delivery-partners/${id}`, data);
    return response.data;
  },

  /**
   * Upload profile image
   */
  uploadProfileImage: async (id: number, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    // Note: Don't set Content-Type header - axios interceptor will handle it
    // This allows axios to automatically set Content-Type with boundary parameter
    const response = await axiosClient.post(`/api/delivery-partners/${id}/profile-image`, formData);
    return response.data;
  },
};


