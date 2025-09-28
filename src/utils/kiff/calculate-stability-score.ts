import { KiffResult } from "../../types/kiff-score.types";

export function calculateStabilityScore(
  monthsSurvival: number,
  kiff: number
): { stabilityScore: number, mood: KiffResult["mood"] } {
  const baseScore = Math.min(100, monthsSurvival * 10 + (kiff > 30 ? 20 : kiff > 15 ? 10 : 0));
  const score = Math.round(baseScore * 100) / 100;

  const mood: KiffResult["mood"] =
    score > 80 ? "relax" :
    score > 50 ? "serré" :
    "alerte";

  return { stabilityScore: score, mood };
}