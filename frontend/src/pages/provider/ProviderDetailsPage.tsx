import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { providerApi } from '../../api/providerApi';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Container from '../../components/ui/Container';
import { useTheme } from '../../hooks/useTheme';
import type { ProviderDetailsRequest } from '../../types/provider.types';

interface ProviderDetailsFormData {
  businessName: string;
  description: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  commissionRate: number;
}

const ProviderDetailsPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Redirect if not authenticated or not a provider
  useEffect(() => {
    if (!isAuthenticated || role !== 'Provider') {
      navigate('/login');
    }
  }, [isAuthenticated, role, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProviderDetailsFormData>({
    defaultValues: {
      businessName: '',
      description: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      commissionRate: 0.0,
    },
  });

  // Load existing provider details if available
  useEffect(() => {
    const loadDetails = async () => {
      try {
        const details = await providerApi.getDetails();
        setValue('businessName', details.businessName || '');
        setValue('description', details.description || '');
        setValue('commissionRate', details.commissionRate ?? 0.0);
        if (details.address) {
          setValue('street', details.address.street || '');
          setValue('city', details.address.city || '');
          setValue('state', details.address.state || '');
          setValue('zipCode', details.address.zipCode || '');
        }
      } catch (err: any) {
        // If details don't exist, that's fine - we're in onboarding
        console.log('No existing details found, starting fresh');
      } finally {
        setIsLoadingData(false);
      }
    };

    if (isAuthenticated && role === 'Provider') {
      loadDetails();
    }
  }, [isAuthenticated, role, setValue]);

  const onSubmit = async (data: ProviderDetailsFormData) => {
    setIsLoading(true);
    setError('');

    try {
      // Get existing provider details to preserve zone if updating
      let existingZone: number | null = null;
      try {
        const existingDetails = await providerApi.getDetails();
        existingZone = existingDetails.zone ?? null;
      } catch (err) {
        // If provider doesn't exist yet, zone will need to be set
        // For now, we'll let backend handle it or use a default
        console.log('No existing provider found');
      }

      const requestData: ProviderDetailsRequest = {
        businessName: data.businessName,
        description: data.description || '',
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        },
        // commissionRate is required (NOT NULL in database)
        commissionRate: data.commissionRate ?? 0.0,
        // zone is required for new providers, preserve existing for updates
        zone: existingZone,
        // Optional fields with defaults
        providesDelivery: false,
        deliveryRadius: null,
      };

      await providerApi.saveDetails(requestData);
      
      // Redirect to dashboard after successful save
      navigate('/provider/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to save provider details. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: theme.spacing(8) }}>
          <p>Loading...</p>
        </div>
      </Container>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.colors.primary}15 0%, ${theme.colors.secondary}15 100%)`,
        padding: theme.spacing(4),
      }}
    >
      <Container maxWidth="lg">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Card
            padding
            shadow="lg"
            style={{
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: theme.spacing(6) }}>
              <h1
                style={{
                  marginBottom: theme.spacing(1),
                  fontSize: theme.font.size['3xl'],
                  fontWeight: theme.font.weight.bold,
                  color: theme.colors.dark,
                }}
              >
                Complete Your Provider Profile
              </h1>
              <p
                style={{
                  fontSize: theme.font.size.base,
                  color: theme.colors.textSecondary,
                }}
              >
                Please provide your business details to get started
              </p>
            </div>

            {error && (
              <div
                style={{
                  padding: theme.spacing(2.5),
                  marginBottom: theme.spacing(3),
                  backgroundColor: `${theme.colors.error}10`,
                  color: theme.colors.error,
                  borderRadius: theme.radius.md,
                  fontSize: theme.font.size.sm,
                  border: `1px solid ${theme.colors.error}20`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing(1),
                }}
              >
                <span style={{ fontSize: '18px' }}>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Business Name"
                fullWidth
                {...register('businessName', {
                  required: 'Business name is required',
                })}
                error={errors.businessName?.message}
              />

              <Input
                label="Description"
                fullWidth
                {...register('description')}
                error={errors.description?.message}
                helperText="Brief description of your business (optional)"
              />

              <div style={{ marginTop: theme.spacing(4), marginBottom: theme.spacing(2) }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: theme.spacing(2),
                    fontSize: theme.font.size.base,
                    fontWeight: theme.font.weight.semibold,
                    color: theme.colors.text,
                  }}
                >
                  Address
                </label>
                <Input
                  label="Street Address"
                  fullWidth
                  {...register('street', {
                    required: 'Street address is required',
                  })}
                  error={errors.street?.message}
                />
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: theme.spacing(2),
                    marginTop: theme.spacing(2),
                  }}
                >
                  <Input
                    label="City"
                    fullWidth
                    {...register('city', {
                      required: 'City is required',
                    })}
                    error={errors.city?.message}
                  />
                  <Input
                    label="State"
                    fullWidth
                    {...register('state', {
                      required: 'State is required',
                    })}
                    error={errors.state?.message}
                  />
                </div>
                <Input
                  label="Zip Code"
                  fullWidth
                  {...register('zipCode', {
                    required: 'Zip code is required',
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: 'Zip code must be 6 digits',
                    },
                  })}
                  error={errors.zipCode?.message}
                  style={{ marginTop: theme.spacing(2) }}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                isLoading={isLoading}
                style={{
                  marginTop: theme.spacing(6),
                  fontSize: theme.font.size.base,
                  fontWeight: theme.font.weight.semibold,
                  padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                  boxShadow: theme.shadow.md,
                }}
              >
                {isLoading ? 'Saving...' : 'Save & Continue'}
              </Button>
            </form>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default ProviderDetailsPage;
