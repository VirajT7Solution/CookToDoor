import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import type { CartItem } from '../../types/customer.types';
import { formatCurrency } from '../../utils';
import Button from '../ui/Button';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
  isLoading?: boolean;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  isLoading = false,
}) => {
  const theme = useTheme();

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleRemove = () => {
    if (window.confirm('Remove this item from cart?')) {
      onRemove(item.id);
    }
  };

  return (
    <div
      style={{
        backgroundColor: theme.colors.white,
        borderRadius: theme.radius.lg,
        padding: theme.spacing(3),
        boxShadow: theme.shadow.sm,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: theme.spacing(3),
        }}
      >
        {/* Item Info */}
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: theme.font.size.base,
              fontWeight: theme.font.weight.semibold,
              color: theme.colors.text,
              margin: `0 0 ${theme.spacing(0.5)} 0`,
            }}
          >
            {item.itemName}
          </h3>
          <p
            style={{
              fontSize: theme.font.size.sm,
              color: theme.colors.textSecondary,
              margin: `0 0 ${theme.spacing(1)} 0`,
            }}
          >
            by {item.providerName}
          </p>
          {item.specialInstructions && (
            <p
              style={{
                fontSize: theme.font.size.xs,
                color: theme.colors.textSecondary,
                fontStyle: 'italic',
                margin: `0 0 ${theme.spacing(1)} 0`,
              }}
            >
              Note: {item.specialInstructions}
            </p>
          )}
          <div
            style={{
              fontSize: theme.font.size.lg,
              fontWeight: theme.font.weight.bold,
              color: theme.colors.primary,
              marginTop: theme.spacing(1),
            }}
          >
            {formatCurrency(item.itemTotal)}
          </div>
          <div
            style={{
              fontSize: theme.font.size.xs,
              color: theme.colors.textSecondary,
            }}
          >
            {formatCurrency(item.itemPrice)} × {item.quantity}
          </div>
        </div>

        {/* Quantity Controls */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: theme.spacing(1),
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing(1.5),
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.md,
              padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
            }}
          >
            <button
              onClick={handleDecrease}
              disabled={isLoading || item.quantity <= 1}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: theme.radius.sm,
                border: `1px solid ${theme.colors.border}`,
                backgroundColor: theme.colors.white,
                color: theme.colors.text,
                cursor: isLoading || item.quantity <= 1 ? 'not-allowed' : 'pointer',
                opacity: isLoading || item.quantity <= 1 ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: theme.font.size.lg,
                fontWeight: theme.font.weight.bold,
                transition: theme.transitions.base,
              }}
              onMouseEnter={(e) => {
                if (!isLoading && item.quantity > 1) {
                  e.currentTarget.style.backgroundColor = theme.colors.light;
                  e.currentTarget.style.borderColor = theme.colors.primary;
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && item.quantity > 1) {
                  e.currentTarget.style.backgroundColor = theme.colors.white;
                  e.currentTarget.style.borderColor = theme.colors.border;
                }
              }}
            >
              −
            </button>
            <span
              style={{
                minWidth: '30px',
                textAlign: 'center',
                fontWeight: theme.font.weight.semibold,
                fontSize: theme.font.size.base,
              }}
            >
              {item.quantity}
            </span>
            <button
              onClick={handleIncrease}
              disabled={isLoading}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: theme.radius.sm,
                border: `1px solid ${theme.colors.border}`,
                backgroundColor: theme.colors.white,
                color: theme.colors.text,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: theme.font.size.lg,
                fontWeight: theme.font.weight.bold,
                transition: theme.transitions.base,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = theme.colors.light;
                  e.currentTarget.style.borderColor = theme.colors.primary;
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = theme.colors.white;
                  e.currentTarget.style.borderColor = theme.colors.border;
                }
              }}
            >
              +
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            disabled={isLoading}
            style={{
              padding: `${theme.spacing(0.5)} ${theme.spacing(1.5)}`,
              backgroundColor: 'transparent',
              color: theme.colors.error,
              border: `1px solid ${theme.colors.error}`,
              borderRadius: theme.radius.md,
              fontSize: theme.font.size.xs,
              fontWeight: theme.font.weight.medium,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
              transition: theme.transitions.base,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = theme.colors.error;
                e.currentTarget.style.color = theme.colors.white;
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = theme.colors.error;
              }
            }}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;


