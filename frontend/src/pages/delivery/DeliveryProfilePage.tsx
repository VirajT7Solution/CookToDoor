import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import { useTheme } from '../../hooks/useTheme';
import { deliveryPartnerApi } from '../../api/deliveryPartnerApi';
import type { DeliveryPartnerUpdateRequest, VehicleType } from '../../types/deliveryPartner.types';

interface DeliveryProfileFormData {
  fullName: string;
  vehicleType: VehicleType;
  serviceArea: string;
  isAvailable: boolean;
}

const DeliveryProfilePage: React.FC = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string>('');
  const [profile, setProfile] = useState<any>(null);
  const [profileId, setProfileId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DeliveryProfileFormData>({
    defaultValues: {
      fullName: '',
      vehicleType: 'BIKE',
      serviceArea: '',
      isAvailable: false,
    },
  });

  const isAvailable = watch('isAvailable');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoadingData(true);
    try {
      const data = await deliveryPartnerApi.getCurrentProfile();
      setProfile(data);
      setProfileId(data.id);
      setValue('fullName', data.fullName || '');
      setValue('vehicleType', data.vehicleType || 'BIKE');
      setValue('serviceArea', data.serviceArea || '');
      setValue('isAvailable', data.isAvailable || false);
    } catch (err: any) {
      setError('Failed to load profile');
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data: DeliveryProfileFormData) => {
    if (!profileId) {
      setError('Profile ID not found');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const requestData: DeliveryPartnerUpdateRequest = {
        fullName: data.fullName,
        vehicleType: data.vehicleType,
        serviceArea: data.serviceArea,
        isAvailable: data.isAvailable,
      };

      await deliveryPartnerApi.updateProfile(profileId, requestData);
      await loadProfile();
      alert('Profile updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const vehicleTypes: Array<{ value: VehicleType; label: string }> = [
    { value: 'BIKE', label: 'Bike' },
    { value: 'SCOOTER', label: 'Scooter' },
    { value: 'BICYCLE', label: 'Bicycle' },
    { value: 'CAR', label: 'Car' },
  ];

  if (loadingData) {
    return (
      <div
        style={{
          minHeight: '100%',
          background: `linear-gradient(135deg, ${theme.colors.primary}15 0%, ${theme.colors.secondary}15 100%)`,
          padding: theme.spacing(4),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          boxSizing: 'border-box',
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
        minHeight: '100%',
        background: `linear-gradient(135deg, ${theme.colors.primary}15 0%, ${theme.colors.secondary}15 100%)`,
        padding: theme.spacing(4),
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Container maxWidth="md">
        <div style={{ marginBottom: theme.spacing(4) }}>
          <h1
            style={{
              fontSize: theme.font.size['3xl'],
              fontWeight: theme.font.weight.bold,
              color: theme.colors.dark,
              marginBottom: theme.spacing(1),
            }}
          >
            Profile
          </h1>
          <p style={{ color: theme.colors.textSecondary, fontSize: theme.font.size.base }}>
            Manage your delivery partner profile
          </p>
        </div>

        <Card padding shadow="md">
          <form onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <Card
                padding
                shadow="sm"
                style={{
                  marginBottom: theme.spacing(4),
                  backgroundColor: theme.colors.error + '10',
                  borderColor: theme.colors.error,
                }}
              >
                <p style={{ color: theme.colors.error, margin: 0 }}>{error}</p>
              </Card>
            )}

            {/* Availability Toggle */}
            <div
              style={{
                marginBottom: theme.spacing(4),
                padding: theme.spacing(3),
                backgroundColor: isAvailable
                  ? `${theme.colors.success}15`
                  : `${theme.colors.warning}15`,
                borderRadius: theme.radius.md,
                border: `1px solid ${isAvailable ? theme.colors.success : theme.colors.warning}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: theme.font.size.base,
                      fontWeight: theme.font.weight.semibold,
                      marginBottom: theme.spacing(0.5),
                    }}
                  >
                    Availability Status
                  </h3>
                  <p
                    style={{
                      fontSize: theme.font.size.sm,
                      color: theme.colors.textSecondary,
                      margin: 0,
                    }}
                  >
                    {isAvailable
                      ? 'You are currently available to receive orders'
                      : 'You are currently unavailable. Enable to receive orders'}
                  </p>
                </div>
                <label
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    width: '60px',
                    height: '34px',
                  }}
                >
                  <input
                    type="checkbox"
                    {...register('isAvailable')}
                    style={{
                      opacity: 0,
                      width: 0,
                      height: 0,
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: isAvailable ? theme.colors.success : theme.colors.border,
                      transition: theme.transitions.base,
                      borderRadius: '34px',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        content: '""',
                        height: '26px',
                        width: '26px',
                        left: '4px',
                        bottom: '4px',
                        backgroundColor: theme.colors.white,
                        transition: theme.transitions.base,
                        borderRadius: '50%',
                        transform: isAvailable ? 'translateX(26px)' : 'translateX(0)',
                      }}
                    />
                  </span>
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div style={{ marginBottom: theme.spacing(4) }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: theme.spacing(1),
                  fontWeight: theme.font.weight.medium,
                }}
              >
                Full Name <span style={{ color: theme.colors.error }}>*</span>
              </label>
              <Input
                {...register('fullName', { required: 'Full name is required' })}
                placeholder="Enter your full name"
                error={errors.fullName?.message}
              />
            </div>

            {/* Vehicle Type */}
            <div style={{ marginBottom: theme.spacing(4) }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: theme.spacing(1),
                  fontWeight: theme.font.weight.medium,
                }}
              >
                Vehicle Type <span style={{ color: theme.colors.error }}>*</span>
              </label>
              <Select
                {...register('vehicleType', { required: 'Vehicle type is required' })}
                options={vehicleTypes}
                error={errors.vehicleType?.message}
              />
            </div>

            {/* Service Area */}
            <div style={{ marginBottom: theme.spacing(4) }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: theme.spacing(1),
                  fontWeight: theme.font.weight.medium,
                }}
              >
                Service Area <span style={{ color: theme.colors.error }}>*</span>
              </label>
              <Textarea
                {...register('serviceArea', { required: 'Service area is required' })}
                placeholder="Enter areas where you provide delivery service (comma-separated)"
                rows={3}
                error={errors.serviceArea?.message}
              />
              <p
                style={{
                  fontSize: theme.font.size.xs,
                  color: theme.colors.textSecondary,
                  marginTop: theme.spacing(1),
                  margin: 0,
                }}
              >
                Example: Mumbai Central, Andheri, Bandra
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              isLoading={isLoading}
              style={{ marginTop: theme.spacing(2) }}
            >
              Update Profile
            </Button>
          </form>
        </Card>
      </Container>
    </div>
  );
};

export default DeliveryProfilePage;

