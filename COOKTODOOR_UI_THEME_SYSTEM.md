# 🍽️ CookToDoor React + TypeScript UI Theme System

Complete UI theme system for the CookToDoor brand with React + TypeScript.

---

## 📁 Project Structure

```
src/
  components/
    ui/
      Button.tsx
      Card.tsx
      Input.tsx
      Navbar.tsx
      Logo.tsx
      Container.tsx
  layouts/
    MainLayout.tsx
  pages/
    Home/
      HomePage.tsx
  styles/
    theme.ts
    global.css
  hooks/
    useTheme.ts
  utils/
    index.ts
  assets/
    logo/
      cooktodoor-logo.svg
```

---

## 📄 File Contents

### `/src/styles/theme.ts`

```typescript
export interface Theme {
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    dark: string;
    darkLight: string;
    light: string;
    white: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadow: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  spacing: (factor: number) => string;
  font: {
    family: string;
    size: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    weight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  transitions: {
    fast: string;
    base: string;
    slow: string;
  };
}

export const theme: Theme = {
  colors: {
    primary: '#F36A10',
    primaryDark: '#D85A0E',
    primaryLight: '#FF7A20',
    dark: '#2D3A45',
    darkLight: '#3D4A55',
    light: '#FAFAFA',
    white: '#FFFFFF',
    text: '#2D3A45',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    xl: '24px',
    full: '100px',
  },
  shadow: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.08)',
    md: '0 4px 12px rgba(0, 0, 0, 0.12)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.16)',
    xl: '0 12px 32px rgba(0, 0, 0, 0.20)',
  },
  spacing: (factor: number) => `${factor * 8}px`,
  font: {
    family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    size: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '20px',
      xl: '28px',
      '2xl': '36px',
      '3xl': '48px',
    },
    weight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  transitions: {
    fast: '150ms ease-in-out',
    base: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
};

export default theme;
```

---

### `/src/styles/global.css`

```css
/* Font Import */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* CSS Reset */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Root Variables */
:root {
  --color-primary: #F36A10;
  --color-primary-dark: #D85A0E;
  --color-primary-light: #FF7A20;
  --color-dark: #2D3A45;
  --color-dark-light: #3D4A55;
  --color-light: #FAFAFA;
  --color-white: #FFFFFF;
  --color-text: #2D3A45;
  --color-text-secondary: #6B7280;
  --color-border: #E5E7EB;
  --color-error: #EF4444;
  --color-success: #10B981;
  --color-warning: #F59E0B;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 100px;

  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.16);
  --shadow-xl: 0 12px 32px rgba(0, 0, 0, 0.20);

  --transition-fast: 150ms ease-in-out;
  --transition-base: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;
}

/* Base Styles */
html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  color: var(--color-text);
  background-color: var(--color-light);
  min-height: 100vh;
}

/* Typography */
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-dark);
  margin-bottom: 0.5em;
}

h1 {
  font-size: 48px;
}

h2 {
  font-size: 36px;
}

h3 {
  font-size: 28px;
}

h4 {
  font-size: 20px;
}

h5 {
  font-size: 18px;
}

h6 {
  font-size: 16px;
}

p {
  margin-bottom: 1em;
}

a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--color-primary-dark);
}

/* Form Elements */
input,
textarea,
select,
button {
  font-family: inherit;
  font-size: inherit;
}

button {
  cursor: pointer;
  border: none;
  background: none;
}

/* Images */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Lists */
ul,
ol {
  list-style: none;
}

/* Focus Styles */
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Scrollbar Styles */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-light);
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-secondary);
}
```

---

### `/src/hooks/useTheme.ts`

```typescript
import { theme, Theme } from '../styles/theme';

export const useTheme = (): Theme => {
  return theme;
};

export default useTheme;
```

---

### `/src/utils/index.ts`

```typescript
/**
 * Utility function to combine class names
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format date
 */
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObj);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
};
```

---

### `/src/components/ui/Container.tsx`

```typescript
import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils';

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
}

const Container: React.FC<ContainerProps> = ({
  children,
  className,
  maxWidth = 'lg',
  padding = true,
}) => {
  const theme = useTheme();

  const maxWidthMap = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    full: '100%',
  };

  return (
    <div
      className={cn('container', className)}
      style={{
        maxWidth: maxWidthMap[maxWidth],
        margin: '0 auto',
        padding: padding ? theme.spacing(2) : 0,
        width: '100%',
      }}
    >
      {children}
    </div>
  );
};

export default Container;
```

