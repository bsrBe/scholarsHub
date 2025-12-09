import api from './api';
import type { AxiosError } from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImageUrl?: string;
  isEmailConfirmed?: boolean;
}

interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  emailError?: string;
}

interface LoginApiResponse {
  success: boolean;
  token: string;
  user: User & { _id?: string };
}

type RegisterApiResponse = RegisterResponse;

interface MeApiResponse {
  success: boolean;
  user: User;
  message?: string;
}

type ErrorResponseData = {
  message?: string;
  msg?: string;
};

const isAxiosError = (error: unknown): error is AxiosError<ErrorResponseData> => {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error;
};

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    return error.response?.data?.message 
      ?? error.response?.data?.msg 
      ?? error.message 
      ?? fallback;
  }
  if (error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
};

export const authService = {
  // Register a new user
  async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<RegisterResponse> {
    try {
      const response = await api.post<any>('/auth/register', {
        ...userData,
        role: userData.role || 'user',
      });
      // Map backend response (msg) to frontend format (message)
      return {
        success: response.data.success,
        message: response.data.msg || response.data.message || 'Registration successful',
        emailError: response.data.emailError,
      };
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, 'Registration failed'));
    }
  },

  // Login user
  async login(email: string, password: string): Promise<LoginResponse> {
    console.log('[authService] Attempting login for:', email);
    try {
      const response = await api.post<LoginApiResponse>('/auth/login', { email, password });
      console.log('[authService] Login response:', response.data);
      
      // Check if we have the expected response structure
      if (!response.data || !response.data.token || !response.data.user) {
        console.error('[authService] Invalid response format:', response.data);
        throw new Error('Authentication failed: Invalid response from server');
      }
      
      const normalizedUser: User = {
        id: response.data.user.id || response.data.user._id || '',
        name: response.data.user.name,
        email: response.data.user.email,
        role: response.data.user.role,
        profileImageUrl: response.data.user.profileImageUrl,
        isEmailConfirmed: response.data.user.isEmailConfirmed,
      };

      if (!normalizedUser.id) {
        throw new Error('Authentication failed: Missing user identifier');
      }

      // Return the complete response data
      return {
        success: response.data.success,
        token: response.data.token,
        user: normalizedUser
      };
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error, 'Login failed');
      const errorMeta = isAxiosError(error)
        ? {
            status: error.response?.status,
            response: error.response?.data,
          }
        : {
            status: undefined,
            response: undefined,
          };
      console.error('[authService] Login error:', {
        email,
        status: errorMeta.status,
        message: errorMessage,
        response: errorMeta.response,
      });
      throw new Error(errorMessage);
    }
  },

  // Get current user
  async getMe(): Promise<User> {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await api.get<MeApiResponse>('/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch user data');
      }
      
      return response.data.user;
    } catch (error: unknown) {
      console.error('Get me error:', error);
      // Clear invalid token if the request fails
      if (isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      throw new Error(extractErrorMessage(error, 'Failed to fetch user data'));
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error: unknown) {
      console.error('Logout error:', extractErrorMessage(error, 'Failed to logout'));
    }
  },

  // Request password reset
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/auth/forgotPassword', { email });
      return response.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, 'Failed to send reset email'));
    }
  },

  // Reset password
  async resetPassword(token: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.put('/auth/resetPassword', { token, password });
      return response.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, 'Failed to reset password'));
    }
  },

  // Confirm email
  async confirmEmail(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.get(`/auth/confirmEmail/${token}`);
      return response.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, 'Failed to confirm email'));
    }
  },

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await api.put('/auth/changePassword', { 
        currentPassword, 
        newPassword 
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: unknown) {
      throw new Error(extractErrorMessage(error, 'Failed to change password'));
    }
  }
};

export default authService;
