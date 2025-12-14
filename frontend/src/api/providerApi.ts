import axiosClient from './axiosClient';
import type {
  ProviderProfileCompleteResponse,
  ProviderDetailsRequest,
  ProviderDetailsResponse,
  ProviderDetailsGetResponse,
} from '../types/provider.types';
import type {
  DeliveryPartner,
  DeliveryPartnerCreateRequest,
  DeliveryPartnerUpdateRequest,
} from '../types/deliveryPartner.types';

export const providerApi = {
  /**
   * Check if provider profile is complete
   */
  checkProfileComplete: async (): Promise<ProviderProfileCompleteResponse> => {
    const response = await axiosClient.get<ProviderProfileCompleteResponse>(
      '/api/provider/profile-complete'
    );
    return response.data;
  },

  /**
   * Get provider details
   */
  getDetails: async (): Promise<ProviderDetailsGetResponse> => {
    const response = await axiosClient.get<ProviderDetailsGetResponse>(
      '/api/provider/details'
    );
    return response.data;
  },

  /**
   * Save/Update provider details
   */
  saveDetails: async (
    data: ProviderDetailsRequest
  ): Promise<ProviderDetailsResponse> => {
    const response = await axiosClient.post<ProviderDetailsResponse>(
      '/api/provider/details',
      data
    );
    return response.data;
  },

  // ==================== Delivery Partner Management ====================

  /**
   * Get all delivery partners for the current provider
   */
  getDeliveryPartners: async (): Promise<DeliveryPartner[]> => {
    const response = await axiosClient.get<DeliveryPartner[]>(
      '/api/providers/delivery-partners'
    );
    return response.data;
  },

  /**
   * Get available delivery partners (isAvailable = true)
   */
  getAvailableDeliveryPartners: async (): Promise<DeliveryPartner[]> => {
    const response = await axiosClient.get<DeliveryPartner[]>(
      '/api/providers/delivery-partners/available'
    );
    return response.data;
  },

  /**
   * Get delivery partner by ID
   */
  getDeliveryPartner: async (id: number): Promise<DeliveryPartner> => {
    const response = await axiosClient.get<DeliveryPartner>(
      `/api/providers/delivery-partners/${id}`
    );
    return response.data;
  },

  /**
   * Create a new delivery partner
   */
  createDeliveryPartner: async (
    data: DeliveryPartnerCreateRequest
  ): Promise<DeliveryPartner> => {
    const response = await axiosClient.post<DeliveryPartner>(
      '/api/providers/delivery-partners',
      data
    );
    return response.data;
  },

  /**
   * Update delivery partner
   */
  updateDeliveryPartner: async (
    id: number,
    data: DeliveryPartnerUpdateRequest
  ): Promise<DeliveryPartner> => {
    const response = await axiosClient.put<DeliveryPartner>(
      `/api/providers/delivery-partners/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete delivery partner
   */
  deleteDeliveryPartner: async (id: number): Promise<void> => {
    await axiosClient.delete(`/api/providers/delivery-partners/${id}`);
  },
};
