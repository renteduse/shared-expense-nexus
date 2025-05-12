
import { toast } from "@/components/ui/sonner";

// Mock API response delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Mock auth state
let currentUser: User | null = null;

export const getCurrentUser = (): User | null => {
  const savedUser = localStorage.getItem('budgetsplit_user');
  if (savedUser && !currentUser) {
    currentUser = JSON.parse(savedUser);
  }
  return currentUser;
};

export const login = async (email: string, password: string): Promise<User> => {
  // Simulate network request
  await delay(1000);

  // Validation
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // Simulate login
  if (email === 'demo@example.com' && password === 'password') {
    const user = {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      avatar: ''
    };
    
    // Store user in localStorage
    localStorage.setItem('budgetsplit_user', JSON.stringify(user));
    currentUser = user;
    
    toast.success("Welcome back!");
    return user;
  }

  // For demo purposes, allow any email/password with basic validation
  if (email.includes('@') && password.length >= 6) {
    const name = email.split('@')[0];
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: email,
      avatar: ''
    };
    
    // Store user in localStorage
    localStorage.setItem('budgetsplit_user', JSON.stringify(user));
    currentUser = user;
    
    toast.success("Account created successfully!");
    return user;
  }

  throw new Error('Invalid email or password');
};

export const signup = async (name: string, email: string, password: string): Promise<User> => {
  // Simulate network request
  await delay(1000);

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

  // For demo, always succeed with new account
  const user = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    email,
    avatar: ''
  };
  
  // Store user in localStorage
  localStorage.setItem('budgetsplit_user', JSON.stringify(user));
  currentUser = user;
  
  toast.success("Account created successfully!");
  return user;
};

export const logout = async (): Promise<void> => {
  // Clear user from localStorage
  localStorage.removeItem('budgetsplit_user');
  currentUser = null;
  toast.success("You've been logged out");
};

export const isAuthenticated = (): boolean => {
  return !!getCurrentUser();
};
