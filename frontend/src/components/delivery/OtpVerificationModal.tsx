import React, { useState } from 'react';
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
}

const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  order,
  onClose,
  onVerify,
  isLoading = false,
}) => {
  const theme = useTheme();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.trim().length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    onVerify(otp.trim());
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Verify OTP for Delivery" size="sm">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: theme.spacing(3) }}>
          <p style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing(2) }}>
            Please enter the OTP provided by the customer to complete the delivery.
          </p>

          {error && (
            <Card
              padding
              shadow="sm"
              style={{
                marginBottom: theme.spacing(2),
                backgroundColor: theme.colors.error + '10',
                borderColor: theme.colors.error,
              }}
            >
              <p style={{ color: theme.colors.error, margin: 0, fontSize: theme.font.size.sm }}>
                {error}
              </p>
            </Card>
          )}

          <div style={{ marginBottom: theme.spacing(3) }}>
            <label
              style={{
                display: 'block',
                marginBottom: theme.spacing(1),
                fontWeight: theme.font.weight.medium,
                fontSize: theme.font.size.sm,
              }}
            >
              OTP Code
            </label>
            <Input
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(value);
                setError('');
              }}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              style={{
                textAlign: 'center',
                fontSize: theme.font.size['2xl'],
                letterSpacing: theme.spacing(1),
                fontWeight: theme.font.weight.bold,
              }}
              autoFocus
            />
            <p
              style={{
                color: theme.colors.textSecondary,
                fontSize: theme.font.size.xs,
                marginTop: theme.spacing(1),
                margin: 0,
              }}
            >
              {order.hasOTP && order.otpExpiresAt
                ? `OTP expires at: ${new Date(order.otpExpiresAt).toLocaleString()}`
                : 'Enter the OTP sent to the customer'}
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: theme.spacing(2),
          }}
        >
          <Button variant="outline" fullWidth onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" fullWidth type="submit" isLoading={isLoading}>
            Verify & Deliver
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default OtpVerificationModal;

