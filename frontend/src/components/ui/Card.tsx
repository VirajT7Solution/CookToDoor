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
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = true,
  shadow = 'md',
  hover = false,
  onClick,
  style,
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
        borderRadius: theme.radius.xl,
        padding: padding ? theme.spacing(5) : 0,
        boxShadow: shadowMap[shadow],
        transition: theme.transitions.base,
        cursor: onClick ? 'pointer' : 'default',
        border: `1px solid ${theme.colors.border}`,
        ...(className?.includes('signup-form') || className?.includes('login-form')
          ? {
              backdropFilter: 'blur(10px)',
            }
          : {}),
        ...style,
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

