export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  cartItemId: number;
  itemName: string;
  quantity: number;
  itemPrice: number;
  itemTotal: number;
}

export interface Order {
  id: number;
  customerId: number;
  providerId: number;
  providerName: string;
  deliveryPartnerId?: number | null;
  deliveryPartnerName?: string | null;
  orderStatus: OrderStatus;
  cartItems: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  platformCommission: number;
  totalAmount: number;
  deliveryAddress: string;
  orderTime: string;
  estimatedDeliveryTime?: string | null;
  deliveryTime?: string | null;
  hasOTP?: boolean;
  otpExpiresAt?: string | null;
}

export interface UpdateOrderStatusRequest {
  orderStatus: OrderStatus;
  estimatedDeliveryTime?: string | null;
}
