// Shared type definitions for nano-banana CLI

export interface VideoConfig {
  model: string;
  duration: 4 | 6 | 8;
  aspectRatio: "16:9" | "9:16";
  resolution: "720p" | "1080p";
  generateAudio: boolean;
  negativePrompt?: string;
  seed?: number;
  personGeneration?: "allow_adult" | "dont_allow";
}

export interface VideoGenerationResult {
  video: string; // File URI or path
  audio?: string; // Optional audio file URI
}

export interface VideoOperationResponse {
  generatedVideos?: VideoGenerationResult[];
  error?: {
    message: string;
    code?: string;
  };
}

export interface VideoOperation {
  done: boolean;
  name?: string;
  response?: VideoOperationResponse;
  error?: {
    message: string;
    code?: number;
  };
}

export interface ReferenceImage {
  bytesBase64Encoded: string;
  mimeType: string;
  type: "asset" | "style";
}

export const DEFAULT_VIDEO_MODEL = "veo-3.1-generate-preview";
export const FAST_VIDEO_MODEL = "veo-3.1-fast-generate-preview";

export const VIDEO_MODELS = [
  "veo-3.1-generate-preview",
  "veo-3.1-fast-generate-preview",
  "veo-2.0-generate-001",
] as const;

export type VideoModel = (typeof VIDEO_MODELS)[number];
