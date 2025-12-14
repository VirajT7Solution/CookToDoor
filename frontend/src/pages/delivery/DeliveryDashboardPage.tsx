import React, { useEffect, useState } from 'react';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { orderApi } from '../../api/orderApi';
import OrderCard from '../../components/delivery/OrderCard';
import OrderDetailModal from '../../components/delivery/OrderDetailModal';
import type { Order } from '../../types/order.types';

type TabType = 'my-orders' | 'available' | 'completed';

const DeliveryDashboardPage: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('my-orders');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, [activeTab]);

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'my-orders' || activeTab === 'completed') {
        const orders = await orderApi.getDeliveryPartnerOrders();
        setMyOrders(orders);
      }
      if (activeTab === 'available') {
        const orders = await orderApi.getAvailableOrders();
        setAvailableOrders(orders);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId: number) => {
    try {
      await orderApi.acceptOrder(orderId);
      await loadOrders();
      setSelectedOrder(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to accept order');
    }
  };

  const handlePickupOrder = async (orderId: number) => {
    try {
      await orderApi.pickupOrder(orderId);
      await loadOrders();
      setSelectedOrder(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to pickup order');
    }
  };

  const getDisplayOrders = (): Order[] => {
    if (activeTab === 'available') {
      return availableOrders;
    }
    if (activeTab === 'completed') {
      return myOrders.filter((order) => order.orderStatus === 'DELIVERED');
    }
    // my-orders: show assigned orders (READY with deliveryPartnerId, OUT_FOR_DELIVERY)
    return myOrders.filter(
      (order) =>
        (order.orderStatus === 'READY' && order.deliveryPartnerId) ||
        order.orderStatus === 'OUT_FOR_DELIVERY'
    );
  };

  const tabs: Array<{ id: TabType; label: string; icon: string }> = [
    { id: 'my-orders', label: 'My Orders', icon: '📦' },
    { id: 'available', label: 'Available Orders', icon: '🆕' },
    { id: 'completed', label: 'Completed Orders', icon: '✅' },
  ];

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100%',
          background: `linear-gradient(135deg, ${theme.colors.primary}15 0%, ${theme.colors.secondary}15 100%)`,
          padding: theme.spacing(4),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          boxSizing: 'border-box',
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

  const displayOrders = getDisplayOrders();

  return (
    <div
      style={{
        minHeight: '100%',
        background: `linear-gradient(135deg, ${theme.colors.primary}15 0%, ${theme.colors.secondary}15 100%)`,
        padding: theme.spacing(4),
        width: '100%',
        boxSizing: 'border-box',
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
              Delivery Dashboard
            </h1>
            <p style={{ color: theme.colors.textSecondary, fontSize: theme.font.size.base }}>
              Manage your delivery orders
            </p>
          </div>
          <Button variant="ghost" size="md" onClick={loadOrders}>
            Refresh
          </Button>
        </div>

        {error && (
          <Card
            padding
            shadow="md"
            style={{
              marginBottom: theme.spacing(4),
              backgroundColor: theme.colors.error + '10',
              borderColor: theme.colors.error,
            }}
          >
            <p style={{ color: theme.colors.error, margin: 0 }}>{error}</p>
          </Card>
        )}

        {/* Tabs */}
        <Card padding shadow="md" style={{ marginBottom: theme.spacing(4) }}>
          <div
            style={{
              display: 'flex',
              gap: theme.spacing(2),
              borderBottom: `1px solid ${theme.colors.border}`,
              overflowX: 'auto',
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                  border: 'none',
                  borderBottom: `2px solid ${
                    activeTab === tab.id ? theme.colors.primary : 'transparent'
                  }`,
                  backgroundColor: 'transparent',
                  color: activeTab === tab.id ? theme.colors.primary : theme.colors.textSecondary,
                  fontWeight:
                    activeTab === tab.id ? theme.font.weight.semibold : theme.font.weight.normal,
                  cursor: 'pointer',
                  fontSize: theme.font.size.base,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing(1),
                  transition: theme.transitions.base,
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Orders List */}
        {displayOrders.length === 0 ? (
          <Card padding shadow="md">
            <div style={{ textAlign: 'center', padding: theme.spacing(6) }}>
              <div style={{ fontSize: '64px', marginBottom: theme.spacing(2) }}>
                {activeTab === 'available' ? '🆕' : activeTab === 'completed' ? '✅' : '📦'}
              </div>
              <h3
                style={{
                  fontSize: theme.font.size.xl,
                  fontWeight: theme.font.weight.semibold,
                  marginBottom: theme.spacing(1),
                }}
              >
                No orders found
              </h3>
              <p style={{ color: theme.colors.textSecondary }}>
                {activeTab === 'available'
                  ? 'No available orders at the moment'
                  : activeTab === 'completed'
                  ? 'You have not completed any orders yet'
                  : 'You have no active orders'}
              </p>
            </div>
          </Card>
        ) : (
          <div>
            {displayOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={() => setSelectedOrder(order)}
                onAccept={
                  activeTab === 'available'
                    ? () => handleAcceptOrder(order.id)
                    : undefined
                }
                onPickup={
                  activeTab === 'my-orders' && order.orderStatus === 'READY'
                    ? () => handlePickupOrder(order.id)
                    : undefined
                }
                showActions={activeTab === 'available' || activeTab === 'my-orders'}
              />
            ))}
          </div>
        )}
      </Container>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={loadOrders}
          canAccept={activeTab === 'available'}
          canPickup={
            activeTab === 'my-orders' &&
            selectedOrder.orderStatus === 'READY' &&
            !!selectedOrder.deliveryPartnerId
          }
          canDeliver={
            activeTab === 'my-orders' && selectedOrder.orderStatus === 'OUT_FOR_DELIVERY'
          }
        />
      )}
    </div>
  );
};

export default DeliveryDashboardPage;


