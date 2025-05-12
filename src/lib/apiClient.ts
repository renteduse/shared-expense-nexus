
import axios from 'axios';
import { toast } from '@/components/ui/sonner';

// API base URL - adjust if needed
const API_URL = 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle different error scenarios
    if (response) {
      switch (response.status) {
        case 401:
          toast.error('Your session has expired. Please login again.');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('budgetsplit_user');
          // Redirect to login page if unauthorized
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          toast.error('You do not have permission to perform this action.');
          break;
        case 404:
          // Don't show toast for not found errors
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          // Handle other error status codes
          if (response.data && response.data.msg) {
            toast.error(response.data.msg);
          } else {
            toast.error('An error occurred. Please try again.');
          }
      }
    } else {
      // Network error
      toast.error('Cannot connect to server. Please check your internet connection.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