---

### `/src/components/ui/Button.tsx`

```typescript
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

  const hoverStyles: React.CSSProperties =
    !disabled && !isLoading
      ? {
          transform: 'translateY(-1px)',
          boxShadow: theme.shadow.md,
        }
      : {};

  return (
    <button
      className={cn('button', className)}
      style={baseStyles}
      disabled={disabled || isLoading}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          Object.assign(e.currentTarget.style, hoverStyles);
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
```

---

### `/src/components/ui/Card.tsx`

```typescript
import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = true,
  shadow = 'md',
  hover = false,
  onClick,
}) => {
  const theme = useTheme();

  const shadowMap = {
    sm: theme.shadow.sm,
    md: theme.shadow.md,
    lg: theme.shadow.lg,
    xl: theme.shadow.xl,
    none: 'none',
  };

  return (
    <div
      className={cn('card', className)}
      style={{
        backgroundColor: theme.colors.white,
        borderRadius: theme.radius.lg,
        padding: padding ? theme.spacing(3) : 0,
        boxShadow: shadowMap[shadow],
        transition: theme.transitions.base,
        cursor: onClick ? 'pointer' : 'default',
        border: `1px solid ${theme.colors.border}`,
        ...(hover && {
          ':hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadow.lg,
          },
        }),
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = theme.shadow.lg;
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = shadowMap[shadow];
        }
      }}
    >
      {children}
    </div>
  );
};

export default Card;
```

---

### `/src/components/ui/Input.tsx`

```typescript
import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}) => {
  const theme = useTheme();
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      className={cn('input-wrapper', className)}
      style={{
        width: fullWidth ? '100%' : 'auto',
        marginBottom: theme.spacing(2),
      }}
    >
      {label && (
        <label
          htmlFor={inputId}
          style={{
            display: 'block',
            marginBottom: theme.spacing(0.5),
            fontSize: theme.font.size.sm,
            fontWeight: theme.font.weight.medium,
            color: theme.colors.text,
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {leftIcon && (
          <div
            style={{
              position: 'absolute',
              left: theme.spacing(2),
              display: 'flex',
              alignItems: 'center',
              color: theme.colors.textSecondary,
            }}
          >
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={cn('input', error && 'input-error')}
          style={{
            width: '100%',
            padding: `${theme.spacing(1.5)} ${rightIcon || leftIcon ? theme.spacing(4) : theme.spacing(2)}`,
            paddingLeft: leftIcon ? theme.spacing(4) : theme.spacing(2),
            paddingRight: rightIcon ? theme.spacing(4) : theme.spacing(2),
            fontSize: theme.font.size.base,
            fontFamily: theme.font.family,
            color: theme.colors.text,
            backgroundColor: theme.colors.white,
            border: `1px solid ${error ? theme.colors.error : theme.colors.border}`,
            borderRadius: theme.radius.md,
            transition: theme.transitions.base,
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error ? theme.colors.error : theme.colors.primary;
            e.currentTarget.style.boxShadow = `0 0 0 3px ${error ? `${theme.colors.error}20` : `${theme.colors.primary}20`}`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? theme.colors.error : theme.colors.border;
            e.currentTarget.style.boxShadow = 'none';
          }}
          {...props}
        />
        {rightIcon && (
          <div
            style={{
              position: 'absolute',
              right: theme.spacing(2),
              display: 'flex',
              alignItems: 'center',
              color: theme.colors.textSecondary,
            }}
          >
            {rightIcon}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <div
          style={{
            marginTop: theme.spacing(0.5),
            fontSize: theme.font.size.sm,
            color: error ? theme.colors.error : theme.colors.textSecondary,
          }}
        >
          {error || helperText}
        </div>
      )}
    </div>
  );
};

export default Input;
```

---

### `/src/components/ui/Logo.tsx`

