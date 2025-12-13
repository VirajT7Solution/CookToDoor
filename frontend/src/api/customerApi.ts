import axiosClient from './axiosClient';
import type {
  CustomerMenuItem,
  PaginatedResponse,
  CartSummary,
  AddToCartRequest,
  UpdateCartItemRequest,
  CartItem,
  CreateOrderRequest,
  PaymentOrderResponse,
  VerifyPaymentRequest,
  RatingReview,
  RateMenuItemRequest,
  RatingSummary,
} from '../types/customer.types';
import type { Order } from '../types/order.types';

export const customerApi = {
  // Menu Items
  getMenuItems: async (params?: {
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PaginatedResponse<CustomerMenuItem>> => {
    const response = await axiosClient.get<PaginatedResponse<CustomerMenuItem>>(
      '/api/customers/menu-items',
      { params }
    );
    return response.data;
  },

  getMenuItemById: async (id: number): Promise<CustomerMenuItem> => {
    const response = await axiosClient.get<CustomerMenuItem>(
      `/api/customers/menu-items/${id}`
    );
    return response.data;
  },

  searchMenuItems: async (
    query: string,
    params?: {
      page?: number;
      size?: number;
      sort?: string;
    }
  ): Promise<PaginatedResponse<CustomerMenuItem>> => {
    const response = await axiosClient.get<PaginatedResponse<CustomerMenuItem>>(
      '/api/customers/menu-items/search',
      { params: { q: query, ...params } }
    );
    return response.data;
  },

  getMenuItemsByCategory: async (
    categoryId: number,
    params?: {
      page?: number;
      size?: number;
      sort?: string;
    }
  ): Promise<PaginatedResponse<CustomerMenuItem>> => {
    const response = await axiosClient.get<PaginatedResponse<CustomerMenuItem>>(
      `/api/customers/menu-items/category/${categoryId}`,
      { params }
    );
    return response.data;
  },

  // Cart
  getCart: async (): Promise<CartSummary> => {
    const response = await axiosClient.get<CartSummary>('/api/customers/cart');
    return response.data;
  },

  addToCart: async (data: AddToCartRequest): Promise<CartItem> => {
    const response = await axiosClient.post<CartItem>(
      '/api/customers/cart',
      data
    );
    return response.data;
  },

  updateCartItem: async (
    cartItemId: number,
    data: UpdateCartItemRequest
  ): Promise<CartItem> => {
    const response = await axiosClient.put<CartItem>(
      `/api/customers/cart/${cartItemId}`,
      data
    );
    return response.data;
  },

  removeCartItem: async (cartItemId: number): Promise<void> => {
    await axiosClient.delete(`/api/customers/cart/${cartItemId}`);
  },

  clearCart: async (): Promise<void> => {
    await axiosClient.delete('/api/customers/cart');
  },

  // Orders
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await axiosClient.post<Order>('/api/customers/orders', data);
    return response.data;
  },

  getOrders: async (): Promise<Order[]> => {
    const response = await axiosClient.get<Order[]>('/api/customers/orders');
    return response.data;
  },

  getOrderById: async (id: number): Promise<Order> => {
    const response = await axiosClient.get<Order>(`/api/customers/orders/${id}`);
    return response.data;
  },

  cancelOrder: async (id: number): Promise<Order> => {
    const response = await axiosClient.post<Order>(
      `/api/customers/orders/${id}/cancel`
    );
    return response.data;
  },

  // Ratings
  getMenuItemReviews: async (menuItemId: number): Promise<RatingReview[]> => {
    const response = await axiosClient.get<RatingReview[]>(
      `/api/ratings/menu-item/${menuItemId}`
    );
    return response.data;
  },

  getMenuItemRatingSummary: async (
    menuItemId: number
  ): Promise<RatingSummary> => {
    const response = await axiosClient.get<RatingSummary>(
      `/api/ratings/menu-item/${menuItemId}/summary`
    );
    return response.data;
  },

  rateMenuItem: async (data: RateMenuItemRequest): Promise<RatingReview> => {
    const response = await axiosClient.post<RatingReview>(
      '/api/customers/ratings/menu-item',
      data
    );
    return response.data;
  },

  // Customer Profile
  getCustomerByUserId: async (userId: number) => {
    const response = await axiosClient.get(`/api/customers/user/${userId}`);
    return response.data;
  },

  updateCustomer: async (id: number, data: { fullName?: string; dateOfBirth?: string }) => {
    const response = await axiosClient.put(`/api/customers/${id}`, data);
    return response.data;
  },
};

