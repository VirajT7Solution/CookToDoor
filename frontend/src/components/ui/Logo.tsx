import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils';
import logoImage from '../../assets/logo.png';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className, onClick }) => {
  const theme = useTheme();

  const sizeMap = {
    sm: { height: 40 },
    md: { height: 60 },
    lg: { height: 100 },
  };

  const { height: imageHeight } = sizeMap[size];

  return (
    <div
      className={cn('logo', className)}
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.spacing(0.5),
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      {/* Logo Image - Contains full logo with van icon, text and tagline */}
      <img
        src={logoImage}
        alt="CookToDoor Logo"
        style={{
          height: imageHeight,
          width: 'auto',
          objectFit: 'contain',
          maxWidth: '100%',
        }}
      />
    </div>
  );
};

export default Logo;

