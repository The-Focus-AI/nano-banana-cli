// Cost estimation for video generation

import type { VideoConfig } from "./types.js";

interface ModelCost {
  perSecond: number;
  audioMultiplier: number;
  name: string;
}

const MODEL_COSTS: Record<string, ModelCost> = {
  "veo-3.1-generate-preview": {
    perSecond: 0.5,
    audioMultiplier: 1.5,
    name: "Veo 3.1 (Premium)",
  },
  "veo-3.1-fast-generate-preview": {
    perSecond: 0.1,
    audioMultiplier: 1.5,
    name: "Veo 3.1 Fast",
  },
  "veo-2.0-generate-001": {
    perSecond: 0.35,
    audioMultiplier: 1.0, // No audio support
    name: "Veo 2.0",
  },
};

export interface CostEstimate {
  min: number;
  max: number;
  model: string;
  duration: number;
  hasAudio: boolean;
}

export function estimateVideoCost(config: VideoConfig): CostEstimate {
  const modelCost =
    MODEL_COSTS[config.model] || MODEL_COSTS["veo-3.1-fast-generate-preview"];

  const perSecond = config.generateAudio
    ? modelCost.perSecond * modelCost.audioMultiplier
    : modelCost.perSecond;

  const total = config.duration * perSecond;

  return {
    min: Number((total * 0.9).toFixed(2)),
    max: Number((total * 1.1).toFixed(2)),
    model: modelCost.name,
    duration: config.duration,
    hasAudio: config.generateAudio,
  };
}

export function formatCostEstimate(estimate: CostEstimate): string {
  const range =
    estimate.min === estimate.max
      ? `$${estimate.min.toFixed(2)}`
      : `$${estimate.min.toFixed(2)}-$${estimate.max.toFixed(2)}`;

  const audioNote = estimate.hasAudio ? " (with audio)" : " (no audio)";

  return `Estimated cost: ${range} for ${estimate.duration}s video${audioNote}`;
}

export function formatCostWarning(estimate: CostEstimate): string {
  return `\x1b[33m⚠ ${formatCostEstimate(estimate)}\x1b[0m`;
}