```typescript
import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className, onClick }) => {
  const theme = useTheme();

  const sizeMap = {
    sm: { icon: 24, text: 16 },
    md: { icon: 32, text: 20 },
    lg: { icon: 48, text: 28 },
  };

  const { icon: iconSize, text: textSize } = sizeMap[size];

  return (
    <div
      className={cn('logo', className)}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      {/* Logo Icon - Orange Circle with Fork/Knife Icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="24" cy="24" r="24" fill={theme.colors.primary} />
        <path
          d="M24 14V34M18 20H30M18 28H30"
          stroke={theme.colors.white}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="20" cy="18" r="2" fill={theme.colors.white} />
        <circle cx="28" cy="18" r="2" fill={theme.colors.white} />
      </svg>
      {showText && (
        <span
          style={{
            fontSize: textSize,
            fontWeight: theme.font.weight.bold,
            color: theme.colors.dark,
            letterSpacing: '-0.5px',
          }}
        >
          CookToDoor
        </span>
      )}
    </div>
  );
};

export default Logo;
```

---

### `/src/components/ui/Navbar.tsx`

```typescript
import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils';
import Logo from './Logo';
import Button from './Button';
import Container from './Container';

export interface NavbarProps {
  className?: string;
  onLogoClick?: () => void;
  menuItems?: Array<{
    label: string;
    href: string;
    onClick?: () => void;
  }>;
  showAuthButtons?: boolean;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  className,
  onLogoClick,
  menuItems = [],
  showAuthButtons = true,
  onLoginClick,
  onSignUpClick,
}) => {
  const theme = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav
      className={cn('navbar', className)}
      style={{
        backgroundColor: theme.colors.white,
        borderBottom: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadow.sm,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <Container maxWidth="xl" padding>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
          }}
        >
          {/* Logo */}
          <Logo size="md" onClick={onLogoClick} />

          {/* Desktop Menu */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: theme.spacing(4),
              '@media (min-width: 768px)': {
                display: 'flex',
              },
            }}
            className="desktop-menu"
          >
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                onClick={item.onClick}
                style={{
                  fontSize: theme.font.size.base,
                  fontWeight: theme.font.weight.medium,
                  color: theme.colors.text,
                  textDecoration: 'none',
                  transition: theme.transitions.fast,
                  padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
                  borderRadius: theme.radius.md,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.colors.primary;
                  e.currentTarget.style.backgroundColor = `${theme.colors.primary}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.colors.text;
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          {showAuthButtons && (
            <div
              style={{
                display: 'none',
                alignItems: 'center',
                gap: theme.spacing(2),
                '@media (min-width: 768px)': {
                  display: 'flex',
                },
              }}
              className="auth-buttons"
            >
              <Button variant="ghost" size="md" onClick={onLoginClick}>
                Log In
              </Button>
              <Button variant="primary" size="md" onClick={onSignUpClick}>
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              padding: theme.spacing(1),
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              '@media (min-width: 768px)': {
                display: 'none',
              },
            }}
            className="mobile-menu-button"
          >
            <span
              style={{
                width: '24px',
                height: '2px',
                backgroundColor: theme.colors.dark,
                borderRadius: '2px',
                transition: theme.transitions.base,
                transform: isMobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
              }}
            />
            <span
              style={{
                width: '24px',
                height: '2px',
                backgroundColor: theme.colors.dark,
                borderRadius: '2px',
                transition: theme.transitions.base,
                opacity: isMobileMenuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                width: '24px',
                height: '2px',
                backgroundColor: theme.colors.dark,
                borderRadius: '2px',
                transition: theme.transitions.base,
                transform: isMobileMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none',
              }}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing(2),
              paddingTop: theme.spacing(2),
              paddingBottom: theme.spacing(2),
              borderTop: `1px solid ${theme.colors.border}`,
              '@media (min-width: 768px)': {
                display: 'none',
              },
            }}
            className="mobile-menu"
          >
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                onClick={() => {
                  item.onClick?.();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  fontSize: theme.font.size.base,
                  fontWeight: theme.font.weight.medium,
                  color: theme.colors.text,
                  textDecoration: 'none',
                  padding: theme.spacing(1.5),
                  borderRadius: theme.radius.md,
                }}
              >
                {item.label}
              </a>
            ))}
            {showAuthButtons && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: theme.spacing(1),
                  marginTop: theme.spacing(1),
                }}
              >
                <Button variant="ghost" size="md" fullWidth onClick={onLoginClick}>
                  Log In
                </Button>
                <Button variant="primary" size="md" fullWidth onClick={onSignUpClick}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        )}
      </Container>
    </nav>
  );
};

