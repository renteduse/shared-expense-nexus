
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Send email notification when user is added to a group
 */
const sendGroupInvite = async (email, groupName, inviteCode) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `You've been invited to join ${groupName} on BudgetSplit`,
      html: `
        <h1>BudgetSplit Group Invitation</h1>
        <p>You've been invited to join the expense group "${groupName}"</p>
        <p>Use this invite code to join: <strong>${inviteCode}</strong></p>
        <p>or click <a href="${process.env.FRONTEND_URL}/groups/join?code=${inviteCode}">here</a> to join directly.</p>
      `
    });
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

/**
 * Send email notification when a new expense is added
 */
const sendNewExpenseNotification = async (emails, groupName, expenseDetails) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emails,
      subject: `New expense in ${groupName}`,
      html: `
        <h1>New Expense Added</h1>
        <p>A new expense was added to "${groupName}"</p>
        <p><strong>${expenseDetails.paidBy}</strong> paid <strong>${expenseDetails.amount} ${expenseDetails.currency}</strong></p>
        <p>Description: ${expenseDetails.description}</p>
        <p>Click <a href="${process.env.FRONTEND_URL}/groups/${expenseDetails.groupId}">here</a> to view details.</p>
      `
    });
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

/**
 * Send monthly summary email
 */
const sendMonthlySummary = async (email, userName, summaryData) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Your Monthly BudgetSplit Summary`,
      html: `
        <h1>Monthly Expense Summary</h1>
        <p>Hello ${userName},</p>
        <p>Here's your expense summary for this month:</p>
        <ul>
          ${summaryData.map(group => `
            <li>
              <strong>${group.name}:</strong>
              <ul>
                <li>Total expenses: ${group.totalAmount} ${group.currency}</li>
                <li>Your contribution: ${group.userContribution} ${group.currency}</li>
                <li>Balance: ${group.balance > 0 ? 'You are owed ' + group.balance : 'You owe ' + Math.abs(group.balance)} ${group.currency}</li>
              </ul>
            </li>
          `).join('')}
        </ul>
        <p>Login to <a href="${process.env.FRONTEND_URL}">BudgetSplit</a> to see more details.</p>
      `
    });
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

module.exports = {
  sendGroupInvite,
  sendNewExpenseNotification,
  sendMonthlySummary
};
