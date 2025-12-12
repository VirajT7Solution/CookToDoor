import React, { useEffect, useState } from 'react';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { providerApi } from '../../api/providerApi';
import { orderApi } from '../../api/orderApi';
import { menuItemApi } from '../../api/menuItemApi';
import { payoutApi } from '../../api/payoutApi';
import type { Order } from '../../types/order.types';
import type { MenuItem } from '../../types/menuItem.types';
import type { ProviderDetailsGetResponse } from '../../types/provider.types';
import { useAuthStore } from '../../store/authStore';

const ProviderDashboardPage: React.FC = () => {
  const theme = useTheme();
  const { username } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [profile, setProfile] = useState<ProviderDetailsGetResponse | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [pendingAmount, setPendingAmount] = useState<number>(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // Load all data in parallel
      const [profileData, ordersData, productsData, payoutData] = await Promise.all([
        providerApi.getDetails().catch(() => null),
        orderApi.getProviderOrders().catch(() => []),
        menuItemApi.getMenuItems().catch(() => []),
        payoutApi.getPendingAmount().catch(() => ({ pendingAmount: 0 })),
      ]);

      if (profileData) setProfile(profileData);
      setOrders(ordersData);
      setProducts(productsData);
      setPendingAmount(payoutData.pendingAmount);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const activeOrders = orders.filter(
    (order) =>
      order.orderStatus !== 'DELIVERED' &&
      order.orderStatus !== 'CANCELLED'
  ).length;

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
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
        <div
          style={{
            textAlign: 'center',
            color: theme.colors.textSecondary,
          }}
        >
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
          <p>Loading dashboard...</p>
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
        {/* Header */}
        <div style={{ marginBottom: theme.spacing(4) }}>
          <h1
            style={{
              fontSize: theme.font.size['3xl'],
              fontWeight: theme.font.weight.bold,
              color: theme.colors.dark,
              marginBottom: theme.spacing(1),
            }}
          >
            Provider Dashboard
          </h1>
          <p style={{ color: theme.colors.textSecondary, fontSize: theme.font.size.lg }}>
            Welcome back, {username}!
            {profile?.businessName && ` - ${profile.businessName}`}
          </p>
        </div>

        {error && (
          <Card padding shadow="md" style={{ marginBottom: theme.spacing(4), backgroundColor: theme.colors.error + '10', borderColor: theme.colors.error }}>
            <p style={{ color: theme.colors.error, margin: 0 }}>{error}</p>
          </Card>
        )}

        {/* Stats Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: theme.spacing(4),
            marginBottom: theme.spacing(4),
          }}
        >
          <Card padding shadow="lg" hover>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: theme.font.size.sm,
                    margin: 0,
                    marginBottom: theme.spacing(1),
                  }}
                >
                  Total Products
                </p>
                <h2
                  style={{
                    fontSize: theme.font.size['2xl'],
                    fontWeight: theme.font.weight.bold,
                    color: theme.colors.dark,
                    margin: 0,
                  }}
                >
                  {products.length}
                </h2>
              </div>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: theme.radius.full,
                  background: `${theme.colors.primary}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: theme.font.size['2xl'],
                }}
              >
                📦
              </div>
            </div>
          </Card>

          <Card padding shadow="lg" hover>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: theme.font.size.sm,
                    margin: 0,
                    marginBottom: theme.spacing(1),
                  }}
                >
                  Active Orders
                </p>
                <h2
                  style={{
                    fontSize: theme.font.size['2xl'],
                    fontWeight: theme.font.weight.bold,
                    color: theme.colors.dark,
                    margin: 0,
                  }}
                >
                  {activeOrders}
                </h2>
              </div>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: theme.radius.full,
                  background: `${theme.colors.success}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: theme.font.size['2xl'],
                }}
              >
                🛒
              </div>
            </div>
          </Card>

          <Card padding shadow="lg" hover>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: theme.font.size.sm,
                    margin: 0,
                    marginBottom: theme.spacing(1),
                  }}
                >
                  Pending Amount
                </p>
                <h2
                  style={{
                    fontSize: theme.font.size['2xl'],
                    fontWeight: theme.font.weight.bold,
                    color: theme.colors.dark,
                    margin: 0,
                  }}
                >
                  {formatCurrency(pendingAmount)}
                </h2>
              </div>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: theme.radius.full,
                  background: `${theme.colors.warning}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: theme.font.size['2xl'],
                }}
              >
                💰
              </div>
            </div>
          </Card>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: theme.spacing(4),
          }}
        >
          {/* Recent Orders */}
          <Card padding shadow="lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing(3) }}>
              <h2
                style={{
                  fontSize: theme.font.size.xl,
                  fontWeight: theme.font.weight.bold,
                  color: theme.colors.dark,
                  margin: 0,
                }}
              >
                Recent Orders
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadDashboardData}
              >
                Refresh
              </Button>
            </div>
            {orders.length === 0 ? (
              <p style={{ color: theme.colors.textSecondary, textAlign: 'center', padding: theme.spacing(4) }}>
                No orders yet
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}>
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    style={{
                      padding: theme.spacing(3),
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: theme.radius.md,
                      transition: theme.transitions.base,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.background;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: theme.spacing(1) }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: theme.font.weight.semibold, color: theme.colors.dark }}>
                          Order #{order.id}
                        </p>
                        <p style={{ margin: 0, fontSize: theme.font.size.sm, color: theme.colors.textSecondary }}>
                          {formatDate(order.orderTime)}
                        </p>
                      </div>
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
                    <p style={{ margin: 0, marginTop: theme.spacing(1), fontSize: theme.font.size.sm, color: theme.colors.textSecondary }}>
                      {order.cartItems.length} item(s) • {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Products List */}
          <Card padding shadow="lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing(3) }}>
              <h2
                style={{
                  fontSize: theme.font.size.xl,
                  fontWeight: theme.font.weight.bold,
                  color: theme.colors.dark,
                  margin: 0,
                }}
              >
                Products
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadDashboardData}
              >
                Refresh
              </Button>
            </div>
            {products.length === 0 ? (
              <p style={{ color: theme.colors.textSecondary, textAlign: 'center', padding: theme.spacing(4) }}>
                No products yet. Add your first product to get started!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}>
                {products.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    style={{
                      padding: theme.spacing(3),
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: theme.radius.md,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: theme.transitions.base,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.background;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2), marginBottom: theme.spacing(0.5) }}>
                        <p style={{ margin: 0, fontWeight: theme.font.weight.semibold, color: theme.colors.dark }}>
                          {product.itemName}
                        </p>
                        <span
                          style={{
                            padding: `${theme.spacing(0.5)} ${theme.spacing(1.5)}`,
                            borderRadius: theme.radius.full,
                            fontSize: theme.font.size.xs,
                            fontWeight: theme.font.weight.semibold,
                            backgroundColor: product.isAvailable
                              ? (theme.colors.success + '20')
                              : (theme.colors.error + '20'),
                            color: product.isAvailable
                              ? (theme.colors.success || '#10b981')
                              : (theme.colors.error || '#ef4444'),
                          }}
                        >
                          {product.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: theme.font.size.sm, color: theme.colors.textSecondary }}>
                        {product.categoryName || 'Uncategorized'} • {formatCurrency(product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default ProviderDashboardPage;
