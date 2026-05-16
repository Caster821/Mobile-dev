export const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

export const groupByDate = (transactions: any[]) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  return {
    today: transactions.filter(t => isSameDay(new Date(t.date), today)),
    yesterday: transactions.filter(t => isSameDay(new Date(t.date), yesterday)),
    thisWeek: transactions.filter(t => new Date(t.date) > weekAgo && !isSameDay(new Date(t.date), today) && !isSameDay(new Date(t.date), yesterday)),
    older: transactions.filter(t => new Date(t.date) <= weekAgo)
  };
};
