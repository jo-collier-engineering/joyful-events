const CURRENCY_SYMBOLS = {
  'USD': '$',
  'EUR': '€', 
  'GBP': '£',
  'GBX': 'p',
  'CAD': 'C$',
  'AUD': 'A$',
  'JPY': '¥',
  'CHF': 'CHF',
  'SEK': 'kr',
  'NOK': 'kr',
  'DKK': 'kr'
};

export const getCurrencySymbol = (currencyCode) => {
  if (!currencyCode) return '£';
  return CURRENCY_SYMBOLS[currencyCode] || currencyCode;
};

export const getCheapestPrice = (ticketTypes) => {
  if (!ticketTypes || ticketTypes.length === 0) return null;
  
  const prices = ticketTypes
    .map(ticket => ticket?.price?.total)
    .filter(price => typeof price === 'number' && price >= 0);
  
  return prices.length > 0 ? Math.min(...prices) : null;
};

export const formatPrice = (price, currencyCode = 'GBP') => {
  const amount = (price ?? 0) / 100;
  
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  
  const symbol = getCurrencySymbol(currencyCode);
  
  return `${symbol}${formatted}`;
};