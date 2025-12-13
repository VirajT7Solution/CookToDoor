import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { providerApi } from '../../api/providerApi';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { useTheme } from '../../hooks/useTheme';
import { getDefaultRoute } from '../../utils/routing';

interface LoginFormData {
  username: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, role } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Get pre-filled username from location state (from signup)
  const preFilledUsername = (location.state as any)?.username || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    defaultValues: {
      username: preFilledUsername,
    },
  });

  // Set username if pre-filled
  useEffect(() => {
    if (preFilledUsername) {
      setValue('username', preFilledUsername);
    }
  }, [preFilledUsername, setValue]);

  // Redirect if already authenticated based on role
  useEffect(() => {
    if (isAuthenticated && role) {
      navigate(getDefaultRoute(role), { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.login(data);
      login(response);
      
      // Handle role-based redirection
      if (response.role === 'Provider') {
        // Check provider profile completion
        try {
          const profileCheck = await providerApi.checkProfileComplete();
          
          // If profile is incomplete or onboarding, redirect to onboarding page
          if (!profileCheck.isComplete || profileCheck.isOnboarding) {
            navigate('/provider/details', { replace: true });
            return;
          }
          
          // Profile is complete, redirect to dashboard
          navigate('/provider/dashboard', { replace: true });
          return;
        } catch (profileErr: any) {
          // If profile check fails, assume profile is incomplete
          console.error('Profile check failed:', profileErr);
          navigate('/provider/details', { replace: true });
          return;
        }
      } else if (response.role === 'Customer') {
        // Customer: redirect directly to customer home
        navigate('/customer/home', { replace: true });
        return;
      }
      
      // For other roles (Delivery Partner, Admin), use default routing
      navigate(getDefaultRoute(response.role), { replace: true });
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Invalid username or password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      padding
      shadow="lg"
      className="login-form"
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
            Welcome Back
          </h2>
          <p
            style={{
              fontSize: theme.font.size.sm,
              color: theme.colors.textSecondary,
            }}
          >
            Sign in to your account to continue
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
          label="Username"
          fullWidth
          {...register('username', {
            required: 'Username is required',
          })}
          error={errors.username?.message}
        />

        <Input
          label="Password"
          type="password"
          fullWidth
          {...register('password', {
            required: 'Password is required',
          })}
          error={errors.password?.message}
        />

        <div
          style={{
            marginBottom: theme.spacing(2),
            textAlign: 'right',
            fontSize: theme.font.size.sm,
          }}
        >
          <a
            href="/forgot-password"
            onClick={(e) => {
              e.preventDefault();
              navigate('/forgot-password');
            }}
            style={{ color: theme.colors.primary }}
          >
            Forgot Password?
          </a>
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
          {isLoading ? 'Signing In...' : 'Sign In'}
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
          Don't have an account?{' '}
          <a
            href="/signup"
            onClick={(e) => {
              e.preventDefault();
              navigate('/signup');
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
            Sign Up
          </a>
        </div>
      </form>
    </Card>
  );
};

export default LoginForm;

