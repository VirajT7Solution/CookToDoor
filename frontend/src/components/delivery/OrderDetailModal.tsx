import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useTheme } from '../../hooks/useTheme';
import { orderApi } from '../../api/orderApi';
import OtpVerificationModal from './OtpVerificationModal';
import type { Order, OrderStatus } from '../../types/order.types';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdate: () => void;
  canAccept?: boolean;
  canPickup?: boolean;
  canDeliver?: boolean;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onUpdate,
  canAccept = false,
  canPickup = false,
  canDeliver = false,
}) => {
  const theme = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [showOtpModal, setShowOtpModal] = useState(false);

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
      CONFIRMED: '#3b82f6',
      PREPARING: theme.colors.primary,
      READY: theme.colors.success,
      OUT_FOR_DELIVERY: theme.colors.primaryLight,
      DELIVERED: theme.colors.success,
      CANCELLED: theme.colors.error,
    };
    return statusColors[status] || theme.colors.textSecondary;
  };

  const handleAccept = async () => {
    setIsProcessing(true);
    setError('');
    try {
      await orderApi.acceptOrder(order.id);
      onUpdate();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to accept order');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePickup = async () => {
    setIsProcessing(true);
    setError('');
    try {
      await orderApi.pickupOrder(order.id);
      onUpdate();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to pickup order');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeliverClick = () => {
    if (order.orderStatus === 'OUT_FOR_DELIVERY') {
      setShowOtpModal(true);
    }
  };

  const handleDeliver = async (otp: string) => {
    setIsProcessing(true);
    setError('');
    try {
      await orderApi.deliverOrder(order.id, otp);
      setShowOtpModal(false);
      onUpdate();
      onClose();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to deliver order. Invalid OTP.';
      setError(errorMessage);
      // Keep OTP modal open to show error
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={!!order}
        onClose={onClose}
        title={`Order #${order.id} Details`}
        size="lg"
      >
        {error && (
          <Card
            padding
            shadow="sm"
            style={{
              marginBottom: theme.spacing(3),
              backgroundColor: theme.colors.error + '10',
              borderColor: theme.colors.error,
            }}
          >
            <p style={{ color: theme.colors.error, margin: 0 }}>{error}</p>
          </Card>
        )}

        <div style={{ marginBottom: theme.spacing(4) }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: theme.spacing(3),
            }}
          >
            <div>
              <p style={{ color: theme.colors.textSecondary, fontSize: theme.font.size.sm, margin: 0 }}>
                Status
              </p>
              <span
                style={{
                  display: 'inline-block',
                  padding: `${theme.spacing(1)} ${theme.spacing(3)}`,
                  borderRadius: theme.radius.full,
                  backgroundColor: `${getStatusColor(order.orderStatus)}20`,
                  color: getStatusColor(order.orderStatus),
                  fontSize: theme.font.size.sm,
                  fontWeight: theme.font.weight.semibold,
                  marginTop: theme.spacing(0.5),
                }}
              >
                {order.orderStatus.replace(/_/g, ' ')}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: theme.colors.textSecondary, fontSize: theme.font.size.sm, margin: 0 }}>
                Total Amount
              </p>
              <p
                style={{
                  fontSize: theme.font.size['2xl'],
                  fontWeight: theme.font.weight.bold,
                  color: theme.colors.dark,
                  margin: 0,
                }}
              >
                {formatCurrency(order.totalAmount)}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div style={{ marginBottom: theme.spacing(3) }}>
            <h4
              style={{
                fontSize: theme.font.size.base,
                fontWeight: theme.font.weight.semibold,
                marginBottom: theme.spacing(2),
              }}
            >
              Order Items
            </h4>
            {order.cartItems.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: theme.spacing(2),
                  backgroundColor: theme.colors.background || theme.colors.light,
                  borderRadius: theme.radius.md,
                  marginBottom: theme.spacing(1),
                }}
              >
                <div>
                  <p
                    style={{
                      fontWeight: theme.font.weight.medium,
                      margin: 0,
                      marginBottom: theme.spacing(0.5),
                    }}
                  >
                    {item.itemName}
                  </p>
                  <p style={{ color: theme.colors.textSecondary, fontSize: theme.font.size.sm, margin: 0 }}>
                    Qty: {item.quantity} × {formatCurrency(item.itemPrice)}
                  </p>
                </div>
                <p style={{ fontWeight: theme.font.weight.semibold, margin: 0 }}>
                  {formatCurrency(item.itemTotal)}
                </p>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div
            style={{
              borderTop: `1px solid ${theme.colors.border}`,
              paddingTop: theme.spacing(2),
              marginBottom: theme.spacing(3),
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: theme.spacing(1),
              }}
            >
              <span style={{ color: theme.colors.textSecondary }}>Subtotal:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: theme.spacing(1),
              }}
            >
              <span style={{ color: theme.colors.textSecondary }}>Delivery Fee:</span>
              <span>{formatCurrency(order.deliveryFee)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: theme.spacing(1),
              }}
            >
              <span style={{ color: theme.colors.textSecondary }}>Platform Commission:</span>
              <span>{formatCurrency(order.platformCommission)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: theme.spacing(1),
                borderTop: `1px solid ${theme.colors.border}`,
                fontWeight: theme.font.weight.semibold,
              }}
            >
              <span>Total:</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {/* Delivery Address */}
          <div style={{ marginBottom: theme.spacing(3) }}>
            <h4
              style={{
                fontSize: theme.font.size.base,
                fontWeight: theme.font.weight.semibold,
                marginBottom: theme.spacing(1),
              }}
            >
              Delivery Address
            </h4>
            <p style={{ color: theme.colors.text, lineHeight: 1.6 }}>{order.deliveryAddress}</p>
          </div>

          {/* Order Info */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: theme.spacing(2),
              marginBottom: theme.spacing(3),
            }}
          >
            <div>
              <p style={{ color: theme.colors.textSecondary, fontSize: theme.font.size.sm, margin: 0 }}>
                Order Time
              </p>
              <p style={{ fontWeight: theme.font.weight.medium, margin: 0 }}>
                {formatDate(order.orderTime)}
              </p>
            </div>
            {order.estimatedDeliveryTime && (
              <div>
                <p style={{ color: theme.colors.textSecondary, fontSize: theme.font.size.sm, margin: 0 }}>
                  Estimated Delivery
                </p>
                <p style={{ fontWeight: theme.font.weight.medium, margin: 0 }}>
                  {formatDate(order.estimatedDeliveryTime)}
                </p>
              </div>
            )}
            {order.deliveryTime && (
              <div>
                <p style={{ color: theme.colors.textSecondary, fontSize: theme.font.size.sm, margin: 0 }}>
                  Delivered At
                </p>
                <p style={{ fontWeight: theme.font.weight.medium, margin: 0 }}>
                  {formatDate(order.deliveryTime)}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          {canAccept && order.orderStatus === 'READY' && !order.deliveryPartnerId && (
            <Button
              variant="primary"
              fullWidth
              onClick={handleAccept}
              isLoading={isProcessing}
            >
              Accept Order
            </Button>
          )}

          {canPickup && order.orderStatus === 'READY' && order.deliveryPartnerId && (
            <Button
              variant="primary"
              fullWidth
              onClick={handlePickup}
              isLoading={isProcessing}
            >
              Pickup Order
            </Button>
          )}

          {canDeliver && order.orderStatus === 'OUT_FOR_DELIVERY' && (
            <Button
              variant="primary"
              fullWidth
              onClick={handleDeliverClick}
              isLoading={isProcessing}
            >
              Deliver Order
            </Button>
          )}
        </div>
      </Modal>

      {showOtpModal && (
        <OtpVerificationModal
          order={order}
          onClose={() => {
            setShowOtpModal(false);
            setError(''); // Clear error when closing
          }}
          onVerify={handleDeliver}
          isLoading={isProcessing}
          error={error}
        />
      )}
    </>
  );
};

export default OrderDetailModal;

