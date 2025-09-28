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

      const monthFilter = new Date();
      monthFilter.setMonth(monthFilter.getMonth() - 2);

      const recentMonths = new Set(
        transactions
          .filter(t => new Date(t.date).getTime() > monthFilter.getTime())
          .map(t => {
            const d = new Date(t.date);
            return `${d.getFullYear()}-${d.getMonth()}`
          })
      );

      const isLowData = transactions.length < 10 || recentMonths.size < 2;

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
        const bvmPerDay = BVM * 12 / 365.245;

        if (isNegativeOrNearZero && isOutlierCase) {
          kiffRaw = bvmPerDay;
        } else {
          // Estimation du montant quotidien possible
          const reservePerDay = reserve / Math.max(1, daysLeftInMonth);
          const budgetPerDay = monthly.monthlyRemainingBudget / Math.max(1, daysLeftInMonth);

          // On combine les deux (pondérés)
          const weightedDailyBudget = (
            0.6 * Math.max(0, reservePerDay) +
            0.4 * Math.max(0, budgetPerDay)
          );

          // Ajustement par data confidence
          const safeKiff = weightedDailyBudget * (0.5 + 0.5 * dataConfidence); // 50% de réduction si dataConfidence faible

          // On borne pour éviter les excès
          kiffRaw = Math.max(0.5, Math.min(safeKiff, 3 * (BVM / 30))); // borné entre 0.5€ et 3 fois BVM/jour
        }

        cushion = calculateCushion(reserve, BVM * 12);
        adjustedKiff = Math.max(1, kiffRaw + cushion * 0.5);
      } else {
        cushion = calculateCushion(reserve, annual.annualBudget);
        adjustedKiff = Math.max(1, kiffRaw + cushion);
      }

      const survivalMonths = calculateSurvivalMonths(reserve, debits);
      const { mood, stabilityScore } = calculateStabilityScore(survivalMonths, kiffRaw);

      return {
        mode: isLowData ? 'low-data' : 'normal',
        kiff_brut: round2(kiffRaw),
        kiff_ajuste: round2(adjustedKiff),
        mois_survie: round2(survivalMonths),
        score_stabilite: round2(stabilityScore),
        mood,
      };
    }, {},
    "kiff-score",
    "calculateKiffScoreForUser"
  )
}