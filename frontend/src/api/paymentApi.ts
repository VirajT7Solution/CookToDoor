import axiosClient from './axiosClient';
import type { PaymentOrderResponse, VerifyPaymentRequest, Order } from '../types/customer.types';

// Declare Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export const paymentApi = {
  createPaymentOrder: async (orderId: number): Promise<PaymentOrderResponse> => {
    const response = await axiosClient.post<PaymentOrderResponse>(
      `/api/customers/payments/orders/${orderId}`
    );
    return response.data;
  },

  verifyPayment: async (
    orderId: number,
    data: VerifyPaymentRequest
  ): Promise<Order> => {
    const response = await axiosClient.post<Order>(
      `/api/payments/verify/${orderId}`,
      data
    );
    return response.data;
  },

  /**
   * Load Razorpay script dynamically
   */
  loadRazorpayScript: (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  },

  /**
   * Check if Razorpay is properly configured
   */
  isRazorpayConfigured: (): boolean => {
    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    return !!(razorpayKeyId && razorpayKeyId.trim() !== '');
  },

  /**
   * Initialize Razorpay checkout
   */
  openRazorpayCheckout: (
    orderData: PaymentOrderResponse,
    options: {
      onSuccess: (paymentId: string, orderId: string, signature: string) => void;
      onFailure: (error: string) => void;
      prefill?: {
        name?: string;
        email?: string;
        contact?: string;
      };
    }
  ): void => {
    if (!window.Razorpay) {
      options.onFailure('Razorpay SDK not loaded. Please refresh the page and try again.');
      return;
    }

    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    
    // Validate Razorpay key before initializing
    if (!razorpayKeyId || razorpayKeyId.trim() === '' || razorpayKeyId === 'undefined') {
      const errorMsg = 'Razorpay is not configured. Please use Cash on Delivery or contact support.';
      console.error('Razorpay Key ID is missing or invalid. Please set VITE_RAZORPAY_KEY_ID in your .env file');
      options.onFailure(errorMsg);
      return;
    }

    // Additional validation - check if key looks valid (starts with rzp_)
    if (!razorpayKeyId.startsWith('rzp_')) {
      const errorMsg = 'Invalid Razorpay API key format. Please check your configuration.';
      console.error('Invalid Razorpay Key ID format. Key should start with "rzp_"');
      options.onFailure(errorMsg);
      return;
    }

    const razorpayOptions = {
      key: razorpayKeyId,
      amount: orderData.amount * 100, // Convert to paise
      currency: orderData.currency || 'INR',
      name: 'CookToDoor',
      description: `Order #${orderData.razorpayOrderId}`,
      order_id: orderData.razorpayOrderId,
      handler: (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        options.onSuccess(
          response.razorpay_payment_id,
          response.razorpay_order_id,
          response.razorpay_signature
        );
      },
      prefill: options.prefill || {},
      theme: {
        color: '#F36A10',
      },
      modal: {
        ondismiss: () => {
          options.onFailure('Payment cancelled by user');
        },
      },
      notes: {
        order_id: orderData.razorpayOrderId,
      },
    };

    try {
      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.on('payment.failed', (response: any) => {
        const errorDescription = response.error?.description || 'Payment failed';
        console.error('Razorpay payment failed:', response.error);
        options.onFailure(`Payment failed: ${errorDescription}`);
      });
      razorpay.open();
    } catch (error: any) {
      console.error('Error initializing Razorpay:', error);
      options.onFailure(`Failed to initialize payment: ${error.message || 'Unknown error'}`);
    }
  },
};

