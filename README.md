# Nano Banana - Image Processor

A flexible tool that uses Google's Gemini API to process images with customizable prompts. Perfect for batch processing slides, photos, and other images with AI-powered transformations.

## Features

- Processes images through Google Gemini AI with customizable prompts
- Multiple prompt templates for different processing tasks
- Automatically renames files based on EXIF date metadata
- Batch processing of multiple images
- Easy prompt switching via command-line arguments

## Prerequisites

- Node.js (v16 or higher recommended)
- pnpm package manager
- exiftool (for EXIF date extraction)
- Google Gemini API key

## Getting Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy your API key

The API is free for testing and light usage. Check [Google's pricing page](https://ai.google.dev/pricing) for current limits and rates.

## Installation

1. Clone or download this repository

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Install exiftool (if not already installed):
   - **macOS**: `brew install exiftool`
   - **Ubuntu/Debian**: `sudo apt-get install libimage-exiftool-perl`
   - **Windows**: Download from [exiftool.org](https://exiftool.org/)

4. Create a `.env` file in the project root:
   ```bash
   echo "GEMINI_API_KEY=your_api_key_here" > .env
   ```
   Replace `your_api_key_here` with your actual Gemini API key.

## Usage

### Basic Workflow

1. Place your images in the `input/` directory

2. Run the processing pipeline (uses default `slide-extractor` prompt):
   ```bash
   make all
   ```

This will:
- Rename files based on EXIF date (format: YYYY-MM-DD-HH-MM)
- Process each image with the selected prompt
- Save processed images to the `output/` directory

### Using Different Prompts

List available prompts:
```bash
make list-prompts
```

Process with a specific prompt:
```bash
make process PROMPT=slide-extractor
```

Or run the full pipeline with a custom prompt:
```bash
make all PROMPT=your-prompt-name
```

### Individual Commands

Rename files only:
```bash
make rename
```

Process files only (without renaming):
```bash
make process
```

Install dependencies:
```bash
make install
```

### Managing Prompts

Prompts are stored in the `prompts/` directory as markdown files. Each prompt file name becomes its key.

**Built-in Prompts:**

- `slide-extractor` - Extracts slides from snapshots, corrects distortion, enhances readability

**Creating Custom Prompts:**

1. Create a new `.md` file in the `prompts/` directory:
   ```bash
   nano prompts/my-custom-prompt.md
   ```

2. Write your prompt instructions in the file

3. Use it with:
   ```bash
   make process PROMPT=my-custom-prompt
   ```

### Using nano-banana.js Directly

Process a single image with a prompt file:
```bash
node nano-banana.js --file path/to/image.jpg --prompt-file prompts/slide-extractor.md
```

Or with an inline prompt:
```bash
node nano-banana.js --file path/to/image.jpg --prompt "Your prompt here"
```

Specify custom output filename:
```bash
node nano-banana.js --file input.jpg --prompt-file prompts/slide-extractor.md --output custom-name.jpg
```

## Project Structure

```
.
├── nano-banana.js      # Main processing script
├── Makefile           # Build automation
├── package.json       # Node.js dependencies
├── .env              # API key (not in git)
├── prompts/           # Prompt templates
│   └── slide-extractor.md  # Default slide extraction prompt
├── input/            # Place images here (contents ignored by git)
└── output/           # Processed images appear here (contents ignored by git)
```

## Environment Variables

- `GEMINI_API_KEY` (required): Your Google Gemini API key

## Troubleshooting

**"GEMINI_API_KEY environment variable is not set"**
- Ensure you've created a `.env` file with your API key
- The Makefile doesn't automatically load `.env` - you may need to source it: `source .env && make process`

**"Could not find EXIF date for file"**
- The image doesn't have EXIF metadata
- The file will be skipped during the rename process

**"File is not an image"**
- Ensure you're processing image files (JPEG, PNG, etc.)
- Check that the file isn't corrupted

## License

This project uses the Google Gemini API, which has its own terms of service. Review [Google's AI terms](https://ai.google.dev/terms) before use.
