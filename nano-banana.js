import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";
import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const args = process.argv.slice(2);
  let filePath = '';
  let promptText = '';
  let promptFile = '';
  let outputFileName = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file') {
      filePath = args[++i];
    } else if (args[i] === '--prompt') {
      promptText = args[++i];
    } else if (args[i] === '--prompt-file') {
      promptFile = args[++i];
    } else if (args[i] === '--output') {
      outputFileName = args[++i];
    }
  }

  if (promptFile) {
    if (promptText) {
      console.error("Error: Cannot use both --prompt and --prompt-file simultaneously.");
      process.exit(1);
    }
    try {
      promptText = fs.readFileSync(promptFile, 'utf-8');
    } catch (e) {
      console.error(`Error: Could not read prompt file at ${promptFile}`);
      process.exit(1);
    }
  }

  if (!filePath || !promptText) {
    console.error("Usage: node nano-banana.js --file <file_path> [--prompt <prompt_text> | --prompt-file <prompt_file_path>] [--output <output_file>]");
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found at ${filePath}`);
    process.exit(1);
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    console.error("Error: GEMINI_API_KEY environment variable is not set.");
    console.error("Please set it before running the script (e.g., export GEMINI_API_KEY='YOUR_API_KEY').");
    process.exit(1);
  }

  const ai = new GoogleGenAI(geminiApiKey); // Pass API key here

  const base64Image = fs.readFileSync(filePath).toString('base64');
  const mimeType = await new Promise(resolve => {

    exec(`file --mime-type -b "${filePath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error determining MIME type: ${stderr}`);
        process.exit(1);
      }
      resolve(stdout.trim());
    });
  });

  if (!mimeType.startsWith('image/')) {
    console.error(`Error: Input file '${filePath}' is not an image. Detected MIME type: ${mimeType}`);
    process.exit(1);
  }

  const contents = [
    { text: promptText },
    {
      inlineData: {
        mimeType: mimeType,
        data: base64Image,
      },
    },
  ];

  const modelName = 'gemini-3-pro-image-preview';

  try {
    console.log(`Processing '${filePath}' with prompt from '${promptFile || 'text'}' using ${modelName}...`);
    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
    });

    const outputDir = 'output';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    let imageSaved = false;
    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        console.log("Text response from Gemini:", part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        
        let finalOutputName = outputFileName;
        if (!finalOutputName) {
          const originalFileName = path.basename(filePath, path.extname(filePath));
          finalOutputName = `${originalFileName}-gemini-edited.jpg`;
        }
        const outputPath = path.join(outputDir, finalOutputName);

        fs.writeFileSync(outputPath, buffer);
        console.log(`Image saved as ${outputPath}`);
        imageSaved = true;
      }
    }

    if (!imageSaved) {
      console.log("No image part found in the Gemini API response.");
      console.log("Full API response:", JSON.stringify(response, null, 2));
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    process.exit(1);
  }
}

main();
