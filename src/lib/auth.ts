
import { toast } from "@/components/ui/sonner";
import apiClient from "./apiClient";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Get current user from localStorage or fetch from API
export const getCurrentUser = async (): Promise<User | null> => {
  // Check localStorage first
  const savedUser = localStorage.getItem('budgetsplit_user');
  if (savedUser) {
    return JSON.parse(savedUser);
  }
  
  // If we have a token but no user data, fetch from API
  const token = localStorage.getItem('auth_token');
  if (token) {
    try {
      const response = await apiClient.get('/auth');
      const user = {
        id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.avatar
      };
      
      // Store in localStorage
      localStorage.setItem('budgetsplit_user', JSON.stringify(user));
      return user;
    } catch (error) {
      // If API call fails, clear token and return null
      localStorage.removeItem('auth_token');
      return null;
    }
  }
  
  return null;
};

export const login = async (email: string, password: string): Promise<User> => {
  try {
    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Call API
    const response = await apiClient.post('/auth/login', { email, password });
    const token = response.data.token;
    
    // Store token
    localStorage.setItem('auth_token', token);
    
    // Get user data
    const userResponse = await apiClient.get('/auth');
    const user = {
      id: userResponse.data._id,
      name: userResponse.data.name,
      email: userResponse.data.email,
      avatar: userResponse.data.avatar
    };
    
    // Store user in localStorage
    localStorage.setItem('budgetsplit_user', JSON.stringify(user));
    
    toast.success("Welcome back!");
    return user;
  } catch (error: any) {
    // Let the interceptor handle the error toast
    throw new Error(error.response?.data?.msg || 'Login failed');
  }
};

export const signup = async (name: string, email: string, password: string): Promise<User> => {
  try {
    // Validation
    if (!name || !email || !password) {
      throw new Error('All fields are required');
    }
    
    if (!email.includes('@')) {
      throw new Error('Invalid email address');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    // Call API
    const response = await apiClient.post('/auth/register', {
      name,
      email,
      password
    });
    
    const token = response.data.token;
    
    // Store token
    localStorage.setItem('auth_token', token);
    
    // Get user data
    const userResponse = await apiClient.get('/auth');
    const user = {
      id: userResponse.data._id,
      name: userResponse.data.name,
      email: userResponse.data.email,
      avatar: userResponse.data.avatar
    };
    
    // Store user in localStorage
    localStorage.setItem('budgetsplit_user', JSON.stringify(user));
    
    toast.success("Account created successfully!");
    return user;
  } catch (error: any) {
    // Let the interceptor handle the error toast
    throw new Error(error.response?.data?.msg || 'Registration failed');
  }
};

export const logout = async (): Promise<void> => {
  // Clear user from localStorage
  localStorage.removeItem('budgetsplit_user');
  localStorage.removeItem('auth_token');
  toast.success("You've been logged out");
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token');
};
