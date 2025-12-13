import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../hooks/useTheme';
import CustomerLayout from '../../layouts/CustomerLayout';
import MenuItemCard from '../../components/customer/MenuItemCard';
import CategoryFilter from '../../components/customer/CategoryFilter';
import { customerApi } from '../../api/customerApi';
import { categoryApi } from '../../api/categoryApi';
import type { CustomerMenuItem } from '../../types/customer.types';
import type { Category } from '../../types/menuItem.types';
import Input from '../../components/ui/Input';

const CustomerHomePage: React.FC = () => {
  const theme = useTheme();
  const [menuItems, setMenuItems] = useState<CustomerMenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryApi.getCategories();
        setCategories(data);
      } catch (err: any) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Load menu items
  const loadMenuItems = useCallback(async (pageNum: number, reset = false) => {
    try {
      if (reset) {
        setIsLoading(true);
        setError(null);
      } else {
        setIsLoadingMore(true);
      }

      let data;
      if (debouncedSearchQuery.trim()) {
        data = await customerApi.searchMenuItems(debouncedSearchQuery, {
          page: pageNum,
          size: 20,
          sort: 'id,desc',
        });
      } else if (selectedCategoryId) {
        data = await customerApi.getMenuItemsByCategory(selectedCategoryId, {
          page: pageNum,
          size: 20,
          sort: 'id,desc',
        });
      } else {
        data = await customerApi.getMenuItems({
          page: pageNum,
          size: 20,
          sort: 'id,desc',
        });
      }

      if (reset) {
        setMenuItems(data.content);
      } else {
        setMenuItems((prev) => [...prev, ...data.content]);
      }
      setHasMore(data.hasNext);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load menu items');
      console.error('Failed to load menu items:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [debouncedSearchQuery, selectedCategoryId]);


  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Reload when debounced search or category changes
  useEffect(() => {
    loadMenuItems(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, selectedCategoryId]);

  const handleCategorySelect = (categoryId?: number) => {
    setSelectedCategoryId(categoryId);
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setPage(0);
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      loadMenuItems(page + 1, false);
    }
  };

  // Get featured items (first 5 items for "Today's Best Food")
  const featuredItems = menuItems.slice(0, 5);

  return (
    <CustomerLayout>
      <div>
        {/* Welcome Section */}
        <div style={{ marginBottom: theme.spacing(4) }}>
          <h1
            style={{
              fontSize: theme.font.size.xl,
              fontWeight: theme.font.weight.bold,
              color: theme.colors.dark,
              marginBottom: theme.spacing(1),
            }}
          >
            Welcome to CookToDoor
          </h1>
          <p
            style={{
              fontSize: theme.font.size.base,
              color: theme.colors.textSecondary,
            }}
          >
            Discover delicious food from local chefs
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: theme.spacing(3) }}>
          <Input
            placeholder="Search for food items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            leftIcon={<span>🔍</span>}
          />
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div style={{ marginBottom: theme.spacing(4) }}>
            <h2
              style={{
                fontSize: theme.font.size.base,
                fontWeight: theme.font.weight.semibold,
                color: theme.colors.text,
                marginBottom: theme.spacing(2),
              }}
            >
              Choose Category
            </h2>
            <CategoryFilter
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onCategorySelect={handleCategorySelect}
            />
          </div>
        )}

        {/* Today's Best Food - Horizontal Scroll */}
        {!debouncedSearchQuery && !selectedCategoryId && featuredItems.length > 0 && (
          <div style={{ marginBottom: theme.spacing(4) }}>
            <h2
              style={{
                fontSize: theme.font.size.base,
                fontWeight: theme.font.weight.semibold,
                color: theme.colors.text,
                marginBottom: theme.spacing(2),
              }}
            >
              Today's Best Food
            </h2>
            <div
              style={{
                display: 'flex',
                gap: theme.spacing(2),
                overflowX: 'auto',
                paddingBottom: theme.spacing(1),
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
              className="horizontal-scroll"
            >
              {featuredItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    minWidth: '280px',
                    maxWidth: '280px',
                  }}
                >
                  <MenuItemCard item={item} />
                </div>
              ))}
              <style>{`
                .horizontal-scroll::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
            </div>
          </div>
        )}

        {/* Menu Items Grid */}
        <div>
          <h2
            style={{
              fontSize: theme.font.size.base,
              fontWeight: theme.font.weight.semibold,
              color: theme.colors.text,
              marginBottom: theme.spacing(2),
            }}
          >
            {debouncedSearchQuery ? 'Search Results' : selectedCategoryId ? 'Category Items' : 'All Items'}
          </h2>

          {isLoading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: theme.spacing(3),
              }}
            >
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: '350px',
                    backgroundColor: theme.colors.light,
                    borderRadius: theme.radius.lg,
                  }}
                />
              ))}
            </div>
          ) : error ? (
            <div
              style={{
                padding: theme.spacing(4),
                textAlign: 'center',
                color: theme.colors.error,
              }}
            >
              {error}
            </div>
          ) : menuItems.length === 0 ? (
            <div
              style={{
                padding: theme.spacing(6),
                textAlign: 'center',
                color: theme.colors.textSecondary,
              }}
            >
              <p style={{ fontSize: theme.font.size.lg, marginBottom: theme.spacing(2) }}>
                No items found
              </p>
              <p>Try searching with different keywords or browse categories</p>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: theme.spacing(3),
                  marginBottom: theme.spacing(4),
                }}
              >
                {menuItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: theme.spacing(4) }}>
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    style={{
                      padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.white,
                      border: 'none',
                      borderRadius: theme.radius.md,
                      fontSize: theme.font.size.base,
                      fontWeight: theme.font.weight.semibold,
                      cursor: isLoadingMore ? 'not-allowed' : 'pointer',
                      opacity: isLoadingMore ? 0.6 : 1,
                    }}
                  >
                    {isLoadingMore ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerHomePage;

