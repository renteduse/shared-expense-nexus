
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { fetchExchangeRates, convertCurrency } = require('../utils/currencyConverter');

// @route   GET api/currencies/rates
// @desc    Get current exchange rates
// @access  Private
router.get('/rates', auth, async (req, res) => {
  try {
    const rates = await fetchExchangeRates();
    res.json(rates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/currencies/convert
// @desc    Convert amount between currencies
// @access  Private
router.post('/convert', auth, async (req, res) => {
  const { amount, fromCurrency, toCurrency } = req.body;
  
  if (!amount || !fromCurrency || !toCurrency) {
    return res.status(400).json({ 
      msg: 'Please provide amount, fromCurrency, and toCurrency' 
    });
  }
  
  try {
    const convertedAmount = await convertCurrency(
      parseFloat(amount),
      fromCurrency,
      toCurrency
    );
    
    res.json({
      amount: parseFloat(amount),
      fromCurrency,
      toCurrency,
      convertedAmount
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
