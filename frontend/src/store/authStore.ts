import { create } from 'zustand';
import type { LoginResponse, UserRole } from '../types/auth.types';
import { STORAGE_KEYS } from '../utils/constants';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  username: string;
  role: UserRole | '';
  userId: number | null;
  isAuthenticated: boolean;
  login: (data: LoginResponse) => void;
  logout: () => void;
  setAuth: (data: Partial<LoginResponse>) => void;
}

// Initialize from localStorage
const getStoredAuth = () => {
  return {
    token: localStorage.getItem(STORAGE_KEYS.TOKEN),
    refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
    username: localStorage.getItem(STORAGE_KEYS.USERNAME) || '',
    role: (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || '',
    userId: localStorage.getItem(STORAGE_KEYS.USER_ID)
      ? Number(localStorage.getItem(STORAGE_KEYS.USER_ID))
      : null,
  };
};

export const useAuthStore = create<AuthState>((set) => {
  const stored = getStoredAuth();

  return {
    ...stored,
    isAuthenticated: !!stored.token,

    login: (data: LoginResponse) => {
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
      localStorage.setItem(STORAGE_KEYS.USERNAME, data.username);
      localStorage.setItem(STORAGE_KEYS.ROLE, data.role);
      localStorage.setItem(STORAGE_KEYS.USER_ID, data.userId.toString());

      set({
        token: data.token,
        refreshToken: data.refreshToken,
        username: data.username,
        role: data.role,
        userId: data.userId,
        isAuthenticated: true,
      });
    },

    logout: () => {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USERNAME);
      localStorage.removeItem(STORAGE_KEYS.ROLE);
      localStorage.removeItem(STORAGE_KEYS.USER_ID);

      set({
        token: null,
        refreshToken: null,
        username: '',
        role: '',
        userId: null,
        isAuthenticated: false,
      });
    },

    setAuth: (data: Partial<LoginResponse>) => {
      if (data.token) localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      if (data.refreshToken)
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
      if (data.username) localStorage.setItem(STORAGE_KEYS.USERNAME, data.username);
      if (data.role) localStorage.setItem(STORAGE_KEYS.ROLE, data.role);
      if (data.userId)
        localStorage.setItem(STORAGE_KEYS.USER_ID, data.userId.toString());

      set((state) => ({
        ...state,
        ...data,
        isAuthenticated: !!data.token || state.isAuthenticated,
      }));
    },
  };
});

