
import { toast } from "@/components/ui/sonner";
import { getCurrentUserSync } from "./auth";
import apiClient from "./apiClient";

// Types
export interface Group {
  id: string;
  name: string;
  inviteCode: string;
  members: Member[];
  expenses: Expense[];
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  paidBy: string; // userId
  participants: {
    userId: string;
    share: number;
  }[];
  date: string;
  groupId: string;
  createdAt: string;
}

export interface Balance {
  userId: string;
  name: string;
  amount: number;
}

export interface Settlement {
  from: {
    id: string;
    name: string;
  };
  to: {
    id: string;
    name: string;
  };
  amount: number;
}

// Real API functions that connect to the backend
export const createGroup = async (name: string): Promise<Group> => {
  const currentUser = getCurrentUserSync();
  if (!currentUser) {
    throw new Error('You must be logged in to create a group');
  }
  
  try {
    const response = await apiClient.post('/groups', { name });
    return {
      id: response.data._id,
      name: response.data.name,
      inviteCode: response.data.inviteCode,
      members: response.data.members.map((member: any) => ({
        id: member.user,
        name: member.name,
        email: member.email,
        avatar: member.avatar
      })),
      expenses: [],
      createdAt: response.data.createdAt
    };
  } catch (error) {
    console.error('Failed to create group:', error);
    throw error;
  }
};

export const getGroups = async (): Promise<Group[]> => {
  const currentUser = getCurrentUserSync();
  if (!currentUser) {
    return [];
  }
  
  try {
    const response = await apiClient.get('/groups');
    
    return response.data.map((group: any) => ({
      id: group._id,
      name: group.name,
      inviteCode: group.inviteCode,
      members: group.members.map((member: any) => ({
        id: member.user,
        name: member.name,
        email: member.email,
        avatar: member.avatar
      })),
      expenses: [],
      createdAt: group.createdAt
    }));
  } catch (error) {
    console.error('Failed to fetch groups:', error);
    throw error;
  }
};

export const getGroup = async (id: string): Promise<Group> => {
  const currentUser = getCurrentUserSync();
  if (!currentUser) {
    throw new Error('You must be logged in to view groups');
  }
  
  try {
    const response = await apiClient.get(`/groups/${id}`);
    const group = response.data;
    
    return {
      id: group._id,
      name: group.name,
      inviteCode: group.inviteCode,
      members: group.members.map((member: any) => ({
        id: member.user,
        name: member.name,
        email: member.email,
        avatar: member.avatar
      })),
      expenses: [],
      createdAt: group.createdAt
    };
  } catch (error) {
    console.error('Failed to fetch group:', error);
    throw error;
  }
};

export const joinGroup = async (inviteCode: string): Promise<Group> => {
  const currentUser = getCurrentUserSync();
  if (!currentUser) {
    throw new Error('You must be logged in to join a group');
  }
  
  try {
    const response = await apiClient.post('/groups/join', { inviteCode });
    const group = response.data;
    
    return {
      id: group._id,
      name: group.name,
      inviteCode: group.inviteCode,
      members: group.members.map((member: any) => ({
        id: member.user,
        name: member.name,
        email: member.email,
        avatar: member.avatar
      })),
      expenses: [],
      createdAt: group.createdAt
    };
  } catch (error) {
    console.error('Failed to join group:', error);
    throw error;
  }
};

// Expense API functions
export const addExpense = async (
  groupId: string, 
  description: string,
  amount: number,
  currency: string,
  paidById: string,
  participants: { userId: string; share: number }[],
  date: string
): Promise<Expense> => {
  const currentUser = getCurrentUserSync();
  if (!currentUser) {
    throw new Error('You must be logged in to add expenses');
  }
  
  try {
    const response = await apiClient.post('/expenses', {
      group: groupId,
      description,
      amount,
      currency,
      paidBy: paidById,
      participants: participants.map(p => ({
        user: p.userId,
        share: p.share
      })),
      date
    });
    
    const expense = response.data;
    
    return {
      id: expense._id,
      description: expense.description,
      amount: expense.amount,
      currency: expense.currency,
      paidBy: expense.paidBy,
      participants: expense.participants.map((p: any) => ({
        userId: p.user,
        share: p.share
      })),
      date: expense.date,
      groupId: expense.group,
      createdAt: expense.createdAt
    };
  } catch (error) {
    console.error('Failed to add expense:', error);
    throw error;
  }
};

export const getExpenses = async (groupId: string): Promise<Expense[]> => {
  const currentUser = getCurrentUserSync();
  if (!currentUser) {
    throw new Error('You must be logged in to view expenses');
  }
  
  try {
    const response = await apiClient.get(`/expenses/group/${groupId}`);
    
    return response.data.map((expense: any) => ({
      id: expense._id,
      description: expense.description,
      amount: expense.amount,
      currency: expense.currency,
      paidBy: expense.paidBy,
      participants: expense.participants.map((p: any) => ({
        userId: p.user,
        share: p.share
      })),
      date: expense.date,
      groupId: expense.group,
      createdAt: expense.createdAt
    }));
  } catch (error) {
    console.error('Failed to fetch expenses:', error);
    throw error;
  }
};

export const calculateBalances = async (groupId: string): Promise<Balance[]> => {
  const currentUser = getCurrentUserSync();
  if (!currentUser) {
    throw new Error('You must be logged in to view balances');
  }
  
  try {
    const response = await apiClient.get(`/groups/${groupId}/balances`);
    return response.data.balances;
  } catch (error) {
    console.error('Failed to fetch balances:', error);
    throw error;
  }
};

export const calculateSettlements = async (groupId: string): Promise<Settlement[]> => {
  const currentUser = getCurrentUserSync();
  if (!currentUser) {
    throw new Error('You must be logged in to view settlements');
  }
  
  try {
    const response = await apiClient.get(`/groups/${groupId}/settlements`);
    return response.data.settlements;
  } catch (error) {
    console.error('Failed to fetch settlements:', error);
    throw error;
  }
};

export const exportGroupData = async (groupId: string): Promise<string> => {
  const currentUser = getCurrentUserSync();
  if (!currentUser) {
    throw new Error('You must be logged in to export data');
  }
  
  try {
    const response = await apiClient.get(`/groups/${groupId}/export`, {
      responseType: 'text'
    });
    return response.data;
  } catch (error) {
    console.error('Failed to export data:', error);
    throw error;
  }
};

// Create Exchange Rates API
export const getExchangeRates = async (): Promise<Record<string, number>> => {
  try {
    const response = await apiClient.get('/currencies/rates');
    return response.data.rates;
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    throw error;
  }
};

export const convertCurrency = (amount: number, from: string, to: string, rates: Record<string, number>): number => {
  if (from === to) return amount;
  const inUSD = amount / rates[from];
  return inUSD * rates[to];
};
