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
};

export const formatCurrency = (amount: number, currencyCode: string = 'XAF') => {
  const config = CURRENCIES[currencyCode] || CURRENCIES.XAF;
  
  // Use a safe default locale
  const locale = 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(amount).replace(config.code, config.symbol);
};

export const getCurrencySymbol = (code: string) => {
  return CURRENCIES[code]?.symbol || '$';
};
