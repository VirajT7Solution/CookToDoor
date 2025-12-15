export const API_BASE_URL = 'http://localhost:5454';

export const STORAGE_KEYS = {
  TOKEN: 'cooktodor_token',
  REFRESH_TOKEN: 'cooktodor_refreshToken',
  USERNAME: 'cooktodor_username',
  ROLE: 'cooktodor_role',
  USER_ID: 'cooktodor_userId',
} as const;

export const ROLES = {
  CUSTOMER: 'ROLE_CUSTOMER',
  PROVIDER: 'ROLE_PROVIDER',
  DELIVERY_PARTNER: 'ROLE_DELIVERY_PARTNER',
  ADMIN: 'ROLE_ADMIN',
} as const;

export const ROLE_DISPLAY_NAMES = {
  [ROLES.CUSTOMER]: 'Customer',
  [ROLES.PROVIDER]: 'Provider',
  [ROLES.DELIVERY_PARTNER]: 'Delivery Partner',
  [ROLES.ADMIN]: 'Admin',
} as const;

export const ROLE_OPTIONS = [
  { value: ROLES.CUSTOMER, label: 'Customer' },
  { value: ROLES.PROVIDER, label: 'Provider' },
  { value: ROLES.DELIVERY_PARTNER, label: 'Delivery Partner' },
] as const;

