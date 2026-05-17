import * as Notifications from 'expo-notifications';
import { insertTransaction, getRecurringRules } from '../database/database';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const checkAndGenerateRecurringTransactions = async (userId: string) => {
  try {
    const rules = await getRecurringRules(userId);
    const now = Date.now();
    
    for (const rule of rules) {
      const nextDate = getNextOccurrence(rule);
      
      if (nextDate <= now && (!rule.lastGenerated || nextDate > rule.lastGenerated)) {
        await insertTransaction({
          userId: rule.userId,
          amount: rule.amount,
          type: rule.type,
          categoryId: rule.categoryId,
          accountId: rule.accountId,
          date: nextDate,
          note: `Recurring: ${rule.frequency}`,
        });
      } else if (nextDate > now && nextDate < now + 86400000 * 3) {
        scheduleNotification(rule, nextDate);
      }
    }
  } catch(e) {
    console.error('Recurring task error', e);
  }
};

const getNextOccurrence = (rule: any): number => {
  const lastGen = rule.lastGenerated || rule.startDate;
  const date = new Date(lastGen);
  
  switch (rule.frequency) {
    case 'daily': date.setDate(date.getDate() + rule.interval); break;
    case 'weekly': date.setDate(date.getDate() + (7 * rule.interval)); break;
    case 'monthly': date.setMonth(date.getMonth() + rule.interval); break;
    case 'yearly': date.setFullYear(date.getFullYear() + rule.interval); break;
  }
  
  return date.getTime();
};

const scheduleNotification = async (rule: any, dateInMs: number) => {
  const trigger = new Date(dateInMs);
  trigger.setHours(9, 0, 0, 0); 
  
  if (trigger.getTime() > Date.now()) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Upcoming Transaction",
        body: `A recurring ${rule.type} of $${rule.amount} is scheduled soon.`,
      },
      trigger: {
        type: 'date',
        date: trigger,
      } as any,
    });
  }
};