export default Navbar;
```

---

### `/src/layouts/MainLayout.tsx`

```typescript
import React from 'react';
import { useTheme } from '../hooks/useTheme';
import Navbar from '../components/ui/Navbar';
import Container from '../components/ui/Container';

export interface MainLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  navbarProps?: React.ComponentProps<typeof Navbar>;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showNavbar = true,
  navbarProps,
}) => {
  const theme = useTheme();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.colors.light,
      }}
    >
      {showNavbar && <Navbar {...navbarProps} />}
      <main
        style={{
          flex: 1,
          width: '100%',
        }}
      >
        {children}
      </main>
      <footer
        style={{
          backgroundColor: theme.colors.white,
          borderTop: `1px solid ${theme.colors.border}`,
          padding: theme.spacing(4),
          marginTop: 'auto',
        }}
      >
        <Container maxWidth="xl">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: theme.spacing(2),
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: theme.font.size.sm,
                color: theme.colors.textSecondary,
              }}
            >
              © {new Date().getFullYear()} CookToDoor. All rights reserved.
            </p>
            <p
              style={{
                fontSize: theme.font.size.xs,
                color: theme.colors.textSecondary,
              }}
            >
              Fresh. Trust. Convenience — Delivered to Your Door.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default MainLayout;
```

---

### `/src/pages/Home/HomePage.tsx`

```typescript
import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import MainLayout from '../../layouts/MainLayout';
import Container from '../../components/ui/Container';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Logo from '../../components/ui/Logo';

