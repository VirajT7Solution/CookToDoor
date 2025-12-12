export type PayoutStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type PayoutMethod = 'ONLINE' | 'CASH';

export interface PendingAmountResponse {
  pendingAmount: number;
}

export interface PayoutHistory {
  transactionId: number;
  providerId: number;
  businessName: string;
  amount: number;
  status: PayoutStatus;
  processedAt: string;
  razorpayxPayoutId?: string | null;
  processedBy?: number | null;
  paymentMethod: string;
}
