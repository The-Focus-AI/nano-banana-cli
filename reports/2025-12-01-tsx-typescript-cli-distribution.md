---
title: "TypeScript CLI Distribution: tsx"
date: 2025-12-01
topic: tsx-cli-distribution
recommendation: tsx
version_researched: 4.21.0
use_when:
  - Distributing a CLI tool written in TypeScript via npm/npx
  - You want zero-config TypeScript execution without a build step
  - You need full TypeScript feature support (enums, decorators, paths)
  - Building Claude Code plugins or similar developer tools
avoid_when:
  - Targeting non-TypeScript/non-Node.js consumers who shouldn't need tsx
  - Bundle size is critical (consider pre-compiling with tsup/esbuild instead)
  - You need type-checking at runtime (tsx only transpiles, doesn't type-check)
project_context:
  language: JavaScript/TypeScript (Node.js ESM)
  relevant_dependencies: ["@google/genai", "dotenv"]
---

## Summary

**tsx** (TypeScript Execute) is the recommended solution for distributing TypeScript CLI tools via npm without a build step. With 11.6k GitHub stars and 416k dependents[1], tsx has become the de facto standard for running TypeScript directly in Node.js. It uses esbuild under the hood for fast transpilation and requires zero configuration—no tsconfig.json needed to get started[2].

For distributing a CLI as a Claude Code plugin, you can ship TypeScript source files directly and use the shebang `#!/usr/bin/env -S npx tsx` to make your entry point executable. This approach eliminates the build step entirely while providing full TypeScript support including features that Node.js native type-stripping doesn't handle (like path aliases and certain tsconfig options)[3].

While Node.js 23.6+ now includes native TypeScript support via type-stripping[4], it still has significant limitations: it ignores tsconfig.json, doesn't support features like `paths` aliases, and the Node.js team still recommends against production use[5]. tsx provides a more complete and battle-tested solution.

## Philosophy & Mental Model

tsx is a **drop-in replacement for `node`** that transparently handles TypeScript. Think of it as `node` with superpowers:

- **Just-in-time transpilation**: TypeScript is converted to JavaScript on the fly using esbuild
- **Zero config**: Works out of the box without tsconfig.json (but respects it if present)
- **No type-checking**: tsx focuses on execution speed, not correctness—run `tsc --noEmit` separately for type checking
- **Single binary**: No peer dependencies required (TypeScript and esbuild are bundled)

The key mental model: **tsx makes TypeScript files behave like JavaScript files**. Anywhere you'd use `node script.js`, you can use `tsx script.ts`.

## Setup

### For a Distributable CLI Package

**1. Initialize your package:**

```bash
npm init -y
```

**2. Install tsx as a regular dependency:**

```bash
npm install tsx
```

> **Important**: Use `dependencies`, not `devDependencies`, since consumers need tsx to run your CLI.

**3. Create your CLI entry point** (e.g., `cli.ts`):

```typescript
#!/usr/bin/env -S npx tsx

import { Command } from 'commander';

const program = new Command();

program
  .name('my-cli')
  .description('My awesome CLI tool')
  .version('1.0.0');

program
  .argument('<input>', 'input to process')
  .action((input) => {
    console.log(`Processing: ${input}`);
  });

program.parse();
```

**4. Configure package.json:**

```json
{
  "name": "my-cli",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "my-cli": "./cli.ts"
  },
  "files": [
    "cli.ts",
    "src/**/*.ts"
  ],
  "dependencies": {
    "tsx": "^4.21.0"
  }
}
```

**5. Make executable (for local testing):**

```bash
chmod +x cli.ts
```

**6. Test locally:**

```bash
# Direct execution
./cli.ts hello

# Via npx (simulates how users will run it)
npx . hello
```

### Publishing

```bash
npm publish
```

Users can then run your CLI with:

```bash
npx my-cli hello
```

## Core Usage Patterns

### Pattern 1: The Shebang for Distribution

The magic line that makes your TypeScript file executable:

```typescript
#!/usr/bin/env -S npx tsx
```

**Why `-S`?** The `-S` flag tells `env` to split the argument string. Without it, `npx tsx` would be treated as a single command name. This works on macOS and modern Linux (coreutils 8.30+)[6].

**Why `npx`?** Using `npx tsx` instead of just `tsx` ensures tsx is available even if not globally installed—npx will fetch it if needed.

### Pattern 2: Hybrid CLI and Library

Create a single file that works both as an executable CLI and an importable module[7]:

```typescript
#!/usr/bin/env -S npx tsx

// Exported function for library usage
export function processData(input: string): string {
  return input.toUpperCase();
}

// CLI entry point - only runs when executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: my-cli <input>');
    process.exit(1);
  }
  console.log(processData(args[0]));
}
```

Users can:
- Run as CLI: `npx my-cli hello` → `HELLO`
- Import as library: `import { processData } from 'my-cli'`

### Pattern 3: Multi-File Project Structure

```
my-cli/
├── cli.ts          # Entry point with shebang
├── src/
│   ├── commands/
│   │   ├── generate.ts
│   │   └── process.ts
│   ├── utils/
│   │   └── helpers.ts
│   └── index.ts    # Re-exports for library usage
├── package.json
└── tsconfig.json   # Optional but recommended
```

**cli.ts:**

```typescript
#!/usr/bin/env -S npx tsx

import { program } from './src/commands/index.js';
program.parse();
```

> **Note**: Use `.js` extensions in imports even for `.ts` files when using ESM. tsx handles the resolution.

### Pattern 4: Watch Mode for Development

During development, use watch mode to auto-reload on changes:

```bash
npx tsx watch ./cli.ts
```

Or add to package.json:

```json
{
  "scripts": {
    "dev": "tsx watch ./cli.ts",
    "start": "tsx ./cli.ts"
  }
}
```

### Pattern 5: Environment Variables with dotenv

tsx works seamlessly with dotenv:

```typescript
#!/usr/bin/env -S npx tsx

import 'dotenv/config';

console.log(process.env.API_KEY);
```

## Anti-Patterns & Pitfalls

### Don't: Rely on tsx for Type Checking

```typescript
// This will run successfully despite the type error!
const x: number = "not a number";
console.log(x);
```

**Why it's wrong:** tsx strips types without checking them. Your code will run but may have runtime errors that TypeScript would have caught.

### Instead: Run tsc Separately

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "build": "npm run typecheck && npm run start"
  }
}
```

---

### Don't: Use `#!/usr/bin/env tsx` Without `-S npx`

