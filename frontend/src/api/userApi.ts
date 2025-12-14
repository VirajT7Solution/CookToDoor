import axiosClient from './axiosClient';
import type { UserProfile, AddressRequest, Address } from '../types/customer.types';

export const userApi = {
  getUser: async (id: number): Promise<UserProfile> => {
    const response = await axiosClient.get<UserProfile>(`/api/users/${id}`);
    return response.data;
  },

  updateUser: async (id: number, data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await axiosClient.put<UserProfile>(`/api/users/${id}`, data);
    return response.data;
  },

  saveAddress: async (userId: number, address: AddressRequest): Promise<Address> => {
    const response = await axiosClient.post<Address>(
      `/api/users/${userId}/address`,
      address
    );
    return response.data;
  },
};


