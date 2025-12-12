import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled,
  children,
  className,
  ...props
}) => {
  const theme = useTheme();

  const sizeStyles = {
    sm: {
      padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
      fontSize: theme.font.size.sm,
    },
    md: {
      padding: `${theme.spacing(1.5)} ${theme.spacing(3)}`,
      fontSize: theme.font.size.base,
    },
    lg: {
      padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
      fontSize: theme.font.size.lg,
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
      border: `1px solid ${theme.colors.primary}`,
    },
    secondary: {
      backgroundColor: theme.colors.dark,
      color: theme.colors.white,
      border: `1px solid ${theme.colors.dark}`,
    },
    outline: {
      backgroundColor: 'transparent',
      color: theme.colors.primary,
      border: `2px solid ${theme.colors.primary}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: theme.colors.primary,
      border: 'none',
    },
  };

  const baseStyles: React.CSSProperties = {
    ...sizeStyles[size],
    ...variantStyles[variant],
    borderRadius: theme.radius.md,
    fontWeight: theme.font.weight.semibold,
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.6 : 1,
    transition: theme.transitions.base,
    width: fullWidth ? '100%' : 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
    fontFamily: theme.font.family,
  };

  return (
    <button
      className={cn('button', className)}
      style={baseStyles}
      disabled={disabled || isLoading}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = theme.shadow.md;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = '';
        }
      }}
      {...props}
    >
      {isLoading && (
        <span
          style={{
            width: '16px',
            height: '16px',
            border: `2px solid ${variant === 'primary' || variant === 'secondary' ? 'rgba(255,255,255,0.3)' : theme.colors.primary}`,
            borderTopColor: variant === 'primary' || variant === 'secondary' ? theme.colors.white : theme.colors.primary,
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      )}
      {children}
    </button>
  );
};

export default Button;

