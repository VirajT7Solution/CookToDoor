import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ProviderDetailsPage from './pages/provider/ProviderDetailsPage';
import ProviderDashboardPage from './pages/provider/ProviderDashboardPage';
import ProductsListPage from './pages/provider/ProductsListPage';
import AddProductPage from './pages/provider/AddProductPage';
import EditProductPage from './pages/provider/EditProductPage';
import OrdersListPage from './pages/provider/OrdersListPage';
import ProviderProfilePage from './pages/provider/ProviderProfilePage';
import ProviderLayout from './layouts/ProviderLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

// Component to redirect authenticated users away from auth pages
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            <AuthGuard>
              <LoginPage />
            </AuthGuard>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthGuard>
              <SignUpPage />
            </AuthGuard>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthGuard>
              <ForgotPasswordPage />
            </AuthGuard>
          }
        />
        {/* Provider routes */}
        <Route
          path="/provider/details"
          element={
            <ProtectedRoute>
              <ProviderDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/*"
          element={
            <ProtectedRoute>
              <ProviderLayout>
                <Routes>
                  <Route path="dashboard" element={<ProviderDashboardPage />} />
                  <Route path="products" element={<ProductsListPage />} />
                  <Route path="products/add" element={<AddProductPage />} />
                  <Route path="products/edit/:id" element={<EditProductPage />} />
                  <Route path="orders" element={<OrdersListPage />} />
                  <Route path="profile" element={<ProviderProfilePage />} />
                </Routes>
              </ProviderLayout>
            </ProtectedRoute>
          }
        />
        {/* Protected routes - will be implemented later */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>Dashboard (Coming Soon)</div>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
