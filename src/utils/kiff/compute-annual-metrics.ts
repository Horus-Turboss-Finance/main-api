import { TransactionFindReturnType } from "../../models/transaction.models";
import { KiffOptions } from "../../types/kiff-score.types";
import { calculateEstimatedMonthlyDebits } from "./calculate-estimated-monthly-debits";

export function computeAnnualMetrics(
  credits: TransactionFindReturnType[],
  debits: TransactionFindReturnType[],
  options: KiffOptions
): {
  annualRevenue: number,
  annualCharge: number,
  weightedProjects: number,
  savingsObjective: number,
  annualBudget: number,
  annualKiff: number
} {
  const now = new Date();
  const since12Months = new Date(now);
  since12Months.setFullYear(now.getFullYear() - 1);

  const totalCredits = credits.filter(c => new Date(c.date) >= since12Months)
    .reduce((sum, c) => sum + Math.max(Number(c.amount), 0), 0);
  const totalDebits = debits.filter(d => new Date(d.date) >= since12Months)
    .reduce((sum, d) => sum + Math.max(Number(d.amount), 0), 0);

  const annualRevenue = options.revenu_annuel_override ?? totalCredits; 
  const annualCharge = Math.max(totalDebits, calculateEstimatedMonthlyDebits(debits) * 12);

  const weightedProjects = (options.projets_annuel ?? []).reduce(
    (sum, p) => sum + p.montant * (1 - Math.max(0, Math.min(1, p.flexibilite ?? 0))), 0
  );

  const savingsObjective = options.objectif_epargne_annuel ?? 0;

  const annualBudget = annualRevenue - annualCharge - weightedProjects - savingsObjective;
  const annualKiff = Math.max(0, annualBudget / 365.25);

  return {
    annualRevenue,
    annualCharge,
    weightedProjects,
    savingsObjective,
    annualBudget,
    annualKiff
  };
}