import axios, { AxiosError, AxiosHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies (server supports header token too)
  timeout: 10000, // 10 seconds timeout
});

// Add a request interceptor to include auth token if available
type AnyPlainObject = Record<string, unknown>;
type MeetingQueryParams = Record<string, string | number | boolean | undefined>;

const ensureHeaders = (config: InternalAxiosRequestConfig) => {
  if (!config.headers) {
    config.headers = new AxiosHeaders();
  } else if (!(config.headers instanceof AxiosHeaders)) {
    config.headers = AxiosHeaders.from(config.headers);
  }
  return config.headers;
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = ensureHeaders(config);
      headers.set('Authorization', `Bearer ${token}`);
      console.log('[API] Request with token:', config.url);
    } else {
      console.log('[API] Request without token:', config.url);
    }
    
    if (config.data instanceof FormData) {
      const headers = ensureHeaders(config);
      headers.delete('Content-Type');
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`[API] Response ${response.status} from ${response.config.url}`, response.data);
    return response;
  },
  (error: AxiosError) => {
    // Only log API errors (when error.response exists), not network errors
    if (error.response) {
      console.error('[API] Response error:', {
        url: error.config?.url,
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });

      if (error.response.status === 401) {
        console.log('[API] Unauthorized, clearing auth data');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Don't redirect here to avoid loops, let the ProtectedRoute handle it
      }
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      // Log timeout errors separately
      console.warn('[API] Request timeout:', {
        url: error.config?.url,
        message: error.message,
      });
    } else {
      // Log other network errors (connection issues, etc.)
      console.warn('[API] Network error:', {
        url: error.config?.url,
        message: error.message,
        code: error.code,
      });
    }
    
    // Return a rejected promise with the error
    return Promise.reject(error);
  }
);

// Meeting related API calls
export const meetingApi = {
  // Get meetings with optional filters and pagination
  getMeetings: (params?: MeetingQueryParams) => api.get('/meetings', { params }),
  
  // Create a new meeting
  createMeeting: (meetingData: AnyPlainObject) => api.post('/meetings', meetingData),
  
  // Get a single meeting by ID
  getMeetingById: (id: string) => api.get(`/meetings/${id}`),
  
  // Join a meeting
  joinMeeting: (id: string, displayName = '') => {
    return api.get(`/meetings/${id}/join`, { params: { embedded: false, displayName } });
  },
  // Update a meeting
  updateMeeting: (id: string, updates: AnyPlainObject) => api.put(`/meetings/${id}`, updates),
  // Delete meeting (admin only)
  deleteMeeting: (id: string) => api.delete(`/meetings/${id}`),
};

// Auth related API calls
export const authApi = {
  login: (credentials: { email: string; password: string }) => api.post('/auth/login', credentials),
  register: (userData: { name: string; email: string; password: string; role?: string }) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
};

export default api;
