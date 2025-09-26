/*
  [DEV-NOTE]: HORUS 26/09/2025
  TODO / amélioration future:
  - Extraire la récupération/agrégation des données en une "view" SQL / materialized view pour performance.
  - Permettre un mode "pré-calculé" asynchrone.

*/

import { round2 } from "../utils/math/round2";
import { calculateBVM } from "../utils/kiff/calculate-bvm";
import { calculateCushion } from "../utils/kiff/calculate-cushion";
import { calculateReserve } from "../utils/kiff/calculate-reserve";
import { getDaysLeftInMonth } from "../utils/date/get-days-left-in-month";
import { computeAnnualMetrics } from "../utils/kiff/compute-annual-metrics";
import { computeMonthlyMetrics } from "../utils/kiff/compute-monthly-metrics";
import { calculateDailyAvg } from "../utils/transactions/calculate-daily-avg";
import { calculateStabilityScore } from "../utils/kiff/calculate-stability-score";
import { calculateSurvivalMonths } from "../utils/kiff/calculate-survival-months";
import { KiffOptions, KiffResult } from "../types/kiff-score.types";
import {
  fetchUserAccounts,
  fetchUserTransactions,
  splitTransactions,
} from "./kiff-score-data.service";

/**
 * Service principal pour le calcul du kiff-score.
 *
 * - Agrège les données utilisateur (comptes, transactions).
 * - Applique les règles métier pour calculer les indicateurs de bien-être financier.
 * - Toutes les valeurs monétaires sont exprimées en euros, arrondies à 2 décimales.
 */
export async function calculateKiffScoreForUser(userId: number, options: KiffOptions = {}): Promise<KiffResult> {
  const today = new Date();
  const { daysLeftInMonth, lastDayOfMonth } = getDaysLeftInMonth(today);

  const nbPeople = Math.max(1, Math.floor(options.nb_personne_foyer ?? 1));
  const baseBVM = options.baseBVM ?? 300;
  const BVM = calculateBVM(baseBVM, nbPeople);

  const [accounts, transactions] = await Promise.all([
    fetchUserAccounts(userId),
    fetchUserTransactions(userId, options.transactionLimit ?? 10000),
  ]);

  const reserve = calculateReserve(accounts);
  const { credits, debits } = splitTransactions(transactions);

  const annual = computeAnnualMetrics(credits, debits, options);
  const monthly = computeMonthlyMetrics({
    BVM,
    credits,
    debits,
    soldeActuel: reserve,
    daysLeft: daysLeftInMonth,
    lastDayOfMonth,
  });

  const kiffRaw = Math.min(annual.annualKiff, monthly.monthlyKiff);
  const cushion = calculateCushion(reserve, annual.annualBudget);
  const adjustedKiff = kiffRaw + cushion;

  const survivalMonths = calculateSurvivalMonths(debits);
  const { mood, stabilityScore } = calculateStabilityScore(survivalMonths, kiffRaw);

  return {
    date: today,
    nb_personne_foyer: nbPeople,
    BVM: round2(BVM),
    nombre_jour_restant_mensuel: daysLeftInMonth,
    budget_mensuel_restant: round2(monthly.monthlyRemainingBudget),
    kiff_brut_mensuel: round2(monthly.monthlyKiff),
    budget_annuel: round2(annual.annualBudget),
    kiff_brut_annuel: round2(annual.annualKiff),
    kiff_brut: round2(kiffRaw),
    reserve_liquide: round2(reserve),
    coussin: round2(cushion),
    kiff_ajuste: round2(adjustedKiff),
    mois_survie: round2(survivalMonths),
    score_stabilite: round2(stabilityScore),
    mood,
    details: {
      charge_annuelle: round2(annual.annualCharge),
      projet_pondere: round2(annual.weightedProjects),
      revenu_annuel: round2(annual.annualRevenue),
      moyenne_depenses_journalier: round2(calculateDailyAvg(debits)),
    },
  };
}