```typescript
#!/usr/bin/env tsx  // Won't work if tsx isn't globally installed
```

**Why it's wrong:** This requires tsx to be globally installed on the user's system, which you can't guarantee.

### Instead: Always Use the Full Shebang

```typescript
#!/usr/bin/env -S npx tsx
```

---

### Don't: Put tsx in devDependencies for CLIs

```json
{
  "devDependencies": {
    "tsx": "^4.21.0"  // Wrong for distributed CLIs!
  }
}
```

**Why it's wrong:** When users install your package, devDependencies aren't installed. Your CLI will fail because tsx won't be available.

### Instead: Use Regular Dependencies

```json
{
  "dependencies": {
    "tsx": "^4.21.0"
  }
}
```

---

### Don't: Forget the `files` Field

```json
{
  "bin": {
    "my-cli": "./cli.ts"
  }
  // Missing "files" field!
}
```

**Why it's wrong:** npm might not include your TypeScript source files in the published package.

### Instead: Explicitly List Files

```json
{
  "bin": {
    "my-cli": "./cli.ts"
  },
  "files": [
    "cli.ts",
    "src/**/*.ts"
  ]
}
```

---

### Don't: Mix CommonJS and ESM Carelessly

```typescript
// In an ESM project (type: "module")
const fs = require('fs');  // This will fail
```

**Why it's wrong:** tsx respects your module system. If you're using ESM, use ESM imports.

### Instead: Be Consistent With Your Module System

```typescript
// In ESM (type: "module")
import fs from 'fs';
import { readFileSync } from 'fs';

// Or use createRequire if you must use require
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
```

## Caveats

- **~200ms npx overhead**: Using `npx tsx` adds approximately 200ms startup time compared to running compiled JavaScript[8]. For frequently-run CLIs, consider pre-compiling with tsup or having users install tsx globally.

- **Windows compatibility**: The shebang approach works on Windows because npm creates wrapper `.cmd` files[9]. However, direct execution (`./cli.ts`) only works in Unix-like shells.

- **No runtime type safety**: tsx removes types at transpilation time. For runtime validation, use libraries like Zod or io-ts.

- **Node.js version requirements**: tsx supports all maintained Node.js versions (18+). Check compatibility if targeting older Node versions.

- **tsconfig.json is optional but recommended**: While tsx works without it, having a tsconfig.json ensures consistent behavior and enables better IDE support.

- **Large dependency tree**: tsx bundles esbuild (~9MB). If package size is critical, consider pre-compiling to JavaScript instead.

## References

[1] [tsx GitHub Repository](https://github.com/privatenumber/tsx) - GitHub stars count and dependents data

[2] [tsx Official Documentation - Getting Started](https://tsx.is/getting-started) - Zero-config setup and installation guide

[3] [How to run TypeScript files directly in Node.js in 2025](https://allalmohamedlamine.medium.com/how-to-run-typescript-files-directly-in-nodejs-in-2025-b781e1e08a9d) - Comparison of tsx vs Node.js native TypeScript support

[4] [Node.js 23.6 Now Runs TypeScript Natively - InfoQ](https://www.infoq.com/news/2025/03/node-23-runs-typescript-natively/) - Node.js native TypeScript type stripping announcement

[5] [Node's new built-in support for TypeScript](https://2ality.com/2025/01/nodejs-strip-type.html) - Detailed analysis of limitations and production readiness

[6] [Stack Overflow: Using NPX command for shell script shebang](https://stackoverflow.com/questions/55777677/using-npx-command-for-shell-script-shebang-interpreter) - Explanation of the `-S` flag requirement

[7] [Creating a Hybrid TypeScript CLI and Library Function with tsx](https://www.sergevandenoever.nl/creating-a-hybrid-typeScript-cli-and-library-function-with-tsx/) - Pattern for dual CLI/library usage

[8] [ts-node GitHub Issue #995](https://github.com/TypeStrong/ts-node/issues/995) - Discussion of npx overhead and shebang patterns

[9] [npm Community Forum: Making a command for a package](https://npm.community/t/making-a-command-for-a-package-bin/628) - npm's cross-platform executable handling

[10] [Add CLI Scripts to Your TypeScript/Node Project with TSX](https://spin.atomicobject.com/cli-scripts-tsx/) - Practical guide for CLI script creation
