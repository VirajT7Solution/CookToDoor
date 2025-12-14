import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils';

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  style?: React.CSSProperties;
}

const Container: React.FC<ContainerProps> = ({
  children,
  className,
  maxWidth = 'lg',
  padding = true,
  style,
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
        boxSizing: 'border-box', // Include padding in width calculation
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Container;

