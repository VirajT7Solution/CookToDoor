import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { customerApi } from '../../api/customerApi';
import type { Order } from '../../types/order.types';
import { formatCurrency, formatDate } from '../../utils';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await customerApi.getOrderById(Number(id));
      setOrder(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load order');
      console.error('Failed to load order:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setIsCancelling(true);
      await customerApi.cancelOrder(order.id);
      await loadOrder();
      alert('Order cancelled successfully');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusColor = (status: Order['orderStatus']) => {
    switch (status) {
      case 'PENDING':
        return theme.colors.warning;
      case 'CONFIRMED':
        return theme.colors.primary;
      case 'PREPARING':
        return '#3B82F6';
      case 'READY':
        return '#8B5CF6';
      case 'OUT_FOR_DELIVERY':
        return '#06B6D4';
      case 'DELIVERED':
        return theme.colors.success;
      case 'CANCELLED':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusSteps = (status: Order['orderStatus']) => {
    const steps = [
      { key: 'PENDING', label: 'Pending' },
      { key: 'CONFIRMED', label: 'Confirmed' },
      { key: 'PREPARING', label: 'Preparing' },
      { key: 'READY', label: 'Ready' },
      { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
      { key: 'DELIVERED', label: 'Delivered' },
    ];
    const currentIndex = steps.findIndex((s) => s.key === status);
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: theme.spacing(6) }}>
        <div style={{ fontSize: '48px', marginBottom: theme.spacing(2) }}>⏳</div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ textAlign: 'center', padding: theme.spacing(6) }}>
        <p style={{ color: theme.colors.error }}>{error || 'Order not found'}</p>
        <Button onClick={() => navigate('/customer/orders')} style={{ marginTop: theme.spacing(2) }}>
          Back to Orders
        </Button>
      </div>
    );
  }

  const statusSteps = getStatusSteps(order.orderStatus);
  const canCancel = order.orderStatus === 'PENDING';

  return (
    <div style={{ width: '100%', maxWidth: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2), marginBottom: theme.spacing(4) }}>
          <Button variant="outline" size="sm" onClick={() => navigate('/customer/orders')}>
            ← Back
          </Button>
          <h1
            style={{
              fontSize: theme.font.size.xl,
              fontWeight: theme.font.weight.bold,
              margin: 0,
            }}
          >
            Order #{order.id}
          </h1>
        </div>

        {/* Status Timeline */}
        <Card style={{ marginBottom: theme.spacing(3) }}>
          <h2
            style={{
              fontSize: theme.font.size.base,
              fontWeight: theme.font.weight.semibold,
              marginBottom: theme.spacing(3),
            }}
          >
            Order Status
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: theme.spacing(1) }}>
            {statusSteps.map((step, index) => (
              <div
                key={step.key}
                style={{
                  flex: 1,
                  minWidth: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: theme.radius.full,
                    backgroundColor: step.completed ? getStatusColor(order.orderStatus) : theme.colors.border,
                    color: step.completed ? theme.colors.white : theme.colors.textSecondary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: theme.font.weight.semibold,
                    marginBottom: theme.spacing(1),
                  }}
                >
                  {step.completed ? '✓' : index + 1}
                </div>
                <div
                  style={{
                    fontSize: theme.font.size.xs,
                    textAlign: 'center',
                    color: step.completed ? theme.colors.text : theme.colors.textSecondary,
                    fontWeight: step.current ? theme.font.weight.semibold : theme.font.weight.normal,
                  }}
                >
                  {step.label}
                </div>
                {index < statusSteps.length - 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '20px',
                      left: '70%',
                      width: '30%',
                      height: '2px',
                      backgroundColor: step.completed ? getStatusColor(order.orderStatus) : theme.colors.border,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Order Items */}
        <Card style={{ marginBottom: theme.spacing(3) }}>
          <h2
            style={{
              fontSize: theme.font.size.base,
              fontWeight: theme.font.weight.semibold,
              marginBottom: theme.spacing(3),
            }}
          >
            Order Items
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}>
            {order.cartItems.map((item) => (
              <div
                key={item.cartItemId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: theme.spacing(2),
                  backgroundColor: theme.colors.light,
                  borderRadius: theme.radius.md,
                }}
              >
                <div>
                  <div style={{ fontWeight: theme.font.weight.medium }}>{item.itemName}</div>
                  <div style={{ fontSize: theme.font.size.sm, color: theme.colors.textSecondary }}>
                    {formatCurrency(item.itemPrice)} × {item.quantity}
                  </div>
                </div>
                <div style={{ fontWeight: theme.font.weight.semibold }}>{formatCurrency(item.itemTotal)}</div>
              </div>
            ))}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: theme.colors.textSecondary }}>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: theme.colors.textSecondary }}>Delivery Fee</span>
              <span>{formatCurrency(order.deliveryFee)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: theme.colors.textSecondary }}>Platform Commission</span>
              <span>{formatCurrency(order.platformCommission)}</span>
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
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </Card>

        {/* Delivery Address */}
        <Card style={{ marginBottom: theme.spacing(3) }}>
          <h2
            style={{
              fontSize: theme.font.size.base,
              fontWeight: theme.font.weight.semibold,
              marginBottom: theme.spacing(2),
            }}
          >
            Delivery Address
          </h2>
          <p style={{ color: theme.colors.text, lineHeight: 1.6 }}>{order.deliveryAddress}</p>
        </Card>

        {/* Provider & Delivery Info */}
        <Card style={{ marginBottom: theme.spacing(3) }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}>
            <div>
              <div style={{ fontSize: theme.font.size.sm, color: theme.colors.textSecondary, marginBottom: theme.spacing(0.5) }}>
                Provider
              </div>
              <div style={{ fontWeight: theme.font.weight.medium }}>{order.providerName}</div>
            </div>
            {order.deliveryPartnerName && (
              <div>
                <div style={{ fontSize: theme.font.size.sm, color: theme.colors.textSecondary, marginBottom: theme.spacing(0.5) }}>
                  Delivery Partner
                </div>
                <div style={{ fontWeight: theme.font.weight.medium }}>{order.deliveryPartnerName}</div>
              </div>
            )}
            <div>
              <div style={{ fontSize: theme.font.size.sm, color: theme.colors.textSecondary, marginBottom: theme.spacing(0.5) }}>
                Order Time
              </div>
              <div style={{ fontWeight: theme.font.weight.medium }}>{formatDate(order.orderTime)}</div>
            </div>
            {order.estimatedDeliveryTime && (
              <div>
                <div style={{ fontSize: theme.font.size.sm, color: theme.colors.textSecondary, marginBottom: theme.spacing(0.5) }}>
                  Estimated Delivery
                </div>
                <div style={{ fontWeight: theme.font.weight.medium }}>{formatDate(order.estimatedDeliveryTime)}</div>
              </div>
            )}
            {order.deliveryTime && (
              <div>
                <div style={{ fontSize: theme.font.size.sm, color: theme.colors.textSecondary, marginBottom: theme.spacing(0.5) }}>
                  Delivered At
                </div>
                <div style={{ fontWeight: theme.font.weight.medium }}>{formatDate(order.deliveryTime)}</div>
              </div>
            )}
          </div>
        </Card>

        {/* Cancel Button */}
        {canCancel && (
          <Card>
            <Button variant="outline" fullWidth onClick={handleCancelOrder} isLoading={isCancelling}>
              Cancel Order
            </Button>
          </Card>
        )}
      </div>
  );
};

export default OrderDetailPage;


