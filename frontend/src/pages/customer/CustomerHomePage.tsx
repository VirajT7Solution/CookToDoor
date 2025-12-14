import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import MenuItemCard from '../../components/customer/MenuItemCard';
import CategoryFilter from '../../components/customer/CategoryFilter';
import { customerApi } from '../../api/customerApi';
import { categoryApi } from '../../api/categoryApi';
import type { CustomerMenuItem, Customer } from '../../types/customer.types';
import type { Category } from '../../types/menuItem.types';

const CustomerHomePage: React.FC = () => {
  const theme = useTheme();
  const { userId, username } = useAuth();
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
  const [isMobile, setIsMobile] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load customer profile
  useEffect(() => {
    const loadCustomerProfile = async () => {
      if (!userId) return;
      try {
        setIsLoadingProfile(true);
        const customerData = await customerApi.getCustomerByUserId(userId);
        setCustomer(customerData);
      } catch (err: any) {
        console.error('Failed to load customer profile:', err);
        // If customer profile doesn't exist, that's okay - we'll just use username
      } finally {
        setIsLoadingProfile(false);
      }
    };
    loadCustomerProfile();
  }, [userId]);

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
    <div style={{ 
      width: '100%', 
      maxWidth: isMobile ? '100%' : '1400px',
      margin: '0 auto',
      padding: isMobile ? `0 ${theme.spacing(2)}` : `0 ${theme.spacing(4)}`,
      boxSizing: 'border-box',
    }}>
        {/* Welcome Section */}
        <div 
          style={{ 
            marginBottom: isMobile ? theme.spacing(4) : theme.spacing(6),
            padding: isMobile ? theme.spacing(3) : theme.spacing(5),
            background: `linear-gradient(135deg, ${theme.colors.primary}15 0%, ${theme.colors.primaryLight}08 50%, ${theme.colors.white} 100%)`,
            borderRadius: theme.radius.xl,
            border: `1px solid ${theme.colors.primary}20`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ 
              display: 'flex', 
              alignItems: isMobile ? 'flex-start' : 'center', 
              gap: isMobile ? theme.spacing(1.5) : theme.spacing(2), 
              marginBottom: isMobile ? theme.spacing(1.5) : theme.spacing(2),
              flexWrap: isMobile ? 'wrap' : 'nowrap',
            }}>
              <span style={{ 
                fontSize: isMobile ? '36px' : '48px',
                flexShrink: 0,
                lineHeight: 1,
              }}>👋</span>
              <h1
                style={{
                  fontSize: isMobile ? theme.font.size.xl : theme.font.size['3xl'],
                  fontWeight: theme.font.weight.bold,
                  background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  margin: 0,
                  lineHeight: 1.2,
                  flex: 1,
                  wordBreak: 'break-word',
                }}
                >
                  {isLoadingProfile ? (
                    'Welcome to CookToDoor'
                  ) : customer?.fullName ? (
                    `Welcome, ${customer.fullName}!`
                  ) : username ? (
                    `Welcome, ${username}!`
                  ) : (
                    'Welcome to CookToDoor'
                  )}
                </h1>
            </div>
            <p
              style={{
                fontSize: isMobile ? theme.font.size.base : theme.font.size.lg,
                color: theme.colors.textSecondary,
                fontWeight: theme.font.weight.medium,
                margin: 0,
                paddingLeft: isMobile ? theme.spacing(5.5) : theme.spacing(7),
                lineHeight: 1.5,
              }}
            >
              Discover delicious food from local chefs 🍽️
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ 
          marginBottom: theme.spacing(5),
          position: 'relative',
        }}>
          <div style={{
            position: 'relative',
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
            }}>
              <div style={{
                position: 'absolute',
                left: theme.spacing(3),
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                width: '24px',
                height: '24px',
              }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="rgb(243, 106, 16)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M16 16L20 20"
                    stroke="rgb(243, 106, 16)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <input
                placeholder="Search for food items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                  paddingLeft: '48px', // 24px (icon width) + 12px (icon left) + 12px (spacing)
                  fontSize: theme.font.size.base,
                  fontFamily: theme.font.family,
                  color: theme.colors.text,
                  backgroundColor: theme.colors.white,
                  border: `1px solid rgba(243, 106, 16, 0.3)`,
                  borderRadius: theme.radius.xl,
                  boxShadow: 'none',
                  transition: theme.transitions.base,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(243, 106, 16, 0.5)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(243, 106, 16, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div style={{ marginBottom: theme.spacing(5) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1.5), marginBottom: theme.spacing(3) }}>
              <span style={{ fontSize: '24px' }}>🏷️</span>
              <h2
                style={{
                  fontSize: theme.font.size.xl,
                  fontWeight: theme.font.weight.bold,
                  color: theme.colors.dark,
                  margin: 0,
                }}
              >
                Choose Category
              </h2>
            </div>
            <CategoryFilter
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onCategorySelect={handleCategorySelect}
            />
          </div>
        )}

        {/* Today's Best Food - Horizontal Scroll */}
        {!debouncedSearchQuery && !selectedCategoryId && featuredItems.length > 0 && (
          <div style={{ marginBottom: theme.spacing(6) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2), marginBottom: theme.spacing(3) }}>
              <div style={{
                width: '4px',
                height: '32px',
                background: `linear-gradient(180deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
                borderRadius: theme.radius.full,
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1.5) }}>
                <span style={{ fontSize: '28px' }}>⭐</span>
                <h2
                  style={{
                    fontSize: theme.font.size.xl,
                    fontWeight: theme.font.weight.bold,
                    color: theme.colors.dark,
                    margin: 0,
                  }}
                >
                  Today's Best Food
                </h2>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                gap: theme.spacing(2),
                overflowX: 'auto',
                paddingBottom: theme.spacing(1),
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                width: '100%',
              }}
              className="horizontal-scroll"
            >
              {featuredItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    minWidth: '280px',
                    maxWidth: '280px',
                    flexShrink: 0,
                  }}
                >
                  <MenuItemCard item={item} />
                </div>
              ))}
              <style>{`
                .horizontal-scroll::-webkit-scrollbar {
                  display: none;
                }
                @keyframes shimmer {
                  0% {
                    background-position: -200% 0;
                  }
                  100% {
                    background-position: 200% 0;
                  }
                }
              `}</style>
            </div>
          </div>
        )}

        {/* Menu Items Grid */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2), marginBottom: theme.spacing(4) }}>
            <div style={{
              width: '4px',
              height: '32px',
              background: `linear-gradient(180deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
              borderRadius: theme.radius.full,
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1.5) }}>
              <span style={{ fontSize: '24px' }}>
                {debouncedSearchQuery ? '🔍' : selectedCategoryId ? '📂' : '🍽️'}
              </span>
              <h2
                style={{
                  fontSize: theme.font.size.xl,
                  fontWeight: theme.font.weight.bold,
                  color: theme.colors.dark,
                  margin: 0,
                }}
              >
                {debouncedSearchQuery ? 'Search Results' : selectedCategoryId ? 'Category Items' : 'All Items'}
              </h2>
              {menuItems.length > 0 && (
                <span style={{
                  fontSize: theme.font.size.sm,
                  color: theme.colors.textSecondary,
                  fontWeight: theme.font.weight.medium,
                  backgroundColor: theme.colors.light,
                  padding: `${theme.spacing(0.5)} ${theme.spacing(1.5)}`,
                  borderRadius: theme.radius.full,
                  marginLeft: theme.spacing(1),
                }}>
                  {menuItems.length} {menuItems.length === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
          </div>

          {isLoading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: theme.spacing(3),
                width: '100%',
              }}
            >
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: '350px',
                    background: `linear-gradient(90deg, ${theme.colors.light} 25%, ${theme.colors.white} 50%, ${theme.colors.light} 75%)`,
                    backgroundSize: '200% 100%',
                    borderRadius: theme.radius.lg,
                    animation: 'shimmer 1.5s infinite',
                  }}
                />
              ))}
            </div>
          ) : error ? (
            <div
              style={{
                padding: theme.spacing(6),
                textAlign: 'center',
                backgroundColor: `${theme.colors.error}10`,
                borderRadius: theme.radius.xl,
                border: `1px solid ${theme.colors.error}30`,
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: theme.spacing(2) }}>😕</div>
              <p style={{ fontSize: theme.font.size.lg, color: theme.colors.error, fontWeight: theme.font.weight.semibold, marginBottom: theme.spacing(1) }}>
                Oops! Something went wrong
              </p>
              <p style={{ color: theme.colors.textSecondary }}>{error}</p>
            </div>
          ) : menuItems.length === 0 ? (
            <div
              style={{
                padding: theme.spacing(8),
                textAlign: 'center',
                backgroundColor: theme.colors.light,
                borderRadius: theme.radius.xl,
                border: `2px dashed ${theme.colors.border}`,
              }}
            >
              <div style={{ fontSize: '64px', marginBottom: theme.spacing(3) }}>🔍</div>
              <p style={{ fontSize: theme.font.size.xl, fontWeight: theme.font.weight.bold, color: theme.colors.dark, marginBottom: theme.spacing(1) }}>
                No items found
              </p>
              <p style={{ fontSize: theme.font.size.base, color: theme.colors.textSecondary }}>
                Try searching with different keywords or browse categories
              </p>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: theme.spacing(3),
                  marginBottom: theme.spacing(4),
                  width: '100%',
                }}
              >
                {menuItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: theme.spacing(6) }}>
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    style={{
                      padding: `${theme.spacing(2.5)} ${theme.spacing(6)}`,
                      background: isLoadingMore 
                        ? theme.colors.primary 
                        : `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
                      color: theme.colors.white,
                      border: 'none',
                      borderRadius: theme.radius.full,
                      fontSize: theme.font.size.base,
                      fontWeight: theme.font.weight.bold,
                      cursor: isLoadingMore ? 'not-allowed' : 'pointer',
                      opacity: isLoadingMore ? 0.6 : 1,
                      boxShadow: isLoadingMore ? 'none' : theme.shadow.md,
                      transition: theme.transitions.base,
                      transform: isLoadingMore ? 'none' : 'scale(1)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoadingMore) {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = theme.shadow.lg;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoadingMore) {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = theme.shadow.md;
                      }
                    }}
                  >
                    {isLoadingMore ? '⏳ Loading...' : '📦 Load More Items'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
  );
};

export default CustomerHomePage;
