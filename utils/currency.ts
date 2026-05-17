export interface CurrencyConfig {
  code: string;
  symbol: string;
  decimals: number;
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
  XAF: { code: 'XAF', symbol: 'FCFA', decimals: 0 },
  USD: { code: 'USD', symbol: '$', decimals: 2 },
  EUR: { code: 'EUR', symbol: '€', decimals: 2 },
  GBP: { code: 'GBP', symbol: '£', decimals: 2 },
  XOF: { code: 'XOF', symbol: 'FCFA', decimals: 0 },
  JPY: { code: 'JPY', symbol: '¥', decimals: 0 },
};

export const CURRENCY_CODES = Object.keys(CURRENCIES);

export const formatCurrency = (amount: number, currencyCode: string = 'XAF') => {
  const config = CURRENCIES[currencyCode] || CURRENCIES.XAF;
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(amount);
  return `${config.symbol} ${formatted}`;
};

export const getCurrencySymbol = (code: string) => {
  return CURRENCIES[code]?.symbol || '$';
};
