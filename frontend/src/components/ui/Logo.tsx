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

