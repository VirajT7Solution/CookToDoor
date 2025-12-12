import axiosClient from './axiosClient';
import type { PendingAmountResponse } from '../types/payout.types';

export const payoutApi = {
  /**
   * Get pending payout amount
   */
  getPendingAmount: async (): Promise<PendingAmountResponse> => {
    const response = await axiosClient.get<PendingAmountResponse>(
      '/api/providers/payouts/pending'
    );
    return response.data;
  },
};
