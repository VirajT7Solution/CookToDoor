import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { authApi } from '../../api/authApi';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { useTheme } from '../../hooks/useTheme';
import { validateOtp, validateIdentifier } from '../../utils/validators';

interface VerifyOtpFormData {
  otp: string;
}

interface VerifyOtpFormProps {
  username?: string;
  email?: string;
  onSuccess: (otp: string) => void;
  onBack: () => void;
}

const VerifyOtpForm: React.FC<VerifyOtpFormProps> = ({
  username,
  email,
  onSuccess,
  onBack,
}) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpFormData>();

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const onSubmit = async (data: VerifyOtpFormData) => {
    setIsLoading(true);
    setError('');

    if (!validateIdentifier(username, email)) {
      setError('Username or email is required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.verifyOtp({
        username,
        email,
        otp: data.otp,
      });

      if (response.valid) {
        onSuccess(data.otp);
      } else {
        setError(response.message || 'Invalid or expired OTP');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !validateIdentifier(username, email)) return;

    setIsLoading(true);
    setError('');

    try {
      await authApi.resendOtp({
        username,
        email,
      });
      setResendCooldown(60); // 60 second cooldown
    } catch (err: any) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      padding
      shadow="lg"
      className="verify-otp-form"
      style={{
        maxWidth: '100%',
        width: '100%',
        margin: '0 auto',
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ textAlign: 'center', marginBottom: theme.spacing(6) }}>
          <h2
            style={{
              marginBottom: theme.spacing(1),
              fontSize: theme.font.size['2xl'],
              fontWeight: theme.font.weight.bold,
              color: theme.colors.dark,
              letterSpacing: '-0.5px',
            }}
          >
            Verify OTP
          </h2>
          <p
            style={{
              marginBottom: theme.spacing(3),
              color: theme.colors.textSecondary,
              fontSize: theme.font.size.sm,
            }}
          >
            Enter the 6-digit OTP sent to your email
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: theme.spacing(2.5),
              marginBottom: theme.spacing(3),
              backgroundColor: `${theme.colors.error}10`,
              color: theme.colors.error,
              borderRadius: theme.radius.md,
              fontSize: theme.font.size.sm,
              border: `1px solid ${theme.colors.error}20`,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing(1),
            }}
          >
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <Input
          label="OTP"
          type="text"
          fullWidth
          maxLength={6}
          placeholder="000000"
          {...register('otp', {
            required: 'OTP is required',
            validate: (value) => validateOtp(value) || 'OTP must be 6 digits',
          })}
          error={errors.otp?.message}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          size="lg"
          isLoading={isLoading}
          style={{
            marginTop: theme.spacing(4),
            fontSize: theme.font.size.base,
            fontWeight: theme.font.weight.semibold,
            padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
            boxShadow: theme.shadow.md,
          }}
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </Button>

        <div
          style={{
            marginTop: theme.spacing(2),
            textAlign: 'center',
            fontSize: theme.font.size.sm,
          }}
        >
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendCooldown > 0 || isLoading}
            style={{
              background: 'none',
              border: 'none',
              color: resendCooldown > 0 ? theme.colors.textSecondary : theme.colors.primary,
              cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
              textDecoration: 'underline',
              fontSize: theme.font.size.sm,
            }}
          >
            {resendCooldown > 0
              ? `Resend OTP in ${resendCooldown}s`
              : 'Resend OTP'}
          </button>
        </div>

        <Button
          type="button"
          variant="ghost"
          fullWidth
          onClick={onBack}
          style={{ marginTop: theme.spacing(2) }}
        >
          Back
        </Button>
      </form>
    </Card>
  );
};

export default VerifyOtpForm;

