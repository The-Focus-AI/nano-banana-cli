#!/usr/bin/env -S npx tsx

import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";
import { exec } from "node:child_process";
import dotenv from "dotenv";

dotenv.config({ quiet: true } as dotenv.DotenvConfigOptions);

const DEFAULT_MODEL = "nano-banana-pro-preview";
const FLASH_MODEL = "gemini-2.0-flash";

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
    data.models
      .map((m) => m.name.replace("models/", ""))
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

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  let filePath = "";
  let promptText = "";
  let promptFile = "";
  let outputFileName = "";
  let useFlash = false;
  let modelName = "";

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

Options:
  --file <image>       Input image to edit (optional, omit for text-to-image)
  --output <file>      Output file path (default: output/generated-<timestamp>.png)
  --model <name>       Gemini model to use (default: ${DEFAULT_MODEL})
  --flash              Use ${FLASH_MODEL} model
  --prompt-file <path> Read prompt from file instead of argument
  --list-models        List all available Gemini models
  --help, -h           Show this help message

Examples:
  nano-banana "a cat wearing a hat"                    # Generate image
  nano-banana "make it cartoon" --file photo.jpg      # Edit image
  nano-banana "a sunset" --output sunset.png          # Custom output path
  nano-banana "quick sketch" --flash                  # Use Flash model
  nano-banana "detailed art" --model gemini-2.0-pro   # Use specific model
  nano-banana --list-models                           # Show available models`);
}

main();
