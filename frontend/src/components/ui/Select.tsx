import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: SelectOption[];
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  options,
  className,
  id,
  ...props
}) => {
  const theme = useTheme();
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      className={cn('select-wrapper', className)}
      style={{
        width: fullWidth ? '100%' : 'auto',
        marginBottom: theme.spacing(2),
      }}
    >
      {label && (
        <label
          htmlFor={selectId}
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
      <select
        id={selectId}
        className={cn('select', error && 'select-error')}
        style={{
          width: '100%',
          padding: `${theme.spacing(1.5)} ${theme.spacing(2)}`,
          fontSize: theme.font.size.base,
          fontFamily: theme.font.family,
          color: theme.colors.text,
          backgroundColor: theme.colors.white,
          border: `1.5px solid ${error ? theme.colors.error : theme.colors.border}`,
          borderRadius: theme.radius.md,
          transition: theme.transitions.base,
          outline: 'none',
          boxShadow: 'none',
          cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: `right ${theme.spacing(2)} center`,
          paddingRight: theme.spacing(5),
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
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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

export default Select;
