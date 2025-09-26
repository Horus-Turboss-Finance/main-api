import { TransactionFindReturnType } from "../../models/transaction.models";

export function calculateDailyAvg(debits: TransactionFindReturnType[], windowDays: number = 90): number {
  const now = new Date();
  const since = new Date(now);
  since.setDate(now.getDate() - windowDays + 1);

  const debitsInWindow = debits.filter(d => d.date >= since);
  const total = debitsInWindow.reduce((sum, d) => sum + Math.max(Number(d.amount), 0), 0);

  return windowDays > 0 ? total / windowDays : 0;
}