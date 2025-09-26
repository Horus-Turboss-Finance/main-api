import { TransactionFindReturnType } from "../../models/transaction.models";

export function calculateSurvivalMonths(debits: TransactionFindReturnType[]): number {
  const totalDebits12m = debits.reduce((sum, d) => sum + Math.max(Number(d.amount), 0), 0);
  const avgMonthlyExpenses = totalDebits12m / 12;

  return avgMonthlyExpenses > 0 ? debits.reduce((s, d) => s + Math.max(Number(d.amount), 0), 0) / avgMonthlyExpenses : 0;
}