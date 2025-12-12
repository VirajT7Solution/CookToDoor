import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { useTheme } from '../../hooks/useTheme';
import { providerApi } from '../../api/providerApi';
import type { ProviderDetailsRequest } from '../../types/provider.types';

interface ProviderProfileFormData {
  businessName: string;
  description: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

const ProviderProfilePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string>('');
  const [profile, setProfile] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProviderProfileFormData>({
    defaultValues: {
      businessName: '',
      description: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoadingData(true);
    try {
      const data = await providerApi.getDetails();
      setProfile(data);
      setValue('businessName', data.businessName || '');
      setValue('description', data.description || '');
      if (data.address) {
        setValue('street', data.address.street || '');
        setValue('city', data.address.city || '');
        setValue('state', data.address.state || '');
        setValue('zipCode', data.address.zipCode || '');
      }
    } catch (err: any) {
      setError('Failed to load profile');
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data: ProviderProfileFormData) => {
    setIsLoading(true);
    setError('');

    try {
      let existingZone: number | null = null;
      try {
        const existingDetails = await providerApi.getDetails();
        existingZone = existingDetails.zone ?? null;
      } catch (err) {
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
        commissionRate: profile?.commissionRate ?? 0.0,
        zone: existingZone,
        providesDelivery: profile?.providesDelivery || false,
        deliveryRadius: profile?.deliveryRadius || null,
      };

      await providerApi.saveDetails(requestData);
      await loadProfile();
      alert('Profile updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${theme.colors.primary}15 0%, ${theme.colors.secondary}15 100%)`,
          padding: theme.spacing(4),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center', color: theme.colors.textSecondary }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              border: `4px solid ${theme.colors.border}`,
              borderTopColor: theme.colors.primary,
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto',
              marginBottom: theme.spacing(2),
            }}
          />
          <p>Loading profile...</p>
        </div>
      </div>
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
          <Card padding shadow="lg">
            <div style={{ textAlign: 'center', marginBottom: theme.spacing(6) }}>
              <h1
                style={{
                  marginBottom: theme.spacing(1),
                  fontSize: theme.font.size['3xl'],
                  fontWeight: theme.font.weight.bold,
                  color: theme.colors.dark,
                }}
              >
                Provider Profile
              </h1>
              <p
                style={{
                  fontSize: theme.font.size.base,
                  color: theme.colors.textSecondary,
                }}
              >
                Manage your business profile information
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

            {/* Read-only Information */}
            {profile && (
              <Card padding shadow="sm" style={{ marginBottom: theme.spacing(4), backgroundColor: theme.colors.background || theme.colors.light }}>
                <h3
                  style={{
                    fontSize: theme.font.size.lg,
                    fontWeight: theme.font.weight.bold,
                    color: theme.colors.dark,
                    marginBottom: theme.spacing(3),
                  }}
                >
                  Business Information
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: theme.spacing(3),
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: theme.font.size.sm,
                        color: theme.colors.textSecondary,
                        margin: 0,
                        marginBottom: theme.spacing(0.5),
                      }}
                    >
                      Commission Rate
                    </p>
                    <p
                      style={{
                        fontSize: theme.font.size.base,
                        fontWeight: theme.font.weight.semibold,
                        color: theme.colors.dark,
                        margin: 0,
                      }}
                    >
                      {profile.commissionRate ? `${profile.commissionRate}%` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: theme.font.size.sm,
                        color: theme.colors.textSecondary,
                        margin: 0,
                        marginBottom: theme.spacing(0.5),
                      }}
                    >
                      Verification Status
                    </p>
                    <p
                      style={{
                        fontSize: theme.font.size.base,
                        fontWeight: theme.font.weight.semibold,
                        color: profile.isVerified
                          ? (theme.colors.success || '#10b981')
                          : (theme.colors.warning || '#f59e0b'),
                        margin: 0,
                      }}
                    >
                      {profile.isVerified ? '✓ Verified' : '⏳ Pending Verification'}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Business Name"
                fullWidth
                {...register('businessName', {
                  required: 'Business name is required',
                  minLength: {
                    value: 2,
                    message: 'Business name must be at least 2 characters',
                  },
                })}
                error={errors.businessName?.message}
              />

              <Textarea
                label="Description"
                fullWidth
                rows={4}
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 10,
                    message: 'Description must be at least 10 characters',
                  },
                })}
                error={errors.description?.message}
              />

              <h3
                style={{
                  fontSize: theme.font.size.lg,
                  fontWeight: theme.font.weight.bold,
                  color: theme.colors.dark,
                  marginTop: theme.spacing(4),
                  marginBottom: theme.spacing(2),
                }}
              >
                Address
              </h3>

              <Input
                label="Street"
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
                  gap: theme.spacing(3),
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
                    value: /^\d{5,6}$/,
                    message: 'Please enter a valid zip code',
                  },
                })}
                error={errors.zipCode?.message}
              />

              <div
                style={{
                  display: 'flex',
                  gap: theme.spacing(3),
                  marginTop: theme.spacing(4),
                }}
              >
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => navigate('/provider/dashboard')}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default ProviderProfilePage;
