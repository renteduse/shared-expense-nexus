
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Group = require('../models/Group');
const Expense = require('../models/Expense');

// @route   POST api/expenses
// @desc    Create a new expense
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('group', 'Group is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('amount', 'Amount is required').isNumeric(),
      check('paidBy', 'Payer is required').not().isEmpty(),
      check('participants', 'Participants are required').isArray()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { group, description, amount, currency, paidBy, participants, date } = req.body;
      
      // Check if group exists
      const groupDoc = await Group.findById(group);
      if (!groupDoc) {
        return res.status(404).json({ msg: 'Group not found' });
      }
      
      // Check if user is a member of this group
      const isMember = groupDoc.members.some(
        member => member.user.toString() === req.user.id
      );
      
      if (!isMember) {
        return res.status(403).json({ msg: 'Not authorized to add expenses to this group' });
      }
      
      // Create new expense
      const newExpense = new Expense({
        group,
        description,
        amount,
        currency: currency || 'USD',
        paidBy,
        participants,
        date: date || Date.now()
      });
      
      const expense = await newExpense.save();
      res.json(expense);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/expenses/group/:groupId
// @desc    Get all expenses for a group
// @access  Private
router.get('/group/:groupId', auth, async (req, res) => {
  try {
    // Check if group exists
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }
    
    // Check if user is a member of this group
    const isMember = group.members.some(
      member => member.user.toString() === req.user.id
    );
    
    if (!isMember) {
      return res.status(403).json({ msg: 'Not authorized to view expenses for this group' });
    }
    
    // Get expenses
    const expenses = await Expense.find({ group: req.params.groupId })
      .sort({ date: -1 });
    
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Group not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET api/expenses/:id
// @desc    Get expense by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    
    // Check if user is a member of the group this expense belongs to
    const group = await Group.findById(expense.group);
    
    const isMember = group.members.some(
      member => member.user.toString() === req.user.id
    );
    
    if (!isMember) {
      return res.status(403).json({ msg: 'Not authorized to view this expense' });
    }
    
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/expenses/:id
// @desc    Update an expense
// @access  Private
router.put(
  '/:id',
  [
    auth,
    [
      check('description', 'Description is required').not().isEmpty(),
      check('amount', 'Amount is required').isNumeric()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let expense = await Expense.findById(req.params.id);
      
      if (!expense) {
        return res.status(404).json({ msg: 'Expense not found' });
      }
      
      // Check if user is a member of the group this expense belongs to
      const group = await Group.findById(expense.group);
      
      const isMember = group.members.some(
        member => member.user.toString() === req.user.id
      );
      
      if (!isMember) {
        return res.status(403).json({ msg: 'Not authorized to update this expense' });
      }
      
      // Update expense
      const { description, amount, currency, paidBy, participants, date } = req.body;
      
      expense.description = description;
      expense.amount = amount;
      if (currency) expense.currency = currency;
      if (paidBy) expense.paidBy = paidBy;
      if (participants) expense.participants = participants;
      if (date) expense.date = date;
      
      await expense.save();
      
      res.json(expense);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Expense not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    
    // Check if user is a member of the group this expense belongs to
    const group = await Group.findById(expense.group);
    
    const isMember = group.members.some(
      member => member.user.toString() === req.user.id
    );
    
    if (!isMember) {
      return res.status(403).json({ msg: 'Not authorized to delete this expense' });
    }
    
    await expense.remove();
    
    res.json({ msg: 'Expense removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
