export function safeDivide(numerator: number, denominator: number): number | null {
  if (denominator === 0) {
    return null;
  }
  return numerator / denominator;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function weightedScore(items: Array<{ value: number; weight: number }>): number {
  const weightedTotal = items.reduce((sum, item) => sum + item.value * item.weight, 0);
  const weightTotal = items.reduce((sum, item) => sum + item.weight, 0);
  if (weightTotal <= 0) {
    return 0;
  }
  return weightedTotal / weightTotal;
}