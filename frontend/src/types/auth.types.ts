export type UserRole = 'Customer' | 'Provider' | 'Delivery Partner' | 'Admin';

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  phone?: string;
  role: 'ROLE_CUSTOMER' | 'ROLE_PROVIDER' | 'ROLE_DELIVERY_PARTNER' | 'ROLE_ADMIN';
}

export interface SignUpResponse {
  message: string;
  userId: number;
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  username: string;
  role: UserRole;
  userId: number;
}

export interface ForgotPasswordRequest {
  username?: string;
  email?: string;
}

export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

export interface ResendOtpRequest {
  username?: string;
  email?: string;
}

export interface ResendOtpResponse {
  message: string;
  success: boolean;
}

export interface VerifyOtpRequest {
  username?: string;
  email?: string;
  otp: string;
}

export interface VerifyOtpResponse {
  valid: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  username?: string;
  email?: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  username: string;
  role: UserRole | '';
  userId: number | null;
  isAuthenticated: boolean;
}

