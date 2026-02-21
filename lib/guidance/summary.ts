import { getStageRecommendation } from "@/lib/guidance/recommendations";
import {
  resolveGuidanceStage,
  STAGE_META,
  type GuidanceStageInput,
  type StageResolution,
} from "@/lib/guidance/stages";

export interface GuidanceSummary extends StageResolution {
  stageMeta: (typeof STAGE_META)[keyof typeof STAGE_META];
  recommendation: ReturnType<typeof getStageRecommendation>;
}

export function deriveGuidanceSummary(input: GuidanceStageInput): GuidanceSummary {
  const stage = resolveGuidanceStage(input);
  return {
    ...stage,
    stageMeta: STAGE_META[stage.currentStage],
    recommendation: getStageRecommendation(stage.currentStage),
  };
}