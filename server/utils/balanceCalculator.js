
const axios = require('axios');
require('dotenv').config();

/**
 * Calculate balances for all members in the group
 * @param {Array} expenses - List of all expenses in the group
 * @param {Array} members - List of all members in the group
 * @param {String} targetCurrency - Currency to convert all amounts to
 * @returns {Array} - Balance information for each member
 */
const calculateBalances = async (expenses, members, targetCurrency = 'USD') => {
  // Initialize balances for all members
  const balances = {};
  members.forEach(member => {
    balances[member.user.toString()] = 0;
  });
  
  // Get exchange rates if we have expenses in different currencies
  let rates = { USD: 1 }; // Default rate for USD
  const currencies = new Set(expenses.map(expense => expense.currency));
  
  if (currencies.size > 1 || (currencies.size === 1 && !currencies.has('USD'))) {
    try {
      rates = await getExchangeRates();
    } catch (error) {
      console.error('Failed to get exchange rates:', error);
      // Continue with USD rates only
    }
  }
  
  // Calculate balances from expenses
  for (const expense of expenses) {
    const exchangeRate = rates[expense.currency] || 1;
    const amountInUSD = expense.amount / exchangeRate;
    
    // Add money to payer
    balances[expense.paidBy.toString()] += amountInUSD;
    
    // Subtract shares from participants
    for (const participant of expense.participants) {
      const shareInUSD = participant.share / exchangeRate;
      balances[participant.user.toString()] -= shareInUSD;
    }
  }
  
  // Convert to target currency if needed
  if (targetCurrency !== 'USD' && rates[targetCurrency]) {
    Object.keys(balances).forEach(userId => {
      balances[userId] = balances[userId] * rates[targetCurrency];
    });
  }
  
  // Convert to array format with member names
  const balanceArray = Object.keys(balances).map(userId => {
    const member = members.find(m => m.user.toString() === userId);
    return {
      userId,
      name: member ? member.name : 'Unknown member',
      amount: balances[userId]
    };
  });
  
  return balanceArray;
};

/**
 * Calculate the optimal settlement plan
 * @param {Array} balances - Balance information for each member
 * @returns {Array} - List of transactions to settle all debts
 */
const calculateSettlements = (balances) => {
  // Separate positive (creditors) and negative (debtors) balances
  const debtors = balances.filter(b => b.amount < 0)
    .map(b => ({ ...b, amount: Math.abs(b.amount) }))
    .sort((a, b) => b.amount - a.amount); // Sort by amount, largest debt first
    
  const creditors = balances.filter(b => b.amount > 0)
    .sort((a, b) => b.amount - a.amount); // Sort by amount, largest credit first
  
  const settlements = [];
  
  // Create settlements
  let debtorIndex = 0;
  let creditorIndex = 0;
  
  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    
    // Determine settlement amount (minimum of debt and credit)
    const settlementAmount = Math.min(
      parseFloat(debtor.amount.toFixed(2)), 
      parseFloat(creditor.amount.toFixed(2))
    );
    
    if (settlementAmount > 0) {
      settlements.push({
        from: {
          id: debtor.userId,
          name: debtor.name
        },
        to: {
          id: creditor.userId,
          name: creditor.name
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

/**
 * Get current exchange rates from API
 * @returns {Object} - Exchange rates with USD as base
 */
const getExchangeRates = async () => {
  try {
    // If API key is provided, use the API
    if (process.env.EXCHANGE_RATE_API_KEY) {
      const response = await axios.get(
        `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/USD`
      );
      return response.data.conversion_rates;
    } else {
      // Use hardcoded rates if no API key
      return {
        USD: 1,
        EUR: 0.85,
        GBP: 0.75,
        JPY: 110.42,
        INR: 74.53,
        CAD: 1.25,
        AUD: 1.35,
        CNY: 6.45,
      };
    }
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Return hardcoded rates as fallback
    return {
      USD: 1,
      EUR: 0.85,
      GBP: 0.75,
      JPY: 110.42,
      INR: 74.53,
      CAD: 1.25,
      AUD: 1.35,
      CNY: 6.45,
    };
  }
};

module.exports = {
  calculateBalances,
  calculateSettlements,
  getExchangeRates
};
