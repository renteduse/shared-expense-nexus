
import { toast } from "@/components/ui/sonner";
import { getCurrentUser } from "./auth";

// Mock API response delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Interfaces
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

// Mock data storage
let groups: Group[] = [];

// Mock local storage persistence
const loadFromStorage = () => {
  const savedGroups = localStorage.getItem('budgetsplit_groups');
  if (savedGroups) {
    groups = JSON.parse(savedGroups);
  }
};

const saveToStorage = () => {
  localStorage.setItem('budgetsplit_groups', JSON.stringify(groups));
};

// Initialize from storage
loadFromStorage();

// Exchange rates (mock data)
const exchangeRates: Record<string, number> = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.75,
  JPY: 110.42,
  INR: 74.53,
  CAD: 1.25,
  AUD: 1.35,
  CNY: 6.45,
};

export const getExchangeRates = async (): Promise<Record<string, number>> => {
  await delay(500);
  return exchangeRates;
};

export const convertCurrency = (amount: number, from: string, to: string): number => {
  if (from === to) return amount;
  const inUSD = amount / exchangeRates[from];
  return inUSD * exchangeRates[to];
};

// Group API functions
export const createGroup = async (name: string): Promise<Group> => {
  await delay(1000);
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('You must be logged in to create a group');
  }

  // Generate unique invite code
  const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const newGroup: Group = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    inviteCode,
    members: [
      {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        avatar: currentUser.avatar
      }
    ],
    expenses: [],
    createdAt: new Date().toISOString(),
  };
  
  groups.push(newGroup);
  saveToStorage();
  
  toast.success(`Group "${name}" created successfully!`);
  return newGroup;
};

export const getGroups = async (): Promise<Group[]> => {
  await delay(500);
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return [];
  }
  
  // Filter groups the current user is a member of
  return groups.filter(group => 
    group.members.some(member => member.id === currentUser.id)
  );
};

export const getGroup = async (id: string): Promise<Group> => {
  await delay(500);
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('You must be logged in to view groups');
  }
  
  const group = groups.find(g => g.id === id);
  
  if (!group) {
    throw new Error('Group not found');
  }
  
  // Check if user is a member of this group
  if (!group.members.some(member => member.id === currentUser.id)) {
    throw new Error('You are not a member of this group');
  }
  
  return group;
};

export const joinGroup = async (inviteCode: string): Promise<Group> => {
  await delay(1000);
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('You must be logged in to join a group');
  }
  
  // Find group with matching invite code
  const groupIndex = groups.findIndex(g => g.inviteCode === inviteCode);
  
  if (groupIndex === -1) {
    throw new Error('Invalid invite code');
  }
  
  // Check if user is already a member
  if (groups[groupIndex].members.some(member => member.id === currentUser.id)) {
    throw new Error('You are already a member of this group');
  }
  
  // Add user to group members
  groups[groupIndex].members.push({
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    avatar: currentUser.avatar
  });
  
  saveToStorage();
  
  toast.success(`You've joined ${groups[groupIndex].name}!`);
  return groups[groupIndex];
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
  await delay(1000);
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('You must be logged in to add expenses');
  }
  
  // Find the group
  const groupIndex = groups.findIndex(g => g.id === groupId);
  
  if (groupIndex === -1) {
    throw new Error('Group not found');
  }
  
  // Check if user is a member of this group
  if (!groups[groupIndex].members.some(member => member.id === currentUser.id)) {
    throw new Error('You are not a member of this group');
  }
  
  // Validate participants are all group members
  for (const participant of participants) {
    if (!groups[groupIndex].members.some(member => member.id === participant.userId)) {
      throw new Error('All participants must be group members');
    }
  }
  
  // Create the expense
  const newExpense: Expense = {
    id: Math.random().toString(36).substr(2, 9),
    description,
    amount,
    currency,
    paidBy: paidById,
    participants,
    date: date || new Date().toISOString(),
    groupId,
    createdAt: new Date().toISOString(),
  };
  
  // Add to group expenses
  groups[groupIndex].expenses.push(newExpense);
  saveToStorage();
  
  toast.success('Expense added successfully!');
  return newExpense;
};

export const getExpenses = async (groupId: string): Promise<Expense[]> => {
  await delay(500);
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('You must be logged in to view expenses');
  }
  
  // Find the group
  const group = groups.find(g => g.id === groupId);
  
  if (!group) {
    throw new Error('Group not found');
  }
  
  // Check if user is a member of this group
  if (!group.members.some(member => member.id === currentUser.id)) {
    throw new Error('You are not a member of this group');
  }
  
  // Sort expenses by date (newest first)
  return [...group.expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const calculateBalances = async (groupId: string): Promise<Balance[]> => {
  await delay(500);
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('You must be logged in to view balances');
  }
  
  // Find the group
  const group = groups.find(g => g.id === groupId);
  
  if (!group) {
    throw new Error('Group not found');
  }
  
  // Check if user is a member of this group
  if (!group.members.some(member => member.id === currentUser.id)) {
    throw new Error('You are not a member of this group');
  }
  
  // Initialize balances for all members
  const balances: Record<string, number> = {};
  group.members.forEach(member => {
    balances[member.id] = 0;
  });
  
  // Calculate balances from expenses
  for (const expense of group.expenses) {
    // Add money to payer
    balances[expense.paidBy] += expense.amount;
    
    // Subtract shares from participants
    for (const participant of expense.participants) {
      balances[participant.userId] -= participant.share;
    }
  }
  
  // Convert to array format with member names
  const balanceArray: Balance[] = Object.keys(balances).map(userId => {
    const member = group.members.find(m => m.id === userId);
    return {
      userId,
      name: member ? member.name : 'Unknown member',
      amount: balances[userId]
    };
  });
  
  return balanceArray;
};

