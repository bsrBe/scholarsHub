import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '@/services/authService';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  profileImageUrl?: string;
  isEmailConfirmed?: boolean;
  createdAt?: string;
}

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is logged in on initial load
  const checkAuth = useCallback(async () => {
    console.log('checkAuth: Starting authentication check');
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      console.log('checkAuth: Authentication state:', {
        hasToken: !!token,
        hasStoredUser: !!storedUser,
        currentPath: location.pathname
      });
      
      if (!token || !storedUser) {
        console.log('checkAuth: No token or user found in localStorage');
        setUser(null);
        
        // Only redirect if not on a public page
        const publicPaths = ['/auth/login', '/auth/register', '/auth/confirm-email', '/auth/forgot-password', '/auth/reset-password', '/', '/about', '/services', '/how-it-works', '/destinations', '/blog', '/contact', '/faq', '/book-consultation'];
        const isPublicPath = publicPaths.some(path => location.pathname === path || location.pathname.startsWith(path + '/'));
        if (!isPublicPath) {
          console.log('checkAuth: Redirecting to login');
          navigate('/auth/login', { 
            state: { from: location },
            replace: true 
          });
        }
        return;
      }

      try {
        console.log('checkAuth: Verifying token with server...');
        const userData = await authService.getMe();
        console.log('checkAuth: Server response:', userData ? 'User data received' : 'No user data');
        
        if (userData) {
          console.log('checkAuth: User authenticated successfully');
          setUser(userData);
          // Update stored user data in case it was outdated
          localStorage.setItem('user', JSON.stringify(userData));
          
          // If we're on the auth pages, redirect appropriately
          if (location.pathname === '/auth/login' || location.pathname === '/auth/register') {
            const defaultRedirect = userData.role === 'admin' ? '/admin' : '/';
            const from = location.state?.from;
            const requestedPath = from ? `${from.pathname}${from.search}` : null;
            let target = requestedPath || defaultRedirect;

            if (userData.role !== 'admin' && target?.startsWith('/admin')) {
              target = '/';
            }

            console.log('checkAuth: Already logged in, redirecting to:', target);
            navigate(target, { replace: true });
          }
        } else {
          console.log('checkAuth: Invalid user data from server');
          throw new Error('Invalid user data');
        }
      } catch (error) {
        console.error('checkAuth: Error verifying token:', error);
        // Clear invalid session
        console.log('checkAuth: Clearing invalid session data');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        
        // If we're not on a public page, redirect to login
        const publicPaths = ['/auth/login', '/auth/register', '/auth/confirm-email', '/auth/forgot-password', '/auth/reset-password', '/', '/about', '/services', '/how-it-works', '/destinations', '/blog', '/contact', '/faq', '/book-consultation'];
        const isPublicPath = publicPaths.some(path => location.pathname === path || location.pathname.startsWith(path + '/'));
        if (!isPublicPath) {
          console.log('checkAuth: Redirecting to login after token verification failed');
          navigate('/auth/login', { 
            state: { from: location },
            replace: true 
          });
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid session
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [navigate, location]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    console.log('useAuth: Starting login for:', email);
    try {
      setLoading(true);
      setError(null);
      
      // Call the auth service
      const response = await authService.login(email, password);
      console.log('useAuth: Login response received:', {
        hasToken: !!response?.token,
        hasUser: !!response?.user
      });
      
      if (!response.token || !response.user) {
        const errorMsg = 'Invalid response from server: Missing token or user data';
        console.error('useAuth:', errorMsg);
        throw new Error(errorMsg);
      }
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      console.log('useAuth: Stored token and user in localStorage');
      
      // Update state
      setUser(response.user);
      
      const from = location.state?.from;
      const requestedPath = from ? `${from.pathname}${from.search}` : null;
      const defaultRedirect = response.user.role === 'admin' ? '/admin' : '/';
      let target = requestedPath || defaultRedirect;

      if (response.user.role !== 'admin' && target?.startsWith('/admin')) {
        target = '/';
      }

      if (response.user.role === 'admin' && (!requestedPath || !requestedPath.startsWith('/admin'))) {
        target = defaultRedirect;
      }

      console.log('useAuth: Login successful, redirecting to:', target);
      
      // Use setTimeout to ensure state updates before navigation
      setTimeout(() => {
        console.log('useAuth: Executing navigation to', target);
        navigate(target, { replace: true });
      }, 100);
      
      return { success: true };
    } catch (error) {
      console.error('useAuth: Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.register({
        ...userData,
        role: userData.role || 'user',
      });
      
      if (result.success) {
        // Backend always sends confirmation email on registration
        // Return the message from backend
        return { 
          success: true, 
          requiresConfirmation: true,
          message: result.message || 'Please verify your email. Confirmation link sent.'
        };
      }
      
      return { success: false, error: result.message };
    } catch (error) {
      setError(error.message || 'Registration failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/auth/login');
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.changePassword(currentPassword, newPassword);
      
      if (result.success) {
        return { success: true, message: result.message };
      }
      
      return { success: false, error: result.message };
    } catch (error) {
      setError(error.message || 'Failed to change password');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    changePassword,
    setError,
    refreshUser: checkAuth,
  };
};

export default useAuth;
