import axiosClient from './axiosClient';
import type {
  ProviderProfileCompleteResponse,
  ProviderDetailsRequest,
  ProviderDetailsResponse,
  ProviderDetailsGetResponse,
} from '../types/provider.types';

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
};
