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
              zIndex: 1,
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
            border: `1.5px solid ${error ? theme.colors.error : theme.colors.border}`,
            borderRadius: theme.radius.md,
            transition: theme.transitions.base,
            outline: 'none',
            boxShadow: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error ? theme.colors.error : theme.colors.primary;
            e.currentTarget.style.boxShadow = `0 0 0 3px ${error ? `${theme.colors.error}15` : `${theme.colors.primary}15`}`;
            e.currentTarget.style.borderWidth = '1.5px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? theme.colors.error : theme.colors.border;
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderWidth = '1.5px';
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
              zIndex: 1,
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

