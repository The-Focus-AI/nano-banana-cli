# nano-banana

CLI for image generation and editing with Google Gemini.

## Installation

```bash
npx nano-banana --help
```

Or install globally:

```bash
npm install -g nano-banana
```

## Quick Start

```bash
# Set your API key
export GEMINI_API_KEY="your-key-here"

# Generate an image
nano-banana "a cat wearing a hat"

# Edit an existing image
nano-banana "make it cartoon" --file photo.jpg

# Save to specific path
nano-banana "a sunset" --output sunset.png
```

## Usage

```
nano-banana <prompt> [options]

Options:
  --file <image>       Input image to edit (optional, omit for text-to-image)
  --output <file>      Output file path (default: output/generated-<timestamp>.png)
  --model <name>       Gemini model to use (default: gemini-2.0-flash-exp-image-generation)
  --flash              Use gemini-2.5-flash model
  --prompt-file <path> Read prompt from file instead of argument
  --list-models        List all available Gemini models
  --help, -h           Show this help message
```

## Examples

```bash
# Generate image from text
nano-banana "a cat wearing a hat"

# Edit an existing image
nano-banana "make it cartoon" --file photo.jpg

# Use a specific model
nano-banana "detailed artwork" --model gemini-2.0-flash-exp-image-generation

# Use Flash model for speed
nano-banana "quick sketch" --flash

# Read prompt from file
nano-banana --prompt-file prompt.md --file input.jpg

# List available models
nano-banana --list-models
```

## Getting Your API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Set it: `export GEMINI_API_KEY="your-key"`

## Batch Processing

For batch processing, use the included Makefile:

```bash
# Place images in input/ directory
make process PROMPT=slide-extractor

# List available prompts
make list-prompts
```

### Example: Slide Extraction

Transform photos of slides into clean, readable images:

<table>
<tr>
<td width="50%"><b>Before</b></td>
<td width="50%"><b>After</b></td>
</tr>
<tr>
<td><img src="docs/example-before.jpg" alt="Original slide photo"></td>
<td><img src="docs/example-after.jpg" alt="Extracted slide"></td>
</tr>
</table>

## Environment Variables

- `GEMINI_API_KEY` (required): Your Google Gemini API key

You can also use a `.env` file:

```bash
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

## License

MIT
