import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authApi } from '../../api/authApi';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { useTheme } from '../../hooks/useTheme';
import { validateEmail, validateIdentifier } from '../../utils/validators';

interface ForgotPasswordFormData {
  username: string;
  email: string;
}

interface ForgotPasswordFormProps {
  onSuccess: (username?: string, email?: string) => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSuccess }) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>();

  const username = watch('username');
  const email = watch('email');

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError('');

    // Validate at least one field is provided
    if (!validateIdentifier(data.username, data.email)) {
      setError('Please provide either username or email');
      setIsLoading(false);
      return;
    }

    try {
      await authApi.forgotPassword({
        username: data.username || undefined,
        email: data.email || undefined,
      });
      
      setSuccess(true);
      // Always show success to prevent enumeration
      setTimeout(() => {
        onSuccess(data.username, data.email);
      }, 1500);
    } catch (err: any) {
      // Still show success message to prevent enumeration
      setSuccess(true);
      setTimeout(() => {
        onSuccess(data.username, data.email);
      }, 1500);
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
            }}
          >
            ✓
          </div>
          <h3 style={{ marginBottom: theme.spacing(2) }}>
            Check Your Email
          </h3>
          <p style={{ color: theme.colors.textSecondary }}>
            If an account with that username/email exists, an OTP has been sent to your email.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      padding
      shadow="lg"
      className="forgot-password-form"
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
            Forgot Password
          </h2>
          <p
            style={{
              fontSize: theme.font.size.sm,
              color: theme.colors.textSecondary,
            }}
          >
            Enter your username or email to receive a password reset OTP
          </p>
        </div>


        {error && (
          <div
            style={{
              padding: theme.spacing(2),
              marginBottom: theme.spacing(2),
              backgroundColor: `${theme.colors.error}10`,
              color: theme.colors.error,
              borderRadius: theme.radius.md,
              fontSize: theme.font.size.sm,
            }}
          >
            {error}
          </div>
        )}

        <Input
          label="Username"
          fullWidth
          {...register('username', {
            validate: (value) => {
              const emailValue = watch('email');
              return (
                validateIdentifier(value, emailValue) ||
                'Please provide either username or email'
              );
            },
          })}
          error={errors.username?.message}
          helperText="At least one field is required"
        />

        <div
          style={{
            margin: `${theme.spacing(2)} 0`,
            textAlign: 'center',
            color: theme.colors.textSecondary,
            fontSize: theme.font.size.sm,
          }}
        >
          OR
        </div>

        <Input
          label="Email"
          type="email"
          fullWidth
          {...register('email', {
            validate: (value) => {
              const usernameValue = watch('username');
              if (value && !validateEmail(value)) {
                return 'Please enter a valid email address';
              }
              return (
                validateIdentifier(usernameValue, value) ||
                'Please provide either username or email'
              );
            },
          })}
          error={errors.email?.message}
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
          {isLoading ? 'Sending OTP...' : 'Send OTP'}
        </Button>
      </form>
    </Card>
  );
};

export default ForgotPasswordForm;

