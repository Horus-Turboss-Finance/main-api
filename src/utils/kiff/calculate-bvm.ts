export function calculateBVM(base: number, nbPeople: number): number {
  // BVM multiplicateur: log10(9 * nb^3)
  const multiplier = Math.log10(9 * Math.pow(nbPeople, 3));
  return Math.max(base, base * multiplier);
}