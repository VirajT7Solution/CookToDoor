import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { useTheme } from '../../hooks/useTheme';
import { validateEmail, validatePassword, validatePhone } from '../../utils/validators';
import { ROLE_OPTIONS } from '../../utils/constants';
import type { SignUpRequest } from '../../types/auth.types';

interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role: 'ROLE_CUSTOMER' | 'ROLE_PROVIDER' | 'ROLE_DELIVERY_PARTNER';
}

const SignUpForm: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormData>({
    defaultValues: {
      role: 'ROLE_CUSTOMER',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const signUpData: SignUpRequest = {
        username: data.username,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
        role: data.role,
      };

      await authApi.signup(signUpData);
      
      // Redirect to login with username pre-filled
      navigate('/login', { state: { username: data.username } });
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Sign up failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      padding
      shadow="lg"
      className="signup-form"
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
            Create Account
          </h2>
          <p
            style={{
              fontSize: theme.font.size.sm,
              color: theme.colors.textSecondary,
            }}
          >
            Fill in your details to get started
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

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
            gap: theme.spacing(3),
            marginBottom: theme.spacing(3),
          }}
        >
          <Input
            label="Username"
            fullWidth
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters',
              },
            })}
            error={errors.username?.message}
          />

          <Input
            label="Email"
            type="email"
            fullWidth
            {...register('email', {
              required: 'Email is required',
              validate: (value) =>
                validateEmail(value) || 'Please enter a valid email address',
            })}
            error={errors.email?.message}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
            gap: theme.spacing(3),
            marginBottom: theme.spacing(3),
          }}
        >
          <Input
            label="Password"
            type="password"
            fullWidth
            {...register('password', {
              required: 'Password is required',
              validate: (value) => {
                const result = validatePassword(value);
                return result.valid || result.message;
              },
            })}
            error={errors.password?.message}
          />

          <Input
            label="Confirm Password"
            type="password"
            fullWidth
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === password || 'Passwords do not match',
            })}
            error={errors.confirmPassword?.message}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
            gap: theme.spacing(3),
            marginBottom: theme.spacing(3),
          }}
        >
          <Input
            label="Phone (10 digits)"
            type="tel"
            fullWidth
            {...register('phone', {
              validate: (value) =>
                !value || validatePhone(value) || 'Phone must be exactly 10 digits',
            })}
            error={errors.phone?.message}
            helperText="Optional"
          />

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: theme.spacing(0.5),
                fontSize: theme.font.size.sm,
                fontWeight: theme.font.weight.medium,
                color: theme.colors.text,
              }}
            >
              Role
            </label>
            <select
              {...register('role', { required: 'Role is required' })}
              style={{
                width: '100%',
                padding: `${theme.spacing(1.5)} ${theme.spacing(2)}`,
                fontSize: theme.font.size.base,
                fontFamily: theme.font.family,
                color: theme.colors.text,
                backgroundColor: theme.colors.white,
                border: `1px solid ${errors.role ? theme.colors.error : theme.colors.border}`,
                borderRadius: theme.radius.md,
                outline: 'none',
                transition: theme.transitions.base,
                cursor: 'pointer',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = errors.role
                  ? theme.colors.error
                  : theme.colors.primary;
                e.currentTarget.style.boxShadow = `0 0 0 3px ${errors.role ? `${theme.colors.error}20` : `${theme.colors.primary}20`}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.role
                  ? theme.colors.error
                  : theme.colors.border;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.role && (
              <div
                style={{
                  marginTop: theme.spacing(0.5),
                  fontSize: theme.font.size.sm,
                  color: theme.colors.error,
                }}
              >
                {errors.role.message}
              </div>
            )}
          </div>
        </div>

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
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <div
          style={{
            marginTop: theme.spacing(4),
            paddingTop: theme.spacing(4),
            borderTop: `1px solid ${theme.colors.border}`,
            textAlign: 'center',
            fontSize: theme.font.size.sm,
            color: theme.colors.textSecondary,
          }}
        >
          Already have an account?{' '}
          <a
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              navigate('/login');
            }}
            style={{
              color: theme.colors.primary,
              fontWeight: theme.font.weight.semibold,
              textDecoration: 'none',
              transition: theme.transitions.fast,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = theme.colors.primaryDark;
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = theme.colors.primary;
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Log In
          </a>
        </div>
      </form>
    </Card>
  );
};

export default SignUpForm;

