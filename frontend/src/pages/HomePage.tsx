import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/ui/Container';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated, username, logout } = useAuth();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: theme.colors.light,
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
      }}
    >
      <Container maxWidth="lg">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: theme.spacing(4),
          }}
        >
          <Logo size="lg" />

          <h1
            style={{
              fontSize: theme.font.size['3xl'],
              fontWeight: theme.font.weight.bold,
              color: theme.colors.dark,
              maxWidth: '800px',
              lineHeight: 1.2,
            }}
          >
            Fresh. Trust. Convenience — Delivered to Your Door.
          </h1>

          <p
            style={{
              fontSize: theme.font.size.lg,
              color: theme.colors.textSecondary,
              maxWidth: '600px',
              lineHeight: 1.6,
            }}
          >
            Experience the best of home-cooked meals delivered fresh to your doorstep.
            Order from trusted local chefs and enjoy authentic flavors.
          </p>

          {isAuthenticated ? (
            <Card padding shadow="md" style={{ marginTop: theme.spacing(4) }}>
              <p style={{ marginBottom: theme.spacing(2) }}>
                Welcome back, <strong>{username}</strong>!
              </p>
              <Button variant="primary" onClick={logout}>
                Logout
              </Button>
            </Card>
          ) : (
            <div
              style={{
                display: 'flex',
                gap: theme.spacing(3),
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginTop: theme.spacing(2),
              }}
            >
              <Button size="lg" variant="primary" onClick={() => navigate('/login')}>
                Log In
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default HomePage;

