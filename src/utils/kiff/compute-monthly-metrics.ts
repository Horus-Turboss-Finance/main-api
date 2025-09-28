import { TransactionFindReturnType } from "../../models/transaction.models";
import { calculateDailyAvg } from "../transactions/calculate-daily-avg";

export function computeMonthlyMetrics({
  revenuRestantMois, // optionnel override / estimation
  lastDayOfMonth,
  soldeActuel,       // additionnel: solde courant (tous comptes)
  daysLeft,
  credits,
  debits,
  BVM,
}:{
  credits: TransactionFindReturnType[],
  debits: TransactionFindReturnType[],
  revenuRestantMois?: number,
  lastDayOfMonth: number,
  soldeActuel: number,
  daysLeft: number,
  BVM: number,
}): {
  monthlyRemainingBudget: number,
  monthlyKiff: number
} {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);

  // total crédits observés ce mois
  const creditsThisMonth = credits.filter(c => new Date(c.date) >= startOfMonth)
    .reduce((s, c) => s + Math.max(Number(c.amount), 0), 0);

  // estimation simple du revenu restant : si override fourni, on l'utilise,
  // sinon on suppose revenu mensuel moyen - crédits déjà reçus ce mois (clamp >= 0)
  const avgMonthlyCredits = credits.length ? (credits
    .filter(c => new Date(c.date) >= new Date(now.getFullYear()-1, now.getMonth(), now.getDate() - 30))
    .reduce((s, c) => s + Math.max(Number(c.amount), 0), 0) / 12) : 0;

  const estimatedRevenuRestant = revenuRestantMois != null
    ? Math.max(0, revenuRestantMois)
    : Math.max(0, avgMonthlyCredits - creditsThisMonth);

  // dépenses fixes restantes : on peut déduire des transactions "fixes" ou fournir via options.
  // Ici on estime : dépenses observées ce mois proratisées sur daysLeft
  const debitsThisMonth = debits.filter(d => new Date(d.date) >= startOfMonth)
                                .reduce((s, d) => s + Math.max(Number(d.amount), 0), 0);

  const avgMonthDays = lastDayOfMonth; // utiliser le nb de jours du mois courant pour prorata
  const estimatedFixedExpenses = (debitsThisMonth / avgMonthDays) * daysLeft;

  const dailyAvgSpending = calculateDailyAvg(debits);
  const BVM_prorata = (BVM / avgMonthDays) * daysLeft;

  const totalAvailable = soldeActuel + estimatedRevenuRestant;
  const totalEstimatedExpenses = estimatedFixedExpenses + (dailyAvgSpending * daysLeft) + BVM_prorata;

  const monthlyRemainingBudget = totalAvailable - totalEstimatedExpenses;
  const monthlyKiff = Math.max(0, monthlyRemainingBudget / Math.max(1, daysLeft));

  return { monthlyRemainingBudget, monthlyKiff };
}