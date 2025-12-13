import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import CustomerLayout from '../../layouts/CustomerLayout';
import AddressForm from '../../components/customer/AddressForm';
import { customerApi } from '../../api/customerApi';
import { userApi } from '../../api/userApi';
import { paymentApi } from '../../api/paymentApi';
import { useCartStore } from '../../store/cartStore';
import { useAuth } from '../../hooks/useAuth';
import type { AddressRequest, PaymentMethod } from '../../types/customer.types';
import { formatCurrency } from '../../utils';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const DELIVERY_FEE = 30.0;
const GST_RATE = 0.05; // 5%

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { userId } = useAuth();
  const { cart, clearCart } = useCartStore();
  const [address, setAddress] = useState<AddressRequest | null>(null);
  const [formAddress, setFormAddress] = useState<AddressRequest | null>(null); // Track form data
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isRazorpayAvailable, setIsRazorpayAvailable] = useState(false);

  // Check if Razorpay is configured on component mount
  React.useEffect(() => {
    setIsRazorpayAvailable(paymentApi.isRazorpayConfigured());
  }, []);

  // Load user address
  useEffect(() => {
    const loadAddress = async () => {
      if (!userId) return;
      try {
        setIsLoadingAddress(true);
        const user = await userApi.getUser(userId);
        if (user.address) {
          setAddress({
            street1: user.address.street1 || '',
            street2: user.address.street2,
            city: user.address.city || '',
            state: user.address.state || '',
            pincode: user.address.pincode || '',
            address_type: user.address.addressType || 'HOME',
          });
        }
      } catch (err) {
        console.error('Failed to load address:', err);
      } finally {
        setIsLoadingAddress(false);
      }
    };
    loadAddress();
  }, [userId]);

  const handleSaveAddress = async (data: AddressRequest) => {
    if (!userId) return;
    try {
      await userApi.saveAddress(userId, data);
      setAddress(data);
      setFormAddress(data); // Also update form address
      alert('Address saved successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save address');
    }
  };


  const handlePlaceOrder = async () => {
    if (!cart || cart.items.length === 0) {
      alert('Cart is empty');
      return;
    }

    // Use formAddress if available, otherwise use saved address
    const addressToUse = formAddress || address;
    
    if (!addressToUse || !addressToUse.street1 || !addressToUse.city || !addressToUse.state || !addressToUse.pincode) {
      alert('Please fill in all required address fields');
      return;
    }

    // If formAddress exists but address doesn't, save it first
    if (formAddress && !address && userId) {
      try {
        await userApi.saveAddress(userId, formAddress);
        setAddress(formAddress);
      } catch (err: any) {
        console.error('Failed to save address:', err);
        // Continue anyway - we'll use the form data
      }
    }

    // Format address string
    const addressString = `${addressToUse.street1}${addressToUse.street2 ? ', ' + addressToUse.street2 : ''}, ${addressToUse.city}, ${addressToUse.state} - ${addressToUse.pincode}`;

    try {
      setIsPlacingOrder(true);

      // Create order
      const order = await customerApi.createOrder({
        cartItemIds: cart.items.map((item) => item.id),
        deliveryAddress: addressString,
        deliveryFee: DELIVERY_FEE,
        paymentMethod,
      });

      // Handle payment based on method
      if (paymentMethod === 'CASH') {
        // Cash on Delivery - order is already confirmed
        clearCart();
        alert('Order placed successfully! You will pay when you receive your order.');
        navigate('/customer/orders');
        setIsPlacingOrder(false);
      } else {
        // Razorpay UPI payment
        // Check if Razorpay is configured before proceeding
        if (!paymentApi.isRazorpayConfigured()) {
          alert('Razorpay is not configured. Please use Cash on Delivery or contact support.');
          setIsPlacingOrder(false);
          return;
        }

        try {
          // Load Razorpay script
          const loaded = await paymentApi.loadRazorpayScript();
          if (!loaded) {
            throw new Error('Failed to load Razorpay SDK. Please refresh the page and try again.');
          }

          // Create payment order
          const paymentOrder = await paymentApi.createPaymentOrder(order.id);

          // Open Razorpay checkout
          paymentApi.openRazorpayCheckout(paymentOrder, {
            prefill: {
              // You can get these from user profile if available
            },
            onSuccess: async (paymentId, razorpayOrderId, signature) => {
              try {
                // Verify payment
                await paymentApi.verifyPayment(order.id, {
                  razorpayPaymentId: paymentId,
                  razorpayOrderId,
                  razorpaySignature: signature,
                });
                clearCart();
                navigate('/customer/orders');
              } catch (err: any) {
                alert(err.response?.data?.message || 'Payment verification failed');
              }
            },
            onFailure: (error) => {
              console.error('Payment initialization failed:', error);
              alert(`Payment Error: ${error}\n\nPlease try using Cash on Delivery or contact support if the issue persists.`);
              setIsPlacingOrder(false);
            },
          });
        } catch (err: any) {
          alert(err.response?.data?.message || 'Failed to initialize payment');
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <CustomerLayout>
        <div style={{ textAlign: 'center', padding: theme.spacing(6) }}>
          <p>Your cart is empty</p>
          <Button onClick={() => navigate('/customer/home')} style={{ marginTop: theme.spacing(2) }}>
            Browse Menu
          </Button>
        </div>
      </CustomerLayout>
    );
  }

  const subtotal = cart.subtotal;
  const tax = subtotal * GST_RATE;
  const total = subtotal + tax + DELIVERY_FEE;

  return (
    <CustomerLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1
          style={{
            fontSize: theme.font.size.xl,
            fontWeight: theme.font.weight.bold,
            marginBottom: theme.spacing(4),
          }}
        >
          Checkout
        </h1>

        {/* Address Section */}
        <Card style={{ marginBottom: theme.spacing(3) }}>
          <h2
            style={{
              fontSize: theme.font.size.base,
              fontWeight: theme.font.weight.semibold,
              marginBottom: theme.spacing(3),
            }}
          >
            Delivery Address
          </h2>
          {isLoadingAddress ? (
            <p>Loading address...</p>
          ) : address ? (
            <div>
              <div
                style={{
                  padding: theme.spacing(2),
                  backgroundColor: theme.colors.light,
                  borderRadius: theme.radius.md,
                  marginBottom: theme.spacing(2),
                }}
              >
                <p style={{ margin: 0 }}>
                  {address.street1}
                  {address.street2 && `, ${address.street2}`}
                </p>
                <p style={{ margin: 0 }}>
                  {address.city}, {address.state} - {address.pincode}
                </p>
              </div>
              <AddressForm 
                initialData={address} 
                onSubmit={(data) => {
                  handleSaveAddress(data);
                  setFormAddress(data);
                }}
                onFormChange={(data, isValid) => {
                  if (isValid && data) {
                    setFormAddress(data);
                  }
                }}
                submitLabel="Update Address" 
              />
            </div>
          ) : (
            <AddressForm 
              onSubmit={(data) => {
                handleSaveAddress(data);
                setFormAddress(data);
              }}
              onFormChange={(data, isValid) => {
                if (isValid && data) {
                  setFormAddress(data);
                }
              }}
            />
          )}
        </Card>

        {/* Payment Method */}
        <Card style={{ marginBottom: theme.spacing(3) }}>
          <h2
            style={{
              fontSize: theme.font.size.base,
              fontWeight: theme.font.weight.semibold,
              marginBottom: theme.spacing(3),
            }}
          >
            Payment Method
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing(2),
                padding: theme.spacing(2),
                border: `2px solid ${paymentMethod === 'CASH' ? theme.colors.primary : theme.colors.border}`,
                borderRadius: theme.radius.md,
                cursor: 'pointer',
              }}
            >
              <input
                type="radio"
                name="payment"
                value="CASH"
                checked={paymentMethod === 'CASH'}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              />
              <div>
                <div style={{ fontWeight: theme.font.weight.semibold }}>Cash on Delivery</div>
                <div style={{ fontSize: theme.font.size.sm, color: theme.colors.textSecondary }}>
                  Pay when you receive your order
                </div>
              </div>
            </label>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing(2),
                padding: theme.spacing(2),
                border: `2px solid ${paymentMethod === 'UPI' ? theme.colors.primary : theme.colors.border}`,
                borderRadius: theme.radius.md,
                cursor: isRazorpayAvailable ? 'pointer' : 'not-allowed',
                opacity: isRazorpayAvailable ? 1 : 0.5,
              }}
            >
              <input
                type="radio"
                name="payment"
                value="UPI"
                checked={paymentMethod === 'UPI'}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                disabled={!isRazorpayAvailable}
              />
              <div>
                <div style={{ fontWeight: theme.font.weight.semibold }}>
                  UPI / Razorpay
                  {!isRazorpayAvailable && (
                    <span style={{ fontSize: theme.font.size.xs, color: theme.colors.error, marginLeft: theme.spacing(1) }}>
                      (Not available)
                    </span>
                  )}
                </div>
                <div style={{ fontSize: theme.font.size.sm, color: theme.colors.textSecondary }}>
                  {isRazorpayAvailable 
                    ? 'Pay online via Razorpay'
                    : 'Razorpay is not configured. Please use Cash on Delivery.'
                  }
                </div>
              </div>
            </label>
          </div>
        </Card>

        {/* Order Summary */}
        <Card style={{ marginBottom: theme.spacing(3) }}>
          <h2
            style={{
              fontSize: theme.font.size.base,
              fontWeight: theme.font.weight.semibold,
              marginBottom: theme.spacing(3),
            }}
          >
            Order Summary
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2), marginBottom: theme.spacing(3) }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: theme.colors.textSecondary }}>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: theme.colors.textSecondary }}>Delivery Fee</span>
              <span>{formatCurrency(DELIVERY_FEE)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: theme.colors.textSecondary }}>Tax (GST 5%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div
              style={{
                borderTop: `1px solid ${theme.colors.border}`,
                paddingTop: theme.spacing(2),
                marginTop: theme.spacing(1),
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontWeight: theme.font.weight.bold, fontSize: theme.font.size.base }}>Total</span>
              <span
                style={{
                  fontWeight: theme.font.weight.bold,
                  fontSize: theme.font.size.lg,
                  color: theme.colors.primary,
                }}
              >
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            fullWidth
            onClick={handlePlaceOrder}
            isLoading={isPlacingOrder}
            disabled={isPlacingOrder || (!address && !formAddress)}
          >
            Place Order
          </Button>
          {!address && !formAddress && !isLoadingAddress && (
            <p style={{ 
              textAlign: 'center', 
              color: theme.colors.textSecondary, 
              marginTop: theme.spacing(2), 
              fontSize: theme.font.size.sm 
            }}>
              Please fill in the delivery address above to continue
            </p>
          )}
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default CheckoutPage;

