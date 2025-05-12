const axios = require('axios');

/**
 * Cache exchange rates with expiry time
 */
let ratesCache = {
  rates: null,
  lastUpdated: null,
  expiryTime: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
};

/**
 * Fetch current exchange rates from API
 */
const fetchExchangeRates = async () => {
  try {
    // Check if cache is valid
    const now = Date.now();
    if (ratesCache.rates && ratesCache.lastUpdated && 
        (now - ratesCache.lastUpdated < ratesCache.expiryTime)) {
      return ratesCache.rates;
    }
    
    // If not, fetch new rates
    const response = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/USD`,
      {
        headers: {
          'apikey': process.env.EXCHANGE_RATE_API_KEY
        }
      }
    );
    
    // Update cache
    ratesCache.rates = response.data.rates;
    ratesCache.lastUpdated = now;
    
    return ratesCache.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    // If API call failed but we have cached rates, use them
    if (ratesCache.rates) {
      return ratesCache.rates;
    }
    
    // Otherwise, use hardcoded fallback rates
    return {
      USD: 1,
      EUR: 0.85,
      GBP: 0.75,
      JPY: 110.42,
      INR: 74.53,
      CAD: 1.25,
      AUD: 1.35,
      CNY: 6.45
    };
  }
};

/**
 * Convert amount from one currency to another
 */
const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  try {
    const rates = await fetchExchangeRates();
    
    // Convert amount to USD first (base currency)
    const amountInUSD = fromCurrency === 'USD' ? 
      amount : amount / rates[fromCurrency];
    
    // Then convert from USD to target currency
    const convertedAmount = toCurrency === 'USD' ? 
      amountInUSD : amountInUSD * rates[toCurrency];
    
    return parseFloat(convertedAmount.toFixed(2));
  } catch (error) {
    console.error('Currency conversion error:', error);
    throw new Error('Failed to convert currency');
  }
};

module.exports = {
  fetchExchangeRates,
  convertCurrency
};
