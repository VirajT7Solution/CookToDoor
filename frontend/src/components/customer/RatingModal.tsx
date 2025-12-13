import React, { useState } from 'react';
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

  const displayRating = hoveredRating || rating;

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
              gap: theme.spacing(1),
              justifyContent: 'center',
            }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '36px',
                  padding: 0,
                  lineHeight: 1,
                  transition: theme.transitions.base,
                }}
              >
                {star <= displayRating ? '⭐' : '☆'}
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p
              style={{
                textAlign: 'center',
                fontSize: theme.font.size.sm,
                color: theme.colors.textSecondary,
                marginTop: theme.spacing(1),
              }}
            >
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
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
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RatingModal;

