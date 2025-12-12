import axiosClient from './axiosClient';
import type {
  SignUpRequest,
  SignUpResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '../types/auth.types';

export const authApi = {
  /**
   * Sign up a new user
   */
  signup: async (data: SignUpRequest): Promise<SignUpResponse> => {
    const response = await axiosClient.post<SignUpResponse>('/api/auth/signup', data);
    return response.data;
  },

  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosClient.post<LoginResponse>('/api/auth/login', data);
    return response.data;
  },

  /**
   * Request password reset OTP
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    const response = await axiosClient.post<ForgotPasswordResponse>(
      '/api/auth/forgot-password',
      data
    );
    return response.data;
  },

  /**
   * Resend OTP
   */
  resendOtp: async (data: ResendOtpRequest): Promise<ResendOtpResponse> => {
    const response = await axiosClient.post<ResendOtpResponse>('/api/auth/resend-otp', data);
    return response.data;
  },

  /**
   * Verify OTP
   */
  verifyOtp: async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    const response = await axiosClient.post<VerifyOtpResponse>('/api/auth/verify-otp', data);
    return response.data;
  },

  /**
   * Reset password with OTP
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const response = await axiosClient.post<ResetPasswordResponse>(
      '/api/auth/reset-password',
      data
    );
    return response.data;
  },
};

