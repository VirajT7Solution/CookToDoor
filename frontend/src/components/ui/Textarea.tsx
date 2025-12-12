import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  className,
  id,
  ...props
}) => {
  const theme = useTheme();
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      className={cn('textarea-wrapper', className)}
      style={{
        width: fullWidth ? '100%' : 'auto',
        marginBottom: theme.spacing(2),
      }}
    >
      {label && (
        <label
          htmlFor={textareaId}
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
      <textarea
        id={textareaId}
        className={cn('textarea', error && 'textarea-error')}
        style={{
          width: '100%',
          padding: theme.spacing(1.5),
          fontSize: theme.font.size.base,
          fontFamily: theme.font.family,
          color: theme.colors.text,
          backgroundColor: theme.colors.white,
          border: `1.5px solid ${error ? theme.colors.error : theme.colors.border}`,
          borderRadius: theme.radius.md,
          transition: theme.transitions.base,
          outline: 'none',
          boxShadow: 'none',
          resize: 'vertical',
          minHeight: '100px',
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

export default Textarea;
