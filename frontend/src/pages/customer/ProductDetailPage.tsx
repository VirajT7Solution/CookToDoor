import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import RatingModal from '../../components/customer/RatingModal';
import { customerApi } from '../../api/customerApi';
import { useCartStore } from '../../store/cartStore';
import type { CustomerMenuItem, RatingReview, RateMenuItemRequest } from '../../types/customer.types';
import { formatCurrency } from '../../utils';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { userId } = useAuth();
  const [item, setItem] = useState<CustomerMenuItem | null>(null);
  const [reviews, setReviews] = useState<RatingReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { addItem } = useCartStore();

  // Load product details
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await customerApi.getMenuItemById(Number(id));
        setItem(data);
        setQuantity(1);
        
        // Load reviews
        try {
          const reviewsData = await customerApi.getMenuItemReviews(Number(id));
          setReviews(reviewsData);
        } catch (err) {
          console.error('Failed to load reviews:', err);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  // Convert base64 images to blob URLs
  const imageUrls = useMemo(() => {
    if (!item?.imageBase64List || item.imageBase64List.length === 0) return [];
    return item.imageBase64List.map((base64, index) => {
      const fileType = item.imageFileTypeList?.[index] || 'image/jpeg';
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
    }).filter(Boolean) as string[];
  }, [item]);

  const handleAddToCart = async () => {
    if (!item) return;
    try {
      setIsAddingToCart(true);
      const cartItem = await customerApi.addToCart({
        menuItemId: item.id,
        quantity,
        specialInstructions: specialInstructions.trim() || undefined,
      });
      addItem(cartItem);
      navigate('/customer/cart');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleRatingSubmit = async (rating: number, review?: string) => {
    if (!item || !userId) return;
    
    // For now, we need an orderId. In a real scenario, you'd get this from delivered orders
    // This is a simplified version - you might need to fetch deliverable orders first
    try {
      setIsSubmittingRating(true);
      // Note: This requires orderId which should come from a list of deliverable orders
      // For now, showing an error or requiring the user to select an order
      alert('Rating requires an order. Please rate from your orders page.');
      setShowRatingModal(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const mealTypeColors = {
    VEG: theme.colors.success,
    NON_VEG: theme.colors.error,
    JAIN: '#9C27B0',
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: theme.spacing(6) }}>
        <div style={{ fontSize: '48px', marginBottom: theme.spacing(2) }}>⏳</div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div style={{ textAlign: 'center', padding: theme.spacing(6) }}>
        <p style={{ color: theme.colors.error }}>{error || 'Product not found'}</p>
        <Button onClick={() => navigate('/customer/home')} style={{ marginTop: theme.spacing(2) }}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '100%' }}>
        {/* Image Carousel */}
        {imageUrls.length > 0 ? (
          <Card padding={false} style={{ marginBottom: theme.spacing(4), overflow: 'hidden' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: theme.colors.light }}>
              <img
                src={imageUrls[currentImageIndex]}
                alt={item.itemName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {imageUrls.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : imageUrls.length - 1))}
                    style={{
                      position: 'absolute',
                      left: theme.spacing(2),
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: theme.colors.white,
                      border: 'none',
                      borderRadius: theme.radius.full,
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      fontSize: '20px',
                    }}
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev < imageUrls.length - 1 ? prev + 1 : 0))}
                    style={{
                      position: 'absolute',
                      right: theme.spacing(2),
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: theme.colors.white,
                      border: 'none',
                      borderRadius: theme.radius.full,
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      fontSize: '20px',
                    }}
                  >
                    ›
                  </button>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: theme.spacing(2),
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: theme.spacing(1),
                    }}
                  >
                    {imageUrls.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: theme.radius.full,
                          border: 'none',
                          backgroundColor: index === currentImageIndex ? theme.colors.white : 'rgba(255,255,255,0.5)',
                          cursor: 'pointer',
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </Card>
        ) : (
          <Card padding style={{ marginBottom: theme.spacing(4), textAlign: 'center' }}>
            <div style={{ fontSize: '64px' }}>🍽️</div>
          </Card>
        )}

        {/* Product Info */}
        <Card style={{ marginBottom: theme.spacing(3) }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: theme.spacing(2) }}>
            <div style={{ flex: 1 }}>
              <h1
                style={{
                  fontSize: theme.font.size['2xl'],
                  fontWeight: theme.font.weight.bold,
                  color: theme.colors.dark,
                  marginBottom: theme.spacing(1),
                }}
              >
                {item.itemName}
              </h1>
              <p
                style={{
                  fontSize: theme.font.size.base,
                  color: theme.colors.textSecondary,
                  marginBottom: theme.spacing(2),
                }}
              >
                by {item.providerBusinessName || item.providerName}
              </p>
            </div>
            <div
              style={{
                backgroundColor: mealTypeColors[item.mealType] || theme.colors.primary,
                color: theme.colors.white,
                padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
                borderRadius: theme.radius.md,
                fontSize: theme.font.size.sm,
                fontWeight: theme.font.weight.semibold,
              }}
            >
              {item.mealType}
            </div>
          </div>

          {/* Price */}
          <div
            style={{
              fontSize: theme.font.size['2xl'],
              fontWeight: theme.font.weight.bold,
              color: theme.colors.primary,
              marginBottom: theme.spacing(2),
            }}
          >
            {formatCurrency(item.price)}
            {item.unitsOfMeasurement > 0 && (
              <span
                style={{
                  fontSize: theme.font.size.base,
                  color: theme.colors.textSecondary,
                  fontWeight: theme.font.weight.normal,
                  marginLeft: theme.spacing(1),
                }}
              >
                / {item.unitsOfMeasurement}g
              </span>
            )}
          </div>

          {/* Rating */}
          {item.averageRating !== undefined && item.averageRating > 0 && (
            <div style={{ marginBottom: theme.spacing(2), display: 'flex', alignItems: 'center', gap: theme.spacing(1) }}>
              <span style={{ fontSize: '20px' }}>⭐</span>
              <span style={{ fontWeight: theme.font.weight.semibold }}>{item.averageRating.toFixed(1)}</span>
              <span style={{ color: theme.colors.textSecondary }}>
                ({item.ratingCount} {item.ratingCount === 1 ? 'rating' : 'ratings'})
              </span>
            </div>
          )}

          {/* Description */}
          {item.description && (
            <div style={{ marginBottom: theme.spacing(2) }}>
              <h3
                style={{
                  fontSize: theme.font.size.base,
                  fontWeight: theme.font.weight.semibold,
                  marginBottom: theme.spacing(1),
                }}
              >
                Description
              </h3>
              <p style={{ color: theme.colors.textSecondary, lineHeight: 1.6 }}>{item.description}</p>
            </div>
          )}

          {/* Ingredients */}
          {item.ingredients && (
            <div style={{ marginBottom: theme.spacing(2) }}>
              <h3
                style={{
                  fontSize: theme.font.size.base,
                  fontWeight: theme.font.weight.semibold,
                  marginBottom: theme.spacing(1),
                }}
              >
                Ingredients
              </h3>
              <p style={{ color: theme.colors.textSecondary, lineHeight: 1.6 }}>{item.ingredients}</p>
            </div>
          )}
        </Card>

        {/* Add to Cart */}
        <Card style={{ marginBottom: theme.spacing(3) }}>
          <h3
            style={{
              fontSize: theme.font.size.base,
              fontWeight: theme.font.weight.semibold,
              marginBottom: theme.spacing(2),
            }}
          >
            Add to Cart
          </h3>
          
          {/* Quantity Selector */}
          <div style={{ marginBottom: theme.spacing(2) }}>
            <label
              style={{
                display: 'block',
                fontSize: theme.font.size.sm,
                fontWeight: theme.font.weight.medium,
                marginBottom: theme.spacing(1),
              }}
            >
              Quantity
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2) }}>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuantity((q) => Math.max(1, q - 1));
                }}
                disabled={quantity <= 1}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: theme.radius.md,
                  border: `2px solid ${quantity <= 1 ? theme.colors.border : 'rgb(243, 106, 16)'}`,
                  backgroundColor: quantity <= 1 ? theme.colors.light : theme.colors.white,
                  color: quantity <= 1 ? theme.colors.textSecondary : 'rgb(243, 106, 16)',
                  cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                  fontSize: '24px',
                  fontWeight: theme.font.weight.bold,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: theme.transitions.base,
                  userSelect: 'none',
                }}
                onMouseEnter={(e) => {
                  if (quantity > 1) {
                    e.currentTarget.style.backgroundColor = 'rgb(243, 106, 16)';
                    e.currentTarget.style.color = theme.colors.white;
                    e.currentTarget.style.borderColor = 'rgb(243, 106, 16)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (quantity > 1) {
                    e.currentTarget.style.backgroundColor = theme.colors.white;
                    e.currentTarget.style.color = 'rgb(243, 106, 16)';
                    e.currentTarget.style.borderColor = 'rgb(243, 106, 16)';
                  }
                }}
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max={item.maxQuantity || 10}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setQuantity(Math.max(1, Math.min(item.maxQuantity || 10, val)));
                }}
                style={{
                  width: '60px',
                  height: '40px',
                  textAlign: 'center',
                  border: `2px solid ${theme.colors.border}`,
                  borderRadius: theme.radius.md,
                  fontSize: theme.font.size.base,
                  fontWeight: theme.font.weight.semibold,
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgb(243, 106, 16)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.border;
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuantity((q) => Math.min(item.maxQuantity || 10, q + 1));
                }}
                disabled={quantity >= (item.maxQuantity || 10)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: theme.radius.md,
                  border: `2px solid ${quantity >= (item.maxQuantity || 10) ? theme.colors.border : 'rgb(243, 106, 16)'}`,
                  backgroundColor: quantity >= (item.maxQuantity || 10) ? theme.colors.light : theme.colors.white,
                  color: quantity >= (item.maxQuantity || 10) ? theme.colors.textSecondary : 'rgb(243, 106, 16)',
                  cursor: quantity >= (item.maxQuantity || 10) ? 'not-allowed' : 'pointer',
                  fontSize: '24px',
                  fontWeight: theme.font.weight.bold,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: theme.transitions.base,
                  userSelect: 'none',
                }}
                onMouseEnter={(e) => {
                  if (quantity < (item.maxQuantity || 10)) {
                    e.currentTarget.style.backgroundColor = 'rgb(243, 106, 16)';
                    e.currentTarget.style.color = theme.colors.white;
                    e.currentTarget.style.borderColor = 'rgb(243, 106, 16)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (quantity < (item.maxQuantity || 10)) {
                    e.currentTarget.style.backgroundColor = theme.colors.white;
                    e.currentTarget.style.color = 'rgb(243, 106, 16)';
                    e.currentTarget.style.borderColor = 'rgb(243, 106, 16)';
                  }
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Special Instructions */}
          <div style={{ marginBottom: theme.spacing(3) }}>
            <label
              style={{
                display: 'block',
                fontSize: theme.font.size.sm,
                fontWeight: theme.font.weight.medium,
                marginBottom: theme.spacing(1),
              }}
            >
              Special Instructions (Optional)
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any special requests..."
              style={{
                width: '100%',
                padding: theme.spacing(1.5),
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radius.md,
                fontSize: theme.font.size.base,
                fontFamily: theme.font.family,
                minHeight: '80px',
                resize: 'vertical',
              }}
            />
          </div>

          <Button
            variant="primary"
            fullWidth
            onClick={handleAddToCart}
            isLoading={isAddingToCart}
          >
            Add to Cart - {formatCurrency(item.price * quantity)}
          </Button>
        </Card>

        {/* Reviews */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing(2) }}>
            <h3
              style={{
                fontSize: theme.font.size.base,
                fontWeight: theme.font.weight.semibold,
              }}
            >
              Reviews ({reviews.length})
            </h3>
            {!item.hasUserRated && (
              <Button variant="outline" size="sm" onClick={() => setShowRatingModal(true)}>
                Write a Review
              </Button>
            )}
          </div>

          {reviews.length === 0 ? (
            <p style={{ color: theme.colors.textSecondary, textAlign: 'center', padding: theme.spacing(4) }}>
              No reviews yet. Be the first to review!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(3) }}>
              {reviews.map((review) => (
                <div
                  key={review.reviewId}
                  style={{
                    padding: theme.spacing(2),
                    backgroundColor: theme.colors.light,
                    borderRadius: theme.radius.md,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1), marginBottom: theme.spacing(1) }}>
                    <span style={{ fontSize: '16px' }}>⭐</span>
                    <span style={{ fontWeight: theme.font.weight.semibold }}>{review.rating}/5</span>
                    <span style={{ color: theme.colors.textSecondary, marginLeft: theme.spacing(1) }}>
                      {review.customerName || 'Anonymous'}
                    </span>
                  </div>
                  {review.reviewText && (
                    <p style={{ color: theme.colors.text, marginBottom: theme.spacing(0.5) }}>{review.reviewText}</p>
                  )}
                  <p style={{ fontSize: theme.font.size.xs, color: theme.colors.textSecondary }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Rating Modal */}
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          onSubmit={handleRatingSubmit}
          isLoading={isSubmittingRating}
        />
      </div>
  );
};

export default ProductDetailPage;


