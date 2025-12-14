import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useTheme } from '../../hooks/useTheme';
import type { Order, OrderStatus } from '../../types/order.types';

interface OrderCardProps {
  order: Order;
  onViewDetails: () => void;
  onAccept?: () => void;
  onPickup?: () => void;
  onDeliver?: () => void;
  showActions?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onViewDetails,
  onAccept,
  onPickup,
  onDeliver,
  showActions = false,
}) => {
  const theme = useTheme();

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: OrderStatus) => {
    const statusColors: Record<OrderStatus, string> = {
      PENDING: theme.colors.warning,
      CONFIRMED: '#3b82f6',
      PREPARING: theme.colors.primary,
      READY: theme.colors.success,
      OUT_FOR_DELIVERY: theme.colors.primaryLight,
      DELIVERED: theme.colors.success,
      CANCELLED: theme.colors.error,
    };
    return statusColors[status] || theme.colors.textSecondary;
  };

  const getStatusLabel = (status: OrderStatus) => {
    const labels: Record<OrderStatus, string> = {
      PENDING: 'Pending',
      CONFIRMED: 'Confirmed',
      PREPARING: 'Preparing',
      READY: 'Ready',
      OUT_FOR_DELIVERY: 'Out for Delivery',
      DELIVERED: 'Delivered',
      CANCELLED: 'Cancelled',
    };
    return labels[status];
  };

  return (
    <Card padding shadow="sm" style={{ marginBottom: theme.spacing(3) }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: theme.spacing(2),
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
                fontWeight: theme.font.weight.semibold,
                color: theme.colors.dark,
                margin: 0,
              }}
            >
              Order #{order.id}
            </h3>
            <span
              style={{
                padding: `${theme.spacing(0.5)} ${theme.spacing(2)}`,
                borderRadius: theme.radius.full,
                backgroundColor: `${getStatusColor(order.orderStatus)}20`,
                color: getStatusColor(order.orderStatus),
                fontSize: theme.font.size.xs,
                fontWeight: theme.font.weight.medium,
              }}
            >
              {getStatusLabel(order.orderStatus)}
            </span>
          </div>
          <p
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.font.size.sm,
              margin: `${theme.spacing(0.5)} 0`,
            }}
          >
            From: {order.providerName}
          </p>
          {order.deliveryAddress && (
            <p
              style={{
                color: theme.colors.textSecondary,
                fontSize: theme.font.size.sm,
                margin: `${theme.spacing(0.5)} 0`,
              }}
            >
              📍 {order.deliveryAddress}
            </p>
          )}
          <p
            style={{
              color: theme.colors.dark,
              fontSize: theme.font.size.base,
              fontWeight: theme.font.weight.semibold,
              margin: `${theme.spacing(1)} 0`,
            }}
          >
            {formatCurrency(order.totalAmount)}
          </p>
          <p
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.font.size.xs,
              margin: 0,
            }}
          >
            {formatDate(order.orderTime)}
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: theme.spacing(2),
          marginTop: theme.spacing(2),
        }}
      >
        {showActions && onDeliver && order.orderStatus === 'OUT_FOR_DELIVERY' ? (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={onViewDetails}
              style={{
                flex: 1,
                backgroundColor: 'rgb(243, 106, 16)',
                borderColor: 'rgb(243, 106, 16)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(218, 95, 14)';
                e.currentTarget.style.borderColor = 'rgb(218, 95, 14)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(243, 106, 16)';
                e.currentTarget.style.borderColor = 'rgb(243, 106, 16)';
              }}
            >
              View Order
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onDeliver}
              style={{
                flex: 1,
                backgroundColor: 'rgb(243, 106, 16)',
                borderColor: 'rgb(243, 106, 16)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(218, 95, 14)';
                e.currentTarget.style.borderColor = 'rgb(218, 95, 14)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(243, 106, 16)';
                e.currentTarget.style.borderColor = 'rgb(243, 106, 16)';
              }}
            >
              Deliver Order
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={onViewDetails} style={{ flex: 1 }}>
              View Details
            </Button>
            {showActions && onAccept && order.orderStatus === 'READY' && !order.deliveryPartnerId && (
              <Button variant="primary" size="sm" onClick={onAccept} style={{ flex: 1 }}>
                Accept Order
              </Button>
            )}
            {showActions && onPickup && order.orderStatus === 'READY' && order.deliveryPartnerId && (
              <Button variant="primary" size="sm" onClick={onPickup} style={{ flex: 1 }}>
                Pickup Order
              </Button>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default OrderCard;


