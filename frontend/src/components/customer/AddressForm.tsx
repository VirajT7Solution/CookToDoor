import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme } from '../../hooks/useTheme';
import Input from '../ui/Input';
import Button from '../ui/Button';
import type { AddressRequest } from '../../types/customer.types';

const addressSchema = z.object({
  street1: z.string().min(1, 'Street address is required'),
  street2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(6, 'Pincode must be at least 6 digits').max(10, 'Invalid pincode'),
  address_type: z.enum(['HOME', 'WORK', 'OTHER']).optional(),
});

interface AddressFormProps {
  initialData?: Partial<AddressRequest>;
  onSubmit: (data: AddressRequest) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
  onFormChange?: (data: AddressRequest | null, isValid: boolean) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Save Address',
  onFormChange,
}) => {
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<AddressRequest>({
    resolver: zodResolver(addressSchema),
    mode: 'onChange', // Validate on change
    defaultValues: initialData || {
      street1: '',
      street2: '',
      city: '',
      state: '',
      pincode: '',
      address_type: 'HOME',
    },
  });

  // Watch form values to track changes
  const formValues = watch();
  
  // Notify parent of form changes
  React.useEffect(() => {
    if (onFormChange) {
      const hasRequiredFields = 
        formValues.street1?.trim() && 
        formValues.city?.trim() && 
        formValues.state?.trim() && 
        formValues.pincode?.trim() &&
        formValues.pincode.length >= 6;
      
      onFormChange(
        hasRequiredFields ? (formValues as AddressRequest) : null,
        isValid && hasRequiredFields
      );
    }
  }, [formValues, isValid, onFormChange]);

  // Also notify on initial mount if form is already valid
  React.useEffect(() => {
    if (onFormChange && initialData) {
      const hasRequiredFields = 
        initialData.street1?.trim() && 
        initialData.city?.trim() && 
        initialData.state?.trim() && 
        initialData.pincode?.trim() &&
        initialData.pincode.length >= 6;
      
      if (hasRequiredFields) {
        onFormChange(initialData as AddressRequest, true);
      }
    }
  }, []); // Only run on mount

  const handleFormSubmit = async (data: AddressRequest) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Input
        label="Street Address"
        {...register('street1')}
        error={errors.street1?.message}
        fullWidth
        placeholder="House/Flat number, Street name"
      />

      <Input
        label="Street Address 2 (Optional)"
        {...register('street2')}
        error={errors.street2?.message}
        fullWidth
        placeholder="Apartment, suite, etc."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: theme.spacing(2),
        }}
      >
        <Input
          label="City"
          {...register('city')}
          error={errors.city?.message}
          fullWidth
          placeholder="City"
        />

        <Input
          label="State"
          {...register('state')}
          error={errors.state?.message}
          fullWidth
          placeholder="State"
        />
      </div>

      <Input
        label="Pincode"
        {...register('pincode')}
        error={errors.pincode?.message}
        fullWidth
        placeholder="PIN code"
        type="text"
        pattern="[0-9]*"
        maxLength={10}
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isLoading}
        style={{ marginTop: theme.spacing(2) }}
      >
        {submitLabel}
      </Button>
    </form>
  );
};

export default AddressForm;

