
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getExchangeRates } = require('../utils/balanceCalculator');

// @route   GET api/currencies/rates
// @desc    Get current exchange rates
// @access  Private
router.get('/rates', auth, async (req, res) => {
  try {
    const rates = await getExchangeRates();
    res.json({ rates });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/currencies/list
// @desc    Get list of available currencies
// @access  Private
router.get('/list', auth, async (req, res) => {
  try {
    const rates = await getExchangeRates();
    const currencies = Object.keys(rates).map(code => ({
      code,
      rate: rates[code]
    }));
    
    res.json({ currencies });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
