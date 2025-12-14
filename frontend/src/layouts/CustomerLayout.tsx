import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCartStore } from '../store/cartStore';
import { useTheme } from '../hooks/useTheme';
import Logo from '../components/ui/Logo';
import { customerApi } from '../api/customerApi';
import { userApi } from '../api/userApi';
import type { Customer, UserProfile } from '../types/customer.types';
import axiosClient from '../api/axiosClient';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, userId, username } = useAuth();
  const cartItemCount = useCartStore((state) => state.getCartItemCount());
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
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
    const loadProfile = async () => {
      if (!userId) return;
      try {
        setIsLoadingProfile(true);
        const [userData, customerData] = await Promise.all([
          userApi.getUser(userId).catch(() => null),
          customerApi.getCustomerByUserId(userId).catch(() => null),
        ]);
        setUser(userData);
        setCustomer(customerData);

        // Load profile image if available
        if (userData?.profileImageId) {
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
      } finally {
        setIsLoadingProfile(false);
      }
    };
    loadProfile();
  }, [userId]);

  const navItems = [
    { path: '/customer/home', label: 'Home', icon: '🏠' },
    { path: '/customer/orders', label: 'Orders', icon: '📦' },
    { path: '/customer/profile', label: 'Profile', icon: '👤' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      style={{
        height: '100vh',
        backgroundColor: theme.colors.light,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: theme.colors.white,
          boxShadow: theme.shadow.sm,
          position: 'sticky',
          top: 0,
          zIndex: 100,
          flexShrink: 0,
          width: '100%',
        }}
      >
        <div
          style={{
            width: '100%',
            margin: '0 auto',
            padding: `${theme.spacing(2)} ${isMobile ? theme.spacing(3) : theme.spacing(4)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
          }}
        >
          <Link to="/customer/home" style={{ textDecoration: 'none' }}>
            <Logo size="md" />
          </Link>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing(3),
            }}
          >
            {/* User Profile */}
            <Link
              to="/customer/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing(1.5),
                padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
                textDecoration: 'none',
                color: theme.colors.text,
                borderRadius: theme.radius.full,
                transition: theme.transitions.base,
                border: `1px solid transparent`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.light;
                e.currentTarget.style.borderColor = theme.colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: theme.radius.full,
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: theme.radius.full,
                    backgroundColor: theme.colors.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.colors.white,
                    fontSize: theme.font.size.sm,
                    fontWeight: theme.font.weight.bold,
                  }}
                >
                  {isLoadingProfile ? (
                    '⏳'
                  ) : customer?.fullName ? (
                    customer.fullName.charAt(0).toUpperCase()
                  ) : username ? (
                    username.charAt(0).toUpperCase()
                  ) : (
                    '👤'
                  )}
                </div>
              )}
              {!isMobile && (
                <span
                  style={{
                    fontSize: theme.font.size.sm,
                    fontWeight: theme.font.weight.medium,
                    color: theme.colors.text,
                  }}
                >
                  {isLoadingProfile
                    ? 'Loading...'
                    : customer?.fullName || username || 'User'}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/customer/cart"
              style={{
                position: 'relative',
                padding: theme.spacing(1),
                textDecoration: 'none',
                color: theme.colors.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: theme.radius.full,
                transition: theme.transitions.base,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.light;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span style={{ fontSize: '24px' }}>🛒</span>
              {cartItemCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: theme.colors.error,
                    color: theme.colors.white,
                    fontSize: theme.font.size.xs,
                    fontWeight: theme.font.weight.bold,
                    borderRadius: theme.radius.full,
                    minWidth: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: `0 ${theme.spacing(0.5)}`,
                  }}
                >
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
                color: theme.colors.text,
                backgroundColor: 'transparent',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radius.md,
                fontSize: theme.font.size.sm,
                fontWeight: theme.font.weight.medium,
                cursor: 'pointer',
                transition: theme.transitions.base,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.light;
                e.currentTarget.style.borderColor = theme.colors.primary;
                e.currentTarget.style.color = theme.colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = theme.colors.border;
                e.currentTarget.style.color = theme.colors.text;
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area with Sidebar */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Sidebar Navigation (Desktop) */}
        {!isMobile && (
          <div
            style={{
              width: '250px',
              backgroundColor: theme.colors.white,
              borderRight: `1px solid ${theme.colors.border}`,
              padding: theme.spacing(4),
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing(1),
              flexShrink: 0,
              overflowY: 'auto',
            }}
          >
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    textDecoration: 'none',
                    padding: theme.spacing(2),
                    borderRadius: theme.radius.md,
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing(2),
                    backgroundColor: active
                      ? `${theme.colors.primary}10`
                      : 'transparent',
                    color: active ? theme.colors.primary : theme.colors.text,
                    fontWeight: active
                      ? theme.font.weight.semibold
                      : theme.font.weight.normal,
                    transition: theme.transitions.base,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = theme.colors.light;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span style={{ fontSize: theme.font.size.lg }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            width: '100%',
            margin: '0 auto',
            padding: `${theme.spacing(4)} ${isMobile ? theme.spacing(3) : theme.spacing(6)}`,
            paddingBottom: isMobile ? `${theme.spacing(12)}` : theme.spacing(4),
            overflowY: 'auto',
            overflowX: 'hidden',
            minHeight: 0,
            boxSizing: 'border-box',
            backgroundColor: theme.colors.light,
          }}
        >
          {children}
        </main>
      </div>

      {/* Bottom Navigation - Only on Mobile */}
      {isMobile && (
        <nav
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.colors.white,
            borderTop: `1px solid ${theme.colors.border}`,
            boxShadow: `0 -2px 8px rgba(0, 0, 0, 0.08)`,
            zIndex: 100,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              maxWidth: '100%',
              margin: '0 auto',
              padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: `${theme.spacing(1.5)} ${theme.spacing(2)}`,
                      textDecoration: 'none',
                      color: active ? theme.colors.primary : theme.colors.textSecondary,
                      transition: theme.transitions.base,
                      borderRadius: theme.radius.md,
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = theme.colors.light;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <span style={{ fontSize: '24px', marginBottom: theme.spacing(0.5) }}>
                      {item.icon}
                    </span>
                    <span
                      style={{
                        fontSize: theme.font.size.xs,
                        fontWeight: active
                          ? theme.font.weight.semibold
                          : theme.font.weight.normal,
                      }}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};

export default CustomerLayout;

