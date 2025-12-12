import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { useTheme } from '../../hooks/useTheme';
import { validatePassword, validateIdentifier } from '../../utils/validators';

interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

interface ResetPasswordFormProps {
  username?: string;
  email?: string;
  otp: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  username,
  email,
  otp,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>();

  const newPassword = watch('newPassword');

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError('');

    if (!validateIdentifier(username, email)) {
      setError('Username or email is required');
      setIsLoading(false);
      return;
    }

    try {
      await authApi.resetPassword({
        username,
        email,
        otp,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to reset password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card padding shadow="md">
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '48px',
              marginBottom: theme.spacing(2),
              color: theme.colors.success,
            }}
          >
            ✓
          </div>
          <h3 style={{ marginBottom: theme.spacing(2) }}>
            Password Reset Successful
          </h3>
          <p style={{ color: theme.colors.textSecondary }}>
            Your password has been reset successfully. Redirecting to login...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      padding
      shadow="lg"
      className="reset-password-form"
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
            Reset Password
          </h2>
          <p
            style={{
              fontSize: theme.font.size.sm,
              color: theme.colors.textSecondary,
            }}
          >
            Create a new secure password for your account
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
          label="New Password"
          type="password"
          fullWidth
          {...register('newPassword', {
            required: 'New password is required',
            validate: (value) => {
              const result = validatePassword(value);
              return result.valid || result.message;
            },
          })}
          error={errors.newPassword?.message}
        />

        <Input
          label="Confirm Password"
          type="password"
          fullWidth
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) =>
              value === newPassword || 'Passwords do not match',
          })}
          error={errors.confirmPassword?.message}
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
          {isLoading ? 'Resetting Password...' : 'Reset Password'}
        </Button>
      </form>
    </Card>
  );
};

export default ResetPasswordForm;

