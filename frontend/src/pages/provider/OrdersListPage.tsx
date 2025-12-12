import React, { useEffect, useState } from 'react';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { orderApi } from '../../api/orderApi';
import OrderDetailsModal from '../../components/provider/OrderDetailsModal';
import type { Order, OrderStatus } from '../../types/order.types';

const OrdersListPage: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await orderApi.getProviderOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: OrderStatus) => {
    const statusColors: Record<OrderStatus, string> = {
      PENDING: theme.colors.warning,
      CONFIRMED: '#3b82f6', // Blue for confirmed
      PREPARING: theme.colors.primary,
      READY: theme.colors.success,
      OUT_FOR_DELIVERY: theme.colors.primaryLight,
      DELIVERED: theme.colors.success,
      CANCELLED: theme.colors.error,
    };
    return statusColors[status] || theme.colors.textSecondary;
  };

  const filteredOrders = statusFilter === 'ALL' 
    ? orders 
    : orders.filter((order) => order.orderStatus === statusFilter);

  const statusFilters: Array<{ value: OrderStatus | 'ALL'; label: string }> = [
    { value: 'ALL', label: 'All' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'PREPARING', label: 'Preparing' },
    { value: 'READY', label: 'Ready' },
    { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${theme.colors.primary}15 0%, ${theme.colors.secondary}15 100%)`,
          padding: theme.spacing(4),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center', color: theme.colors.textSecondary }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              border: `4px solid ${theme.colors.border}`,
              borderTopColor: theme.colors.primary,
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto',
              marginBottom: theme.spacing(2),
            }}
          />
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.colors.primary}15 0%, ${theme.colors.secondary}15 100%)`,
        padding: theme.spacing(4),
      }}
    >
      <Container maxWidth="xl">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing(4),
          }}
        >
          <div>
            <h1
              style={{
                fontSize: theme.font.size['3xl'],
                fontWeight: theme.font.weight.bold,
                color: theme.colors.dark,
                marginBottom: theme.spacing(1),
              }}
            >
              Orders
            </h1>
            <p style={{ color: theme.colors.textSecondary, fontSize: theme.font.size.base }}>
              Manage and track your orders
            </p>
          </div>
          <Button variant="ghost" size="md" onClick={loadOrders}>
            Refresh
          </Button>
        </div>

        {error && (
          <Card padding shadow="md" style={{ marginBottom: theme.spacing(4), backgroundColor: theme.colors.error + '10', borderColor: theme.colors.error }}>
            <p style={{ color: theme.colors.error, margin: 0 }}>{error}</p>
          </Card>
        )}

        {/* Status Filters */}
        <div
          style={{
            display: 'flex',
            gap: theme.spacing(2),
            marginBottom: theme.spacing(4),
            flexWrap: 'wrap',
          }}
        >
          {statusFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={statusFilter === filter.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <Card padding shadow="lg">
            <div style={{ textAlign: 'center', padding: theme.spacing(8) }}>
              <div style={{ fontSize: '64px', marginBottom: theme.spacing(2) }}>🛒</div>
              <h2
                style={{
                  fontSize: theme.font.size.xl,
                  fontWeight: theme.font.weight.bold,
                  color: theme.colors.dark,
                  marginBottom: theme.spacing(1),
                }}
              >
                No orders found
              </h2>
              <p style={{ color: theme.colors.textSecondary }}>
                {statusFilter === 'ALL'
                  ? 'You don\'t have any orders yet'
                  : `No orders with status "${statusFilter}"`}
              </p>
            </div>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(3) }}>
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                padding
                shadow="lg"
                hover
                onClick={() => setSelectedOrder(order)}
                style={{ cursor: 'pointer' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    gap: theme.spacing(3),
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing(2),
                        marginBottom: theme.spacing(1),
                      }}
                    >
                      <h3
                        style={{
                          fontSize: theme.font.size.lg,
                          fontWeight: theme.font.weight.bold,
                          color: theme.colors.dark,
                          margin: 0,
                        }}
                      >
                        Order #{order.id}
                      </h3>
                      <span
                        style={{
                          padding: `${theme.spacing(0.5)} ${theme.spacing(1.5)}`,
                          borderRadius: theme.radius.full,
                          fontSize: theme.font.size.xs,
                          fontWeight: theme.font.weight.semibold,
                          backgroundColor: getStatusColor(order.orderStatus) + '20',
                          color: getStatusColor(order.orderStatus),
                        }}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: theme.font.size.sm,
                        color: theme.colors.textSecondary,
                        marginBottom: theme.spacing(1),
                      }}
                    >
                      {formatDate(order.orderTime)}
                    </p>
                    <p
                      style={{
                        fontSize: theme.font.size.sm,
                        color: theme.colors.textSecondary,
                        marginBottom: theme.spacing(1),
                      }}
                    >
                      {order.cartItems.length} item(s) • {formatCurrency(order.totalAmount)}
                    </p>
                    {order.deliveryAddress && (
                      <p
                        style={{
                          fontSize: theme.font.size.sm,
                          color: theme.colors.textSecondary,
                          margin: 0,
                        }}
                      >
                        📍 {order.deliveryAddress}
                      </p>
                    )}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: theme.spacing(1),
                    }}
                  >
                    <div
                      style={{
                        fontSize: theme.font.size.lg,
                        fontWeight: theme.font.weight.bold,
                        color: theme.colors.primary,
                      }}
                    >
                      {formatCurrency(order.totalAmount)}
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details →
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={loadOrders}
        />
      </Container>
    </div>
  );
};

export default OrdersListPage;
