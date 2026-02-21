import type { SeedSource, ToolSampleState } from "@/lib/domain";

export function shouldSeedSample(
  state: ToolSampleState | undefined,
  hasAnyData: boolean,
): boolean {
  return !hasAnyData && state !== "dismissed" && state !== "consumed";
}

export function clearSampleOnly<T extends { seedSource?: SeedSource }>(entries: T[]): T[] {
  return entries.filter((entry) => entry.seedSource !== "sample");
}

export function isSampleOnlyDataset<T extends { seedSource?: SeedSource }>(entries: T[]): boolean {
  return entries.length > 0 && entries.every((entry) => entry.seedSource === "sample");
}