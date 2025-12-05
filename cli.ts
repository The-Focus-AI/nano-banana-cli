#!/usr/bin/env -S npx tsx

import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";
import { exec } from "node:child_process";
import dotenv from "dotenv";

import {
  DEFAULT_VIDEO_MODEL,
  FAST_VIDEO_MODEL,
  type VideoConfig,
  type VideoOperation,
} from "./lib/types.js";
import { showProgress, clearProgress } from "./lib/progress.js";
import { estimateVideoCost, formatCostWarning } from "./lib/cost.js";

dotenv.config({ quiet: true } as dotenv.DotenvConfigOptions);

const DEFAULT_MODEL = "nano-banana-pro-preview";
const FLASH_MODEL = "gemini-2.0-flash";

// Polling configuration
const POLL_INTERVAL_MS = 10_000; // 10 seconds
const MAX_WAIT_MS = 5 * 60 * 1000; // 5 minutes timeout

interface Model {
  name: string;
}

interface ModelsResponse {
  models?: Model[];
}

interface ContentPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

interface Candidate {
  content: {
    parts: ContentPart[];
  };
}

interface GenerateContentResponse {
  candidates: Candidate[];
}

async function listModels(apiKey: string): Promise<void> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
  );
  const data: ModelsResponse = await response.json();
  if (data.models) {
    console.log("Available models:");
    console.log("\nImage Generation:");
    data.models
      .map((m) => m.name.replace("models/", ""))
      .filter((name) => !name.includes("veo"))
      .sort()
      .forEach((name) => console.log(`  ${name}`));

    console.log("\nVideo Generation (Veo):");
    data.models
      .map((m) => m.name.replace("models/", ""))
      .filter((name) => name.includes("veo"))
      .sort()
      .forEach((name) => console.log(`  ${name}`));
  } else {
    console.error("Error fetching models:", data);
  }
}

