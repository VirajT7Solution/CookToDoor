import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCartStore } from '../store/cartStore';
import { useTheme } from '../hooks/useTheme';
import Logo from '../components/ui/Logo';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const cartItemCount = useCartStore((state) => state.getCartItemCount());
  const theme = useTheme();

  const navItems = [
    { path: '/customer/home', label: 'Home', icon: '🏠' },
    { path: '/customer/orders', label: 'Orders', icon: '📦' },
    { path: '/customer/profile', label: 'Profile', icon: '👤' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: theme.colors.light,
        display: 'flex',
        flexDirection: 'column',
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
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
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

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: `${theme.spacing(3)} ${theme.spacing(3)}`,
          paddingBottom: `${theme.spacing(12)}`, // Space for bottom nav
        }}
      >
        {children}
      </main>

      {/* Bottom Navigation */}
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
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
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
    </div>
  );
};

export default CustomerLayout;


