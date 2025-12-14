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
import CustomerLayout from './layouts/CustomerLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import { getDefaultRoute } from './utils/routing';
import CustomerHomePage from './pages/customer/CustomerHomePage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrdersPage from './pages/customer/OrdersPage';
import OrderDetailPage from './pages/customer/OrderDetailPage';
import CustomerProfilePage from './pages/customer/CustomerProfilePage';
import DeliveryLayout from './layouts/DeliveryLayout';
import DeliveryDashboardPage from './pages/delivery/DeliveryDashboardPage';
import DeliveryProfilePage from './pages/delivery/DeliveryProfilePage';

// Component to redirect authenticated users away from auth pages
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, role } = useAuth();
  
  if (isAuthenticated && role) {
    return <Navigate to={getDefaultRoute(role)} replace />;
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
        {/* Customer routes */}
        <Route
          path="/customer/*"
          element={
            <ProtectedRoute requiredRole="Customer">
              <CustomerLayout>
                <Routes>
                  <Route path="home" element={<CustomerHomePage />} />
                  <Route path="products/:id" element={<ProductDetailPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="orders/:id" element={<OrderDetailPage />} />
                  <Route path="profile" element={<CustomerProfilePage />} />
                  <Route path="*" element={<Navigate to="/customer/home" replace />} />
                </Routes>
              </CustomerLayout>
            </ProtectedRoute>
          }
        />
        {/* Delivery Partner routes */}
        <Route
          path="/delivery/*"
          element={
            <ProtectedRoute requiredRole="Delivery Partner">
              <DeliveryLayout>
                <Routes>
                  <Route path="dashboard" element={<DeliveryDashboardPage />} />
                  <Route path="profile" element={<DeliveryProfilePage />} />
                  <Route path="*" element={<Navigate to="/delivery/dashboard" replace />} />
                </Routes>
              </DeliveryLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
