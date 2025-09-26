import { TransactionFindReturnType } from "../../models/transaction.models";

export function calculateEstimatedMonthlyDebits(debits: TransactionFindReturnType[]): number {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const debitsThisMonth = debits.filter(d => d.date >= startOfMonth);
  const totalDebitsThisMonth = debitsThisMonth.reduce((sum, d) => sum + Math.max(Number(d.amount), 0), 0);

  return totalDebitsThisMonth;
}