import * as Notifications from 'expo-notifications';
import { getRecurringRules, insertTransaction, updateLastGenerated } from '../database/database';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const checkAndGenerateRecurringTransactions = async () => {
  try {
    const rules = await getRecurringRules();
    const now = Date.now();
    
    for (const rule of rules) {
      const nextDate = getNextOccurrence(rule);
      
      if (nextDate <= now && (!rule.last_generated || nextDate > rule.last_generated)) {
        await insertTransaction({
          id: Date.now().toString(),
          amount: rule.amount,
          type: rule.type,
          category_id: rule.category_id,
          account_id: rule.account_id,
          date: nextDate,
          note: `Recurring: ${rule.frequency}`,
          receipt_uri: null,
          recurring_id: rule.id,
          tags: null,
          is_deleted: 0,
          created_at: Date.now(),
        });
        
        await updateLastGenerated(rule.id, nextDate);
      } else if (nextDate > now && nextDate < now + 86400000 * 3) {
        scheduleNotification(rule, nextDate);
      }
    }
  } catch(e) {
    console.error('Recurring task error', e);
  }
};

const getNextOccurrence = (rule: any): number => {
  const lastGen = rule.last_generated || rule.start_date;
  const date = new Date(lastGen);
  
  switch (rule.frequency) {
    case 'daily': date.setDate(date.getDate() + rule.interval); break;
    case 'weekly': date.setDate(date.getDate() + (7 * rule.interval)); break;
    case 'monthly': date.setMonth(date.getMonth() + rule.interval); break;
    case 'yearly': date.setFullYear(date.getFullYear() + rule.interval); break;
  }
  
  return date.getTime();
};

const scheduleNotification = async (rule: any, date: number) => {
  const trigger = new Date(date);
  trigger.setHours(9, 0, 0, 0); 
  
  if (trigger.getTime() > Date.now()) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Upcoming Transaction",
        body: `A recurring ${rule.type} of $${rule.amount} is scheduled soon.`,
      },
      trigger,
    });
  }
};
