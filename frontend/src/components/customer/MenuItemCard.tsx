import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import type { CustomerMenuItem } from '../../types/customer.types';
import { formatCurrency } from '../../utils';

interface MenuItemCardProps {
  item: CustomerMenuItem;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Convert base64 image to blob URL
  const imageUrl = useMemo(() => {
    if (item.imageBase64List && item.imageBase64List.length > 0) {
      const base64 = item.imageBase64List[0];
      const fileType = item.imageFileTypeList?.[0] || 'image/jpeg';
      try {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: fileType });
        return URL.createObjectURL(blob);
      } catch (e) {
        console.error('Error converting base64 to blob:', e);
        return null;
      }
    }
    return null;
  }, [item.imageBase64List, item.imageFileTypeList]);

  const mealTypeColors = {
    VEG: theme.colors.success,
    NON_VEG: theme.colors.error,
    JAIN: '#9C27B0',
  };

  const handleClick = () => {
    navigate(`/customer/products/${item.id}`);
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <span key={i}>⭐</span>;
          } else if (i === fullStars && hasHalfStar) {
            return <span key={i}>✨</span>;
          }
          return <span key={i}>☆</span>;
        })}
        <span
          style={{
            fontSize: theme.font.size.xs,
            color: theme.colors.textSecondary,
            marginLeft: theme.spacing(0.5),
          }}
        >
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div
      onClick={handleClick}
      style={{
        backgroundColor: theme.colors.white,
        borderRadius: theme.radius.xl,
        overflow: 'hidden',
        boxShadow: theme.shadow.sm,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        border: `1px solid ${theme.colors.border}`,
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
        e.currentTarget.style.boxShadow = theme.shadow.lg;
        e.currentTarget.style.borderColor = theme.colors.primary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = theme.shadow.sm;
        e.currentTarget.style.borderColor = theme.colors.border;
      }}
    >
      {/* Image */}
      <div
        style={{
          width: '100%',
          height: '200px',
          background: `linear-gradient(135deg, ${theme.colors.light} 0%, ${theme.colors.white} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.itemName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${theme.colors.primary}10 0%, ${theme.colors.primaryLight}05 100%)`,
              fontSize: theme.font.size['3xl'],
            }}
          >
            🍽️
          </div>
        )}
        {/* Meal Type Badge */}
        <div
          style={{
            position: 'absolute',
            top: theme.spacing(1.5),
            right: theme.spacing(1.5),
            background: `linear-gradient(135deg, ${mealTypeColors[item.mealType] || theme.colors.primary} 0%, ${mealTypeColors[item.mealType] || theme.colors.primaryDark} 100%)`,
            color: theme.colors.white,
            padding: `${theme.spacing(0.75)} ${theme.spacing(1.5)}`,
            borderRadius: theme.radius.full,
            fontSize: theme.font.size.xs,
            fontWeight: theme.font.weight.bold,
            boxShadow: theme.shadow.md,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {item.mealType}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: theme.spacing(2.5),
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: theme.spacing(1.5),
        }}
      >
        {/* Item Name */}
        <h3
          style={{
            fontSize: theme.font.size.lg,
            fontWeight: theme.font.weight.bold,
            color: theme.colors.dark,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
          }}
        >
          {item.itemName}
        </h3>

        {/* Provider Name */}
        {item.providerBusinessName && (
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(0.5) }}>
            <span style={{ fontSize: '14px' }}>👨‍🍳</span>
            <p
              style={{
                fontSize: theme.font.size.sm,
                color: theme.colors.textSecondary,
                margin: 0,
                fontWeight: theme.font.weight.medium,
              }}
            >
              {item.providerBusinessName}
            </p>
          </div>
        )}

        {/* Price and Weight */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: 'auto',
            paddingTop: theme.spacing(2),
            borderTop: `1px solid ${theme.colors.border}`,
          }}
        >
          <div>
            <div
              style={{
                fontSize: theme.font.size.xl,
                fontWeight: theme.font.weight.bold,
                background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.2,
              }}
            >
              {formatCurrency(item.price)}
            </div>
            {item.unitsOfMeasurement > 0 && (
              <div
                style={{
                  fontSize: theme.font.size.xs,
                  color: theme.colors.textSecondary,
                  fontWeight: theme.font.weight.medium,
                  marginTop: theme.spacing(0.25),
                }}
              >
                {item.unitsOfMeasurement}g
              </div>
            )}
          </div>
          {item.averageRating !== undefined && item.averageRating > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing(0.5),
              backgroundColor: `${theme.colors.warning}15`,
              padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
              borderRadius: theme.radius.md,
            }}>
              <span style={{ fontSize: '14px' }}>⭐</span>
              <span style={{
                fontSize: theme.font.size.xs,
                fontWeight: theme.font.weight.bold,
                color: theme.colors.warning,
              }}>
                {item.averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;




