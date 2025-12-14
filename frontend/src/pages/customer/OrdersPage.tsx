import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { customerApi } from '../../api/customerApi';
import type { Order as OrderType } from '../../types/order.types';
import { formatCurrency, formatDate } from '../../utils';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await customerApi.getOrders();
      // Sort by most recent first
      setOrders(data.sort((a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime()));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load orders');
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setCancellingOrderId(orderId);
      await customerApi.cancelOrder(orderId);
      await loadOrders(); // Reload orders
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const getStatusColor = (status: OrderType['orderStatus']) => {
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

  const getStatusLabel = (status: OrderType['orderStatus']) => {
    return status.replace(/_/g, ' ');
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: theme.spacing(6) }}>
        <div style={{ fontSize: '48px', marginBottom: theme.spacing(2) }}>⏳</div>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: theme.spacing(6) }}>
        <p style={{ color: theme.colors.error }}>{error}</p>
        <Button onClick={loadOrders} style={{ marginTop: theme.spacing(2) }}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
        <h1
          style={{
            fontSize: theme.font.size.xl,
            fontWeight: theme.font.weight.bold,
            marginBottom: theme.spacing(4),
          }}
        >
          My Orders
        </h1>

        {orders.length === 0 ? (
          <Card>
            <div style={{ textAlign: 'center', padding: theme.spacing(6) }}>
              <div style={{ fontSize: '64px', marginBottom: theme.spacing(2) }}>📦</div>
              <h2 style={{ marginBottom: theme.spacing(1) }}>No orders yet</h2>
              <p style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing(4) }}>
                Start ordering delicious food from local chefs!
              </p>
              <Button variant="primary" onClick={() => navigate('/customer/home')}>
                Browse Menu
              </Button>
            </div>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(3) }}>
            {orders.map((order) => (
              <Card
                key={order.id}
                hover
                onClick={() => navigate(`/customer/orders/${order.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: theme.spacing(2) }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2), marginBottom: theme.spacing(1) }}>
                      <h3
                        style={{
                          fontSize: theme.font.size.base,
                          fontWeight: theme.font.weight.semibold,
                          margin: 0,
                        }}
                      >
                        Order #{order.id}
                      </h3>
                      <span
                        style={{
                          backgroundColor: getStatusColor(order.orderStatus) + '20',
                          color: getStatusColor(order.orderStatus),
                          padding: `${theme.spacing(0.5)} ${theme.spacing(1.5)}`,
                          borderRadius: theme.radius.full,
                          fontSize: theme.font.size.xs,
                          fontWeight: theme.font.weight.semibold,
                        }}
                      >
                        {getStatusLabel(order.orderStatus)}
                      </span>
                    </div>
                    <p style={{ color: theme.colors.textSecondary, fontSize: theme.font.size.sm, margin: 0 }}>
                      {order.providerName}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontSize: theme.font.size.lg,
                        fontWeight: theme.font.weight.bold,
                        color: theme.colors.primary,
                      }}
                    >
                      {formatCurrency(order.totalAmount)}
                    </div>
                    <div style={{ fontSize: theme.font.size.xs, color: theme.colors.textSecondary }}>
                      {order.cartItems.length} {order.cartItems.length === 1 ? 'item' : 'items'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: theme.spacing(2) }}>
                  <p style={{ fontSize: theme.font.size.sm, color: theme.colors.textSecondary, margin: 0 }}>
                    {formatDate(order.orderTime)}
                  </p>
                  {order.orderStatus === 'PENDING' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelOrder(order.id);
                      }}
                      isLoading={cancellingOrderId === order.id}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
  );
};

export default OrdersPage;