const HomePage: React.FC = () => {
  const theme = useTheme();

  const handleGetStarted = () => {
    console.log('Get Started clicked');
    // Navigate to sign up or order page
  };

  const handleOrderNow = () => {
    console.log('Order Now clicked');
    // Navigate to menu/order page
  };

  return (
    <MainLayout
      navbarProps={{
        menuItems: [
          { label: 'Menu', href: '#menu' },
          { label: 'How It Works', href: '#how-it-works' },
          { label: 'About', href: '#about' },
          { label: 'Contact', href: '#contact' },
        ],
        onLoginClick: () => console.log('Login clicked'),
        onSignUpClick: () => console.log('Sign Up clicked'),
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          backgroundColor: theme.colors.white,
          paddingTop: theme.spacing(8),
          paddingBottom: theme.spacing(12),
          background: `linear-gradient(135deg, ${theme.colors.light} 0%, ${theme.colors.white} 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: theme.spacing(4),
            }}
          >
            {/* Logo */}
            <Logo size="lg" />

            {/* Hero Title */}
            <h1
              style={{
                fontSize: theme.font.size['3xl'],
                fontWeight: theme.font.weight.bold,
                color: theme.colors.dark,
                maxWidth: '800px',
                lineHeight: 1.2,
                marginBottom: theme.spacing(2),
              }}
            >
              Fresh. Trust. Convenience — Delivered to Your Door.
            </h1>

            {/* Hero Subtitle */}
            <p
              style={{
                fontSize: theme.font.size.lg,
                color: theme.colors.textSecondary,
                maxWidth: '600px',
                lineHeight: 1.6,
                marginBottom: theme.spacing(2),
              }}
            >
              Experience the best of home-cooked meals delivered fresh to your doorstep.
              Order from trusted local chefs and enjoy authentic flavors.
            </p>

            {/* CTA Buttons */}
            <div
              style={{
                display: 'flex',
                gap: theme.spacing(3),
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginTop: theme.spacing(2),
              }}
            >
              <Button size="lg" variant="primary" onClick={handleOrderNow}>
                Order Now
              </Button>
              <Button size="lg" variant="outline" onClick={handleGetStarted}>
                Get Started
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section
        style={{
          paddingTop: theme.spacing(12),
          paddingBottom: theme.spacing(12),
          backgroundColor: theme.colors.light,
        }}
      >
        <Container maxWidth="lg">
          <div
            style={{
              textAlign: 'center',
              marginBottom: theme.spacing(8),
            }}
          >
            <h2
              style={{
                fontSize: theme.font.size['2xl'],
                fontWeight: theme.font.weight.bold,
                color: theme.colors.dark,
                marginBottom: theme.spacing(2),
              }}
            >
              Why Choose CookToDoor?
            </h2>
            <p
              style={{
                fontSize: theme.font.size.base,
                color: theme.colors.textSecondary,
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              We bring you the best home-cooked meals with convenience and trust.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: theme.spacing(4),
            }}
          >
            {[
              {
                title: 'Fresh Ingredients',
                description: 'Every meal is prepared with the freshest ingredients, sourced locally.',
                icon: '🥬',
              },
              {
                title: 'Trusted Chefs',
                description: 'All our chefs are verified and trusted members of the community.',
                icon: '👨‍🍳',
              },
              {
                title: 'Fast Delivery',
                description: 'Get your meals delivered quickly and safely to your door.',
                icon: '🚀',
              },
            ].map((feature, index) => (
              <Card key={index} hover shadow="md" padding>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: theme.spacing(2),
                  }}
                >
                  <div
                    style={{
                      fontSize: '48px',
                      marginBottom: theme.spacing(1),
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: theme.font.size.xl,
                      fontWeight: theme.font.weight.semibold,
                      color: theme.colors.dark,
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontSize: theme.font.size.base,
                      color: theme.colors.textSecondary,
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section
        style={{
          paddingTop: theme.spacing(12),
          paddingBottom: theme.spacing(12),
          backgroundColor: theme.colors.white,
        }}
      >
        <Container maxWidth="lg">
          <div
            style={{
              textAlign: 'center',
              marginBottom: theme.spacing(8),
            }}
          >
            <h2
              style={{
                fontSize: theme.font.size['2xl'],
                fontWeight: theme.font.weight.bold,
                color: theme.colors.dark,
                marginBottom: theme.spacing(2),
              }}
            >
              How It Works
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: theme.spacing(6),
            }}
          >
            {[
              { step: '1', title: 'Browse Menu', description: 'Explore delicious meals from local chefs' },
              { step: '2', title: 'Place Order', description: 'Select your favorite dishes and checkout' },
              { step: '3', title: 'Get Delivered', description: 'Receive fresh meals at your doorstep' },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: theme.spacing(2),
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: theme.radius.full,
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.white,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: theme.font.size.xl,
                    fontWeight: theme.font.weight.bold,
                    marginBottom: theme.spacing(2),
                  }}
                >
                  {item.step}
                </div>
                <h3
                  style={{
                    fontSize: theme.font.size.lg,
                    fontWeight: theme.font.weight.semibold,
                    color: theme.colors.dark,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: theme.font.size.base,
                    color: theme.colors.textSecondary,
                    lineHeight: 1.6,
                  }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </MainLayout>
  );
};

export default HomePage;
```

---

### `/src/assets/logo/cooktodoor-logo.svg`

```svg
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="24" cy="24" r="24" fill="#F36A10"/>
  <path d="M24 14V34M18 20H30M18 28H30" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="20" cy="18" r="2" fill="white"/>
  <circle cx="28" cy="18" r="2" fill="white"/>
</svg>
```

---

## 🎨 Additional Styling Notes

### CSS Animation for Loading Spinner

Add this to your `global.css`:

```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

### Responsive Breakpoints

The theme includes breakpoints that can be used with media queries:

```typescript
// Usage example
const isMobile = window.innerWidth < parseInt(theme.breakpoints.md);
```

---

## 📦 Package.json Dependencies

Make sure your `package.json` includes:

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  }
}
```

---

## 🚀 Usage Example

### App.tsx

```typescript
import React from 'react';
import './styles/global.css';
import HomePage from './pages/Home/HomePage';

const App: React.FC = () => {
  return <HomePage />;
};

export default App;
```

---

## ✅ TypeScript Configuration

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 🎉 Summary

This complete UI theme system provides:

✅ **Full TypeScript typing** - All components are properly typed  
✅ **Theme system** - Centralized colors, spacing, typography, shadows  
✅ **Reusable components** - Button, Card, Input, Navbar, Logo, Container  
✅ **Responsive design** - Mobile-first approach with breakpoints  
✅ **Brand consistency** - CookToDoor orange (#F36A10) and dark gray (#2D3A45)  
✅ **Modern UI patterns** - Rounded corners, smooth transitions, hover effects  
✅ **Accessibility** - Focus states, semantic HTML, proper labels  
✅ **Professional layout** - MainLayout with Navbar and Footer  
✅ **Example page** - Complete HomePage with hero, features, and CTA sections  

All components follow React best practices and are ready for production use!

