import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useTheme } from '../../hooks/useTheme';
import { orderApi } from '../../api/orderApi';
import type { Order, OrderStatus } from '../../types/order.types';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdate: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose, onUpdate }) => {
  const theme = useTheme();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string>('');

  if (!order) return null;

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

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    setError('');
    try {
      await orderApi.updateOrderStatus(order.id, { orderStatus: newStatus });
      onUpdate();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setIsUpdating(true);
    setError('');
    try {
      await orderApi.cancelOrder(order.id);
      onUpdate();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setIsUpdating(false);
    }
  };

  const getNextStatusButton = () => {
    switch (order.orderStatus) {
      case 'PENDING':
        return (
          <Button
            variant="primary"
            fullWidth
            onClick={() => handleStatusUpdate('CONFIRMED')}
            isLoading={isUpdating}
          >
            Confirm Order
          </Button>
        );
      case 'CONFIRMED':
        return (
          <Button
            variant="primary"
            fullWidth
            onClick={() => handleStatusUpdate('PREPARING')}
            isLoading={isUpdating}
          >
            Start Preparing
          </Button>
        );
      case 'PREPARING':
        return (
          <Button
            variant="primary"
            fullWidth
            onClick={() => handleStatusUpdate('READY')}
            isLoading={isUpdating}
          >
            Mark as Ready
          </Button>
        );
      case 'READY':
        return (
          <div
            style={{
              padding: theme.spacing(2),
              backgroundColor: theme.colors.success + '20',
              borderRadius: theme.radius.md,
              textAlign: 'center',
              color: theme.colors.success || '#10b981',
              fontWeight: theme.font.weight.semibold,
            }}
          >
            Ready for Pickup
          </div>
        );
      default:
        return null;
    }
  };

  const canCancel = order.orderStatus === 'PENDING' || order.orderStatus === 'CONFIRMED';

  return (
    <Modal isOpen={!!order} onClose={onClose} title={`Order #${order.id}`} size="lg">
      {error && (
        <div
          style={{
            padding: theme.spacing(2),
            marginBottom: theme.spacing(3),
            backgroundColor: `${theme.colors.error}10`,
            color: theme.colors.error,
            borderRadius: theme.radius.md,
            fontSize: theme.font.size.sm,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(4) }}>
        {/* Order Status */}
        <div>
          <h3
            style={{
              fontSize: theme.font.size.base,
              fontWeight: theme.font.weight.semibold,
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing(1),
            }}
          >
            Status
          </h3>
          <span
            style={{
              padding: `${theme.spacing(0.5)} ${theme.spacing(1.5)}`,
              borderRadius: theme.radius.full,
              fontSize: theme.font.size.sm,
              fontWeight: theme.font.weight.semibold,
              backgroundColor: getStatusColor(order.orderStatus) + '20',
              color: getStatusColor(order.orderStatus),
              display: 'inline-block',
            }}
          >
            {order.orderStatus}
          </span>
        </div>

        {/* Order Info */}
        <div>
          <h3
            style={{
              fontSize: theme.font.size.base,
              fontWeight: theme.font.weight.semibold,
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing(2),
            }}
          >
            Order Information
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(1) }}>
            <p style={{ margin: 0, fontSize: theme.font.size.sm, color: theme.colors.text }}>
              <strong>Order Time:</strong> {formatDate(order.orderTime)}
            </p>
            {order.estimatedDeliveryTime && (
              <p style={{ margin: 0, fontSize: theme.font.size.sm, color: theme.colors.text }}>
                <strong>Estimated Delivery:</strong> {formatDate(order.estimatedDeliveryTime)}
              </p>
            )}
            {order.deliveryTime && (
              <p style={{ margin: 0, fontSize: theme.font.size.sm, color: theme.colors.text }}>
                <strong>Delivered At:</strong> {formatDate(order.deliveryTime)}
              </p>
            )}
          </div>
        </div>

        {/* Delivery Address */}
        {order.deliveryAddress && (
          <div>
            <h3
              style={{
                fontSize: theme.font.size.base,
                fontWeight: theme.font.weight.semibold,
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing(1),
              }}
            >
              Delivery Address
            </h3>
            <p style={{ margin: 0, fontSize: theme.font.size.sm, color: theme.colors.text }}>
              {order.deliveryAddress}
            </p>
          </div>
        )}

        {/* Order Items */}
        <div>
          <h3
            style={{
              fontSize: theme.font.size.base,
              fontWeight: theme.font.weight.semibold,
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing(2),
            }}
          >
            Order Items
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}>
            {order.cartItems.map((item) => (
              <div
                key={item.cartItemId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: theme.spacing(2),
                  backgroundColor: theme.colors.background || theme.colors.light,
                  borderRadius: theme.radius.md,
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: theme.font.size.base,
                      fontWeight: theme.font.weight.semibold,
                      color: theme.colors.dark,
                    }}
                  >
                    {item.itemName}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: theme.font.size.sm,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    Qty: {item.quantity} × {formatCurrency(item.itemPrice)}
                  </p>
                </div>
                <div
                  style={{
                    fontSize: theme.font.size.base,
                    fontWeight: theme.font.weight.semibold,
                    color: theme.colors.dark,
                  }}
                >
                  {formatCurrency(item.itemTotal)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <Card padding shadow="sm">
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(1) }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: theme.colors.textSecondary }}>Subtotal:</span>
              <span style={{ fontWeight: theme.font.weight.semibold }}>
                {formatCurrency(order.subtotal)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: theme.colors.textSecondary }}>Delivery Fee:</span>
              <span style={{ fontWeight: theme.font.weight.semibold }}>
                {formatCurrency(order.deliveryFee)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: theme.colors.textSecondary }}>Platform Commission:</span>
              <span style={{ fontWeight: theme.font.weight.semibold }}>
                {formatCurrency(order.platformCommission)}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: theme.spacing(2),
                borderTop: `1px solid ${theme.colors.border}`,
                marginTop: theme.spacing(1),
              }}
            >
              <span
                style={{
                  fontSize: theme.font.size.lg,
                  fontWeight: theme.font.weight.bold,
                  color: theme.colors.dark,
                }}
              >
                Total:
              </span>
              <span
                style={{
                  fontSize: theme.font.size.lg,
                  fontWeight: theme.font.weight.bold,
                  color: theme.colors.primary,
                }}
              >
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </Card>

        {/* Delivery Partner Info */}
        {order.deliveryPartnerName && (
          <div>
            <h3
              style={{
                fontSize: theme.font.size.base,
                fontWeight: theme.font.weight.semibold,
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing(1),
              }}
            >
              Delivery Partner
            </h3>
            <p style={{ margin: 0, fontSize: theme.font.size.sm, color: theme.colors.text }}>
              {order.deliveryPartnerName}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}>
          {getNextStatusButton()}
          {canCancel && (
            <Button
              variant="outline"
              fullWidth
              onClick={handleCancelOrder}
              isLoading={isUpdating}
              style={{ color: theme.colors.error, borderColor: theme.colors.error }}
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailsModal;
