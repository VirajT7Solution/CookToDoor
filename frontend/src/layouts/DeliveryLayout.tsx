import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useAuthStore } from '../store/authStore';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';
import { deliveryPartnerApi } from '../api/deliveryPartnerApi';

interface DeliveryLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { path: '/delivery/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/delivery/profile', label: 'Profile', icon: '👤' },
];

const DeliveryLayout: React.FC<DeliveryLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { username, logout } = useAuthStore();
  const [fullName, setFullName] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await deliveryPartnerApi.getCurrentProfile();
      setFullName(profile.fullName || '');
    } catch (err) {
      // Ignore errors
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div
      style={{
        height: '100vh', // Use fixed height instead of minHeight
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.colors.light,
        overflow: 'hidden', // Prevent body scroll
        width: '100%', // Ensure full width
      }}
    >
      {/* Top Navigation Bar */}
      <div
        style={{
          backgroundColor: theme.colors.white,
          borderBottom: `1px solid ${theme.colors.border}`,
          padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: theme.shadow.sm,
          flexShrink: 0, // Prevent header from shrinking
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing(3) }}>
          <Link
            to="/delivery/dashboard"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Logo size="sm" />
          </Link>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: theme.font.size.sm,
                fontWeight: theme.font.weight.semibold,
                color: theme.colors.dark,
              }}
            >
              {fullName || username}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: theme.font.size.xs,
                color: theme.colors.textSecondary,
              }}
            >
              Delivery Partner
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>

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
              flexShrink: 0, // Prevent sidebar from shrinking
              overflowY: 'auto', // Allow sidebar to scroll if needed
            }}
          >
            {navItems.map((item) => (
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
                  backgroundColor: isActive(item.path)
                    ? `${theme.colors.primary}10`
                    : 'transparent',
                  color: isActive(item.path) ? theme.colors.primary : theme.colors.text,
                  fontWeight: isActive(item.path)
                    ? theme.font.weight.semibold
                    : theme.font.weight.normal,
                  transition: theme.transitions.base,
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.backgroundColor = theme.colors.background || theme.colors.light;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: theme.font.size.lg }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', // Only vertical scroll
          overflowX: 'hidden', // Prevent horizontal scroll
          minHeight: 0, // Important for flexbox
          width: '100%', // Ensure full width
        }}>
          {children}
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      {isMobile && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.colors.white,
            borderTop: `1px solid ${theme.colors.border}`,
            padding: theme.spacing(2),
            display: 'flex',
            justifyContent: 'space-around',
            boxShadow: theme.shadow.lg,
            zIndex: 100,
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: theme.spacing(0.5),
                padding: theme.spacing(1),
                borderRadius: theme.radius.md,
                color: isActive(item.path) ? theme.colors.primary : theme.colors.textSecondary,
                minWidth: '60px',
              }}
            >
              <span style={{ fontSize: theme.font.size.xl }}>{item.icon}</span>
              <span
                style={{
                  fontSize: theme.font.size.xs,
                  fontWeight: isActive(item.path)
                    ? theme.font.weight.semibold
                    : theme.font.weight.normal,
                }}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Spacer for mobile bottom nav */}
      {isMobile && <div style={{ height: '80px', flexShrink: 0 }} />}
    </div>
  );
};

export default DeliveryLayout;


