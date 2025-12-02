#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cliPath = join(__dirname, 'cli.ts');

// Resolve tsx from wherever it's installed (works both locally and as dependency)
const require = createRequire(import.meta.url);
const tsxPath = require.resolve('tsx/cli');

const child = spawn(process.execPath, [tsxPath, cliPath, ...process.argv.slice(2)], {
  stdio: 'inherit',
  cwd: process.cwd(),
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
