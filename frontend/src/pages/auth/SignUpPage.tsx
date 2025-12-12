import React, { useState, useEffect } from 'react';
import Container from '../../components/ui/Container';
import Logo from '../../components/ui/Logo';
import SignUpForm from '../../components/auth/SignUpForm';
import { useTheme } from '../../hooks/useTheme';

const SignUpPage: React.FC = () => {
  const theme = useTheme();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.colors.light} 0%, ${theme.colors.white} 50%, ${theme.colors.light} 100%)`,
        padding: theme.spacing(4),
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background elements */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.colors.primaryLight}15 0%, ${theme.colors.primary}10 100%)`,
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.colors.primary}10 0%, ${theme.colors.primaryLight}15 100%)`,
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />

      <Container maxWidth="xl" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
            gap: isDesktop ? theme.spacing(8) : theme.spacing(4),
            alignItems: 'center',
            maxWidth: isDesktop ? '1200px' : '100%',
            margin: '0 auto',
          }}
        >
          {/* Left side - Branding/Info (desktop only) */}
          {isDesktop && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: theme.spacing(4),
              }}
            >
              <Logo size="lg" />
              <h1
                style={{
                  fontSize: theme.font.size['3xl'],
                  fontWeight: theme.font.weight.bold,
                  color: theme.colors.dark,
                  marginTop: theme.spacing(4),
                  marginBottom: theme.spacing(2),
                  lineHeight: 1.2,
                }}
              >
                Join CookToDoor Today
              </h1>
              <p
                style={{
                  fontSize: theme.font.size.lg,
                  color: theme.colors.textSecondary,
                  lineHeight: 1.6,
                  marginBottom: theme.spacing(4),
                }}
              >
                Experience the best of home-cooked meals delivered fresh to your doorstep. Order from trusted local chefs and enjoy authentic flavors.
              </p>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: theme.spacing(3),
                }}
              >
                {[
                  { icon: '🍽️', text: 'Fresh meals from local chefs' },
                  { icon: '🚀', text: 'Fast and reliable delivery' },
                  { icon: '⭐', text: 'Trusted by thousands' },
                ].map((feature, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing(2),
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{feature.icon}</span>
                    <span
                      style={{
                        fontSize: theme.font.size.base,
                        color: theme.colors.text,
                      }}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Right side - Form */}
          <div>
            {/* Mobile/Tablet Header */}
            {!isDesktop && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: theme.spacing(4),
                }}
              >
                <Logo size="lg" />
                <p
                  style={{
                    fontSize: theme.font.size.base,
                    color: theme.colors.textSecondary,
                    textAlign: 'center',
                    marginTop: theme.spacing(1),
                  }}
                >
                  Join us and start your food journey
                </p>
              </div>
            )}
            <SignUpForm />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SignUpPage;

