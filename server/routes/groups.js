
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Group = require('../models/Group');
const Expense = require('../models/Expense');
const generateInviteCode = require('../utils/generateInviteCode');
const { calculateBalances, calculateSettlements } = require('../utils/balanceCalculator');

// @route   POST api/groups
// @desc    Create a group
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Group name is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Get user info
      const user = await User.findById(req.user.id).select('-password');
      
      // Generate unique invite code
      let inviteCode;
      let isUnique = false;
      
      while (!isUnique) {
        inviteCode = generateInviteCode();
        const existingGroup = await Group.findOne({ inviteCode });
        if (!existingGroup) {
          isUnique = true;
        }
      }
      
      // Create new group
      const newGroup = new Group({
        name: req.body.name,
        inviteCode,
        createdBy: req.user.id,
        members: [
          {
            user: req.user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
          }
        ]
      });
      
      const group = await newGroup.save();
      res.json(group);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/groups
// @desc    Get all groups for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const groups = await Group.find({ 'members.user': req.user.id })
      .sort({ createdAt: -1 });
    res.json(groups);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/groups/:id
// @desc    Get group by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    // Check if group exists
    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }
    
    // Check if user is a member of this group
    const isMember = group.members.some(
      member => member.user.toString() === req.user.id
    );
    
    if (!isMember) {
      return res.status(403).json({ msg: 'Not authorized to view this group' });
    }
    
    res.json(group);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Group not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/groups/join
// @desc    Join a group by invite code
// @access  Private
router.post(
  '/join',
  [
    auth,
    [
      check('inviteCode', 'Invite code is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Get user info
      const user = await User.findById(req.user.id).select('-password');
      
      // Find the group by invite code
      const group = await Group.findOne({ inviteCode: req.body.inviteCode });
      
      if (!group) {
        return res.status(404).json({ msg: 'Invalid invite code' });
      }
      
      // Check if user is already a member
      if (group.members.some(member => member.user.toString() === req.user.id)) {
        return res.status(400).json({ msg: 'You are already a member of this group' });
      }
      
      // Add user to group members
      group.members.push({
        user: req.user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      });
      
      await group.save();
      res.json(group);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/groups/:id/balances
// @desc    Get balances for a group
// @access  Private
router.get('/:id/balances', auth, async (req, res) => {
  try {
    // Check if group exists and user is a member
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }
    
    const isMember = group.members.some(
      member => member.user.toString() === req.user.id
    );
    
    if (!isMember) {
      return res.status(403).json({ msg: 'Not authorized to view this group' });
    }
    
    // Get all expenses for this group
    const expenses = await Expense.find({ group: req.params.id });
    
    // Calculate balances
    const targetCurrency = req.query.currency || 'USD';
    const balances = await calculateBalances(expenses, group.members, targetCurrency);
    
    res.json({ balances, currency: targetCurrency });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/groups/:id/settlements
// @desc    Get settlement plan for a group
// @access  Private
router.get('/:id/settlements', auth, async (req, res) => {
  try {
    // Check if group exists and user is a member
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }
    
    const isMember = group.members.some(
      member => member.user.toString() === req.user.id
    );
    
    if (!isMember) {
      return res.status(403).json({ msg: 'Not authorized to view this group' });
    }
    
    // Get all expenses for this group
    const expenses = await Expense.find({ group: req.params.id });
    
    // Calculate balances and settlements
    const targetCurrency = req.query.currency || 'USD';
    const balances = await calculateBalances(expenses, group.members, targetCurrency);
    const settlements = calculateSettlements(balances);
    
    res.json({ settlements, currency: targetCurrency });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/groups/:id/export
// @desc    Export group expenses as CSV data
// @access  Private
router.get('/:id/export', auth, async (req, res) => {
  try {
    // Check if group exists and user is a member
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }
    
    const isMember = group.members.some(
      member => member.user.toString() === req.user.id
    );
    
    if (!isMember) {
      return res.status(403).json({ msg: 'Not authorized to export this group data' });
    }
    
    // Get all expenses for this group
    const expenses = await Expense.find({ group: req.params.id })
      .sort({ date: 1 });
    
    // Generate CSV header
    let csv = 'Date,Description,Amount,Currency,Paid By,Participants\n';
    
    // Add expense rows
    for (const expense of expenses) {
      // Find payer name
      const payer = group.members.find(
        member => member.user.toString() === expense.paidBy.user.toString()
      );
      
      // Format participants with their shares
      const participants = expense.participants.map(p => {
        const member = group.members.find(
          m => m.user.toString() === p.user.toString()
        );
        return `${member ? member.name : 'Unknown'} (${p.share})`;
      }).join('; ');
      
      // Format date
      const date = new Date(expense.date).toLocaleDateString();
      
      // Add row to CSV
      csv += `"${date}","${expense.description}",${expense.amount},${expense.currency},"${payer?.name || 'Unknown'}","${participants}"\n`;
    }
    
    // Set headers for file download
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', `attachment; filename="group-${req.params.id}-expenses.csv"`);
    
    res.send(csv);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
