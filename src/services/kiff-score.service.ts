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
  computeDataConfidence,
  detectOutlierSpending,
  fetchUserAccounts,
  fetchUserTransactions,
  splitTransactions,
} from "./kiff-score-data.service";
import { CoreResponse } from "../types/@types.core";
import { handleOnlyDataCore } from "../utils/handleCoreResponse";

/**
 * Service principal pour le calcul du kiff-score.
 *
 * - Agrège les données utilisateur (comptes, transactions).
 * - Applique les règles métier pour calculer les indicateurs de bien-être financier.
 * - Toutes les valeurs monétaires sont exprimées en euros, arrondies à 2 décimales.
 */
export async function calculateKiffScoreForUser(userId: number, options: KiffOptions = {}): CoreResponse<KiffResult|string> {
  return handleOnlyDataCore(
    async () => {
      const today = new Date();
      const { daysLeftInMonth, lastDayOfMonth } = getDaysLeftInMonth(today);

      const nbPeople = Math.max(1, Math.floor(options.nb_personne_foyer ?? 1));
      const baseBVM = options.baseBVM ?? 300;
      const BVM = calculateBVM(baseBVM, nbPeople);

      const [accounts, transactions] = await Promise.all([
        fetchUserAccounts(userId),
        fetchUserTransactions(userId, options.transactionLimit ?? 10000),
      ]);

      const mounthFilter = new Date();
      mounthFilter.setMonth(mounthFilter.getMonth() - 2);

      const isLowData = transactions.length < 10 || new Set(transactions.filter(t => new Date(t.date).getTime() > mounthFilter.getTime() )).size < 2;

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

      const isOutlierCase = detectOutlierSpending(debits);
      const dataConfidence = computeDataConfidence(debits);

      let kiffRaw = Math.min(annual.annualKiff, monthly.monthlyKiff);
      let adjustedKiff = kiffRaw;
      let cushion = 0;

      if (isLowData) {
        const isNegativeOrNearZero = reserve <= 0 || monthly.monthlyRemainingBudget < 0;
        const reservePerDay = reserve / Math.max(1, daysLeftInMonth);
        const bvmPerDay = BVM / 30;

        const reserveFactor = Math.min(1, reservePerDay / bvmPerDay);
        const budgetFactor = Math.min(1, Math.max(0, monthly.monthlyRemainingBudget / (BVM / 2)));

        if (isNegativeOrNearZero && isOutlierCase) {
          // Fallback très prudent si données faibles et transaction suspecte
          kiffRaw = 0.2 + 0.3 * reserveFactor;
        } else {
          const base = 0.1 + 0.4 * reserveFactor + 0.2 * budgetFactor;
          kiffRaw = base * dataConfidence + (1 - dataConfidence) * 0.1;
          kiffRaw = Math.min(0.95, Math.max(0.05, kiffRaw));
        }

        cushion = calculateCushion(reserve, BVM * 12);
        adjustedKiff = Math.min(1, kiffRaw + cushion * 0.5);
      } else {
        cushion = calculateCushion(reserve, annual.annualBudget);
        adjustedKiff = Math.min(1, kiffRaw + cushion);
      }

      const survivalMonths = calculateSurvivalMonths(debits);
      const { mood, stabilityScore } = calculateStabilityScore(survivalMonths, kiffRaw);

      return {
        mode: isLowData ? 'low-data' : 'normal',
        nb_personne_foyer: nbPeople,
        BVM: round2(BVM),
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
    }, {},
    "kiff-score",
    "calculateKiffScoreForUser"
  )
}