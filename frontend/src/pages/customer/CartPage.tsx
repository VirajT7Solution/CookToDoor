import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import CustomerLayout from '../../layouts/CustomerLayout';
import CartItemCard from '../../components/customer/CartItemCard';
import { customerApi } from '../../api/customerApi';
import { useCartStore } from '../../store/cartStore';
import type { CartItem } from '../../types/customer.types';
import { formatCurrency } from '../../utils';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const DELIVERY_FEE = 30.0;
const GST_RATE = 0.05; // 5%

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { cart, setCart, setIsLoading, clearCart } = useCartStore();
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);

  // Load cart from API
  useEffect(() => {
    const loadCart = async () => {
      try {
        setIsLoadingCart(true);
        const data = await customerApi.getCart();
        setCart(data);
      } catch (err: any) {
        console.error('Failed to load cart:', err);
        if (err.response?.status === 404 || err.response?.status === 400) {
          // Cart is empty or doesn't exist
          setCart(null);
        }
      } finally {
        setIsLoadingCart(false);
      }
    };
    loadCart();
  }, [setCart]);

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    try {
      setUpdatingItemId(itemId);
      const updatedItem = await customerApi.updateCartItem(itemId, { quantity });
      // Reload cart to get updated totals
      const cartData = await customerApi.getCart();
      setCart(cartData);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update cart');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      setUpdatingItemId(itemId);
      await customerApi.removeCartItem(itemId);
      // Reload cart
      const cartData = await customerApi.getCart();
      setCart(cartData);
      if (!cartData || cartData.items.length === 0) {
        clearCart();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to remove item');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) {
      alert('Cart is empty');
      return;
    }

    // Validate all items are from same provider
    const providerIds = new Set(cart.items.map((item) => item.providerId));
    if (providerIds.size > 1) {
      alert('All items must be from the same provider. Please remove items from different providers.');
      return;
    }

    navigate('/customer/checkout');
  };

  // Calculate order summary
  const subtotal = cart?.subtotal || 0;
  const tax = subtotal * GST_RATE;
  const deliveryFee = DELIVERY_FEE;
  const total = subtotal + tax + deliveryFee;

  if (isLoadingCart) {
    return (
      <CustomerLayout>
        <div style={{ textAlign: 'center', padding: theme.spacing(6) }}>
          <div style={{ fontSize: '48px', marginBottom: theme.spacing(2) }}>⏳</div>
          <p>Loading cart...</p>
        </div>
      </CustomerLayout>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <CustomerLayout>
        <div style={{ textAlign: 'center', padding: theme.spacing(6) }}>
          <div style={{ fontSize: '64px', marginBottom: theme.spacing(2) }}>🛒</div>
          <h2 style={{ marginBottom: theme.spacing(1) }}>Your cart is empty</h2>
          <p style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing(4) }}>
            Add some delicious items to get started!
          </p>
          <Button variant="primary" onClick={() => navigate('/customer/home')}>
            Browse Menu
          </Button>
        </div>
      </CustomerLayout>
    );
  }

  // Check if all items are from same provider
  const providerIds = new Set(cart.items.map((item) => item.providerId));
  const isMultipleProviders = providerIds.size > 1;

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
          Your Cart ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
        </h1>

        {/* Warning if multiple providers */}
        {isMultipleProviders && (
          <Card
            style={{
              marginBottom: theme.spacing(3),
              backgroundColor: theme.colors.warning + '20',
              borderColor: theme.colors.warning,
            }}
          >
            <p style={{ color: theme.colors.warning, margin: 0 }}>
              ⚠️ All items must be from the same provider. Please remove items from different providers before checkout.
            </p>
          </Card>
        )}

        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2), marginBottom: theme.spacing(4) }}>
          {cart.items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
              isLoading={updatingItemId === item.id}
            />
          ))}
        </div>

        {/* Order Summary */}
        <Card>
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
              <span style={{ fontWeight: theme.font.weight.medium }}>{formatCurrency(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: theme.colors.textSecondary }}>Delivery Fee</span>
              <span style={{ fontWeight: theme.font.weight.medium }}>{formatCurrency(deliveryFee)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: theme.colors.textSecondary }}>Tax (GST 5%)</span>
              <span style={{ fontWeight: theme.font.weight.medium }}>{formatCurrency(tax)}</span>
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
            onClick={handleCheckout}
            disabled={isMultipleProviders}
          >
            Proceed to Checkout
          </Button>

          {isMultipleProviders && (
            <p style={{ textAlign: 'center', color: theme.colors.error, marginTop: theme.spacing(2), fontSize: theme.font.size.sm }}>
              Please remove items from different providers
            </p>
          )}
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default CartPage;


