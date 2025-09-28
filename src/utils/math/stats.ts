/**
 * Calcule la moyenne arithmétique d'une liste de nombres.
 * @param values - Liste de nombres
 * @returns Moyenne
 */
export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  const total = values.reduce((sum, val) => sum + val, 0);
  return total / values.length;
}

/**
 * Calcule l'écart-type (standard deviation) d'une liste de nombres.
 * @param values - Liste de nombres
 * @returns Écart-type
 */
export function standardDeviation(values: number[]): number {
  if (values.length === 0) return 0;

  const avg = mean(values);
  const variance = values.reduce((sum, val) => {
    const diff = val - avg;
    return sum + diff * diff;
  }, 0) / values.length;

  return Math.sqrt(variance);
}