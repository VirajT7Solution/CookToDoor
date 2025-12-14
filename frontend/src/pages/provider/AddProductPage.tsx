import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import { useTheme } from '../../hooks/useTheme';
import { menuItemApi } from '../../api/menuItemApi';
import { categoryApi } from '../../api/categoryApi';
import type { CreateMenuItemRequest } from '../../types/menuItem.types';
import type { Category, MealType } from '../../types/menuItem.types';

interface ProductFormData {
  itemName: string;
  description: string;
  price: number;
  categoryId: number;
  mealType: MealType;
  ingredients: string;
  unitsOfMeasurement: number;
  maxQuantity: number;
  isAvailable: boolean;
}

const AddProductPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    defaultValues: {
      itemName: '',
      description: '',
      price: 0,
      categoryId: 0,
      mealType: 'VEG',
      ingredients: '',
      unitsOfMeasurement: 0,
      maxQuantity: 1,
      isAvailable: true,
    },
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryApi.getCategories();
      setCategories(data.filter((cat) => cat.isActive !== false));
    } catch (err: any) {
      setError('Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must not exceed 5MB');
        return;
      }
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('File must be an image');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const requestData: CreateMenuItemRequest = {
        categoryId: data.categoryId,
        itemName: data.itemName,
        description: data.description,
        price: data.price,
        ingredients: data.ingredients || undefined,
        mealType: data.mealType,
        isAvailable: data.isAvailable,
        unitsOfMeasurement: data.unitsOfMeasurement,
        maxQuantity: data.maxQuantity,
      };

      await menuItemApi.createMenuItem(requestData, imageFile || undefined);
      navigate('/provider/products');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const mealTypeOptions = [
    { value: 'VEG', label: 'Vegetarian' },
    { value: 'NON_VEG', label: 'Non-Vegetarian' },
    { value: 'JAIN', label: 'Jain' },
  ];

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.categoryName,
  }));

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
                Add New Product
              </h1>
              <p
                style={{
                  fontSize: theme.font.size.base,
                  color: theme.colors.textSecondary,
                }}
              >
                Create a new menu item for your customers
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
                label="Item Name"
                fullWidth
                {...register('itemName', {
                  required: 'Item name is required',
                  minLength: {
                    value: 2,
                    message: 'Item name must be at least 2 characters',
                  },
                })}
                error={errors.itemName?.message}
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

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: theme.spacing(3),
                }}
              >
                <Input
                  label="Price (₹)"
                  type="number"
                  step="0.01"
                  min="0"
                  fullWidth
                  {...register('price', {
                    required: 'Price is required',
                    min: {
                      value: 0,
                      message: 'Price must be greater than or equal to 0',
                    },
                    valueAsNumber: true,
                  })}
                  error={errors.price?.message}
                />

                {loadingCategories ? (
                  <div style={{ display: 'flex', alignItems: 'center', paddingTop: theme.spacing(5) }}>
                    <p style={{ color: theme.colors.textSecondary }}>Loading categories...</p>
                  </div>
                ) : (
                  <Select
                    label="Category"
                    fullWidth
                    options={[
                      { value: 0, label: 'Select Category' },
                      ...categoryOptions,
                    ]}
                    {...register('categoryId', {
                      required: 'Category is required',
                      validate: (value) => value !== 0 || 'Please select a category',
                      valueAsNumber: true,
                    })}
                    error={errors.categoryId?.message}
                    onChange={(e) => setValue('categoryId', Number(e.target.value))}
                  />
                )}
              </div>

              <Select
                label="Meal Type"
                fullWidth
                options={mealTypeOptions}
                {...register('mealType', {
                  required: 'Meal type is required',
                })}
                error={errors.mealType?.message}
                onChange={(e) => setValue('mealType', e.target.value as MealType)}
              />

              <Textarea
                label="Ingredients (Optional)"
                fullWidth
                rows={3}
                {...register('ingredients')}
                helperText="List the main ingredients"
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: theme.spacing(3),
                }}
              >
                <Input
                  label="Units of Measurement (grams)"
                  type="number"
                  min="0"
                  fullWidth
                  {...register('unitsOfMeasurement', {
                    required: 'Units of measurement is required',
                    min: {
                      value: 0,
                      message: 'Must be greater than or equal to 0',
                    },
                    valueAsNumber: true,
                  })}
                  error={errors.unitsOfMeasurement?.message}
                />

                <Input
                  label="Max Quantity"
                  type="number"
                  min="1"
                  fullWidth
                  {...register('maxQuantity', {
                    required: 'Max quantity is required',
                    min: {
                      value: 1,
                      message: 'Must be at least 1',
                    },
                    valueAsNumber: true,
                  })}
                  error={errors.maxQuantity?.message}
                />
              </div>

              <div style={{ marginBottom: theme.spacing(3) }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing(2),
                    cursor: 'pointer',
                    fontSize: theme.font.size.base,
                    color: theme.colors.text,
                  }}
                >
                  <input
                    type="checkbox"
                    {...register('isAvailable')}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                    }}
                  />
                  <span>Available for order</span>
                </label>
              </div>

              <div style={{ marginBottom: theme.spacing(3) }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: theme.spacing(0.5),
                    fontSize: theme.font.size.sm,
                    fontWeight: theme.font.weight.medium,
                    color: theme.colors.text,
                  }}
                >
                  Product Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{
                    width: '100%',
                    padding: theme.spacing(1.5),
                    fontSize: theme.font.size.base,
                    fontFamily: theme.font.family,
                    color: theme.colors.text,
                    backgroundColor: theme.colors.white,
                    border: `1.5px solid ${theme.colors.border}`,
                    borderRadius: theme.radius.md,
                  }}
                />
                {imagePreview && (
                  <div style={{ marginTop: theme.spacing(2) }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '200px',
                        borderRadius: theme.radius.md,
                        border: `1px solid ${theme.colors.border}`,
                      }}
                    />
                  </div>
                )}
                <p
                  style={{
                    marginTop: theme.spacing(0.5),
                    fontSize: theme.font.size.xs,
                    color: theme.colors.textSecondary,
                  }}
                >
                  Maximum file size: 5MB. Supported formats: JPG, PNG, JPEG
                </p>
              </div>

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
                  onClick={() => navigate('/provider/products')}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                  Create Product
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default AddProductPage;
