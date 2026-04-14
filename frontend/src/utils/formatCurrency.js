export const CURRENCIES = [
  { code: 'INR', label: 'Indian Rupee (₹)' },
  { code: 'USD', label: 'US Dollar ($)'    },
  { code: 'EUR', label: 'Euro (€)'         },
  { code: 'GBP', label: 'British Pound (£)'},
];

export const formatCurrency = (amount, currency = 'INR') => {
  const localeMap = { INR: 'en-IN', USD: 'en-US', EUR: 'de-DE', GBP: 'en-GB' };
  return new Intl.NumberFormat(localeMap[currency] || 'en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export default formatCurrency;
