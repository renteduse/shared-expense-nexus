
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
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
      check('groupId', 'Group ID is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('amount', 'Amount must be a positive number').isFloat({ gt: 0 }),
      check('currency', 'Currency is required').not().isEmpty(),
      check('paidById', 'Payer ID is required').not().isEmpty(),
      check('participants', 'Participants are required').isArray({ min: 1 })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      groupId,
      description,
      amount,
      currency,
      paidById,
      participants,
      date
    } = req.body;

    try {
      // Check if group exists
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ msg: 'Group not found' });
      }

      // Check if user is a member of this group
      const isMember = group.members.some(
        member => member.user.toString() === req.user.id
      );

      if (!isMember) {
        return res.status(403).json({ msg: 'Not authorized to add expenses to this group' });
      }

      // Validate that payer is a group member
      const payerMember = group.members.find(
        member => member.user.toString() === paidById
      );

      if (!payerMember) {
        return res.status(400).json({ msg: 'Payer must be a group member' });
      }

      // Validate that all participants are group members and shares sum to total
      let totalShare = 0;
      const formattedParticipants = [];

      for (const participant of participants) {
        // Check if participant is a member
        const member = group.members.find(
          m => m.user.toString() === participant.userId
        );

        if (!member) {
          return res.status(400).json({ 
            msg: `Participant ${participant.userId} is not a group member` 
          });
        }

        // Add participant with share
        formattedParticipants.push({
          user: participant.userId,
          name: member.name,
          share: participant.share
        });

        totalShare += parseFloat(participant.share);
      }

      // Ensure total shares approximately equal the total amount (allowing for small rounding errors)
      if (Math.abs(totalShare - amount) > 0.01) {
        return res.status(400).json({ 
          msg: `Total shares (${totalShare.toFixed(2)}) must equal total amount (${amount})` 
        });
      }

      // Create expense
      const newExpense = new Expense({
        group: groupId,
        description,
        amount,
        currency,
        paidBy: {
          user: paidById,
          name: payerMember.name
        },
        participants: formattedParticipants,
        date: date || new Date(),
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
    // Check if group exists and user is a member
    const group = await Group.findById(req.params.groupId);
    
    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }
    
    const isMember = group.members.some(
      member => member.user.toString() === req.user.id
    );
    
    if (!isMember) {
      return res.status(403).json({ msg: 'Not authorized to view expenses for this group' });
    }
    
    // Get expenses sorted by date (newest first)
    const expenses = await Expense.find({ group: req.params.groupId })
      .sort({ date: -1 });
    
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
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
    
    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }
    
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

module.exports = router;
