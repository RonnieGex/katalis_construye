import type { BreakEvenMultiProductItem } from "@/lib/domain";

export interface SingleBreakEvenInput {
  fixedCosts: number;
  price: number;
  variableCost: number;
}

export interface SingleBreakEvenResult {
  contributionMargin: number;
  units: number | null;
  message: string | null;
}

export function computeSingleProductBreakEven(
  input: SingleBreakEvenInput,
): SingleBreakEvenResult {
  const contributionMargin = input.price - input.variableCost;
  if (contributionMargin <= 0) {
    return {
      contributionMargin,
      units: null,
      message: "No break-even (negative/zero contribution margin)",
    };
  }

  return {
    contributionMargin,
    units: input.fixedCosts / contributionMargin,
    message: null,
  };
}

export function computeWeightedContributionMargin(
  products: BreakEvenMultiProductItem[],
): number {
  return products.reduce((total, product) => {
    const margin = product.price - product.variableCost;
    return total + margin * (product.salesMixPct / 100);
  }, 0);
}