export const calculateSettlements = async (groupId: string): Promise<Settlement[]> => {
  await delay(500);
  
  // Get the raw balances
  const balances = await calculateBalances(groupId);
  
  // Find the group
  const group = groups.find(g => g.id === groupId);
  if (!group) throw new Error('Group not found');
  
  // Separate positive (creditors) and negative (debtors) balances
  const debtors = balances.filter(b => b.amount < 0)
    .map(b => ({ ...b, amount: Math.abs(b.amount) }))
    .sort((a, b) => b.amount - a.amount); // Sort by amount, largest debt first
    
  const creditors = balances.filter(b => b.amount > 0)
    .sort((a, b) => b.amount - a.amount); // Sort by amount, largest credit first
  
  const settlements: Settlement[] = [];
  
  // Create settlements
  let debtorIndex = 0;
  let creditorIndex = 0;
  
  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    
    // Get the debtor and creditor info
    const debtorMember = group.members.find(m => m.id === debtor.userId);
    const creditorMember = group.members.find(m => m.id === creditor.userId);
    
    if (!debtorMember || !creditorMember) {
      // Skip any unknown members
      if (!debtorMember) debtorIndex++;
      if (!creditorMember) creditorIndex++;
      continue;
    }
    
    // Determine settlement amount (minimum of debt and credit)
    const settlementAmount = Math.min(debtor.amount, creditor.amount);
    
    if (settlementAmount > 0) {
      settlements.push({
        from: {
          id: debtor.userId,
          name: debtorMember.name
        },
        to: {
          id: creditor.userId,
          name: creditorMember.name
        },
        amount: parseFloat(settlementAmount.toFixed(2))
      });
    }
    
    // Adjust remaining balances
    debtor.amount -= settlementAmount;
    creditor.amount -= settlementAmount;
    
    // Move indices if balances are zero
    if (Math.abs(debtor.amount) < 0.01) {
      debtorIndex++;
    }
    
    if (Math.abs(creditor.amount) < 0.01) {
      creditorIndex++;
    }
  }
  
  return settlements;
};

export const exportGroupData = async (groupId: string): Promise<string> => {
  await delay(1000);
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('You must be logged in to export data');
  }
  
  // Find the group
  const group = groups.find(g => g.id === groupId);
  if (!group) {
    throw new Error('Group not found');
  }
  
  // Check if user is a member
  if (!group.members.some(member => member.id === currentUser.id)) {
    throw new Error('You are not a member of this group');
  }
  
  // Generate CSV data
  let csv = 'Date,Description,Amount,Currency,Paid By,Participants\n';
  
  for (const expense of group.expenses) {
    const paidByMember = group.members.find(m => m.id === expense.paidBy);
    const paidBy = paidByMember ? paidByMember.name : 'Unknown';
    
    const participants = expense.participants.map(p => {
      const member = group.members.find(m => m.id === p.userId);
      return `${member ? member.name : 'Unknown'} (${p.share})`;
    }).join('; ');
    
    const date = new Date(expense.date).toLocaleDateString();
    
    csv += `"${date}","${expense.description}",${expense.amount},${expense.currency},"${paidBy}","${participants}"\n`;
  }
  
  return csv;
};

// Initialize with some demo data if empty
if (groups.length === 0) {
  const demoGroup: Group = {
    id: 'demo1',
    name: 'Weekend Trip',
    inviteCode: 'DEMO123',
    members: [
      { id: '1', name: 'Demo User', email: 'demo@example.com' },
      { id: '2', name: 'John Smith', email: 'john@example.com' },
      { id: '3', name: 'Sarah Johnson', email: 'sarah@example.com' }
    ],
    expenses: [
      {
        id: 'exp1',
        description: 'Dinner at Italian Restaurant',
        amount: 120,
        currency: 'USD',
        paidBy: '1',
        participants: [
          { userId: '1', share: 40 },
          { userId: '2', share: 40 },
          { userId: '3', share: 40 }
        ],
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        groupId: 'demo1',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'exp2',
        description: 'Hotel Booking',
        amount: 300,
        currency: 'USD',
        paidBy: '2',
        participants: [
          { userId: '1', share: 100 },
          { userId: '2', share: 100 },
          { userId: '3', share: 100 }
        ],
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        groupId: 'demo1',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'exp3',
        description: 'Taxi Ride',
        amount: 50,
        currency: 'USD',
        paidBy: '3',
        participants: [
          { userId: '1', share: 16.67 },
          { userId: '2', share: 16.67 },
          { userId: '3', share: 16.66 }
        ],
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        groupId: 'demo1',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  const demoGroup2: Group = {
    id: 'demo2',
    name: 'Apartment Expenses',
    inviteCode: 'HOME456',
    members: [
      { id: '1', name: 'Demo User', email: 'demo@example.com' },
      { id: '4', name: 'Mike Thompson', email: 'mike@example.com' },
      { id: '5', name: 'Emily Williams', email: 'emily@example.com' }
    ],
    expenses: [
      {
        id: 'exp4',
        description: 'Groceries',
        amount: 78.50,
        currency: 'USD',
        paidBy: '1',
        participants: [
          { userId: '1', share: 26.17 },
          { userId: '4', share: 26.17 },
          { userId: '5', share: 26.16 }
        ],
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        groupId: 'demo2',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'exp5',
        description: 'Electricity Bill',
        amount: 95.20,
        currency: 'USD',
        paidBy: '4',
        participants: [
          { userId: '1', share: 31.73 },
          { userId: '4', share: 31.73 },
          { userId: '5', share: 31.74 }
        ],
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        groupId: 'demo2',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  groups.push(demoGroup, demoGroup2);
  saveToStorage();
}
