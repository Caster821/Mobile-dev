export const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  } catch (e) {
    // Fallback if Intl is not fully supported or invalid code
    return `${amount < 0 ? '-' : ''}${currencyCode} ${Math.abs(amount).toFixed(2)}`;
  }
};

export const convertCurrency = (amount: number, rate: number): number => {
  return amount * rate;
};
