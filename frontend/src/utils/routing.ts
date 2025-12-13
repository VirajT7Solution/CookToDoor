import { ROLES } from './constants';
import type { UserRole } from '../types/auth.types';

/**
 * Get the default route for a user role after login
 */
export const getDefaultRoute = (role: UserRole): string => {
  switch (role) {
    case 'Provider':
      return '/provider/dashboard';
    case 'Customer':
      return '/customer/home';
    case 'Delivery Partner':
      return '/delivery/dashboard';
    case 'Admin':
      return '/admin/dashboard';
    default:
      return '/';
  }
};

/**
 * Check if user role matches the provided role string
 */
export const isRole = (userRole: UserRole | '', role: string): boolean => {
  const roleMap: Record<UserRole, string> = {
    Customer: ROLES.CUSTOMER,
    Provider: ROLES.PROVIDER,
    'Delivery Partner': ROLES.DELIVERY_PARTNER,
    Admin: ROLES.ADMIN,
  };
  return roleMap[userRole as UserRole] === role;
};
