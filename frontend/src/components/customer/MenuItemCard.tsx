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
        borderRadius: theme.radius.lg,
        overflow: 'hidden',
        boxShadow: theme.shadow.sm,
        cursor: 'pointer',
        transition: theme.transitions.base,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = theme.shadow.md;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = theme.shadow.sm;
      }}
    >
      {/* Image */}
      <div
        style={{
          width: '100%',
          height: '180px',
          backgroundColor: theme.colors.light,
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
              color: theme.colors.textSecondary,
              fontSize: theme.font.size['2xl'],
            }}
          >
            🍽️
          </div>
        )}
        {/* Meal Type Badge */}
        <div
          style={{
            position: 'absolute',
            top: theme.spacing(1),
            right: theme.spacing(1),
            backgroundColor: mealTypeColors[item.mealType] || theme.colors.primary,
            color: theme.colors.white,
            padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
            borderRadius: theme.radius.md,
            fontSize: theme.font.size.xs,
            fontWeight: theme.font.weight.semibold,
          }}
        >
          {item.mealType}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: theme.spacing(2),
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: theme.spacing(1),
        }}
      >
        {/* Item Name */}
        <h3
          style={{
            fontSize: theme.font.size.base,
            fontWeight: theme.font.weight.semibold,
            color: theme.colors.text,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.itemName}
        </h3>

        {/* Provider Name */}
        {item.providerBusinessName && (
          <p
            style={{
              fontSize: theme.font.size.sm,
              color: theme.colors.textSecondary,
              margin: 0,
            }}
          >
            by {item.providerBusinessName}
          </p>
        )}

        {/* Rating */}
        {item.averageRating !== undefined && item.averageRating > 0 && (
          <div>{renderStars(item.averageRating)}</div>
        )}

        {/* Price and Weight */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: 'auto',
            paddingTop: theme.spacing(1),
          }}
        >
          <div>
            <div
              style={{
                fontSize: theme.font.size.lg,
                fontWeight: theme.font.weight.bold,
                color: theme.colors.primary,
              }}
            >
              {formatCurrency(item.price)}
            </div>
            {item.unitsOfMeasurement > 0 && (
              <div
                style={{
                  fontSize: theme.font.size.xs,
                  color: theme.colors.textSecondary,
                }}
              >
                {item.unitsOfMeasurement}g
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;


