import React, { useEffect, useState } from 'react';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useTheme } from '../../hooks/useTheme';
import { providerApi } from '../../api/providerApi';
import type {
  DeliveryPartner,
  DeliveryPartnerCreateRequest,
  DeliveryPartnerUpdateRequest,
  VehicleType,
} from '../../types/deliveryPartner.types';

const DeliveryPartnersPage: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<DeliveryPartner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<DeliveryPartnerCreateRequest & { isAvailable?: boolean }>({
    username: '',
    email: '',
    password: '',
    fullName: '',
    vehicleType: 'BIKE',
    serviceArea: '',
    isAvailable: false,
  });

  useEffect(() => {
    loadDeliveryPartners();
  }, []);

  const loadDeliveryPartners = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await providerApi.getDeliveryPartners();
      setPartners(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load delivery partners');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      fullName: '',
      vehicleType: 'BIKE',
      serviceArea: '',
      isAvailable: false,
    });
    setError('');
    setIsCreateModalOpen(true);
  };

  const handleEdit = (partner: DeliveryPartner) => {
    setSelectedPartner(partner);
    setFormData({
      fullName: partner.fullName,
      vehicleType: partner.vehicleType,
      serviceArea: partner.serviceArea,
      isAvailable: partner.isAvailable,
    } as any);
    setError('');
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this delivery partner?')) {
      return;
    }

    try {
      await providerApi.deleteDeliveryPartner(id);
      loadDeliveryPartners();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete delivery partner');
    }
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await providerApi.createDeliveryPartner({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        vehicleType: formData.vehicleType,
        serviceArea: formData.serviceArea,
      });
      setIsCreateModalOpen(false);
      loadDeliveryPartners();
      setFormData({
        username: '',
        email: '',
        password: '',
        fullName: '',
        vehicleType: 'BIKE',
        serviceArea: '',
        isAvailable: false,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create delivery partner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartner) return;

    setIsSubmitting(true);
    setError('');

    try {
      await providerApi.updateDeliveryPartner(selectedPartner.id, {
        fullName: formData.fullName,
        vehicleType: formData.vehicleType,
        serviceArea: formData.serviceArea,
        isAvailable: formData.isAvailable || false,
      });
      setIsEditModalOpen(false);
      setSelectedPartner(null);
      loadDeliveryPartners();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update delivery partner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const vehicleTypes: Array<{ value: VehicleType; label: string }> = [
    { value: 'BIKE', label: 'Bike' },
    { value: 'SCOOTER', label: 'Scooter' },
    { value: 'BICYCLE', label: 'Bicycle' },
    { value: 'CAR', label: 'Car' },
  ];

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100%',
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
          <p>Loading delivery partners...</p>
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
      }}
    >
      <Container maxWidth="xl">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing(4),
          }}
        >
          <div>
            <h1
              style={{
                fontSize: theme.font.size['3xl'],
                fontWeight: theme.font.weight.bold,
                color: theme.colors.dark,
                marginBottom: theme.spacing(1),
              }}
            >
              Delivery Partners
            </h1>
            <p style={{ color: theme.colors.textSecondary, fontSize: theme.font.size.base }}>
              Manage your delivery partners
            </p>
          </div>
          <Button variant="primary" onClick={handleCreate}>
            + Add Delivery Partner
          </Button>
        </div>

        {error && !isCreateModalOpen && !isEditModalOpen && (
          <Card padding shadow="md" style={{ marginBottom: theme.spacing(4), backgroundColor: theme.colors.error + '10', borderColor: theme.colors.error }}>
            <p style={{ color: theme.colors.error, margin: 0 }}>{error}</p>
          </Card>
        )}

        {partners.length === 0 ? (
          <Card padding shadow="lg">
            <div style={{ textAlign: 'center', padding: theme.spacing(8) }}>
              <div style={{ fontSize: '64px', marginBottom: theme.spacing(2) }}>🚚</div>
              <h2
                style={{
                  fontSize: theme.font.size.xl,
                  fontWeight: theme.font.weight.bold,
                  color: theme.colors.dark,
                  marginBottom: theme.spacing(1),
                }}
              >
                No delivery partners
              </h2>
              <p style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing(4) }}>
                Create your first delivery partner to start assigning orders
              </p>
              <Button variant="primary" onClick={handleCreate}>
                Add Delivery Partner
              </Button>
            </div>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(3) }}>
            {partners.map((partner) => (
              <Card key={partner.id} padding shadow="lg" hover>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    gap: theme.spacing(3),
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing(2),
                        marginBottom: theme.spacing(1),
                      }}
                    >
                      <h3
                        style={{
                          fontSize: theme.font.size.lg,
                          fontWeight: theme.font.weight.bold,
                          color: theme.colors.dark,
                          margin: 0,
                        }}
                      >
                        {partner.fullName}
                      </h3>
                      <span
                        style={{
                          padding: `${theme.spacing(0.5)} ${theme.spacing(1.5)}`,
                          borderRadius: theme.radius.full,
                          fontSize: theme.font.size.xs,
                          fontWeight: theme.font.weight.semibold,
                          backgroundColor: partner.isAvailable
                            ? theme.colors.success + '20'
                            : theme.colors.textSecondary + '20',
                          color: partner.isAvailable
                            ? theme.colors.success
                            : theme.colors.textSecondary,
                        }}
                      >
                        {partner.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: theme.font.size.sm,
                        color: theme.colors.textSecondary,
                        marginBottom: theme.spacing(1),
                      }}
                    >
                      🚗 {partner.vehicleType} • 📍 {partner.serviceArea}
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: theme.spacing(1),
                    }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(partner)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(partner.id)}
                      style={{ color: theme.colors.error }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setError('');
          }}
          title="Add Delivery Partner"
          size="md"
        >
          <form onSubmit={handleSubmitCreate}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(3) }}>
              <Input
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
              <Input
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
              <Select
                label="Vehicle Type"
                value={formData.vehicleType}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleType: e.target.value as VehicleType })
                }
                options={vehicleTypes}
                required
              />
              <Input
                label="Service Area"
                value={formData.serviceArea}
                onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                placeholder="e.g., Mumbai Central, Andheri, Bandra"
                required
              />
              {error && (
                <p style={{ color: theme.colors.error, fontSize: theme.font.size.sm, margin: 0 }}>
                  {error}
                </p>
              )}
              <div style={{ display: 'flex', gap: theme.spacing(2), marginTop: theme.spacing(2) }}>
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setError('');
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
                  Create
                </Button>
              </div>
            </div>
          </form>
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPartner(null);
            setError('');
          }}
          title="Edit Delivery Partner"
          size="md"
        >
          <form onSubmit={handleSubmitEdit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(3) }}>
              <Input
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
              <Select
                label="Vehicle Type"
                value={formData.vehicleType}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleType: e.target.value as VehicleType })
                }
                options={vehicleTypes}
                required
              />
              <Input
                label="Service Area"
                value={formData.serviceArea}
                onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                placeholder="e.g., Mumbai Central, Andheri, Bandra"
                required
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing(2),
                  padding: theme.spacing(2),
                  backgroundColor: theme.colors.background || theme.colors.light,
                  borderRadius: theme.radius.md,
                }}
              >
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable || false}
                  onChange={(e) =>
                    setFormData({ ...formData, isAvailable: e.target.checked })
                  }
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <label
                  htmlFor="isAvailable"
                  style={{
                    fontSize: theme.font.size.base,
                    color: theme.colors.text,
                    cursor: 'pointer',
                    flex: 1,
                  }}
                >
                  Available for orders
                </label>
              </div>
              {error && (
                <p style={{ color: theme.colors.error, fontSize: theme.font.size.sm, margin: 0 }}>
                  {error}
                </p>
              )}
              <div style={{ display: 'flex', gap: theme.spacing(2), marginTop: theme.spacing(2) }}>
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedPartner(null);
                    setError('');
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
                  Update
                </Button>
              </div>
            </div>
          </form>
        </Modal>
      </Container>
    </div>
  );
};

export default DeliveryPartnersPage;

