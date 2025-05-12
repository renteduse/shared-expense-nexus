
const { convertCurrency } = require('./currencyConverter');

/**
 * Calculate balances for each member in a group
 * @param {Array} expenses - Group expenses
 * @param {Array} members - Group members
 * @param {String} targetCurrency - Currency to normalize all balances to
 */
const calculateBalances = async (expenses, members, targetCurrency = 'USD') => {
  try {
    // Initialize balances for all members
    const balances = {};
    members.forEach(member => {
      balances[member.user.toString()] = 0;
    });

    // Process each expense
    for (const expense of expenses) {
      // Convert expense amount to target currency
      const normalizedAmount = await convertCurrency(
        expense.amount,
        expense.currency,
        targetCurrency
      );

      // Add to payer's balance (they are owed money)
      const payerId = expense.paidBy.user.toString();
      balances[payerId] += normalizedAmount;

      // Subtract shares from participants (they owe money)
      for (const participant of expense.participants) {
        const participantId = participant.user.toString();
        // Convert share to target currency
        const normalizedShare = await convertCurrency(
          participant.share,
          expense.currency,
          targetCurrency
        );
        balances[participantId] -= normalizedShare;
      }
    }

    // Format balances into an array with member info
    const balanceArray = members.map(member => {
      const userId = member.user.toString();
      return {
        userId,
        name: member.name,
        amount: parseFloat(balances[userId].toFixed(2))
      };
    });

    return balanceArray;
  } catch (error) {
    console.error('Balance calculation error:', error);
    throw new Error('Failed to calculate balances');
  }
};

/**
 * Calculate optimal settlement transactions to minimize the number of payments
 * @param {Array} balances - User balances array
 */
const calculateSettlements = (balances) => {
  try {
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
      const settlementAmount = Math.min(debtor.amount, creditor.amount);
      
      if (settlementAmount > 0.01) { // Ignore very small amounts
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
      
      // Move indices if balances are approximately zero
      if (Math.abs(debtor.amount) < 0.01) {
        debtorIndex++;
      }
      
      if (Math.abs(creditor.amount) < 0.01) {
        creditorIndex++;
      }
    }
    
    return settlements;
  } catch (error) {
    console.error('Settlement calculation error:', error);
    throw new Error('Failed to calculate settlements');
  }
};

module.exports = {
  calculateBalances,
  calculateSettlements
};
