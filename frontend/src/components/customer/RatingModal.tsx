import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review?: string) => Promise<void>;
  isLoading?: boolean;
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const theme = useTheme();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    await onSubmit(rating, review.trim() || undefined);
    // Reset form on success
    setRating(0);
    setReview('');
    setHoveredRating(0);
  };

  const handleClose = () => {
    setRating(0);
    setReview('');
    setHoveredRating(0);
    onClose();
  };

  // Show hovered rating when hovering, otherwise show selected rating
  const displayRating = hoveredRating > 0 ? hoveredRating : rating;

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setReview('');
      setHoveredRating(0);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Rate this item" size="sm">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(3),
        }}
      >
        {/* Star Rating */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: theme.font.size.sm,
              fontWeight: theme.font.weight.medium,
              color: theme.colors.text,
              marginBottom: theme.spacing(1),
            }}
          >
            Rating *
          </label>
          <div
            style={{
              display: 'flex',
              gap: theme.spacing(0.5),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onMouseLeave={() => setHoveredRating(0)}
          >
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = star <= displayRating;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setRating(star);
                  }}
                  onMouseEnter={() => setHoveredRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '40px',
                    padding: theme.spacing(0.5),
                    lineHeight: 1,
                    transition: 'transform 0.2s ease, filter 0.2s ease',
                    transform: isFilled ? 'scale(1.1)' : 'scale(1)',
                    filter: isFilled ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none',
                    userSelect: 'none',
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      color: isFilled ? '#FFD700' : '#E0E0E0',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {isFilled ? '★' : '☆'}
                  </span>
                </button>
              );
            })}
          </div>
          {rating > 0 && (
            <p
              style={{
                textAlign: 'center',
                fontSize: theme.font.size.sm,
                color: theme.colors.primary,
                fontWeight: theme.font.weight.medium,
                marginTop: theme.spacing(1),
                minHeight: '20px',
              }}
            >
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          )}
          {rating === 0 && hoveredRating > 0 && (
            <p
              style={{
                textAlign: 'center',
                fontSize: theme.font.size.sm,
                color: theme.colors.textSecondary,
                marginTop: theme.spacing(1),
                minHeight: '20px',
              }}
            >
              {hoveredRating === 1 && 'Poor'}
              {hoveredRating === 2 && 'Fair'}
              {hoveredRating === 3 && 'Good'}
              {hoveredRating === 4 && 'Very Good'}
              {hoveredRating === 5 && 'Excellent'}
            </p>
          )}
          {rating === 0 && hoveredRating === 0 && (
            <p
              style={{
                textAlign: 'center',
                fontSize: theme.font.size.sm,
                color: theme.colors.textSecondary,
                marginTop: theme.spacing(1),
                minHeight: '20px',
              }}
            >
              &nbsp;
            </p>
          )}
        </div>

        {/* Review Text */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: theme.font.size.sm,
              fontWeight: theme.font.weight.medium,
              color: theme.colors.text,
              marginBottom: theme.spacing(1),
            }}
          >
            Review (Optional)
          </label>
          <Textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience..."
            rows={4}
          />
        </div>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            gap: theme.spacing(2),
            justifyContent: 'flex-end',
          }}
        >
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={rating === 0}
            style={{
              backgroundColor: rating === 0 ? theme.colors.textSecondary : 'rgb(243, 106, 16)',
              borderColor: rating === 0 ? theme.colors.textSecondary : 'rgb(243, 106, 16)',
            }}
            onMouseEnter={(e) => {
              if (rating > 0 && !isLoading) {
                e.currentTarget.style.backgroundColor = 'rgb(218, 95, 14)';
                e.currentTarget.style.borderColor = 'rgb(218, 95, 14)';
              }
            }}
            onMouseLeave={(e) => {
              if (rating > 0 && !isLoading) {
                e.currentTarget.style.backgroundColor = 'rgb(243, 106, 16)';
                e.currentTarget.style.borderColor = 'rgb(243, 106, 16)';
              }
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RatingModal;




