export function calculateCushion(reserve: number, annualBudget: number): number {
  const dailyBudget = annualBudget / 365.25;
  const denom = Math.max(1, Math.abs(dailyBudget));
  return Math.min(reserve / denom, 20);
}