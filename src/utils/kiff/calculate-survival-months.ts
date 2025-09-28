import { TransactionFindReturnType } from "../../models/transaction.models";

export function calculateSurvivalMonths(reserve: number, debits: TransactionFindReturnType[]): number {
  if (!debits || debits.length === 0) return 0;

  // Trouver les dates min et max
  const dates = debits.map(d => new Date(d.date));
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

  // Calcul de la durée en mois (arrondi au plus proche mois supérieur, min = 1)
  const monthsAvailable = Math.max(
    1,
    (maxDate.getFullYear() - minDate.getFullYear()) * 12 + (maxDate.getMonth() - minDate.getMonth()) + 1
  );

  // Total des dépenses sur la période
  const totalSpent = debits.reduce((sum, d) => sum + Number(d.amount), 0);

  // Moyenne mensuelle réelle
  const avgMonthlyExpenses = totalSpent / monthsAvailable;

  // Calcul des mois de survie
  return avgMonthlyExpenses > 0 ? reserve / avgMonthlyExpenses : 0;
}