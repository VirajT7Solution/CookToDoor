// Customer Menu Item types (different from provider's MenuItem)
export interface CustomerMenuItem {
  id: number;
  itemName: string;
  description?: string;
  price: number;
  ingredients?: string;
  mealType: 'VEG' | 'NON_VEG' | 'JAIN';
  categoryId: number;
  categoryName?: string;
  providerId: number;
  providerName?: string;
  providerBusinessName?: string;
  imageBase64List?: string[];
  imageFileTypeList?: string[];
  unitsOfMeasurement: number;
  maxQuantity: number;
  averageRating?: number;
  ratingCount?: number;
  hasUserRated?: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

// Cart Types
export interface CartItem {
  id: number;
  menuItemId: number;
  itemName: string;
  quantity: number;
  itemPrice: number;
  itemTotal: number;
  specialInstructions?: string;
  providerId: number;
  providerName: string;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  totalItems?: number;
  groupedByProvider?: Record<number, CartItem[]>;
}

export interface AddToCartRequest {
  menuItemId: number;
  quantity: number;
  specialInstructions?: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
  specialInstructions?: string;
}

// Address Types
export interface Address {
  id?: number;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  pincode: string;
  addressType?: 'HOME' | 'WORK' | 'OTHER';
}

export interface AddressRequest {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  pincode: string;
  address_type?: 'HOME' | 'WORK' | 'OTHER';
}

// Payment Types
export type PaymentMethod = 'CASH' | 'UPI';

export interface CreateOrderRequest {
  cartItemIds: number[];
  deliveryAddress: string;
  deliveryFee: number;
  paymentMethod: PaymentMethod;
}

export interface PaymentOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
}

export interface VerifyPaymentRequest {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

// Rating Types
export interface RatingReview {
  reviewId: number;
  rating: number;
  reviewText?: string;
  customerName?: string;
  createdAt: string;
}

export interface RateMenuItemRequest {
  orderId: number;
  menuItemId: number;
  rating: number;
  review?: string;
}

export interface RatingSummary {
  count: number;
  average: number;
}

// Customer Profile Types
export interface Customer {
  id: number;
  userId: number;
  fullName?: string;
  dateOfBirth?: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  phoneNumber?: string;
  role: string;
  address?: Address;
  profileImageId?: number;
}

export interface UpdateCustomerRequest {
  fullName?: string;
  dateOfBirth?: string;
}