function getMimeType(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(`file --mime-type -b "${filePath}"`, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Error determining MIME type: ${stderr}`));
      }
      resolve(stdout.trim());
    });
  });
}

async function waitForVideoCompletion(
  ai: GoogleGenAI,
  operation: VideoOperation
): Promise<VideoOperation> {
  const startTime = Date.now();

  while (!operation.done) {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);

    if (Date.now() - startTime > MAX_WAIT_MS) {
      clearProgress();
      throw new Error(`Video generation timeout after ${elapsed}s`);
    }

    showProgress(elapsed, "Generating video...");

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

    // Poll for updated status
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    operation = await (ai as any).operations.getVideosOperation({
      operation,
    });
  }

  clearProgress();
  return operation;
}

async function generateVideo(
  ai: GoogleGenAI,
  promptText: string,
  config: VideoConfig,
  inputImagePath?: string,
  referenceImagePaths?: string[],
  extendVideoUri?: string
): Promise<string> {
  // Show cost estimate
  const costEstimate = estimateVideoCost(config);
  console.log(formatCostWarning(costEstimate));

  // Prepare request
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const request: any = {
    model: config.model,
    prompt: promptText,
    config: {
      aspectRatio: config.aspectRatio,
      durationSeconds: config.duration,
      resolution: config.resolution,
      // Note: generateAudio and personGeneration not supported in Gemini API yet
      // generateAudio: config.generateAudio,
      // personGeneration: config.personGeneration || "dont_allow",
    },
  };

  // Add seed if specified
  if (config.seed !== undefined) {
    request.config.seed = config.seed;
  }

  // Add negative prompt if specified
  if (config.negativePrompt) {
    request.config.negativePrompt = config.negativePrompt;
  }

  // If extending a video, add the video reference
  if (extendVideoUri) {
    request.video = {
      gcsUri: extendVideoUri
    };
  }
  // If input image provided, add it for image-to-video (mutually exclusive with extend)
  else if (inputImagePath) {
    const imageBuffer = fs.readFileSync(inputImagePath);
    const mimeType = await getMimeType(inputImagePath);
    request.image = {
      bytesBase64Encoded: imageBuffer.toString("base64"),
      mimeType: mimeType,
    };
  }

  // Add reference images for character/style consistency
  if (referenceImagePaths && referenceImagePaths.length > 0) {
    request.referenceImages = await Promise.all(
      referenceImagePaths.map(async (refPath) => {
        const imageBuffer = fs.readFileSync(refPath);
        const mimeType = await getMimeType(refPath);
        return {
          bytesBase64Encoded: imageBuffer.toString("base64"),
          mimeType: mimeType,
          type: "asset" as const,
        };
      })
    );
  }

  // Start generation
  console.log("Starting video generation (this takes 2-4 minutes)...");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let operation = (await (ai as any).models.generateVideos(
    request
  )) as VideoOperation;

  // Poll until complete
  operation = await waitForVideoCompletion(ai, operation);

  // Check for errors
  if (operation.error) {
    throw new Error(`Video generation failed: ${operation.error.message}`);
  }

  if (
    !operation.response?.generatedVideos ||
    operation.response.generatedVideos.length === 0
  ) {
    throw new Error("No video generated in response");
  }

  return operation.response.generatedVideos[0].video;
}

async function downloadVideo(
  ai: GoogleGenAI,
  videoUri: string,
  outputPath: string
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (ai as any).files.download({
    file: videoUri,
    downloadPath: outputPath,
  });

  // Save the URI alongside the video file for potential scene extension
  const uriFilePath = outputPath.replace(/\.(mp4|mov)$/i, '.uri');
  fs.writeFileSync(uriFilePath, videoUri, 'utf-8');
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // Common options
  let filePath = "";
  let promptText = "";
  let promptFile = "";
  let outputFileName = "";

  // Image options
  let useFlash = false;
  let modelName = "";

  // Video options
  let videoMode = false;
  let videoModel = "";
  let videoFast = false;
  let duration: 4 | 6 | 8 = 8;
  let aspectRatio: "16:9" | "9:16" = "16:9";
  let resolution: "720p" | "1080p" = "1080p";
  let generateAudio = true;
  let seed: number | undefined;
  let extendVideoPath = "";
  let estimateCostOnly = false;
  const referenceImages: string[] = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--file") {
      filePath = args[++i];
    } else if (args[i] === "--prompt") {
      promptText = args[++i];
    } else if (args[i] === "--prompt-file") {
      promptFile = args[++i];
    } else if (args[i] === "--output") {
      outputFileName = args[++i];
    } else if (args[i] === "--flash") {
      useFlash = true;
    } else if (args[i] === "--model") {
      modelName = args[++i];
    } else if (args[i] === "--video") {
      videoMode = true;
    } else if (args[i] === "--video-model") {
      videoModel = args[++i];
    } else if (args[i] === "--video-fast") {
      videoFast = true;
    } else if (args[i] === "--duration") {
      const d = parseInt(args[++i], 10);
      if (d === 4 || d === 6 || d === 8) {
        duration = d;
      } else {
        console.error("Error: --duration must be 4, 6, or 8");
        process.exit(1);
      }
    } else if (args[i] === "--aspect") {
      const a = args[++i];
      if (a === "16:9" || a === "9:16") {
        aspectRatio = a;
      } else {
        console.error("Error: --aspect must be 16:9 or 9:16");
        process.exit(1);
      }
    } else if (args[i] === "--resolution") {
      const r = args[++i];
      if (r === "720p" || r === "1080p") {
        resolution = r;
      } else {
        console.error("Error: --resolution must be 720p or 1080p");
        process.exit(1);
      }
    } else if (args[i] === "--audio") {
      generateAudio = true;
    } else if (args[i] === "--no-audio") {
      generateAudio = false;
    } else if (args[i] === "--seed") {
      seed = parseInt(args[++i], 10);
    } else if (args[i] === "--reference") {
      const refPath = args[++i];
      if (!fs.existsSync(refPath)) {
        console.error(`Error: Reference image not found at ${refPath}`);
        process.exit(1);
      }
      referenceImages.push(refPath);
    } else if (args[i] === "--extend") {
      extendVideoPath = args[++i];
      videoMode = true; // Extending a video implies video mode
    } else if (args[i] === "--estimate-cost") {
      estimateCostOnly = true;
      videoMode = true; // Cost estimation implies video mode
    } else if (args[i] === "--list-models") {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error("Error: GEMINI_API_KEY environment variable is not set.");
        process.exit(1);
      }
      await listModels(apiKey);
      process.exit(0);
    } else if (args[i] === "--help" || args[i] === "-h") {
      printUsage();
      process.exit(0);
    } else if (!args[i].startsWith("--")) {
      // Positional argument is the prompt
      promptText = args[i];
    }
  }

  if (promptFile) {
    if (promptText) {
      console.error(
        "Error: Cannot use both --prompt and --prompt-file simultaneously."
      );
      process.exit(1);
    }
    try {
      promptText = fs.readFileSync(promptFile, "utf-8");
    } catch {
      console.error(`Error: Could not read prompt file at ${promptFile}`);
      process.exit(1);
    }
  }

  if (!promptText) {
    printUsage();
    process.exit(1);
  }

  if (filePath && !fs.existsSync(filePath)) {
    console.error(`Error: File not found at ${filePath}`);
    process.exit(1);
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    console.error("Error: GEMINI_API_KEY environment variable is not set.");
    console.error(
      "Please set it before running the script (e.g., export GEMINI_API_KEY='YOUR_API_KEY')."
    );
    process.exit(1);
  }

  const ai = new GoogleGenAI(geminiApiKey);

  // Video generation mode
  if (videoMode) {
    // Validate extend video path
    let extendVideoUri: string | undefined;
    if (extendVideoPath) {
      if (!fs.existsSync(extendVideoPath)) {
        console.error(`Error: Video file not found at ${extendVideoPath}`);
        process.exit(1);
      }

      // Load the URI file
      const uriFilePath = extendVideoPath.replace(/\.(mp4|mov)$/i, '.uri');
      if (!fs.existsSync(uriFilePath)) {
        console.error(`Error: URI file not found at ${uriFilePath}`);
        console.error('Can only extend videos generated by nano-banana (need .uri file)');
        process.exit(1);
      }

      extendVideoUri = fs.readFileSync(uriFilePath, 'utf-8').trim();

      // Enforce 720p resolution for extensions
      if (resolution !== "720p") {
        console.log("Note: Resolution forced to 720p for video extensions");
        resolution = "720p";
      }

      // Can't use reference images with extension
      if (referenceImages.length > 0) {
        console.error("Error: Cannot use --reference with --extend");
        process.exit(1);
      }

      // Can't use --file (image-to-video) with extension
      if (filePath) {
        console.error("Error: Cannot use --file with --extend");
        process.exit(1);
      }
    }

    // Validate reference images
    if (referenceImages.length > 3) {
      console.error("Error: Maximum 3 reference images allowed");
      process.exit(1);
    }
    const selectedVideoModel =
      videoModel || (videoFast ? FAST_VIDEO_MODEL : DEFAULT_VIDEO_MODEL);

    const videoConfig: VideoConfig = {
      model: selectedVideoModel,
      duration,
      aspectRatio,
      resolution,
      generateAudio,
      seed,
    };

    // If only estimating cost, show estimate and exit
    if (estimateCostOnly) {
      const costEstimate = estimateVideoCost(videoConfig);
      console.log("\nCost Estimate:");
      console.log(`  Model: ${costEstimate.model}`);
      console.log(`  Duration: ${costEstimate.duration} seconds`);
      console.log(`  Audio: ${costEstimate.hasAudio ? "enabled" : "disabled"}`);
      console.log(`  Resolution: ${resolution}`);
      console.log(`  Aspect Ratio: ${aspectRatio}`);
      console.log(
        `\n  Estimated cost: $${costEstimate.min.toFixed(2)} - $${costEstimate.max.toFixed(2)}`
      );
      if (extendVideoPath) {
        console.log(
          `\n  Note: This is for a single extension. Each additional extension costs the same.`
        );
      }
      console.log(
        `\nTo generate this video, remove the --estimate-cost flag.`
      );
      process.exit(0);
    }

    let mode: string;
    if (extendVideoUri) {
      mode = `Extending '${extendVideoPath}'`;
    } else if (filePath) {
      mode = `Animating '${filePath}'`;
    } else {
      mode = "Generating video";
    }

    console.log(`${mode} using ${selectedVideoModel}`);
    console.log(
      `Prompt: "${promptText.substring(0, 60)}${promptText.length > 60 ? "..." : ""}"`
    );
    console.log(
      `Settings: ${duration}s, ${aspectRatio}, ${resolution}, audio: ${generateAudio ? "yes" : "no"}`
    );
    if (referenceImages.length > 0) {
      console.log(`Reference images: ${referenceImages.length}`);
    }

    try {
      const videoUri = await generateVideo(
        ai,
        promptText,
        videoConfig,
        filePath || undefined,
        referenceImages.length > 0 ? referenceImages : undefined,
        extendVideoUri
      );

      // Determine output path
      let outputPath: string;
      if (outputFileName) {
        outputPath = outputFileName;
        const outputDir = path.dirname(outputPath);
        if (outputDir && !fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
      } else {
        const outputDir = "output";
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        if (filePath) {
          const originalFileName = path.basename(
            filePath,
            path.extname(filePath)
          );
          outputPath = path.join(outputDir, `${originalFileName}-animated.mp4`);
        } else {
          const timestamp = Date.now();
          outputPath = path.join(outputDir, `video-${timestamp}.mp4`);
        }
      }

      console.log("Downloading video...");
      await downloadVideo(ai, videoUri, outputPath);
      console.log(`Video saved: ${outputPath}`);
    } catch (error) {
      console.error("Error generating video:", error);
      process.exit(1);
    }

    return;
  }

  // Image generation mode (original behavior)
  const contents: ContentPart[] = [{ text: promptText }];

  // If file provided, add it to the request (image editing mode)
  if (filePath) {
    const base64Image = fs.readFileSync(filePath).toString("base64");
    const mimeType = await getMimeType(filePath);

    if (!mimeType.startsWith("image/")) {
      console.error(
        `Error: Input file '${filePath}' is not an image. Detected MIME type: ${mimeType}`
      );
      process.exit(1);
    }

    contents.push({
      inlineData: {
        mimeType: mimeType,
        data: base64Image,
      },
    });
  }

  // Determine model: --model takes precedence, then --flash, then default
  const selectedModel = modelName || (useFlash ? FLASH_MODEL : DEFAULT_MODEL);

  try {
    const mode = filePath ? `Editing '${filePath}'` : "Generating image";
    console.log(`${mode} using ${selectedModel}`);
    console.log(
      `Prompt: "${promptText.substring(0, 60)}${promptText.length > 60 ? "..." : ""}"`
    );

    const response = (await ai.models.generateContent({
      model: selectedModel,
      contents: contents,
      config: {
        responseModalities: ["Text", "Image"],
      },
    })) as GenerateContentResponse;

    let imageSaved = false;
    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        console.log("Response:", part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");

        let outputPath: string;
        if (outputFileName) {
          // Use exact path specified by --output
          outputPath = outputFileName;
          const outputDir = path.dirname(outputPath);
          if (outputDir && !fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }
        } else {
          // Default to output/ directory with auto-generated name
          const outputDir = "output";
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }
          if (filePath) {
            const originalFileName = path.basename(
              filePath,
              path.extname(filePath)
            );
            outputPath = path.join(outputDir, `${originalFileName}-edited.png`);
          } else {
            const timestamp = Date.now();
            outputPath = path.join(outputDir, `generated-${timestamp}.png`);
          }
        }

        fs.writeFileSync(outputPath, buffer);
        console.log(`Image saved: ${outputPath}`);
        imageSaved = true;
      }
    }

    if (!imageSaved) {
      console.log("No image in response.");
      console.log("Full response:", JSON.stringify(response, null, 2));
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    process.exit(1);
  }
}

function printUsage(): void {
  console.log(`Usage: nano-banana <prompt> [options]

MODES:
  (default)     Generate or edit images using Gemini image models
  --video       Generate videos using Google Veo models

IMAGE OPTIONS:
  --file <image>       Input image for editing mode
  --model <name>       Gemini model (default: ${DEFAULT_MODEL})
  --flash              Use faster ${FLASH_MODEL} model

VIDEO OPTIONS:
  --video              Enable video generation mode
  --video-model <name> Veo model (default: ${DEFAULT_VIDEO_MODEL})
  --video-fast         Use ${FAST_VIDEO_MODEL} (cheaper, faster)
  --duration <sec>     Duration: 4, 6, or 8 seconds (default: 8)
  --aspect <ratio>     16:9 (landscape) or 9:16 (portrait) (default: 16:9)
  --resolution <res>   720p or 1080p (default: 1080p)
  --audio              Generate synchronized audio (default)
  --no-audio           Disable audio generation (saves cost)
  --reference <image>  Reference image for character consistency (max 3)
  --extend <video>     Extend a previously generated video (max 20 extensions)
  --seed <number>      Seed for reproducibility

COMMON OPTIONS:
  --output <file>      Output path (default: output/)
  --prompt-file <path> Read prompt from file
  --estimate-cost      Show cost estimate without generating (video only)
  --list-models        Show available models
  --help, -h           Show this help

IMAGE EXAMPLES:
  nano-banana "a cat wearing a hat"
  nano-banana "make it cartoon" --file photo.jpg
  nano-banana "a sunset" --output sunset.png

VIDEO EXAMPLES:
  nano-banana --video "A sunset over mountains, cinematic"
  nano-banana --video "Character smiles" --file portrait.png
  nano-banana --video "Quick test" --video-fast --no-audio
  nano-banana --video "Hero walks through forest" --reference hero.jpg
  nano-banana --video "Camera continues forward" --extend output/video-123.mp4
  nano-banana --video "Complex scene" --duration 8 --estimate-cost

COST NOTES:
  Video generation costs $0.10-$0.75 per second depending on model.
  Use --video-fast and --no-audio for cheaper development iterations.

ENVIRONMENT:
  GEMINI_API_KEY       Required. Get from https://aistudio.google.com/apikey`);
}

main();
