import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { menuItemApi } from '../../api/menuItemApi';
import type { MenuItem } from '../../types/menuItem.types';

const ProductsListPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await menuItemApi.getMenuItems();
      setProducts(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setDeletingId(id);
    try {
      await menuItemApi.deleteMenuItem(id);
      await loadProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleAvailability = async (id: number, currentStatus: boolean) => {
    setTogglingId(id);
    try {
      await menuItemApi.toggleAvailability(id, !currentStatus);
      await loadProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update availability');
    } finally {
      setTogglingId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  const getImageUrl = (product: MenuItem): string | null => {
    if (product.imageBase64List && product.imageBase64List.length > 0) {
      const fileType = product.imageFileTypeList?.[0] || 'image/jpeg';
      return `data:${fileType};base64,${product.imageBase64List[0]}`;
    }
    if (product.imageUrl) {
      return product.imageUrl;
    }
    return null;
  };

  if (loading) {
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
          <p>Loading products...</p>
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
              Products
            </h1>
            <p style={{ color: theme.colors.textSecondary, fontSize: theme.font.size.base }}>
              Manage your menu items
            </p>
          </div>
          <div style={{ display: 'flex', gap: theme.spacing(2) }}>
            <Button variant="ghost" size="md" onClick={loadProducts}>
              Refresh
            </Button>
            <Button variant="primary" size="md" onClick={() => navigate('/provider/products/add')}>
              + Add Product
            </Button>
          </div>
        </div>

        {error && (
          <Card padding shadow="md" style={{ marginBottom: theme.spacing(4), backgroundColor: theme.colors.error + '10', borderColor: theme.colors.error }}>
            <p style={{ color: theme.colors.error, margin: 0 }}>{error}</p>
          </Card>
        )}

        {products.length === 0 ? (
          <Card padding shadow="lg">
            <div style={{ textAlign: 'center', padding: theme.spacing(8) }}>
              <div style={{ fontSize: '64px', marginBottom: theme.spacing(2) }}>📦</div>
              <h2
                style={{
                  fontSize: theme.font.size.xl,
                  fontWeight: theme.font.weight.bold,
                  color: theme.colors.dark,
                  marginBottom: theme.spacing(1),
                }}
              >
                No products yet
              </h2>
              <p style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing(4) }}>
                Get started by adding your first product
              </p>
              <Button variant="primary" onClick={() => navigate('/provider/products/add')}>
                Add Your First Product
              </Button>
            </div>
          </Card>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: theme.spacing(4),
            }}
          >
            {products.map((product) => {
              const imageUrl = getImageUrl(product);
              return (
                <Card key={product.id} padding shadow="lg" hover>
                  <div style={{ position: 'relative' }}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.itemName}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: theme.radius.md,
                          marginBottom: theme.spacing(2),
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '200px',
                          backgroundColor: theme.colors.border,
                          borderRadius: theme.radius.md,
                          marginBottom: theme.spacing(2),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: theme.colors.textSecondary,
                          fontSize: theme.font.size['2xl'],
                        }}
                      >
                        📷
                      </div>
                    )}
                    <span
                      style={{
                        position: 'absolute',
                        top: theme.spacing(2),
                        right: theme.spacing(2),
                        padding: `${theme.spacing(0.5)} ${theme.spacing(1.5)}`,
                        borderRadius: theme.radius.full,
                        fontSize: theme.font.size.xs,
                        fontWeight: theme.font.weight.semibold,
                        backgroundColor: product.isAvailable
                          ? (theme.colors.success + '20')
                          : (theme.colors.error + '20'),
                        color: product.isAvailable
                          ? (theme.colors.success || '#10b981')
                          : (theme.colors.error || '#ef4444'),
                      }}
                    >
                      {product.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  <div>
                    <h3
                      style={{
                        fontSize: theme.font.size.lg,
                        fontWeight: theme.font.weight.bold,
                        color: theme.colors.dark,
                        marginBottom: theme.spacing(0.5),
                      }}
                    >
                      {product.itemName}
                    </h3>
                    <p
                      style={{
                        fontSize: theme.font.size.sm,
                        color: theme.colors.textSecondary,
                        marginBottom: theme.spacing(1),
                      }}
                    >
                      {product.categoryName || 'Uncategorized'} • {product.mealType}
                    </p>
                    <p
                      style={{
                        fontSize: theme.font.size.base,
                        fontWeight: theme.font.weight.semibold,
                        color: theme.colors.primary,
                        marginBottom: theme.spacing(2),
                      }}
                    >
                      {formatCurrency(product.price)}
                    </p>
                    {product.description && (
                      <p
                        style={{
                          fontSize: theme.font.size.sm,
                          color: theme.colors.textSecondary,
                          marginBottom: theme.spacing(2),
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {product.description}
                      </p>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        gap: theme.spacing(2),
                        marginTop: theme.spacing(3),
                      }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        onClick={() => navigate(`/provider/products/edit/${product.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        fullWidth
                        onClick={() => handleToggleAvailability(product.id, product.isAvailable)}
                        isLoading={togglingId === product.id}
                      >
                        {product.isAvailable ? 'Hide' : 'Show'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        isLoading={deletingId === product.id}
                        style={{ color: theme.colors.error }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
};

export default ProductsListPage;
