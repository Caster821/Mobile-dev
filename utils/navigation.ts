import { router } from 'expo-router';

export const navigateToEditGoal = (id: string) => {
  router.push({
    pathname: '/(tabs)/goals/[id]',
    params: { id },
  });
};

export const navigateToEditBudget = (id: string, month: number, year: number) => {
  router.push({
    pathname: '/(tabs)/budgets/edit',
    params: { id, month: String(month), year: String(year) },
  });
};

export const navigateToCreateBudget = (month: number, year: number) => {
  router.push({
    pathname: '/(tabs)/budgets/create',
    params: { month: String(month), year: String(year) },
  });
};

export const navigateToEditTransaction = (id: string) => {
  router.push({
    pathname: '/(tabs)/transactions/[id]',
    params: { id },
  });
};
