import React, { useState, useEffect, useRef } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { useTheme } from '../../hooks/useTheme';
import type { Order } from '../../types/order.types';

interface OtpVerificationModalProps {
  order: Order;
  onClose: () => void;
  onVerify: (otp: string) => void;
  isLoading?: boolean;
  error?: string;
}

const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  order,
  onClose,
  onVerify,
  isLoading = false,
  error: externalError,
}) => {
  const theme = useTheme();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Calculate time remaining until OTP expires
  useEffect(() => {
    if (order.otpExpiresAt) {
      const updateTimeRemaining = () => {
        const now = new Date().getTime();
        const expiresAt = new Date(order.otpExpiresAt!).getTime();
        const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
        setTimeRemaining(remaining);
      };

      updateTimeRemaining();
      const interval = setInterval(updateTimeRemaining, 1000);

      return () => clearInterval(interval);
    }
  }, [order.otpExpiresAt]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Update error when external error changes
  useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);

  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatExpirationDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.trim().length !== 6) {
      setError('Please enter a valid 6-digit OTP code');
      return;
    }

    onVerify(otp.trim());
  };

  const isExpired = timeRemaining !== null && timeRemaining === 0;
  const displayError = error || externalError;

  return (
    <Modal isOpen={true} onClose={onClose} title="Verify OTP for Delivery" size="sm">
      <form onSubmit={handleSubmit} aria-label="OTP Verification Form">
        <div style={{ marginBottom: theme.spacing(4) }}>
          {/* Instruction Text */}
          <p
            style={{
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing(3),
              fontSize: theme.font.size.base,
              lineHeight: 1.6,
            }}
          >
            Please enter the 6-digit OTP code provided by the customer to complete the delivery.
          </p>

          {/* Error Display */}
          {displayError && (
            <Card
              padding
              shadow="sm"
              style={{
                marginBottom: theme.spacing(3),
                backgroundColor: theme.colors.error + '10',
                borderColor: theme.colors.error,
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1.5) }}>
                <span style={{ fontSize: theme.font.size.lg }}>⚠️</span>
                <p
                  style={{
                    color: theme.colors.error,
                    margin: 0,
                    fontSize: theme.font.size.sm,
                    fontWeight: theme.font.weight.medium,
                  }}
                >
                  {displayError}
                </p>
              </div>
            </Card>
          )}

          {/* OTP Input Section */}
          <div style={{ marginBottom: theme.spacing(3) }}>
            <label
              htmlFor="otp-input"
              style={{
                display: 'block',
                marginBottom: theme.spacing(1.5),
                fontWeight: theme.font.weight.semibold,
                fontSize: theme.font.size.sm,
                color: theme.colors.text,
              }}
            >
              OTP Code
            </label>
            <Input
              ref={inputRef}
              id="otp-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(value);
                setError('');
              }}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              error={displayError ? undefined : undefined}
              style={{
                textAlign: 'center',
                fontSize: theme.font.size['2xl'],
                letterSpacing: theme.spacing(0.5),
                fontWeight: theme.font.weight.bold,
                padding: theme.spacing(3),
                borderWidth: '2px',
                borderColor: displayError ? theme.colors.error : theme.colors.border,
              }}
              autoFocus
              aria-label="Enter 6-digit OTP code"
              aria-describedby="otp-helper otp-expiry"
            />

            {/* Helper Text and Expiry Info */}
            <div
              id="otp-helper"
              style={{
                marginTop: theme.spacing(2),
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing(1),
              }}
            >
              {order.otpExpiresAt && (
                <div
                  id="otp-expiry"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: theme.spacing(1.5),
                    backgroundColor: isExpired
                      ? theme.colors.error + '10'
                      : theme.colors.primary + '08',
                    borderRadius: theme.radius.md,
                    border: `1px solid ${isExpired ? theme.colors.error : theme.colors.primary}30`,
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: theme.colors.textSecondary,
                        fontSize: theme.font.size.xs,
                        margin: 0,
                        fontWeight: theme.font.weight.medium,
                      }}
                    >
                      OTP Expires:
                    </p>
                    <p
                      style={{
                        color: theme.colors.text,
                        fontSize: theme.font.size.sm,
                        margin: 0,
                        fontWeight: theme.font.weight.semibold,
                      }}
                    >
                      {formatExpirationDate(order.otpExpiresAt)}
                    </p>
                  </div>
                  {timeRemaining !== null && (
                    <div style={{ textAlign: 'right' }}>
                      <p
                        style={{
                          color: isExpired ? theme.colors.error : theme.colors.primary,
                          fontSize: theme.font.size.xs,
                          margin: 0,
                          fontWeight: theme.font.weight.medium,
                        }}
                      >
                        {isExpired ? 'Expired' : 'Time Left'}
                      </p>
                      <p
                        style={{
                          color: isExpired ? theme.colors.error : theme.colors.primary,
                          fontSize: theme.font.size.lg,
                          margin: 0,
                          fontWeight: theme.font.weight.bold,
                          fontFamily: 'monospace',
                        }}
                      >
                        {isExpired ? '00:00' : formatTimeRemaining(timeRemaining)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {!order.otpExpiresAt && (
                <p
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: theme.font.size.xs,
                    margin: 0,
                    textAlign: 'center',
                  }}
                >
                  Enter the OTP sent to the customer
                </p>
              )}
            </div>
          </div>

          {/* Order Info Summary */}
          <Card
            padding
            shadow="sm"
            style={{
              backgroundColor: theme.colors.background || theme.colors.light,
              borderColor: theme.colors.border,
              marginBottom: theme.spacing(3),
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: theme.font.size.xs,
                    margin: 0,
                  }}
                >
                  Order ID
                </p>
                <p
                  style={{
                    color: theme.colors.text,
                    fontSize: theme.font.size.base,
                    margin: 0,
                    fontWeight: theme.font.weight.semibold,
                  }}
                >
                  #{order.id}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: theme.font.size.xs,
                    margin: 0,
                  }}
                >
                  Total Amount
                </p>
                <p
                  style={{
                    color: theme.colors.primary,
                    fontSize: theme.font.size.base,
                    margin: 0,
                    fontWeight: theme.font.weight.bold,
                  }}
                >
                  ₹{order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: theme.spacing(2),
          }}
        >
          <Button
            variant="outline"
            fullWidth
            onClick={onClose}
            disabled={isLoading}
            type="button"
            style={{
              borderColor: theme.colors.border,
              color: theme.colors.text,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            fullWidth
            type="submit"
            isLoading={isLoading}
            disabled={isLoading || isExpired || otp.length !== 6}
            style={{
              opacity: isLoading || isExpired || otp.length !== 6 ? 0.6 : 1,
            }}
          >
            {isLoading ? 'Verifying...' : 'Verify & Deliver'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default OtpVerificationModal;
