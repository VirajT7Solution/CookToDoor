import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme } from '../../hooks/useTheme';
import CustomerLayout from '../../layouts/CustomerLayout';
import AddressForm from '../../components/customer/AddressForm';
import { userApi } from '../../api/userApi';
import { customerApi } from '../../api/customerApi';
import { useAuth } from '../../hooks/useAuth';
import type { UserProfile, AddressRequest, Customer } from '../../types/customer.types';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import axiosClient from '../../api/axiosClient';

const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  dateOfBirth: z.string().optional(),
  email: z.string().email('Invalid email'),
  phoneNumber: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const CustomerProfilePage: React.FC = () => {
  const theme = useTheme();
  const { userId } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const [userData, customerData] = await Promise.all([
        userApi.getUser(userId),
        customerApi.getCustomerByUserId(userId).catch(() => null),
      ]);
      setUser(userData);
      if (customerData) {
        setCustomer(customerData);
        reset({
          fullName: customerData.fullName || '',
          dateOfBirth: customerData.dateOfBirth || '',
          email: userData.email,
          phoneNumber: userData.phoneNumber || '',
        });
      } else {
        reset({
          fullName: '',
          dateOfBirth: '',
          email: userData.email,
          phoneNumber: userData.phoneNumber || '',
        });
      }

      // Load profile image
      if (userData.profileImageId) {
        try {
          const imageResponse = await axiosClient.get(`/images/view/${userData.profileImageId}`, {
            responseType: 'blob',
          });
          const imageUrl = URL.createObjectURL(imageResponse.data);
          setProfileImageUrl(imageUrl);
        } catch (err) {
          console.error('Failed to load profile image:', err);
        }
      }
    } catch (err: any) {
      console.error('Failed to load profile:', err);
      alert('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (data: ProfileFormData) => {
    if (!userId || !customer) return;
    try {
      setIsSaving(true);

      // Update user
      await userApi.updateUser(userId, {
        email: data.email,
        phoneNumber: data.phoneNumber,
      });

      // Update customer
      await customerApi.updateCustomer(customer.id, {
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth || undefined,
      });

      await loadProfile();
      alert('Profile updated successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAddress = async (data: AddressRequest) => {
    if (!userId) return;
    try {
      await userApi.saveAddress(userId, data);
      await loadProfile();
      alert('Address saved successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save address');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userId || !customer || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      const formData = new FormData();
      formData.append('file', file);

      await axiosClient.post(`/api/users/${userId}/profile-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await loadProfile();
      alert('Profile image updated successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload image');
    }
  };

  if (isLoading) {
    return (
      <CustomerLayout>
        <div style={{ textAlign: 'center', padding: theme.spacing(6) }}>
          <div style={{ fontSize: '48px', marginBottom: theme.spacing(2) }}>⏳</div>
          <p>Loading profile...</p>
        </div>
      </CustomerLayout>
    );
  }

  if (!user) {
    return (
      <CustomerLayout>
        <div style={{ textAlign: 'center', padding: theme.spacing(6) }}>
          <p>Failed to load profile</p>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1
          style={{
            fontSize: theme.font.size.xl,
            fontWeight: theme.font.weight.bold,
            marginBottom: theme.spacing(4),
          }}
        >
          My Profile
        </h1>

        {/* Profile Image */}
        <Card style={{ marginBottom: theme.spacing(3), textAlign: 'center' }}>
          <div style={{ marginBottom: theme.spacing(2) }}>
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: theme.radius.full,
                  objectFit: 'cover',
                  margin: '0 auto',
                }}
              />
            ) : (
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: theme.radius.full,
                  backgroundColor: theme.colors.light,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  margin: '0 auto',
                }}
              >
                👤
              </div>
            )}
          </div>
          <label
            style={{
              display: 'inline-block',
              padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
              backgroundColor: theme.colors.primary,
              color: theme.colors.white,
              borderRadius: theme.radius.md,
              cursor: 'pointer',
              fontSize: theme.font.size.sm,
              fontWeight: theme.font.weight.medium,
            }}
          >
            Upload Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </label>
        </Card>

        {/* Profile Information */}
        <Card style={{ marginBottom: theme.spacing(3) }}>
          <h2
            style={{
              fontSize: theme.font.size.base,
              fontWeight: theme.font.weight.semibold,
              marginBottom: theme.spacing(3),
            }}
          >
            Profile Information
          </h2>
          <form onSubmit={handleSubmit(handleSaveProfile)}>
            <Input
              label="Username"
              value={user.username}
              disabled
              fullWidth
              helperText="Username cannot be changed"
            />
            <Input
              label="Email"
              {...register('email')}
              error={errors.email?.message}
              fullWidth
              type="email"
            />
            <Input
              label="Phone Number"
              {...register('phoneNumber')}
              error={errors.phoneNumber?.message}
              fullWidth
            />
            <Input
              label="Full Name"
              {...register('fullName')}
              error={errors.fullName?.message}
              fullWidth
            />
            <Input
              label="Date of Birth"
              {...register('dateOfBirth')}
              error={errors.dateOfBirth?.message}
              fullWidth
              type="date"
            />
            <Button type="submit" variant="primary" fullWidth isLoading={isSaving} style={{ marginTop: theme.spacing(2) }}>
              Save Profile
            </Button>
          </form>
        </Card>

        {/* Address */}
        <Card>
          <h2
            style={{
              fontSize: theme.font.size.base,
              fontWeight: theme.font.weight.semibold,
              marginBottom: theme.spacing(3),
            }}
          >
            Delivery Address
          </h2>
          {user.address ? (
            <div>
              <div
                style={{
                  padding: theme.spacing(2),
                  backgroundColor: theme.colors.light,
                  borderRadius: theme.radius.md,
                  marginBottom: theme.spacing(2),
                }}
              >
                <p style={{ margin: 0 }}>
                  {user.address.street1}
                  {user.address.street2 && `, ${user.address.street2}`}
                </p>
                <p style={{ margin: 0 }}>
                  {user.address.city}, {user.address.state} - {user.address.pincode}
                </p>
              </div>
              <AddressForm
                initialData={{
                  street1: user.address.street1 || '',
                  street2: user.address.street2,
                  city: user.address.city || '',
                  state: user.address.state || '',
                  pincode: user.address.pincode || '',
                  address_type: user.address.addressType || 'HOME',
                }}
                onSubmit={handleSaveAddress}
                submitLabel="Update Address"
              />
            </div>
          ) : (
            <AddressForm onSubmit={handleSaveAddress} />
          )}
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default CustomerProfilePage;

